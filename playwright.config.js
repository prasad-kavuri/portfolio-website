// playwright.config.js
/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
  testDir: '.',
  testMatch: ['**/*.e2e.spec.{js,ts}'],
  timeout: 30_000,
  use: {
    headless: true,
    baseURL: 'http://localhost:8081',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run serve',
    port: 8081,
    timeout: 120_000,
    reuseExistingServer: true,
  },
  reporter: [['github'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
};
