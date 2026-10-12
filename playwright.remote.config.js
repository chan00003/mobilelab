import { defineConfig, devices } from '@playwright/test';

const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
if (!bypassSecret) {
  throw new Error('VERCEL_AUTOMATION_BYPASS_SECRET is not available; remote QA stopped before making requests.');
}

const defaultBaseURL = 'https://mobilelab-git-feature-vercel-node-runtime-mlbs.vercel.app';
const configuredBaseURL = process.env.REMOTE_BASE_URL;
const baseURL = configuredBaseURL === undefined ? defaultBaseURL : configuredBaseURL.trim();
if (!baseURL) {
  throw new Error('REMOTE_BASE_URL cannot be empty when supplied.');
}

let parsedBaseURL;
try {
  parsedBaseURL = new URL(baseURL);
} catch {
  throw new Error('REMOTE_BASE_URL must be an absolute URL.');
}
if (!['http:', 'https:'].includes(parsedBaseURL.protocol)) {
  throw new Error('REMOTE_BASE_URL must use http or https.');
}

export default defineConfig({
  testDir: './test/remote',
  outputDir: 'test-results/remote',
  fullyParallel: false,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report/remote', open: 'never' }],
    ['./test/remote/qa-summary-reporter.js', { outputFile: 'playwright-report/remote/qa-summary.json' }],
  ],
  use: {
    baseURL,
    extraHTTPHeaders: { 'x-vercel-protection-bypass': bypassSecret },
    screenshot: 'only-on-failure',
    trace: 'off',
    headless: true,
  },
  projects: [
    { name: 'remote-chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
