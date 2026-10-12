import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import unzipper from 'unzipper';
import { expect, test } from '@playwright/test';

const pages = ['/', '/about', '/services', '/how-we-work', '/contact'];
const downloads = ['/download', '/download-zip', '/api/download'];
const fixedMembers = [
  'index.html', 'about.html', 'services.html', 'how-we-work.html', 'contact.html',
  'mobilelab-ogimage.png', 'server.js', 'package.json', '.env.example', '.gitignore', 'README.md',
];
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function assetMembers(directory, prefix = 'assets') {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    const relative = `${prefix}/${entry.name}`;
    return entry.isDirectory() ? assetMembers(absolute, relative) : [relative.replaceAll('\\', '/')];
  });
}

const expectedMembers = [...fixedMembers, ...assetMembers(path.join(projectRoot, 'public', 'assets'))].sort();
assert.equal(expectedMembers.length, 93, 'repository archive specification must contain 93 members');

test('serves actual MobileLab pages and assets at all required widths', async ({ page }) => {
  for (const route of pages) {
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(route, { waitUntil: 'networkidle' });
      expect(response?.status(), route).toBe(200);
      await expect(page.locator('body')).toContainText(/Mobile Lab/i);
      await expect(page).not.toHaveURL(/vercel\.com\/sso|\/login/);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
      expect(await page.locator('img').evaluateAll((images) => images.filter((image) => image.complete && image.naturalWidth === 0))).toHaveLength(0);
    }
  }
});

test('supports protected-preview interactions and contact responses', async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/', { waitUntil: 'networkidle' });
  const menu = page.locator('#mobile-menu-btn');
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#mobile-nav')).not.toHaveClass(/(?:^| )hidden(?: |$)/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#header-glow')).toBeHidden();

  const invalid = await request.post('/api/contact', { data: {} });
  expect(invalid.status()).toBe(400);
  const valid = await request.post('/api/contact', {
    data: { name: 'Remote QA', email: 'qa@example.com', fix: 'Synthetic remote validation request.' },
  });
  expect(valid.status()).toBe(503);
});

test('returns protected archives with exactly the allowlisted members', async ({ request }) => {
  let baselineNames;
  for (const route of downloads) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    expect(response.headers()['content-type']).toMatch(/application\/zip/);
    const archive = await unzipper.Open.buffer(await response.body());
    const names = archive.files.map((file) => file.path).sort();
    assert.equal(new Set(names).size, names.length, `${route} archive contains duplicate members`);
    assert.ok(names.every((name) => !name.endsWith('/')), `${route} archive contains directory metadata`);
    assert.deepEqual(names, expectedMembers, `${route} archive members differ`);
    if (!baselineNames) baselineNames = names;
    else assert.deepEqual(names, baselineNames, `${route} differs from the first download endpoint`);
    assert.ok(names.every((name) => !name.startsWith('/') && !name.includes('..')));
    await Promise.all(archive.files.map((file) => file.buffer()));
    const index = await archive.files.find((file) => file.path === 'index.html').buffer();
    assert.match(index.toString('utf8'), /Mobile Lab/i);
  }
});

test('returns security headers and protects repository paths', async ({ request }) => {
  const response = await request.get('/');
  expect(response.status()).toBe(200);
  const headers = response.headers();
  expect(headers['x-content-type-options']).toBe('nosniff');
  expect(headers['x-frame-options']).toBe('DENY');
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
  expect(headers['content-security-policy']).toContain("default-src 'self'");

  for (const route of ['/server.js', '/.env', '/package.json', '/package-lock.json', '/.git/config', '/AGENTS.md']) {
    expect((await request.get(route)).status(), route).toBe(404);
  }
});
