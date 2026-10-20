import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { after, before, test } from 'node:test';
import { chromium } from 'playwright';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const baseUrl = 'http://127.0.0.1:3100';
const pages = [
  ['home', '/'],
  ['about', '/about'],
  ['services', '/services'],
  ['how-we-work', '/how-we-work'],
  ['contact', '/contact'],
  ['blog', '/blog'],
  ['work', '/work']
];
const viewports = [390, 768, 1440];
const artifactDir = fileURLToPath(new URL('../artifacts/browser-qa/', import.meta.url));
let server;
let browser;

async function waitForServer() {
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(baseUrl)).ok) return;
    } catch {
      // The local server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('Local E2E server did not start within 10 seconds.');
}

before(async () => {
  mkdirSync(artifactDir, { recursive: true });
  server = spawn(process.execPath, ['server.js'], {
    cwd: projectRoot,
    env: { ...process.env, PORT: '3100' },
    stdio: 'ignore'
  });
  await waitForServer();
  browser = await chromium.launch({ headless: true });
});

after(async () => {
  await browser?.close();
  if (server && !server.killed) {
    server.kill();
    await once(server, 'exit').catch(() => {});
  }
});

test('captures responsive pages without overflow or broken images', async () => {
  for (const [name, route] of pages) {
    for (const width of viewports) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await context.newPage();
      await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
      await page.screenshot({ path: `${artifactDir}${name}-${width}.png`, fullPage: true });

      const layout = await page.evaluate(() => ({
        viewportWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        brokenImages: [...document.images]
          .filter((image) => image.complete && image.naturalWidth === 0)
          .map((image) => image.currentSrc || image.src)
      }));
      assert.equal(layout.viewportWidth, width);
      assert.ok(layout.scrollWidth <= width + 1, `${route} at ${width}px overflows by ${layout.scrollWidth - width}px`);
      assert.deepEqual(layout.brokenImages, [], `${route} has broken images`);
      await context.close();
    }
  }
});

test('supports mobile navigation, keyboard focus, reduced motion, and method steps', async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });

  const menuButton = page.locator('#mobile-menu-btn');
  await menuButton.focus();
  assert.notEqual(await menuButton.evaluate((element) => getComputedStyle(element).outlineStyle), 'none');
  assert.equal(await menuButton.getAttribute('aria-expanded'), 'false');
  await menuButton.click();
  assert.equal(await menuButton.getAttribute('aria-expanded'), 'true');
  assert.equal(await page.locator('#mobile-nav').evaluate((element) => element.classList.contains('hidden')), false);
  await menuButton.click();
  assert.equal(await menuButton.getAttribute('aria-expanded'), 'false');

  assert.equal(await page.locator('#header-glow').evaluate((element) => getComputedStyle(element).display), 'none');
  const methodSteps = page.locator('#method-steps-container .method-step-btn');
  if (await methodSteps.count() > 1) {
    await methodSteps.nth(1).click();
    assert.equal(await methodSteps.nth(1).getAttribute('aria-selected'), 'true');
  }
  await context.close();
});

test('keeps the how-we-work collaboration heading within a mobile viewport', async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/how-we-work`, { waitUntil: 'networkidle' });

  const layout = await page.evaluate(() => {
    const heading = [...document.querySelectorAll('h2')]
      .find((element) => element.textContent.includes('How We Collaborate Day-to-Day'));
    const rect = heading?.getBoundingClientRect();
    return {
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      headingRight: rect?.right ?? 0,
    };
  });

  assert.ok(layout.documentWidth <= layout.viewportWidth, 'how-we-work overflows horizontally on mobile');
  assert.ok(layout.headingRight <= layout.viewportWidth, 'collaboration heading exceeds the mobile viewport');
  await context.close();
});

test('contact form validates and reports unconfigured delivery without false success', async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/contact`, { waitUntil: 'networkidle' });
  await page.locator('#contact-name').fill('Ada Lovelace');
  await page.locator('#contact-email').fill('ada@example.com');
  await page.locator('#contact-fix').fill('We need help reducing a recurring deployment bottleneck across several services.');
  await page.locator('#submit-btn').click();
  const feedback = page.locator('#contact-success-msg');
  await page.waitForFunction(() => document.querySelector('#contact-success-msg')?.textContent.includes('not configured'));
  assert.match(await feedback.textContent(), /not configured/i);
  assert.doesNotMatch(await feedback.textContent(), /Thank you for submitting/i);
  await context.close();
});

test('keeps downloads available and repository files private', async () => {
  for (const route of ['/download', '/download-zip', '/api/download']) {
    const response = await fetch(`${baseUrl}${route}`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type') || '', /application\/zip/);
    assert.ok((await response.arrayBuffer()).byteLength > 1000);
  }
  for (const route of ['/server.js', '/package.json', '/.env', '/.git/config']) {
    const response = await fetch(`${baseUrl}${route}`);
    assert.equal(response.status, 404, `${route} should not be public`);
  }
});

test('renders blog and projects through direct, refreshed, and internal navigation', async () => {
  for (const [route, detailPrefix] of [['/blog', '/blog/'], ['/work', '/work/']]) {
    for (const width of [390, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await context.newPage();
      const consoleErrors = [];
      const failedRequests = [];
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });
      page.on('pageerror', (error) => consoleErrors.push(error.message));
      page.on('requestfailed', (request) => failedRequests.push(request.url()));

      await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('.content-card').count(), 10, `${route} should render its cards`);
      const detailHref = await page.locator('.content-card a').first().getAttribute('href');
      assert.ok(detailHref?.startsWith(detailPrefix));
      await page.locator('.content-card a').first().click();
      await page.waitForLoadState('networkidle');
      assert.equal(await page.locator('.article').count(), 1);
      await page.reload({ waitUntil: 'networkidle' });
      assert.equal(await page.locator('.article').count(), 1);
      await page.goBack({ waitUntil: 'networkidle' });
      assert.equal(await page.locator('.content-card').count(), 10);
      assert.deepEqual(consoleErrors, [], `${route} emitted browser errors`);
      assert.deepEqual(failedRequests, [], `${route} had failed requests`);
      await context.close();
    }
  }
});
