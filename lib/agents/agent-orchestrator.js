/**
 * Agent Orchestrator - Coordinates multi-agent collaboration
 * Manages the workflow between analyzer, researcher, and strategist agents
 */
class AgentOrchestrator {
    constructor() {
        this.name = "Agent Orchestrator";
        this.agents = this.initializeAgents();
        this.communicationLog = [];
        this.currentWorkflow = null;
        this.status = "idle";
    }

    /**
     * Initialize all agents
     * @returns {Object} Initialized agents
     */
    initializeAgents() {
        try {
            return {
                analyzer: new AnalyzerAgent(),
                researcher: new ResearcherAgent(),
                strategist: new StrategistAgent()
            };
        } catch (error) {
            console.error("Failed to initialize agents:", error);
            throw new Error("Agent initialization failed. Please ensure all agent classes are loaded.");
        }
    }

    /**
     * Orchestrate the complete multi-agent workflow
     * @param {string} url - Website URL to analyze
     * @param {Object} options - Orchestration options
     * @returns {Promise<Object>} Complete workflow results
     */
    async orchestrate(url, options = {}) {
        try {
            this.status = "orchestrating";
            this.currentWorkflow = {
                id: this.generateWorkflowId(),
                url: url,
                startTime: new Date().toISOString(),
                status: "running"
            };

            this.logCommunication("orchestrator", "workflow", `Starting multi-agent analysis for: ${url}`);

            // Phase 1: Website Analysis
            this.logCommunication("orchestrator", "analyzer", "Requesting website analysis");
            const analysisResults = await this.agents.analyzer.analyze(url, {
                onProgress: (progress) => this.handleAgentProgress("analyzer", progress)
            });

            this.logCommunication("analyzer", "orchestrator", `Analysis completed: ${analysisResults.findings ? Object.keys(analysisResults.findings).length : 0} categories identified`);

            // Phase 2: Research Solutions
            this.logCommunication("orchestrator", "researcher", "Requesting research on identified issues");
            const researchResults = await this.agents.researcher.research(analysisResults, {
                onProgress: (progress) => this.handleAgentProgress("researcher", progress)
            });

            this.logCommunication("researcher", "orchestrator", `Research completed: ${researchResults.recommendations ? Object.keys(researchResults.recommendations).length : 0} solution areas covered`);

            // Phase 3: Strategic Planning
            this.logCommunication("orchestrator", "strategist", "Requesting strategic plan development");
            const strategyResults = await this.agents.strategist.strategize(analysisResults, researchResults, {
                onProgress: (progress) => this.handleAgentProgress("strategist", progress)
            });

            this.logCommunication("strategist", "orchestrator", `Strategy completed: ${strategyResults.prioritizedInitiatives ? strategyResults.prioritizedInitiatives.length : 0} initiatives prioritized`);

            // Compile final results
            const finalResults = this.compileResults(analysisResults, researchResults, strategyResults);

            this.currentWorkflow.status = "completed";
            this.currentWorkflow.endTime = new Date().toISOString();
            this.status = "completed";

            this.logCommunication("orchestrator", "system", "Multi-agent workflow completed successfully");

            // Update UI with results
            this.displayResults(finalResults);

            return finalResults;

        } catch (error) {
            this.status = "error";
            if (this.currentWorkflow) {
                this.currentWorkflow.status = "error";
                this.currentWorkflow.error = error.message;
            }

            this.logCommunication("orchestrator", "system", `Workflow failed: ${error.message}`);
            console.error("Orchestration failed:", error);
            throw error;
        }
    }

    /**
     * Handle progress updates from agents
     * @param {string} agentName - Name of the reporting agent
     * @param {Object} progress - Progress information
     */
    handleAgentProgress(agentName, progress) {
        this.logCommunication(agentName, "orchestrator", `Progress: ${progress.progress}% - ${progress.status}`);

        // Emit progress event for external listeners
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('agentProgress', {
                detail: { agent: agentName, progress: progress }
            }));
        }
    }

    /**
     * Log communication between agents
     * @param {string} from - Sender
     * @param {string} to - Receiver
     * @param {string} message - Message content
     */
    logCommunication(from, to, message) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            from: from,
            to: to,
            message: message,
            workflowId: this.currentWorkflow?.id
        };

        this.communicationLog.push(logEntry);
        console.log(`[${from} → ${to}] ${message}`);

        // Update communication log UI
        this.updateCommunicationLogUI(logEntry);
    }

    /**
     * Update communication log in UI
     * @param {Object} logEntry - Log entry to display
     */
    updateCommunicationLogUI(logEntry) {
        const logContainer = document.getElementById('log-messages');
        const communicationLog = document.getElementById('communication-log');

        if (logContainer && communicationLog) {
            // Show the communication log
            communicationLog.classList.remove('hidden');

            const messageElement = document.createElement('div');
            messageElement.className = 'flex items-start gap-3 p-3 bg-gray-50 rounded-lg';

            const timeString = new Date(logEntry.timestamp).toLocaleTimeString();

            messageElement.innerHTML = `
                <div class="flex-shrink-0">
                    <div class="w-2 h-2 rounded-full ${this.getAgentColor(logEntry.from)} mt-2"></div>
                </div>
                <div class="flex-1">
                    <div class="text-xs text-gray-500 mb-1">
                        ${timeString} - ${this.formatAgentName(logEntry.from)} → ${this.formatAgentName(logEntry.to)}
                    </div>
                    <div class="text-sm text-gray-700">${logEntry.message}</div>
                </div>
            `;

            logContainer.appendChild(messageElement);

            // Scroll to bottom
            logContainer.scrollTop = logContainer.scrollHeight;

            // Limit log entries to prevent memory issues
            if (logContainer.children.length > 20) {
                logContainer.removeChild(logContainer.firstChild);
            }
        }
    }

    /**
     * Get color class for agent
     * @param {string} agentName - Agent name
     * @returns {string} CSS color class
     */
    getAgentColor(agentName) {
        const colors = {
            'analyzer': 'bg-blue-500',
            'researcher': 'bg-green-500',
            'strategist': 'bg-purple-500',
            'orchestrator': 'bg-gray-500',
            'system': 'bg-yellow-500'
        };

        return colors[agentName.toLowerCase()] || 'bg-gray-400';
    }

    /**
     * Format agent name for display
     * @param {string} agentName - Agent name
     * @returns {string} Formatted name
     */
    formatAgentName(agentName) {
        const names = {
            'analyzer': 'Analyzer Agent',
            'researcher': 'Researcher Agent',
            'strategist': 'Strategist Agent',
            'orchestrator': 'Orchestrator',
            'system': 'System'
        };

        return names[agentName.toLowerCase()] || agentName;
    }

    /**
     * Compile results from all agents
     * @param {Object} analysisResults - Analyzer results
     * @param {Object} researchResults - Researcher results
     * @param {Object} strategyResults - Strategist results
     * @returns {Object} Compiled results
     */
    compileResults(analysisResults, researchResults, strategyResults) {
        return {
            workflow: {
                id: this.currentWorkflow.id,
                url: this.currentWorkflow.url,
                startTime: this.currentWorkflow.startTime,
                endTime: this.currentWorkflow.endTime,
                status: this.currentWorkflow.status,
                duration: this.calculateDuration()
            },
            analysis: analysisResults,
            research: researchResults,
            strategy: strategyResults,
            summary: this.generateWorkflowSummary(analysisResults, researchResults, strategyResults),
            communicationLog: this.communicationLog,
            metadata: {
                agentsUsed: Object.keys(this.agents),
                totalCommunications: this.communicationLog.length,
                workflowVersion: "1.0.0"
            }
        };
    }

    /**
     * Generate workflow summary
     * @param {Object} analysisResults - Analyzer results
     * @param {Object} researchResults - Researcher results
     * @param {Object} strategyResults - Strategist results
     * @returns {Object} Workflow summary
     */
    generateWorkflowSummary(analysisResults, researchResults, strategyResults) {
        const totalIssues = analysisResults.findings ?
            Object.values(analysisResults.findings).reduce((sum, issues) => sum + issues.length, 0) : 0;

        const totalRecommendations = researchResults.recommendations ?
            Object.values(researchResults.recommendations).reduce((sum, recs) => sum + recs.length, 0) : 0;

        const totalInitiatives = strategyResults.prioritizedInitiatives ?
            strategyResults.prioritizedInitiatives.length : 0;

        return {
            issuesIdentified: totalIssues,
            recommendationsProvided: totalRecommendations,
            initiativesPrioritized: totalInitiatives,
            keyInsights: this.extractKeyInsights(analysisResults, researchResults, strategyResults),
            nextSteps: this.generateNextSteps(strategyResults),
            confidenceScore: this.calculateOverallConfidence(analysisResults, researchResults, strategyResults)
        };
    }

    /**
     * Display results in UI
     * @param {Object} results - Compiled results
     */
    displayResults(results) {
        // Show results section
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
            resultsSection.classList.remove('hidden');
        }

        // Display analyzer results
        this.displayAnalyzerResults(results.analysis);

        // Display researcher results
        this.displayResearcherResults(results.research);

        // Display strategist results
        this.displayStrategistResults(results.strategy);
    }

    /**
     * Display analyzer results in UI
     * @param {Object} analysisResults - Analyzer results
     */
    displayAnalyzerResults(analysisResults) {
        // Display findings
        const findingsContainer = document.getElementById('analyzer-findings');
        if (findingsContainer && analysisResults.findings) {
            findingsContainer.innerHTML = '';

            Object.keys(analysisResults.findings).forEach(category => {
                const findings = analysisResults.findings[category];
                findings.slice(0, 3).forEach(finding => {
                    const findingElement = document.createElement('div');
                    findingElement.className = 'text-sm text-blue-700 bg-blue-100 rounded px-2 py-1';
                    findingElement.textContent = finding;
                    findingsContainer.appendChild(findingElement);
                });
            });
        }

        // Display categories
        const categoriesContainer = document.getElementById('analyzer-categories');
        if (categoriesContainer && analysisResults.categories) {
            categoriesContainer.innerHTML = '';

            analysisResults.categories.forEach(category => {
                const categoryElement = document.createElement('span');
                categoryElement.className = 'px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs';
                categoryElement.textContent = category;
                categoriesContainer.appendChild(categoryElement);
            });
        }
    }

    /**
     * Display researcher results in UI
     * @param {Object} researchResults - Researcher results
     */
    displayResearcherResults(researchResults) {
        // Display recommendations
        const recommendationsContainer = document.getElementById('researcher-recommendations');
        if (recommendationsContainer && researchResults.recommendations) {
            recommendationsContainer.innerHTML = '';

            Object.values(researchResults.recommendations).flat().slice(0, 4).forEach(recommendation => {
                const recElement = document.createElement('div');
                recElement.className = 'text-sm text-green-700 bg-green-100 rounded px-2 py-1';
                recElement.textContent = recommendation;
                recommendationsContainer.appendChild(recElement);
            });
        }

        // Display sources
        const sourcesContainer = document.getElementById('researcher-sources');
        if (sourcesContainer && researchResults.sources) {
            sourcesContainer.innerHTML = '';

            researchResults.sources.slice(0, 4).forEach(source => {
                const sourceElement = document.createElement('div');
                sourceElement.className = 'text-sm text-green-600 underline cursor-pointer';
                sourceElement.textContent = source;
                sourcesContainer.appendChild(sourceElement);
            });
        }
    }

    /**
     * Display strategist results in UI
     * @param {Object} strategyResults - Strategist results
     */
    displayStrategistResults(strategyResults) {
        // Display priorities
        const prioritiesContainer = document.getElementById('strategist-priorities');
        if (prioritiesContainer && strategyResults.prioritizedInitiatives) {
            prioritiesContainer.innerHTML = '';

            strategyResults.prioritizedInitiatives.slice(0, 3).forEach((initiative, index) => {
                const priorityElement = document.createElement('div');
                priorityElement.className = 'border-l-4 border-purple-500 pl-4 py-2';
                priorityElement.innerHTML = `
                    <div class="font-semibold text-purple-800">${index + 1}. ${initiative.title}</div>
                    <div class="text-sm text-purple-700 mt-1">${initiative.description}</div>
                    <div class="text-xs text-purple-600 mt-2">
                        Impact: ${initiative.impact} | Timeline: ${initiative.timeline}
                    </div>
                `;
                prioritiesContainer.appendChild(priorityElement);
            });
        }

        // Display timeline
        const timelineElement = document.getElementById('strategist-timeline');
        if (timelineElement && strategyResults.timeline) {
            timelineElement.textContent = strategyResults.timeline.totalDuration || '6-8 weeks';
        }
    }

    /**
     * Generate unique workflow ID
     * @returns {string} Unique workflow ID
     */
    generateWorkflowId() {
        return `workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Calculate workflow duration
     * @returns {string} Duration string
     */
    calculateDuration() {
        if (!this.currentWorkflow || !this.currentWorkflow.startTime) {
            return "Unknown";
        }

        const start = new Date(this.currentWorkflow.startTime);
        const end = this.currentWorkflow.endTime ? new Date(this.currentWorkflow.endTime) : new Date();
        const duration = Math.round((end - start) / 1000);

        return `${duration} seconds`;
    }

    /**
     * Extract key insights from all results
     * @param {Object} analysisResults - Analysis results
     * @param {Object} researchResults - Research results
     * @param {Object} strategyResults - Strategy results
     * @returns {Array} Key insights
     */
    extractKeyInsights(analysisResults, researchResults, strategyResults) {
        const insights = [];

        // Insights from analysis
        if (analysisResults.summary && analysisResults.summary.topConcerns) {
            insights.push(`Primary concerns: ${analysisResults.summary.topConcerns.join(', ')}`);
        }

        // Insights from strategy
        if (strategyResults.prioritizedInitiatives && strategyResults.prioritizedInitiatives.length > 0) {
            const highPriorityCount = strategyResults.prioritizedInitiatives.filter(i => i.priority === 'High').length;
            insights.push(`${highPriorityCount} high-priority initiatives identified`);
        }

        // Add general insight
        insights.push("Multi-agent collaboration provided comprehensive analysis and actionable recommendations");

        return insights;
    }

    /**
     * Generate next steps based on strategy
     * @param {Object} strategyResults - Strategy results
     * @returns {Array} Next steps
     */
    generateNextSteps(strategyResults) {
        const nextSteps = [];

        if (strategyResults.executiveSummary && strategyResults.executiveSummary.nextSteps) {
            return strategyResults.executiveSummary.nextSteps;
        }

        // Fallback next steps
        return [
            "Review and approve strategic recommendations",
            "Allocate resources for implementation",
            "Begin with highest priority initiatives",
            "Establish monitoring and measurement processes"
        ];
    }

    /**
     * Calculate overall confidence score
     * @param {Object} analysisResults - Analysis results
     * @param {Object} researchResults - Research results
     * @param {Object} strategyResults - Strategy results
     * @returns {number} Confidence score (0-1)
     */
    calculateOverallConfidence(analysisResults, researchResults, strategyResults) {
        const confidenceScores = [
            analysisResults.confidence || 0.8,
            researchResults.confidence || 0.8,
            strategyResults.confidence || 0.8
        ];

        return Math.round((confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length) * 100) / 100;
    }

    /**
     * Get workflow status
     * @returns {Object} Current workflow status
     */
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

    /**
     * Reset orchestrator for new workflow
     */
    reset() {
        this.status = "idle";
        this.currentWorkflow = null;
        this.communicationLog = [];

        // Reset all agents
        Object.values(this.agents).forEach(agent => {
            if (agent.updateStatus) {
                agent.updateStatus("idle");
            }
        });

        console.log("Orchestrator reset and ready for new workflow");
    }

    /**
     * Get communication log
     * @returns {Array} Communication log entries
     */
    getCommunicationLog() {
        return [...this.communicationLog]; // Return copy
    }

    /**
     * Export workflow results
     * @param {Object} results - Workflow results
     * @returns {string} JSON string of results
     */
    exportResults(results) {
        try {
            return JSON.stringify(results, null, 2);
        } catch (error) {
            console.error("Failed to export results:", error);
            return null;
        }
    }

    /**
     * Validate agent availability
     * @returns {Object} Validation results
     */
    validateAgents() {
        const validation = {
            valid: true,
            issues: [],
            availableAgents: []
        };

        Object.keys(this.agents).forEach(agentName => {
            try {
                const agent = this.agents[agentName];
                if (agent && typeof agent === 'object' && agent.name) {
                    validation.availableAgents.push(agentName);
                } else {
                    validation.valid = false;
                    validation.issues.push(`${agentName} agent is not properly initialized`);
                }
            } catch (error) {
                validation.valid = false;
                validation.issues.push(`${agentName} agent validation failed: ${error.message}`);
            }
        });

        return validation;
    }
}

// Make class available globally
if (typeof window !== 'undefined') {
    window.AgentOrchestrator = AgentOrchestrator;
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AgentOrchestrator;
}