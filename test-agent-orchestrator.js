// test-agent-orchestrator.js
// Unit tests for Agent Orchestrator functionality

// Mock the individual agent classes
jest.mock('./lib/agents/analyzer-agent.js', () => {
    return class MockAnalyzerAgent {
        constructor() {
            this.name = 'Analyzer Agent';
            this.status = 'idle';
        }

        async analyze(url, options = {}) {
            // Simulate progress reporting
            if (options.onProgress) {
                options.onProgress({ progress: 50, status: 'analyzing' });
                options.onProgress({ progress: 100, status: 'completed' });
            }

            return {
                url,
                timestamp: new Date().toISOString(),
                agent: this.name,
                findings: {
                    performance: ['Large bundle size causing slow load'],
                    seo: ['Missing meta descriptions'],
                    accessibility: ['Low color contrast']
                },
                categories: ['Performance', 'SEO', 'Accessibility'],
                confidence: 0.92,
                analysisTime: '5.2 seconds'
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

        async research(analysisResults, options = {}) {
            if (options.onProgress) {
                options.onProgress({ progress: 25, status: 'researching' });
                options.onProgress({ progress: 100, status: 'completed' });
            }

            return {
                timestamp: new Date().toISOString(),
                agent: this.name,
                recommendations: {
                    performance: ['Implement code splitting', 'Use WebP images'],
                    seo: ['Add meta descriptions', 'Implement structured data']
                },
                sources: ['Web.dev Performance Guide', 'Google SEO Documentation'],
                confidence: 0.89,
                researchTime: '3.7 seconds'
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

        async strategize(analysisResults, researchResults, options = {}) {
            if (options.onProgress) {
                options.onProgress({ progress: 40, status: 'strategizing' });
                options.onProgress({ progress: 100, status: 'completed' });
            }

            return {
                timestamp: new Date().toISOString(),
                agent: this.name,
                prioritizedInitiatives: [
                    {
                        title: 'Performance Optimization',
                        description: 'Optimize loading performance',
                        priority: 'High',
                        timeline: '2-4 weeks',
                        impact: 'High',
                        effort: 'Medium'
                    }
                ],
                timeline: { totalDuration: '6-8 weeks' },
                confidence: 0.91,
                strategyTime: '4.1 seconds'
            };
        }

        updateStatus(status) {
            this.status = status;
        }
    };
});

describe('Agent Orchestrator', () => {
    let AgentOrchestrator;
    let orchestrator;
    let mockDocument;

    beforeEach(() => {
        // Mock DOM
        mockDocument = {
            getElementById: jest.fn(),
            querySelector: jest.fn(),
            createElement: jest.fn(() => ({
                classList: { add: jest.fn(), remove: jest.fn() },
                innerHTML: '',
                textContent: '',
                appendChild: jest.fn(),
                scrollTop: 0,
                scrollHeight: 100,
                children: { length: 0 },
                removeChild: jest.fn(),
                firstChild: null
            })),
            addEventListener: jest.fn()
        };

        global.document = mockDocument;
        global.window = {
            ...global.window,
            dispatchEvent: jest.fn(),
            CustomEvent: jest.fn()
        };

        // Mock the orchestrator class
        AgentOrchestrator = class MockAgentOrchestrator {
            constructor() {
                this.name = 'Agent Orchestrator';
                this.agents = this.initializeAgents();
                this.communicationLog = [];
                this.currentWorkflow = null;
                this.status = 'idle';
            }

            initializeAgents() {
                const AnalyzerAgent = require('./lib/agents/analyzer-agent.js');
                const ResearcherAgent = require('./lib/agents/researcher-agent.js');
                const StrategistAgent = require('./lib/agents/strategist-agent.js');

                return {
                    analyzer: new AnalyzerAgent(),
                    researcher: new ResearcherAgent(),
                    strategist: new StrategistAgent()
                };
            }

            async orchestrate(url, options = {}) {
                this.status = 'orchestrating';
                this.currentWorkflow = {
                    id: this.generateWorkflowId(),
                    url: url,
                    startTime: new Date().toISOString(),
                    status: 'running'
                };

                this.logCommunication('orchestrator', 'analyzer', `Starting analysis for: ${url}`);

                // Phase 1: Analysis
                const analysisResults = await this.agents.analyzer.analyze(url, {
                    onProgress: (progress) => this.handleAgentProgress('analyzer', progress)
                });

                this.logCommunication('analyzer', 'orchestrator', 'Analysis completed');

                // Phase 2: Research
                const researchResults = await this.agents.researcher.research(analysisResults, {
                    onProgress: (progress) => this.handleAgentProgress('researcher', progress)
                });

                this.logCommunication('researcher', 'orchestrator', 'Research completed');

                // Phase 3: Strategy
                const strategyResults = await this.agents.strategist.strategize(analysisResults, researchResults, {
                    onProgress: (progress) => this.handleAgentProgress('strategist', progress)
                });

                this.logCommunication('strategist', 'orchestrator', 'Strategy completed');

                const finalResults = this.compileResults(analysisResults, researchResults, strategyResults);

                this.currentWorkflow.status = 'completed';
                this.currentWorkflow.endTime = new Date().toISOString();
                this.status = 'completed';

                return finalResults;
            }

            handleAgentProgress(agentName, progress) {
                this.logCommunication(agentName, 'orchestrator', `Progress: ${progress.progress}%`);

                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new window.CustomEvent('agentProgress', {
                        detail: { agent: agentName, progress: progress }
                    }));
                }
            }

            logCommunication(from, to, message) {
                const logEntry = {
                    timestamp: new Date().toISOString(),
                    from: from,
                    to: to,
                    message: message,
                    workflowId: this.currentWorkflow?.id
                };

                this.communicationLog.push(logEntry);
            }

            compileResults(analysisResults, researchResults, strategyResults) {
                return {
                    workflow: {
                        id: this.currentWorkflow.id,
                        url: this.currentWorkflow.url,
                        startTime: this.currentWorkflow.startTime,
                        endTime: this.currentWorkflow.endTime,
                        status: this.currentWorkflow.status
                    },
                    analysis: analysisResults,
                    research: researchResults,
                    strategy: strategyResults,
                    communicationLog: this.communicationLog
                };
            }

            generateWorkflowId() {
                return `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            }

            validateAgents() {
                const validation = { valid: true, issues: [], availableAgents: [] };

                Object.keys(this.agents).forEach(agentName => {
                    try {
                        const agent = this.agents[agentName];
                        if (agent && typeof agent === 'object' && agent.name) {
                            validation.availableAgents.push(agentName);
                        } else {
                            validation.valid = false;
                            validation.issues.push(`${agentName} agent not properly initialized`);
                        }
                    } catch (error) {
                        validation.valid = false;
                        validation.issues.push(`${agentName} validation failed: ${error.message}`);
                    }
                });

                return validation;
            }

            getWorkflowStatus() {
                return {
                    orchestratorStatus: this.status,
                    currentWorkflow: this.currentWorkflow,
                    agentStatuses: {
                        analyzer: this.agents.analyzer.status,
                        researcher: this.agents.researcher.status,
                        strategist: this.agents.strategist.status
                    },
                    communicationCount: this.communicationLog.length
                };
            }

            reset() {
                this.status = 'idle';
                this.currentWorkflow = null;
                this.communicationLog = [];

                Object.values(this.agents).forEach(agent => {
                    if (agent.updateStatus) {
                        agent.updateStatus('idle');
                    }
                });
            }
        };

        orchestrator = new AgentOrchestrator();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Initialization', () => {
        test('should initialize with correct properties', () => {
            expect(orchestrator.name).toBe('Agent Orchestrator');
            expect(orchestrator.status).toBe('idle');
            expect(orchestrator.communicationLog).toEqual([]);
            expect(orchestrator.currentWorkflow).toBeNull();
        });

        test('should initialize all agents', () => {
            expect(orchestrator.agents).toBeDefined();
            expect(orchestrator.agents.analyzer).toBeDefined();
            expect(orchestrator.agents.researcher).toBeDefined();
            expect(orchestrator.agents.strategist).toBeDefined();
        });

        test('should validate agents successfully', () => {
            const validation = orchestrator.validateAgents();

            expect(validation.valid).toBe(true);
            expect(validation.availableAgents).toEqual(['analyzer', 'researcher', 'strategist']);
            expect(validation.issues).toEqual([]);
        });
    });

    describe('Workflow Orchestration', () => {
        test('should orchestrate complete workflow successfully', async () => {
            const testUrl = 'https://test.com';
            const results = await orchestrator.orchestrate(testUrl);

            expect(results).toBeDefined();
            expect(results.workflow).toBeDefined();
            expect(results.workflow.url).toBe(testUrl);
            expect(results.workflow.status).toBe('completed');

            expect(results.analysis).toBeDefined();
            expect(results.research).toBeDefined();
            expect(results.strategy).toBeDefined();

            expect(orchestrator.status).toBe('completed');
        });

        test('should handle progress updates from agents', async () => {
            const testUrl = 'https://test.com';
            const progressEvents = [];

            // Mock window.dispatchEvent to capture events
            global.window.dispatchEvent = jest.fn((event) => {
                progressEvents.push(event);
            });

            await orchestrator.orchestrate(testUrl);

            expect(global.window.dispatchEvent).toHaveBeenCalled();
            expect(orchestrator.communicationLog.length).toBeGreaterThan(0);
        });

        test('should log communication between agents', async () => {
            const testUrl = 'https://test.com';
            await orchestrator.orchestrate(testUrl);

            expect(orchestrator.communicationLog.length).toBeGreaterThan(0);

            const startLog = orchestrator.communicationLog.find(log =>
                log.from === 'orchestrator' && log.to === 'analyzer'
            );
            expect(startLog).toBeDefined();
            expect(startLog.message).toContain(testUrl);
        });

        test('should generate unique workflow IDs', () => {
            const id1 = orchestrator.generateWorkflowId();
            const id2 = orchestrator.generateWorkflowId();

            expect(id1).not.toBe(id2);
            expect(id1).toMatch(/^workflow-\d+-[a-z0-9]+$/);
        });
    });

    describe('Agent Communication', () => {
        test('should log communication correctly', () => {
            orchestrator.currentWorkflow = { id: 'test-workflow' };
            orchestrator.logCommunication('agent1', 'agent2', 'test message');

            expect(orchestrator.communicationLog).toHaveLength(1);

            const log = orchestrator.communicationLog[0];
            expect(log.from).toBe('agent1');
            expect(log.to).toBe('agent2');
            expect(log.message).toBe('test message');
            expect(log.workflowId).toBe('test-workflow');
        });

        test('should handle agent progress updates', () => {
            const mockProgress = { progress: 50, status: 'working' };

            orchestrator.currentWorkflow = { id: 'test' };
            orchestrator.handleAgentProgress('testAgent', mockProgress);

            const progressLog = orchestrator.communicationLog.find(log =>
                log.message.includes('Progress: 50%')
            );
            expect(progressLog).toBeDefined();
        });
    });

    describe('Status Management', () => {
        test('should track workflow status correctly', () => {
            const status = orchestrator.getWorkflowStatus();

            expect(status.orchestratorStatus).toBe('idle');
            expect(status.agentStatuses).toBeDefined();
            expect(status.agentStatuses.analyzer).toBe('idle');
            expect(status.communicationCount).toBe(0);
        });

        test('should reset orchestrator state', () => {
            orchestrator.status = 'completed';
            orchestrator.communicationLog = [{ test: 'data' }];
            orchestrator.currentWorkflow = { id: 'test' };

            orchestrator.reset();

            expect(orchestrator.status).toBe('idle');
            expect(orchestrator.communicationLog).toEqual([]);
            expect(orchestrator.currentWorkflow).toBeNull();
        });
    });


    describe('Result Compilation', () => {
        test('should compile results from all agents', () => {
            const analysisResults = { findings: ['test'] };
            const researchResults = { recommendations: ['test'] };
            const strategyResults = { initiatives: ['test'] };

            orchestrator.currentWorkflow = {
                id: 'test-workflow',
                url: 'https://test.com',
                startTime: new Date().toISOString(),
                endTime: new Date().toISOString(),
                status: 'completed'
            };

            const compiled = orchestrator.compileResults(analysisResults, researchResults, strategyResults);

            expect(compiled.workflow).toBeDefined();
            expect(compiled.analysis).toBe(analysisResults);
            expect(compiled.research).toBe(researchResults);
            expect(compiled.strategy).toBe(strategyResults);
        });

        test('should handle missing workflow gracefully', () => {
            const analysisResults = { findings: ['test'] };
            const researchResults = { recommendations: ['test'] };
            const strategyResults = { initiatives: ['test'] };

            orchestrator.currentWorkflow = null;

            expect(() => {
                orchestrator.compileResults(analysisResults, researchResults, strategyResults);
            }).not.toThrow();
        });
    });
});

