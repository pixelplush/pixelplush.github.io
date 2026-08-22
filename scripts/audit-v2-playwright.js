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
