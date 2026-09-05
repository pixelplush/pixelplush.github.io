const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;

const repositoryRoot = path.resolve(__dirname, '..');
const siteBasePath = process.env.PIXELPLUSH_V2_BASE_PATH || '/';
const siteRoot = siteBasePath === '/' ? repositoryRoot : path.join(repositoryRoot, siteBasePath.slice(1));
const siteRoute = (route) => `${siteBasePath === '/' ? '' : siteBasePath}${route}`;
const routes = [
  '/',
  '/games/',
  '/games/?type=parachute',
  '/market/',
  '/customize/',
  '/links/',
  '/login/',
  '/scores/',
  '/status/',
  '/transactions/',
  '/redeem/',
  '/redirect/',
  '/troubleshoot/',
  '/privacy/',
  '/terms/',
  '/admin/',
];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

function startStaticServer() {
  const server = http.createServer((request, response) => {
    const requestUrl = new URL(request.url, 'http://127.0.0.1');
    let pathname;
    try {
      pathname = decodeURIComponent(requestUrl.pathname);
    } catch {
      response.writeHead(400).end('Bad request');
      return;
    }

    let filePath = path.resolve(repositoryRoot, `.${pathname}`);
    if (!filePath.startsWith(`${repositoryRoot}${path.sep}`) && filePath !== repositoryRoot) {
      response.writeHead(403).end('Forbidden');
      return;
    }

    try {
      if (fs.statSync(filePath).isDirectory()) filePath = path.join(filePath, 'index.html');
      const body = fs.readFileSync(filePath);
      response.writeHead(200, {
        'Cache-Control': 'no-store',
        'Content-Type': contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      });
      if (request.method === 'HEAD') response.end();
      else response.end(body);
    } catch {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
    }
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${address.port}${siteBasePath === '/' ? '' : siteBasePath}` });
    });
  });
}

async function configureContext(context, clarityRequests) {
  context.on('request', (request) => {
    if (/clarity\.ms|clarity\.events/.test(request.url())) clarityRequests.push(request.url());
  });
  await context.route('https://player.twitch.tv/**', (route) => route.fulfill({
    status: 200,
    contentType: 'text/html',
    body: '<!doctype html><title>Twitch preview disabled during audit</title>',
  }));
  await context.route('https://api.pixelplush.dev/v1/analytics/sessions/live/short', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: '[]',
  }));
  await context.route(/https:\/\/(?:www\.)?google-analytics\.com\/.*/, (route) => route.fulfill({ status: 204, body: '' }));
  await context.route(/https:\/\/region1\.google-analytics\.com\/.*/, (route) => route.fulfill({ status: 204, body: '' }));
  await context.route('https://www.googletagmanager.com/**', (route) => route.fulfill({
    status: 200,
    contentType: 'application/javascript',
    body: '',
  }));
  await context.route('https://www.paypal.com/sdk/js**', (route) => route.fulfill({
    status: 200,
    contentType: 'application/javascript',
    body: 'window.paypal={Buttons:function(){return{render:function(){return Promise.resolve();}}}};',
  }));
}

async function auditRoute(page, baseUrl, viewport, route) {
  const pageErrors = [];
  const consoleErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.stack || error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 45000 });
  await page.evaluate(async () => {
    for (let offset = 0; offset < document.documentElement.scrollHeight; offset += 700) {
      window.scrollTo(0, offset);
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    window.scrollTo(0, 0);
  });
  await page.evaluate(async () => {
    const pendingImages = [...document.images].filter((image) => !image.complete && image.offsetWidth > 0 && image.offsetHeight > 0);
    await Promise.all(pendingImages.map((image) => new Promise((resolve) => {
      const finish = () => resolve();
      image.addEventListener('load', finish, { once: true });
      image.addEventListener('error', finish, { once: true });
      setTimeout(finish, 30000);
    })));
  });
  await page.waitForTimeout(100);

  const rendered = await page.evaluate(() => ({
    has404: /This page could not be found|404:/.test(document.body.innerText),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    brokenImages: [...document.images]
      .filter((image) => image.complete && image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src),
    incompleteImages: [...document.images]
      .filter((image) => !image.complete && image.offsetWidth > 0 && image.offsetHeight > 0)
      .map((image) => image.currentSrc || image.src),
  }));
  const axe = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const severeAccessibility = axe.violations.filter((violation) => ['critical', 'serious'].includes(violation.impact));
  const failures = [];

  if (!response || response.status() >= 400) failures.push(`HTTP ${response?.status() || 'no response'}`);
  if (rendered.has404) failures.push('rendered 404 content');
  if (rendered.overflow > 1) failures.push(`${rendered.overflow}px horizontal overflow`);
  if (rendered.brokenImages.length) failures.push(`${rendered.brokenImages.length} broken image(s)`);
  if (rendered.incompleteImages.length) failures.push(`${rendered.incompleteImages.length} image(s) did not finish loading`);
  if (pageErrors.length) failures.push(`${pageErrors.length} uncaught exception(s)`);
  if (consoleErrors.length) failures.push(`${consoleErrors.length} console error(s)`);
  if (severeAccessibility.length) {
    failures.push(`${severeAccessibility.reduce((sum, violation) => sum + violation.nodes.length, 0)} serious/critical accessibility node(s)`);
  }

  return {
    viewport: viewport.name,
    route,
    failures,
    pageErrors,
    consoleErrors,
    brokenImages: rendered.brokenImages,
    incompleteImages: rendered.incompleteImages,
    accessibility: severeAccessibility.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      nodes: violation.nodes.map((node) => node.target),
    })),
    allAccessibilityViolations: axe.violations.length,
  };
}

async function auditInteractions(browser, baseUrl, clarityRequests) {
  const desktop = await browser.newContext({ viewport: viewports[0] });
  await configureContext(desktop, clarityRequests);
  const games = await desktop.newPage();
  await games.goto(`${baseUrl}/games/?type=parachute`, { waitUntil: 'networkidle' });
  const settings = games.getByRole('button', { name: 'Game Settings' });
  if ((await settings.getAttribute('aria-expanded')) !== 'false') throw new Error('Game Settings did not begin collapsed');
  await settings.click();
  if ((await settings.getAttribute('aria-expanded')) !== 'true') throw new Error('Game Settings did not expose its expanded state');
  if (!(await games.locator('#game-settings-panel').isVisible())) throw new Error('Game Settings panel is not visible after expansion');
  const dayVariantIcon = games.getByText('Day', { exact: true }).locator('..').locator('img');
  if (!(await dayVariantIcon.getAttribute('src'))?.startsWith(`${siteRoute('/app-assets/')}`)) throw new Error('Parachute relative variant icon lost the site asset prefix');
  const autumn = games.getByRole('button', { name: /Autumn/ }).first();
  await autumn.click();
  await games.waitForTimeout(250);
  const autumnPreview = await games.locator('img').evaluateAll((images) => images.some((image) => image.src.includes('drop_autumn_website.gif')));
  if (!autumnPreview) throw new Error('Selecting Autumn did not update the game preview');
  const seafaring = games.getByRole('button', { name: /Seafaring Chutes/ }).first();
  if (!(await seafaring.isVisible())) throw new Error('Seafaring Chutes is missing from Parachute themes');
  if (!(await seafaring.locator('img').getAttribute('src'))?.includes('/assets/add-ons/icon_boat_chutes.png')) throw new Error('Seafaring Chutes is missing its catalog icon');
  await seafaring.click();
  await games.waitForTimeout(250);
  const seafaringPreview = games.locator('img[src*="boat_chutes.png"]').first();
  await seafaringPreview.waitFor({ state: 'visible' });
  if (!(await seafaringPreview.evaluate((image) => image.complete && image.naturalWidth > 0))) throw new Error('Seafaring Chutes preview did not load');
  if ((await games.locator('#theme-select').inputValue()) !== 'boatchutes') throw new Error('Seafaring Chutes did not become the selected theme');
  await games.close();

  const maze = await desktop.newPage();
  await maze.goto(`${baseUrl}/games/?type=maze`, { waitUntil: 'networkidle' });
  const summerCamp = maze.getByRole('button', { name: /Summer Camp/ }).first();
  if (!(await summerCamp.isVisible())) throw new Error('Summer Camp is missing from Maze themes');
  if (!(await summerCamp.locator('img').getAttribute('src'))?.includes('/assets/add-ons/icon_summer_camp_maze.png')) throw new Error('Summer Camp is missing its catalog icon');
  await summerCamp.click();
  await maze.waitForTimeout(250);
  const summerCampPreview = maze.locator('img[src*="summercamp.png"]').first();
  await summerCampPreview.waitFor({ state: 'visible' });
  if (!(await summerCampPreview.evaluate((image) => image.complete && image.naturalWidth > 0))) throw new Error('Summer Camp preview did not load');
  if ((await maze.locator('#theme-select').inputValue()) !== 'summercamp') throw new Error('Summer Camp did not become the selected theme');
  await maze.close();

  const gamesChunk = fs.readdirSync(path.join(siteRoot, '_next', 'static', 'chunks', 'app', 'games')).find((file) => /^page-.*\.js$/.test(file));
  const gamesContent = fs.readFileSync(path.join(siteRoot, '_next', 'static', 'chunks', 'app', 'games', gamesChunk), 'utf8');
  if (!gamesContent.includes('{key:"boatchutes",name:"Seafaring Chutes (Premium)",page:"/parachute/boat_chutes.html",premium:!0,preview:"/app-assets/images/games/boat_chutes.png",requires:"addon_parachute_boat"}')) throw new Error('Seafaring Chutes paid-page contract is missing from Games data');
  if (!gamesContent.includes('{key:"summercamp",name:"Summer Camp (Premium)",page:"/maze/summercamp.html",premium:!0,preview:"/app-assets/images/games/summercamp.png",requires:"addon_maze_summercamp"}')) throw new Error('Summer Camp paid-page contract is missing from Games data');

  const scores = await desktop.newPage();
  await scores.goto(`${baseUrl}/scores/`, { waitUntil: 'networkidle' });
  await scores.getByLabel('Time Range').selectOption('1w');
  if ((await scores.getByLabel('Time Range').inputValue()) !== '1w') throw new Error('Leaderboard time range did not change');
  const themeSelect = scores.getByLabel('Theme');
  const themeOptions = await themeSelect.locator('option').evaluateAll((options) => options.map((option) => option.value));
  if (themeOptions.length > 1) {
    await themeSelect.selectOption(themeOptions[1]);
    if ((await themeSelect.inputValue()) !== themeOptions[1]) throw new Error('Leaderboard theme did not change');
  }
  await scores.close();

  const navigation = await desktop.newPage();
  await navigation.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  const gamesLink = navigation.getByRole('link', { name: 'Games for Streams' });
  if (await gamesLink.getAttribute('href') !== siteRoute('/games/')) throw new Error('Games navigation link does not target the canonical Games route');
  await navigation.goto(`${baseUrl}${siteRoute('/games/')}`, { waitUntil: 'networkidle' });
  if (new URL(navigation.url()).pathname !== siteRoute('/games/')) throw new Error('Canonical Games route did not load');
  await navigation.close();
  await desktop.close();

  const mobile = await browser.newContext({ viewport: viewports[1] });
  await configureContext(mobile, clarityRequests);
  const home = await mobile.newPage();
  await home.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  const languageButton = home.getByRole('button', { name: /^Language:/ });
  if (!(await languageButton.isVisible())) throw new Error('Mobile language menu lacks an accessible name');
  await languageButton.click();
  const languageChoices = home.locator('button').filter({ hasText: /Deutsch|Čeština|Türkçe|Español/ });
  if (!(await languageChoices.first().isVisible())) throw new Error('Language menu did not open');
  await languageChoices.first().click();
  if ((await languageButton.getAttribute('aria-label')) === 'Language: English') throw new Error('Language selection did not update');
  const footerPosition = await home.locator('footer').evaluate((footer) => getComputedStyle(footer).position);
  if (footerPosition !== 'static') throw new Error(`Mobile footer overlays content with position: ${footerPosition}`);
  const expectedOldSitePath = process.env.PIXELPLUSH_OLD_SITE_PATH || '/v1/';
  if ((await home.locator('[data-old-pixelplush-site]').getAttribute('href')) !== expectedOldSitePath) throw new Error(`Old PixelPlush Site link does not point to ${expectedOldSitePath}`);
  const layoutChunk = fs.readdirSync(path.join(siteRoot, '_next', 'static', 'chunks', 'app')).find((file) => /^layout-.*\.js$/.test(file));
  const layoutContent = fs.readFileSync(path.join(siteRoot, '_next', 'static', 'chunks', 'app', layoutChunk), 'utf8');
  if (!layoutContent.includes(`href:"${expectedOldSitePath}",target:"_blank",rel:"noopener noreferrer","data-old-pixelplush-site":!0`)) throw new Error(`Hydrated old-site link does not point to ${expectedOldSitePath}`);
  await home.close();
  await mobile.close();
}

async function auditNullScopes(browser, baseUrl, clarityRequests) {
  const context = await browser.newContext({ viewport: viewports[0] });
  await configureContext(context, clarityRequests);
  await context.addInitScript(() => localStorage.setItem('twitchToken', 'null-scopes-token'));
  await context.route('https://id.twitch.tv/oauth2/validate', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ client_id: 'test-client', login: 'teststreamer', user_id: '1', scopes: null }),
  }));
  await context.route('https://api.pixelplush.dev/v1/accounts', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ username: 'teststreamer', displayName: 'Test Streamer', coins: 0, owned: [], styles: {} }),
  }));
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.stack || error.message));
  await page.goto(`${baseUrl}/games/?type=parachute`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Grant Twitch Permissions' }).waitFor({ state: 'visible' });
  const scopes = await page.evaluate(() => window.ComfyTwitch.Scopes);
  if (!Array.isArray(scopes) || scopes.length !== 0) throw new Error(`Null Twitch scopes were not normalized: ${JSON.stringify(scopes)}`);
  await page.locator('header button').filter({ hasText: 'Test Streamer' }).click();
  const globalGrant = page.getByRole('button', { name: 'Grant Twitch Permissions' }).last();
  await globalGrant.waitFor({ state: 'visible' });
  await page.evaluate(() => {
    window.__auditPermissionLogin = null;
    window.ComfyTwitch.Login = (...args) => { window.__auditPermissionLogin = args; };
  });
  await globalGrant.click();
  const permissionLogin = await page.evaluate(() => window.__auditPermissionLogin);
  if (JSON.stringify(permissionLogin?.[2]) !== JSON.stringify(['user:read:email', 'chat:read', 'chat:edit', 'channel:manage:redemptions', 'channel:read:redemptions'])) throw new Error('Global Twitch permission action did not request every required scope');
  const savedReturnUrl = await page.evaluate(() => localStorage.getItem('redirectPage'));
  if (!savedReturnUrl?.includes(`${siteRoute('/games/')}?type=parachute`)) throw new Error(`Global permission action lost its originating URL: ${savedReturnUrl}`);
  if (pageErrors.length) throw new Error(`Null Twitch scopes caused an uncaught exception: ${pageErrors.join('\n')}`);
  await page.close();
  await context.close();
}

async function auditOAuthReturnUrl(browser, baseUrl, clarityRequests) {
  const context = await browser.newContext({ viewport: viewports[0] });
  await configureContext(context, clarityRequests);
  const expectedUrl = `${baseUrl}/games/?type=giveaway#colors`;
  await context.addInitScript((returnUrl) => {
    localStorage.setItem('twitchToken', 'oauth-return-token');
    localStorage.setItem('redirectPage', returnUrl);
  }, expectedUrl);
  await context.route('https://id.twitch.tv/oauth2/validate', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ client_id: 'test-client', login: 'teststreamer', user_id: '1', scopes: ['user:read:email', 'chat:read', 'chat:edit', 'channel:manage:redemptions', 'channel:read:redemptions'] }) }));
  await context.route('https://api.pixelplush.dev/v1/accounts', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ username: 'teststreamer', displayName: 'Test Streamer', coins: 0, owned: [], styles: {} }) }));
  const page = await context.newPage();
  await page.goto(`${baseUrl}/redirect/`, { waitUntil: 'networkidle' });
  await page.waitForURL((url) => url.pathname === siteRoute('/games/') && url.search === '?type=giveaway' && url.hash === '#colors', { timeout: 5000 });
  await page.close();
  await context.close();

  const unsafeContext = await browser.newContext({ viewport: viewports[0] });
  await configureContext(unsafeContext, clarityRequests);
  await unsafeContext.addInitScript(() => localStorage.setItem('redirectPage', 'https://example.com/stolen?token=1#outside'));
  const unsafePage = await unsafeContext.newPage();
  await unsafePage.goto(`${baseUrl}/redirect/`, { waitUntil: 'networkidle' });
  await unsafePage.waitForURL((url) => url.pathname === siteRoute('/') && url.origin === new URL(baseUrl).origin, { timeout: 5000 });
  await unsafePage.close();
  await unsafeContext.close();
}

async function auditGiveawayHierarchy(browser, baseUrl, clarityRequests) {
  const context = await browser.newContext({ viewport: viewports[0] });
  await configureContext(context, clarityRequests);
  await context.addInitScript(() => localStorage.setItem('twitchToken', 'giveaway-audit-token'));
  await context.route('https://id.twitch.tv/oauth2/validate', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ client_id: 'test-client', login: 'teststreamer', user_id: '1', scopes: ['user:read:email', 'chat:read', 'chat:edit', 'channel:manage:redemptions', 'channel:read:redemptions'] }),
  }));
  await context.route('https://api.pixelplush.dev/v1/accounts', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      username: 'teststreamer',
      displayName: 'Test Streamer',
      coins: 100,
      owned: ['addon_giveaway_blue', 'addon_giveaway_bw', 'addon_giveaway_green', 'addon_giveaway_orange', 'addon_giveaway_pink', 'addon_giveaway_purple', 'addon_giveaway_red', 'addon_giveaway_yellow', 'addon_giveaway_blossoms', 'addon_giveaway_autumn'],
      styles: {},
    }),
  }));

  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.stack || error.message));
  await page.goto(`${baseUrl}/games/?type=giveaway`, { waitUntil: 'networkidle' });
  const themeSection = page.getByRole('heading', { name: /Available Themes/ }).locator('..');
  const topButtons = themeSection.locator('> div > button');
  const topLabels = (await topButtons.allInnerTexts()).map((text) => text.replace(/\s+/g, ' ').trim());
  if (topLabels.length !== 4 || topLabels.some((label) => /^(Blue|Black & White|Green|Orange|Pink|Purple|Red|Yellow)/.test(label))) {
    throw new Error(`Giveaway colors are not nested under Colorful: ${topLabels.join(', ')}`);
  }
  const colorful = topButtons.filter({ hasText: 'Colorful' });
  const colorfulIcon = colorful.locator('img');
  if ((await colorfulIcon.getAttribute('src')) !== 'https://cdn.pixelplush.dev/assets/bundles/icon_giveaway_bundle.gif') throw new Error('Colorful Giveaway does not use the animated bundle icon');
  if ((await colorfulIcon.evaluate((image) => image.naturalWidth)) === 0) throw new Error('Colorful Giveaway bundle icon is broken');
  const firstFrame = await colorfulIcon.screenshot();
  await page.waitForTimeout(300);
  const secondFrame = await colorfulIcon.screenshot();
  if (firstFrame.equals(secondFrame)) throw new Error('Colorful Giveaway bundle icon did not animate');
  await colorful.click();
  const variantHeading = page.getByText('Color Variants', { exact: true });
  await variantHeading.waitFor({ state: 'visible' });
  const variantContainer = variantHeading.locator('..');
  if ((await variantContainer.locator('input[type="radio"]').count()) !== 8) throw new Error('Colorful Giveaway does not have eight exclusive color choices');
  await variantContainer.locator('label').filter({ hasText: 'Yellow' }).click();
  await page.waitForTimeout(200);
  if ((await variantContainer.locator('input[type="radio"]:checked').count()) !== 1) throw new Error('Colorful Giveaway color selection is not exclusive');
  if (!(await page.getByAltText(/Giveaway Tool - Colorful/).getAttribute('src'))?.includes('giveaway_pp_yellow.gif')) throw new Error('Colorful Yellow did not update the game preview');
  if (!(await page.locator('input[readonly]').last().inputValue()).includes('/giveaway/yellow.html')) throw new Error('Colorful Yellow did not update the browser-source URL');
  if (pageErrors.length) throw new Error(`Giveaway hierarchy caused an uncaught exception: ${pageErrors.join('\n')}`);
  await page.locator('header button').filter({ hasText: 'Test Streamer' }).click();
  if (await page.getByRole('button', { name: 'Grant Twitch Permissions' }).count()) throw new Error('Global Twitch permission action shown for a fully scoped account');

  await page.goto(`${baseUrl}/market/`, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    for (let offset = 0; offset < document.documentElement.scrollHeight; offset += 700) {
      window.scrollTo(0, offset);
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(() => [...document.querySelectorAll('div.group')]
    .filter((card) => card.textContent?.toLowerCase().includes('bundle'))
    .every((card) => card.querySelector('img[alt]')?.complete), null, { timeout: 15000 });
  const bundles = await page.locator('div.group').evaluateAll((cards) => cards
    .filter((card) => card.textContent?.toLowerCase().includes('bundle'))
    .map((card) => {
      const image = card.querySelector('img[alt]');
      const rect = image?.getBoundingClientRect();
      return { alt: image?.alt, width: Math.round(rect?.width || 0), height: Math.round(rect?.height || 0), naturalWidth: image?.naturalWidth || 0 };
    }));
  if (bundles.length !== 16) throw new Error(`Expected 16 market bundle cards, found ${bundles.length}`);
  const invalidBundles = bundles.filter((image) => image.width !== 48 || image.height !== 48 || image.naturalWidth === 0);
  if (invalidBundles.length) throw new Error(`Invalid market bundle icons: ${JSON.stringify(invalidBundles)}`);
  await page.close();
  await context.close();

  const restrictedContext = await browser.newContext({ viewport: viewports[0] });
  await configureContext(restrictedContext, clarityRequests);
  await restrictedContext.addInitScript(() => localStorage.setItem('twitchToken', 'restricted-giveaway-token'));
  await restrictedContext.route('https://id.twitch.tv/oauth2/validate', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ client_id: 'test-client', login: 'teststreamer', user_id: '1', scopes: ['user:read:email'] }) }));
  await restrictedContext.route('https://api.pixelplush.dev/v1/accounts', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ username: 'teststreamer', displayName: 'Test Streamer', coins: 0, owned: ['addon_giveaway_blue'], styles: {} }) }));
  const restrictedPage = await restrictedContext.newPage();
  await restrictedPage.goto(`${baseUrl}/games/?type=giveaway`, { waitUntil: 'networkidle' });
  await restrictedPage.getByRole('button', { name: /Colorful/ }).click();
  const restrictedVariants = restrictedPage.getByText('Color Variants', { exact: true }).locator('..');
  if (await restrictedVariants.locator('label').filter({ hasText: 'Blue' }).locator('input').isDisabled()) throw new Error('Owned Blue Giveaway color is disabled');
  if (!(await restrictedVariants.locator('label').filter({ hasText: 'Yellow' }).locator('input').isDisabled())) throw new Error('Unowned Yellow Giveaway color is not disabled');
  await restrictedPage.close();
  await restrictedContext.close();
}

async function auditBirthdayCelebration(browser, baseUrl, clarityRequests) {
  const htmlFiles = fs.readdirSync(siteRoot, { recursive: true })
    .filter((file) => file.endsWith('.html')
      && !file.startsWith(`app-assets${path.sep}`)
      && !file.startsWith(`v1${path.sep}`)
      && !file.startsWith(`out${path.sep}`)
      && !file.startsWith(`node_modules${path.sep}`)
      && !file.startsWith(`page-templates${path.sep}`)
      && !file.startsWith('template_'));
  const birthdayTags = htmlFiles.filter((file) => fs.readFileSync(path.join(siteRoot, file), 'utf8').includes('/birthday-celebration.js'));
  const birthdayEnabled = birthdayTags.length > 0;
  if (birthdayEnabled && birthdayTags.length !== htmlFiles.length) throw new Error(`Birthday script is missing from ${htmlFiles.length - birthdayTags.length} generated page(s)`);
  if (!birthdayEnabled) return;
  const context = await browser.newContext({ viewport: viewports[1] });
  await configureContext(context, clarityRequests);
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.stack || error.message));
  await page.goto(`${baseUrl}/`, { waitUntil: 'load' });
  const banner = page.getByRole('status', { name: "PixelPlush's 7th birthday celebration" });
  await banner.waitFor({ state: 'visible', timeout: 5000 });
  if (!(await banner.innerText()).includes("Celebrate PixelPlush's 7th birthday!")) throw new Error('Birthday banner text is missing');
  const confetti = page.locator('#pp-birthday-confetti-layer i');
  if ((await confetti.count()) !== 56) throw new Error(`Expected 56 confetti pieces, found ${await confetti.count()}`);
  if ((await page.locator('#pp-birthday-confetti-layer').evaluate((element) => getComputedStyle(element).pointerEvents)) !== 'none') throw new Error('Birthday confetti blocks page interaction');
  const before = await confetti.first().boundingBox();
  await page.waitForTimeout(350);
  const after = await confetti.first().boundingBox();
  if (!before || !after || before.y === after.y) throw new Error('Birthday confetti did not animate');
  await page.getByRole('button', { name: 'Dismiss birthday celebration' }).click();
  if (await banner.count()) throw new Error('Birthday banner did not dismiss');
  if (await page.locator('#pp-birthday-confetti-layer').count()) throw new Error('Birthday confetti did not dismiss with the banner');
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(2000);
  if (await page.locator('#pp-birthday-banner').count()) throw new Error('Birthday dismissal did not persist for the browser session');
  if (pageErrors.length) throw new Error(`Birthday celebration caused an uncaught exception: ${pageErrors.join('\n')}`);
  await page.close();
  await context.close();

  const reducedContext = await browser.newContext({ viewport: viewports[1], reducedMotion: 'reduce' });
  await configureContext(reducedContext, clarityRequests);
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(`${baseUrl}/`, { waitUntil: 'load' });
  await reducedPage.getByRole('status', { name: "PixelPlush's 7th birthday celebration" }).waitFor({ state: 'visible', timeout: 5000 });
  if (await reducedPage.locator('#pp-birthday-confetti-layer').count()) throw new Error('Birthday confetti rendered for a reduced-motion user');
  await reducedPage.close();
  await reducedContext.close();
}

async function main() {
  const { server, baseUrl } = await startStaticServer();
  const browser = await chromium.launch({ headless: true });
  const clarityRequests = [];
  const results = [];

  try {
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport });
      await configureContext(context, clarityRequests);
      for (const route of routes) {
        const page = await context.newPage();
        results.push(await auditRoute(page, baseUrl, viewport, route));
        await page.close();
      }
      await context.close();
    }
    await auditInteractions(browser, baseUrl, clarityRequests);
    await auditNullScopes(browser, baseUrl, clarityRequests);
    await auditOAuthReturnUrl(browser, baseUrl, clarityRequests);
    await auditGiveawayHierarchy(browser, baseUrl, clarityRequests);
    await auditBirthdayCelebration(browser, baseUrl, clarityRequests);
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  if (clarityRequests.length) {
    results.push({ viewport: 'all', route: 'all', failures: [`Microsoft Clarity was requested ${clarityRequests.length} time(s)`], clarityRequests });
  }
  const failures = results.filter((result) => result.failures.length);
  const failureCount = results.reduce((sum, result) => {
    const accessibilityNodes = (result.accessibility || []).reduce((nodeSum, violation) => nodeSum + violation.nodes.length, 0);
    return sum + result.pageErrors?.length + result.consoleErrors?.length + result.brokenImages?.length + accessibilityNodes + (result.failures.length && !accessibilityNodes && !result.pageErrors?.length && !result.consoleErrors?.length && !result.brokenImages?.length ? result.failures.length : 0);
  }, 0);
  const accessibilityViolations = results.reduce((sum, result) => sum + (result.allAccessibilityViolations || 0), 0);
  console.log(`Checked ${routes.length * viewports.length} route/viewport combinations and key interactions.`);
  console.log(`Serious/critical failure nodes: ${failureCount}. Total axe rule findings of any impact: ${accessibilityViolations}.`);
  if (failures.length) {
    console.error(JSON.stringify(failures, null, 2));
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
