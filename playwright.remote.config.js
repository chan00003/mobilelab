import { defineConfig, devices } from '@playwright/test';

const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
if (!bypassSecret) {
  throw new Error('VERCEL_AUTOMATION_BYPASS_SECRET is not available; remote QA stopped before making requests.');
}

export default defineConfig({
  testDir: './test/remote',
  outputDir: 'test-results/remote',
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report/remote', open: 'never' }]],
  use: {
    baseURL: 'https://mobilelab-git-feature-vercel-node-runtime-mlbs.vercel.app',
    extraHTTPHeaders: { 'x-vercel-protection-bypass': bypassSecret },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    headless: true,
  },
  projects: [
    { name: 'remote-chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
