/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',

  // Only run unit tests; keep Playwright e2e out of Jest
  testMatch: ['**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/', '\\.e2e\\.spec\\.[jt]s$'],

  // Your previous coverage settings, plus exclude e2e specs
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/test/**',
    '!**/coverage/**',
    '!**/*.e2e.spec.js'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  verbose: true
};
