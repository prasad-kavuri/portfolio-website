// test-setup.js
// Global test setup for Jest environment

// Mock DOM globals for browser-based code
global.window = global.window || {};
global.document = global.document || {
    createElement: jest.fn(() => ({
        classList: {
            add: jest.fn(),
            remove: jest.fn(),
            contains: jest.fn(),
            toggle: jest.fn()
        },
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        style: {},
        innerHTML: '',
        textContent: '',
        appendChild: jest.fn(),
        removeChild: jest.fn(),
        querySelector: jest.fn(),
        querySelectorAll: jest.fn(() => []),
        getElementById: jest.fn()
    })),
    getElementById: jest.fn(),
    querySelector: jest.fn(),
    querySelectorAll: jest.fn(() => []),
    addEventListener: jest.fn(),
    body: {
        scrollWidth: 1024,
        appendChild: jest.fn(),
        removeChild: jest.fn()
    },
    head: {
        appendChild: jest.fn()
    }
};

// Mock window methods
global.window.addEventListener = jest.fn();
global.window.removeEventListener = jest.fn();
global.window.dispatchEvent = jest.fn();
global.window.CustomEvent = jest.fn();
global.window.innerWidth = 1024;
global.window.innerHeight = 768;
global.window.location = {
    href: 'http://localhost',
    pathname: '/',
    search: '',
    hash: ''
};
global.window.performance = {
    timing: {
        loadEventEnd: 1000,
        navigationStart: 0
    }
};

// Mock console methods for cleaner test output
global.console = {
    ...console,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
};

// Mock fetch for API calls
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve('')
    })
);

// Mock setTimeout/setInterval for async operations
jest.useFakeTimers();

// Setup custom matchers or utilities
expect.extend({
    toBeVisible(received) {
        const pass = received && !received.classList.contains('hidden');
        return {
            message: () => `expected element ${pass ? 'not ' : ''}to be visible`,
            pass
        };
    }
});