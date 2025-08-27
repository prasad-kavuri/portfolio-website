// Agentic AI Portfolio Assistant Main Controller
class PortfolioAssistant {
    constructor() {
        this.conversationHistory = [];
        this.currentContext = {
            mode: 'explorer',
            topicsExplored: [],
            insightsGenerated: 0,
            depthLevel: 'surface',
            userIntent: null,
            activeExperience: 'krutrim'
        };

        this.analytics = {
            topicsExplored: 0,
            insightsGenerated: 0,
            depthLevel: 'Surface',
            matchScore: '-',
            interactions: 0
        };

        this.radarChart = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeRadarChart();
        this.loadAgentPersonality();
    }

    setupEventListeners() {
        // Mode selector
        document.getElementById('agentMode').addEventListener('change', (e) => {
            this.changeMode(e.target.value);
        });

        // Send button
        document.getElementById('sendBtn').addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter key in input
        document.getElementById('userInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Suggested queries
        document.querySelectorAll('.query-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const query = e.target.dataset.query;
                document.getElementById('userInput').value = query;
                this.sendMessage();
            });
        });

        // Timeline nodes
        document.querySelectorAll('.timeline-node').forEach(node => {
            node.addEventListener('click', (e) => {
                this.exploreExperience(e.currentTarget.dataset.exp);
            });
        });

        // Action buttons
        document.getElementById('generateCaseStudy').addEventListener('click', () => {
            this.generateCaseStudy();
        });

        document.getElementById('exportConversation').addEventListener('click', () => {
            this.exportConversation();
        });

        document.getElementById('scheduleCall').addEventListener('click', () => {
            this.scheduleCall();
        });
    }

    changeMode(mode) {
        this.currentContext.mode = mode;
        this.addAgentMessage(`Switched to ${this.getModeDescription(mode)}. How can I help you in this mode?`);
        this.updateSuggestedQueries(mode);
    }

    getModeDescription(mode) {
        const descriptions = {
            'explorer': 'Explorer Mode - I\'ll help you navigate through Prasad\'s experience interactively',
            'interview': 'Interview Prep Mode - I\'ll help prepare talking points and practice responses',
            'technical': 'Technical Deep-Dive Mode - Let\'s explore technical implementations and architectures',
            'executive': 'Executive Summary Mode - I\'ll provide high-level strategic insights'
        };
        return descriptions[mode];
    }

    updateSuggestedQueries(mode) {
        const queries = {
            'explorer': [
                'Tell me about Kruti.ai platform architecture',
                'How did you scale Ola Maps to 13,000+ customers?',
                'Explain your approach to LLM orchestration',
                'Leadership philosophy for managing 200+ engineers'
            ],
            'interview': [
                'Common challenges in scaling AI platforms',
                'Your biggest technical achievement',
                'How do you handle team conflicts?',
                'Vision for AI in next 5 years'
            ],
            'technical': [
                'RAG pipeline implementation details',
                'Multi-model LLM orchestration architecture',
                'Cost optimization strategies for cloud infrastructure',
                'MLOps best practices at scale'
            ],
            'executive': [
                'ROI from AI transformation initiatives',
                'Building and scaling engineering teams',
                'Strategic approach to platform monetization',
                'Digital transformation roadmap'
            ]
        };

        const container = document.getElementById('suggestedQueries');
        container.innerHTML = '';

        queries[mode].forEach(query => {
            const chip = document.createElement('button');
            chip.className = 'query-chip';
            chip.dataset.query = query;
            chip.textContent = query.length > 30 ? query.substring(0, 30) + '...' : query;
            chip.addEventListener('click', () => {
                document.getElementById('userInput').value = query;
                this.sendMessage();
            });
            container.appendChild(chip);
        });
    }

    async sendMessage() {
        const input = document.getElementById('userInput');
        const message = input.value.trim();

        if (!message) return;

        // Add user message to conversation
        this.addUserMessage(message);
        input.value = '';

        // Show loading
        this.showThinking();

        // Process message with AI engine
        const response = await window.agentEngine.processQuery(
            message,
            this.currentContext,
            this.conversationHistory
        );

        // Hide loading
        this.hideThinking();

        // Add agent response
        this.addAgentMessage(response.message);

        // Update context and analytics
        this.updateContext(response);
        this.updateAnalytics();

        // Generate insights if applicable
        if (response.insights) {
            this.displayInsights(response.insights);
        }

        // Update skill match if analyzing requirements
        if (response.skillMatch) {
            this.updateSkillMatch(response.skillMatch);
        }
    }

    addUserMessage(message) {
        const conversationArea = document.getElementById('conversationArea');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'user-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">👤</div>
            <div class="message-content">${message}</div>
        `;
        conversationArea.appendChild(messageDiv);
        conversationArea.scrollTop = conversationArea.scrollHeight;

        this.conversationHistory.push({
            role: 'user',
            content: message,
            timestamp: new Date().toISOString()
        });
    }

    addAgentMessage(message) {
        const conversationArea = document.getElementById('conversationArea');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'agent-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">${message}</div>
        `;
        conversationArea.appendChild(messageDiv);
        conversationArea.scrollTop = conversationArea.scrollHeight;

        this.conversationHistory.push({
            role: 'agent',
            content: message,
            timestamp: new Date().toISOString()
        });
    }

    showThinking() {
        document.getElementById('loadingOverlay').classList.add('active');
    }

    hideThinking() {
        document.getElementById('loadingOverlay').classList.remove('active');
    }

    updateContext(response) {
        if (response.topicExplored) {
            this.currentContext.topicsExplored.push(response.topicExplored);
        }

        if (response.depthLevel) {
            this.currentContext.depthLevel = response.depthLevel;
        }

        if (response.userIntent) {
            this.currentContext.userIntent = response.userIntent;
        }

        this.currentContext.insightsGenerated += response.insights ? response.insights.length : 0;
    }

    updateAnalytics() {
        this.analytics.topicsExplored = this.currentContext.topicsExplored.length;
        this.analytics.insightsGenerated = this.currentContext.insightsGenerated;
        this.analytics.depthLevel = this.capitalizeFirst(this.currentContext.depthLevel);
        this.analytics.interactions++;

        document.getElementById('topicsExplored').textContent = this.analytics.topicsExplored;
        document.getElementById('insightsGenerated').textContent = this.analytics.insightsGenerated;
        document.getElementById('depthLevel').textContent = this.analytics.depthLevel;

        // Update match score if we have enough interaction
        if (this.analytics.interactions > 3) {
            this.analytics.matchScore = Math.min(95, 70 + (this.analytics.interactions * 2)) + '%';
            document.getElementById('matchScore').textContent = this.analytics.matchScore;
        }
    }

    displayInsights(insights) {
        const container = document.getElementById('insightCards');
        container.innerHTML = '';

        insights.forEach((insight, index) => {
            setTimeout(() => {
                const card = document.createElement('div');
                card.className = 'insight-card';
                card.innerHTML = `<strong>Insight ${index + 1}:</strong> ${insight}`;
                container.appendChild(card);
            }, index * 200);
        });
    }

    updateSkillMatch(skillMatch) {
        if (this.radarChart) {
            this.radarChart.data.datasets[0].data = [
                skillMatch.ai_ml || 90,
                skillMatch.leadership || 95,
                skillMatch.technical || 85,
                skillMatch.business || 88,
                skillMatch.innovation || 92,
                skillMatch.scale || 96
            ];
            this.radarChart.update();
        }

        // Update metric cards
        document.getElementById('aiScore').textContent = `${skillMatch.ai_ml || 90}%`;
        document.getElementById('leadershipScore').textContent = `${skillMatch.leadership || 95}%`;
        document.getElementById('techScore').textContent = `${skillMatch.technical || 85}%`;
    }

    exploreExperience(exp) {
        // Update active state
        document.querySelectorAll('.timeline-node').forEach(node => {
            node.classList.remove('active');
        });
        document.querySelector(`[data-exp="${exp}"]`).classList.add('active');

        this.currentContext.activeExperience = exp;

        // Generate message about this experience
        const experienceMessages = {
            'krutrim': 'Let me tell you about the Krutrim experience - leading India\'s first Agentic AI platform with 200+ engineers.',
            'ola': 'The Ola journey was transformative - scaling Maps to 13,000+ B2B customers while reducing costs by 70%.',
            'here': 'HERE Technologies was an 18-year progression where I led global teams and delivered autonomous driving solutions.'
        };

        this.addAgentMessage(experienceMessages[exp]);
    }

    initializeRadarChart() {
        const ctx = document.getElementById('radarChart').getContext('2d');
        this.radarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['AI/ML', 'Leadership', 'Technical', 'Business', 'Innovation', 'Scale'],
                datasets: [{
                    label: 'Skill Match',
                    data: [95, 98, 92, 88, 90, 96],
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(102, 126, 234, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    generateCaseStudy() {
        this.showThinking();

        setTimeout(() => {
            const caseStudy = window.agentEngine.generateCaseStudy(this.currentContext);
            this.hideThinking();

            // Create a modal or new window with the case study
            const caseStudyWindow = window.open('', '_blank');
            caseStudyWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Generated Case Study - Prasad Kavuri</title>
                    <style>
                        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
                        h1 { color: #667eea; }
                        h2 { color: #2d3748; margin-top: 30px; }
                        p { line-height: 1.6; color: #4a5568; }
                        .metric { background: #f8f9fa; padding: 10px; margin: 10px 0; border-left: 3px solid #667eea; }
                    </style>
                </head>
                <body>
                    ${caseStudy}
                </body>
                </html>
            `);
        }, 2000);
    }

    exportConversation() {
        const conversationText = this.conversationHistory.map(msg => {
            return `[${msg.role.toUpperCase()}]: ${msg.content}\n`;
        }).join('\n');

        const blob = new Blob([conversationText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio_conversation_${new Date().toISOString()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.addAgentMessage('Conversation exported successfully! Check your downloads folder.');
    }

    scheduleCall() {
        window.open('https://calendly.com/your-link', '_blank');
        this.addAgentMessage('Opening scheduling page... Looking forward to our discussion!');
    }

    loadAgentPersonality() {
        // Set initial personality based on mode
        this.agentPersonality = {
            tone: 'professional',
            expertise: 'comprehensive',
            responseStyle: 'analytical'
        };
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioAssistant = new PortfolioAssistant();
});