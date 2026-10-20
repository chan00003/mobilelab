import { expect, test } from '@playwright/test';

const pages = ['/', '/about', '/services', '/how-we-work', '/contact', '/blog', '/work'];

test('serves the responsive MobileLab pages without broken assets', async ({ page }) => {
  for (const route of pages) {
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(route, { waitUntil: 'networkidle' });
      expect(response?.status(), `${route} at ${width}px`).toBe(200);
      await expect(page.locator('body')).toContainText(/Mobile Lab/i);
      await expect(page.locator('img').evaluateAll((images) => images
        .filter((image) => image.complete && image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.src))).resolves.toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    }
  }
});

test('supports navigation, focus, reduced motion, and contact behavior', async ({ page, request }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/', { waitUntil: 'networkidle' });
  const menu = page.locator('#mobile-menu-btn');
  await menu.focus();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#mobile-nav')).not.toHaveClass(/(?:^| )hidden(?: |$)/);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('#header-glow')).toBeHidden();

  const invalid = await request.post('/api/contact', { data: {} });
  expect(invalid.status()).toBe(400);
  const valid = await request.post('/api/contact', {
    data: { name: 'QA Visitor', email: 'qa@example.com', fix: 'Synthetic validation request.' },
  });
  expect(valid.status()).toBe(503);
  await page.goto('/contact', { waitUntil: 'networkidle' });
  await page.locator('#contact-name').fill('QA Visitor');
  await page.locator('#contact-email').fill('qa@example.com');
  await page.locator('#contact-fix').fill('Synthetic validation request.');
  await page.locator('#submit-btn').click();
  const feedback = page.locator('#contact-success-msg');
  await expect(feedback).toHaveClass(/form-feedback-error/);
  await expect(feedback).not.toContainText(/thank you for submitting|successfully delivered/i);
});
