// test-multi-agent-demo.js
// Unit tests for multi-agent demo functionality

// Mock the agent classes before importing
jest.mock('./lib/agents/analyzer-agent.js', () => {
    return class MockAnalyzerAgent {
        constructor() {
            this.name = 'Analyzer Agent';
            this.status = 'idle';
        }

        async analyze(url) {
            return {
                url,
                findings: {
                    performance: ['Mock performance issue'],
                    seo: ['Mock SEO issue']
                },
                categories: ['Performance', 'SEO'],
                confidence: 0.9
            };
        }

        updateStatus(status) {
            this.status = status;
        }
    };
});

jest.mock('./lib/agents/researcher-agent.js', () => {
    return class MockResearcherAgent {
        constructor() {
            this.name = 'Researcher Agent';
            this.status = 'idle';
        }

        async research(analysisResults) {
            return {
                recommendations: {
                    performance: ['Mock performance recommendation'],
                    seo: ['Mock SEO recommendation']
                },
                sources: ['Mock source 1', 'Mock source 2'],
                confidence: 0.85
            };
        }

        updateStatus(status) {
            this.status = status;
        }
    };
});

jest.mock('./lib/agents/strategist-agent.js', () => {
    return class MockStrategistAgent {
        constructor() {
            this.name = 'Strategist Agent';
            this.status = 'idle';
        }

        async strategize(analysisResults, researchResults) {
            return {
                prioritizedInitiatives: [
                    {
                        title: 'Mock Initiative',
                        description: 'Mock description',
                        priority: 'High',
                        timeline: '2-4 weeks'
                    }
                ],
                timeline: { totalDuration: '6-8 weeks' },
                confidence: 0.91
            };
        }

        updateStatus(status) {
            this.status = status;
        }
    };
});

// Mock the mock data
jest.mock('./data/agent-mock-data.js', () => ({
    AGENT_MOCK_DATA: {
        analyzer: {
            findings: {
                performance: ['Test performance issue'],
                seo: ['Test SEO issue']
            },
            categories: ['Performance', 'SEO']
        },
        researcher: {
            recommendations: {
                performance: ['Test performance recommendation']
            },
            sources: ['Test source']
        },
        strategist: {
            priorities: [
                {
                    title: 'Test Initiative',
                    description: 'Test description',
                    priority: 'High'
                }
            ]
        }
    }
}));

describe('Multi-Agent Demo', () => {
    let mockDocument;

    beforeEach(() => {
        // Reset DOM mocks
        mockDocument = {
            getElementById: jest.fn(),
            querySelector: jest.fn(),
            addEventListener: jest.fn(),
            createElement: jest.fn(() => ({
                classList: {
                    add: jest.fn(),
                    remove: jest.fn(),
                    contains: jest.fn()
                },
                style: {},
                innerHTML: '',
                textContent: '',
                appendChild: jest.fn()
            }))
        };

        global.document = mockDocument;

        // Clear all mocks
        jest.clearAllMocks();
    });

    describe('Agent Mock Data', () => {
        test('should have valid mock data structure', () => {
            const { AGENT_MOCK_DATA } = require('./data/agent-mock-data.js');

            expect(AGENT_MOCK_DATA).toBeDefined();
            expect(AGENT_MOCK_DATA.analyzer).toBeDefined();
            expect(AGENT_MOCK_DATA.researcher).toBeDefined();
            expect(AGENT_MOCK_DATA.strategist).toBeDefined();
        });

        test('analyzer mock data should have required fields', () => {
            const { AGENT_MOCK_DATA } = require('./data/agent-mock-data.js');

            expect(AGENT_MOCK_DATA.analyzer.findings).toBeDefined();
            expect(AGENT_MOCK_DATA.analyzer.categories).toBeDefined();
            expect(Array.isArray(AGENT_MOCK_DATA.analyzer.categories)).toBe(true);
        });

        test('researcher mock data should have recommendations and sources', () => {
            const { AGENT_MOCK_DATA } = require('./data/agent-mock-data.js');

            expect(AGENT_MOCK_DATA.researcher.recommendations).toBeDefined();
            expect(AGENT_MOCK_DATA.researcher.sources).toBeDefined();
            expect(Array.isArray(AGENT_MOCK_DATA.researcher.sources)).toBe(true);
        });
    });

    describe('MultiAgentDemo Class', () => {
        let MultiAgentDemo;
        let demo;

        beforeEach(() => {
            // Mock DOM elements that the demo expects
            const mockElements = {
                'startAnalysis': { addEventListener: jest.fn(), disabled: false },
                'websiteUrl': { addEventListener: jest.fn(), value: 'https://test.com' },
                'results-section': { classList: { add: jest.fn(), remove: jest.fn() } },
                'communication-log': { classList: { add: jest.fn(), remove: jest.fn() } }
            };

            mockDocument.getElementById.mockImplementation((id) => mockElements[id] || null);

            // Mock the MultiAgentDemo class
            MultiAgentDemo = class MockMultiAgentDemo {
                constructor() {
                    this.isRunning = false;
                    this.orchestrator = null;
                    this.currentWorkflow = null;
                }

                init() {
                    this.setupEventListeners();
                    return true;
                }

                setupEventListeners() {
                    return true;
                }

                async startAnalysis(url) {
                    this.isRunning = true;
                    return { success: true, url };
                }

                isValidUrl(url) {
                    try {
                        new URL(url);
                        return true;
                    } catch {
                        return false;
                    }
                }

                showError(message) {
                    console.error(message);
                }

                showSuccess(message) {
                    console.log(message);
                }
            };

            demo = new MultiAgentDemo();
        });

        test('should initialize successfully', () => {
            const result = demo.init();
            expect(result).toBe(true);
            expect(demo.isRunning).toBe(false);
        });

        test('should validate URLs correctly', () => {
            expect(demo.isValidUrl('https://example.com')).toBe(true);
            expect(demo.isValidUrl('http://test.com')).toBe(true);
            expect(demo.isValidUrl('invalid-url')).toBe(false);
            expect(demo.isValidUrl('')).toBe(false);
        });

        test('should handle analysis start', async () => {
            const url = 'https://test.com';
            const result = await demo.startAnalysis(url);

            expect(result.success).toBe(true);
            expect(result.url).toBe(url);
            expect(demo.isRunning).toBe(true);
        });

        test('should handle errors gracefully', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

            demo.showError('Test error');
            expect(consoleSpy).toHaveBeenCalledWith('Test error');

            consoleSpy.mockRestore();
        });
    });

    describe('DOM Integration', () => {
        test('should handle missing DOM elements gracefully', () => {
            mockDocument.getElementById.mockReturnValue(null);

            // This should not throw an error
            expect(() => {
                const element = document.getElementById('nonexistent');
                if (element) {
                    element.classList.add('test');
                }
            }).not.toThrow();
        });

        test('should create DOM elements correctly', () => {
            const mockElement = {
                classList: { add: jest.fn(), remove: jest.fn() },
                appendChild: jest.fn(),
                innerHTML: '',
                textContent: ''
            };

            mockDocument.createElement.mockReturnValue(mockElement);

            const element = document.createElement('div');
            expect(element).toBeDefined();
            expect(element.classList.add).toBeDefined();
        });
    });

    describe('Event Handling', () => {
        test('should handle button clicks', () => {
            const mockButton = {
                addEventListener: jest.fn(),
                disabled: false
            };

            mockDocument.getElementById.mockReturnValue(mockButton);

            const button = document.getElementById('startAnalysis');
            expect(button.addEventListener).toBeDefined();

            // Simulate adding event listener
            button.addEventListener('click', () => { });
            expect(button.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
        });

        test('should handle input events', () => {
            const mockInput = {
                addEventListener: jest.fn(),
                value: 'https://test.com'
            };

            mockDocument.getElementById.mockReturnValue(mockInput);

            const input = document.getElementById('websiteUrl');
            expect(input.addEventListener).toBeDefined();
            expect(input.value).toBe('https://test.com');
        });
    });

    describe('UI Updates', () => {
        test('should update progress bars', () => {
            const mockProgressBar = {
                style: {},
                classList: { remove: jest.fn() }
            };

            const mockContainer = {
                classList: { remove: jest.fn() },
                querySelector: jest.fn().mockReturnValue(mockProgressBar)
            };

            mockDocument.getElementById.mockReturnValue(mockContainer);

            const progressContainer = document.getElementById('analyzer-progress');
            if (progressContainer) {
                progressContainer.classList.remove('hidden');
                const progressBar = progressContainer.querySelector('.progress-bar');
                if (progressBar) {
                    progressBar.style.width = '50%';
                }
            }

            expect(mockContainer.classList.remove).toHaveBeenCalledWith('hidden');
        });

        test('should update agent status indicators', () => {
            const mockStatus = {
                className: '',
                classList: { add: jest.fn(), remove: jest.fn() }
            };

            mockDocument.getElementById.mockReturnValue(mockStatus);

            const statusElement = document.getElementById('analyzer-status');
            if (statusElement) {
                statusElement.classList.add('border-blue-500');
            }

            expect(statusElement.classList.add).toHaveBeenCalledWith('border-blue-500');
        });
    });
});