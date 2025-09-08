/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/', '\\.e2e\\.spec\\.[jt]s$'],

  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/test/**',
    '!**/coverage/**',
    '!**/*.e2e.spec.js',
    '!**/*.test.js',
    '!**/playwright-report/**',
    '!jest.config.js',
    '!playwright.config.js',
    '!multi-agent-demo.js',
    '!data/**',
    '!lib/agents/**'
  ],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },

  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  },

  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
};
