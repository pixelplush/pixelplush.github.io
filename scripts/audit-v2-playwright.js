const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;

const repositoryRoot = path.resolve(__dirname, '..');
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
      resolve({ server, baseUrl: `http://127.0.0.1:${address.port}/v2` });
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
  if (!(await dayVariantIcon.getAttribute('src'))?.startsWith('/v2/app-assets/')) throw new Error('Parachute relative variant icon lost the /v2 asset prefix');
  const autumn = games.getByRole('button', { name: /Autumn/ }).first();
  await autumn.click();
  await games.waitForTimeout(250);
  const autumnPreview = await games.locator('img').evaluateAll((images) => images.some((image) => image.src.includes('drop_autumn_website.gif')));
  if (!autumnPreview) throw new Error('Selecting Autumn did not update the game preview');
  await games.close();

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
  await navigation.getByRole('link', { name: 'Games for Streams' }).click();
  await navigation.waitForURL(/\/v2\/games\/?$/);
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
  if (pageErrors.length) throw new Error(`Null Twitch scopes caused an uncaught exception: ${pageErrors.join('\n')}`);
  await page.close();
  await context.close();
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
    await auditGiveawayHierarchy(browser, baseUrl, clarityRequests);
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
