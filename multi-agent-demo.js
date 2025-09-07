/**
 * Multi-Agent Demo Main Script
 * Handles UI interactions and demo orchestration
 */
class MultiAgentDemo {
    constructor() {
        this.orchestrator = null;
        this.isRunning = false;
        this.currentWorkflow = null;

        this.init();
    }

    /**
     * Initialize the demo
     */
    init() {
        console.log('[MultiAgentDemo] Initializing...');

        try {
            // Initialize orchestrator
            this.orchestrator = new AgentOrchestrator();
            console.log('[MultiAgentDemo] Orchestrator initialized successfully');

            // Setup event listeners
            this.setupEventListeners();

            // Setup progress monitoring
            this.setupProgressMonitoring();

            console.log('[MultiAgentDemo] Demo initialization completed');

        } catch (error) {
            console.error('[MultiAgentDemo] Initialization failed:', error);
            this.showError('Demo initialization failed. Please check that all agent scripts are loaded correctly.');
        }
    }

    /**
     * Setup event listeners for UI interactions
     */
    setupEventListeners() {
        // Start analysis button
        const startButton = document.getElementById('startAnalysis');
        if (startButton) {
            startButton.addEventListener('click', () => this.handleStartAnalysis());
        }

        // URL input enter key
        const urlInput = document.getElementById('websiteUrl');
        if (urlInput) {
            urlInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleStartAnalysis();
                }
            });
        }

        // Reset demo button (if exists)
        const resetButton = document.getElementById('resetDemo');
        if (resetButton) {
            resetButton.addEventListener('click', () => this.resetDemo());
        }
    }

    /**
     * Setup progress monitoring
     */
    setupProgressMonitoring() {
        // Listen for agent progress events
        if (typeof window !== 'undefined') {
            window.addEventListener('agentProgress', (event) => {
                this.handleAgentProgress(event.detail);
            });
        }
    }

    /**
     * Handle start analysis button click
     */
    async handleStartAnalysis() {
        if (this.isRunning) {
            console.log('[MultiAgentDemo] Analysis already running, ignoring request');
            return;
        }

        const urlInput = document.getElementById('websiteUrl');
        if (!urlInput) {
            this.showError('URL input not found');
            return;
        }

        const url = urlInput.value.trim();
        if (!url) {
            this.showError('Please enter a website URL');
            return;
        }

        if (!this.isValidUrl(url)) {
            this.showError('Please enter a valid URL (e.g., https://example.com)');
            return;
        }

        await this.startAnalysis(url);
    }

    /**
     * Start the multi-agent analysis
     * @param {string} url - Website URL to analyze
     */
    async startAnalysis(url) {
        try {
            this.isRunning = true;
            this.updateStartButton(true);
            this.clearPreviousResults();

            console.log(`[MultiAgentDemo] Starting analysis for: ${url}`);

            // Validate orchestrator
            if (!this.orchestrator) {
                throw new Error('Orchestrator not initialized');
            }

            // Validate agents
            const validation = this.orchestrator.validateAgents();
            if (!validation.valid) {
                throw new Error(`Agent validation failed: ${validation.issues.join(', ')}`);
            }

            // Start orchestrated analysis
            this.currentWorkflow = await this.orchestrator.orchestrate(url, {
                onProgress: (progress) => this.handleWorkflowProgress(progress)
            });

            console.log('[MultiAgentDemo] Analysis completed successfully');
            this.showSuccess('Analysis completed successfully!');

        } catch (error) {
            console.error('[MultiAgentDemo] Analysis failed:', error);
            this.showError(`Analysis failed: ${error.message}`);
        } finally {
            this.isRunning = false;
            this.updateStartButton(false);
        }
    }

    /**
     * Handle workflow progress updates
     * @param {Object} progress - Progress information
     */
    handleWorkflowProgress(progress) {
        console.log(`[MultiAgentDemo] Workflow progress:`, progress);

        // Update UI based on progress
        this.updateAgentStatus(progress.agent, progress.status);
    }

    /**
     * Handle individual agent progress updates
     * @param {Object} agentProgress - Agent progress details
     */
    handleAgentProgress(agentProgress) {
        console.log(`[MultiAgentDemo] Agent progress:`, agentProgress);

        // Update progress bars if they exist
        this.updateProgressBar(agentProgress.agent, agentProgress.progress);
    }

    /**
     * Update agent status indicator
     * @param {string} agent - Agent name
     * @param {string} status - Status
     */
    updateAgentStatus(agent, status) {
        const agentCard = document.getElementById(`${agent.toLowerCase()}-card`);
        if (agentCard) {
            // Remove existing status classes
            agentCard.classList.remove('border-blue-500', 'border-green-500', 'border-purple-500', 'border-red-500');

            // Add status-specific styling
            switch (status) {
                case 'analyzing':
                case 'researching':
                case 'strategizing':
                    agentCard.classList.add('border-blue-500');
                    break;
                case 'completed':
                    agentCard.classList.add('border-green-500');
                    break;
                case 'error':
                    agentCard.classList.add('border-red-500');
                    break;
            }
        }
    }

    /**
     * Update progress bar for an agent
     * @param {string} agent - Agent name
     * @param {number} progress - Progress percentage
     */
    updateProgressBar(agent, progress) {
        const progressContainer = document.getElementById(`${agent.toLowerCase()}-progress`);
        if (progressContainer) {
            progressContainer.classList.remove('hidden');

            const progressBar = progressContainer.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
        }
    }

    /**
     * Update start button state
     * @param {boolean} isRunning - Whether analysis is running
     */
    updateStartButton(isRunning) {
        const startButton = document.getElementById('startAnalysis');
        if (startButton) {
            const icon = startButton.querySelector('.button-icon');
            const text = startButton.querySelector('.button-text');

            if (isRunning) {
                startButton.disabled = true;
                if (icon) icon.textContent = '⏳';
                if (text) text.textContent = 'Analyzing...';
            } else {
                startButton.disabled = false;
                if (icon) icon.textContent = '▶';
                if (text) text.textContent = 'Start Analysis';
            }
        }
    }

    /**
     * Clear previous results from UI
     */
    clearPreviousResults() {
        // Hide results section
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
            resultsSection.classList.add('hidden');
        }

        // Hide communication log
        const communicationLog = document.getElementById('communication-log');
        if (communicationLog) {
            communicationLog.classList.add('hidden');
        }

        // Clear log messages
        const logMessages = document.getElementById('log-messages');
        if (logMessages) {
            logMessages.innerHTML = '';
        }

        // Reset progress bars
        ['analyzer', 'researcher', 'strategist'].forEach(agent => {
            const progressContainer = document.getElementById(`${agent}-progress`);
            if (progressContainer) {
                progressContainer.classList.add('hidden');
                const progressBar = progressContainer.querySelector('.progress-bar');
                if (progressBar) {
                    progressBar.style.width = '0%';
                }
            }
        });

        // Reset agent status indicators
        ['analyzer', 'researcher', 'strategist'].forEach(agent => {
            const statusElement = document.getElementById(`${agent}-status`);
            if (statusElement) {
                statusElement.className = 'w-6 h-6 rounded-full border-2 border-gray-300 agent-status';
            }

            const agentCard = document.getElementById(`${agent}-card`);
            if (agentCard) {
                agentCard.className = 'agent-card bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200';
            }
        });
    }

    /**
     * Reset the demo to initial state
     */
    resetDemo() {
        if (this.isRunning) {
            console.log('[MultiAgentDemo] Cannot reset while analysis is running');
            return;
        }

        console.log('[MultiAgentDemo] Resetting demo...');

        this.clearPreviousResults();

        if (this.orchestrator) {
            this.orchestrator.reset();
        }

        this.currentWorkflow = null;

        // Reset URL input
        const urlInput = document.getElementById('websiteUrl');
        if (urlInput) {
            urlInput.value = 'https://www.prasadkavuri.com';
        }

        console.log('[MultiAgentDemo] Demo reset completed');
    }

    /**
     * Validate URL format
     * @param {string} url - URL to validate
     * @returns {boolean} Whether URL is valid
     */
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            // Try adding https:// if missing
            try {
                new URL(`https://${url}`);
                return true;
            } catch {
                return false;
            }
        }
    }

    /**
     * Show error message to user
     * @param {string} message - Error message
     */
    showError(message) {
        console.error(`[MultiAgentDemo] Error: ${message}`);

        // Show browser alert as fallback
        alert(`Error: ${message}`);

        // TODO: Implement better error UI
    }

    /**
     * Show success message to user
     * @param {string} message - Success message
     */
    showSuccess(message) {
        console.log(`[MultiAgentDemo] Success: ${message}`);

        // TODO: Implement success UI notification
    }

    /**
     * Get current demo status
     * @returns {Object} Demo status
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            hasOrchestrator: !!this.orchestrator,
            currentWorkflow: this.currentWorkflow,
            orchestratorStatus: this.orchestrator ? this.orchestrator.getWorkflowStatus() : null
        };
    }

    /**
     * Export current workflow results
     * @returns {string|null} JSON string of results or null if no results
     */
    exportResults() {
        if (!this.currentWorkflow || !this.orchestrator) {
            console.log('[MultiAgentDemo] No results to export');
            return null;
        }

        return this.orchestrator.exportResults(this.currentWorkflow);
    }
}

// Initialize demo when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('[MultiAgentDemo] DOM loaded, initializing demo...');

    // Add slight delay to ensure all scripts are loaded
    setTimeout(() => {
        try {
            window.multiAgentDemo = new MultiAgentDemo();
            console.log('[MultiAgentDemo] Demo ready!');
        } catch (error) {
            console.error('[MultiAgentDemo] Failed to initialize demo:', error);

            // Show user-friendly error
            const errorMessage = `
                Demo initialization failed. Please check that all required files are present:
                - data/agent-mock-data.js
                - lib/agents/analyzer-agent.js
                - lib/agents/researcher-agent.js
                - lib/agents/strategist-agent.js
                - lib/agents/agent-orchestrator.js
                
                Error details: ${error.message}
            `;

            alert(errorMessage);
        }
    }, 1000);
});

// Make class available globally
if (typeof window !== 'undefined') {
    window.MultiAgentDemo = MultiAgentDemo;
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MultiAgentDemo;
}