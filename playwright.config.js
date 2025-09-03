module.exports = {
  testDir: '.',
  testMatch: '*.spec.js',
  timeout: 30000,
  use: {
    headless: true,
    baseURL: 'http://localhost:8080',
  },
  webServer: {
    command: 'npm run serve',
    port: 8080,
    timeout: 120 * 1000,
    reuseExistingServer: true,
  },
};
