// playwright.config.js
const { test, expect } = require('@playwright/test');
module.exports = {
  testDir: '.',
  testMatch: ['**/*.e2e.spec.{js,ts}'],
  timeout: 30_000,
  use: {
    headless: true,
    baseURL: 'http://localhost:8081', // moved off 8080
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run serve', // now serves on 8081
    port: 8081,
    timeout: 120_000,
    reuseExistingServer: true,
  },
  jest: {
    testMatch: ["**/*.test.js"],
    testPathIgnorePatterns: ["/node_modules/", "\\.e2e\\.spec\\.[jt]s$", "/e2e/"],
    testEnvironment: "jsdom"
  }
};
