/**
 * Researcher Agent - Best Practices Research Specialist
 * Researches industry standards, solutions, and best practices
 */
class ResearcherAgent {
    constructor() {
        this.name = "Researcher Agent";
        this.role = "Best Practices Research Specialist";
        this.capabilities = ["Research", "Standards", "Solutions", "Best Practices"];
        this.status = "idle";
        this.knowledgeBase = this.initializeKnowledgeBase();
    }

    /**
     * Research solutions and best practices for identified issues
     * @param {Object} analysisResults - Results from the analyzer agent
     * @param {Object} options - Research options
     * @returns {Promise<Object>} Research results with recommendations
     */
    async research(analysisResults, options = {}) {
        try {
            this.updateStatus("researching");

            console.log(`[${this.name}] Starting research based on analysis findings`);

            // Simulate research time
            await this.simulateResearch();

            // Extract issues to research
            const issues = this.extractIssues(analysisResults);

            // Research each issue category
            const recommendations = await this.researchSolutions(issues);

            // Find relevant sources
            const sources = this.findRelevantSources(issues);

            // Generate best practices
            const bestPractices = this.generateBestPractices(issues);

            // Progress reporting
            if (options.onProgress) {
                await this.reportProgress(options.onProgress);
            }

            const results = {
                timestamp: new Date().toISOString(),
                agent: this.name,
                inputAnalysis: analysisResults,
                recommendations: recommendations,
                bestPractices: bestPractices,
                sources: sources,
                researchAreas: issues,
                confidence: 0.89,
                researchTime: "8.7 seconds"
            };

            this.updateStatus("completed");
            console.log(`[${this.name}] Research completed successfully`);

            return results;

        } catch (error) {
            this.updateStatus("error");
            console.error(`[${this.name}] Research failed:`, error);
            throw new Error(`Research failed: ${error.message}`);
        }
    }

    /**
     * Update agent status and notify UI
     * @param {string} status - New status
     */
    updateStatus(status) {
        this.status = status;

        const statusElement = document.getElementById('researcher-status');
        if (statusElement) {
            statusElement.className = 'w-6 h-6 rounded-full border-2 agent-status';

            switch (status) {
                case 'researching':
                    statusElement.classList.add('border-green-500', 'bg-green-100', 'pulse-animation');
                    break;
                case 'completed':
                    statusElement.classList.add('border-green-500', 'bg-green-500');
                    break;
                case 'error':
                    statusElement.classList.add('border-red-500', 'bg-red-100');
                    break;
                default:
                    statusElement.classList.add('border-gray-300');
            }
        }
    }

    /**
     * Simulate research process
     */
    async simulateResearch() {
        const steps = [
            "Analyzing problem categories...",
            "Searching knowledge base...",
            "Cross-referencing best practices...",
            "Evaluating solution effectiveness...",
            "Compiling recommendations..."
        ];

        for (let i = 0; i < steps.length; i++) {
            console.log(`[${this.name}] ${steps[i]}`);
            await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
        }
    }

    /**
     * Report progress during research
     * @param {Function} progressCallback - Progress callback function
     */
    async reportProgress(progressCallback) {
        const progressElement = document.getElementById('researcher-progress');
        if (progressElement) {
            progressElement.classList.remove('hidden');
            const progressBar = progressElement.querySelector('.progress-bar');

            for (let progress = 0; progress <= 100; progress += 25) {
                if (progressBar) {
                    progressBar.style.width = `${progress}%`;
                }
                progressCallback && progressCallback({
                    agent: this.name,
                    progress: progress,
                    status: progress === 100 ? 'completed' : 'researching'
                });
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
    }

    /**
     * Extract issues from analysis results
     * @param {Object} analysisResults - Analysis results from AnalyzerAgent
     * @returns {Array} Array of issue categories
     */
    extractIssues(analysisResults) {
        const issues = [];

        if (analysisResults.categories) {
            issues.push(...analysisResults.categories);
        }

        if (analysisResults.findings) {
            issues.push(...Object.keys(analysisResults.findings));
        }

        // Remove duplicates and normalize
        return [...new Set(issues.map(issue => issue.toLowerCase()))];
    }

    /**
     * Research solutions for specific issues
     * @param {Array} issues - Array of issue categories
     * @returns {Object} Categorized recommendations
     */
    async researchSolutions(issues) {
        const recommendations = {};

        for (const issue of issues) {
            console.log(`[${this.name}] Researching solutions for: ${issue}`);

            // Get recommendations from knowledge base or mock data
            const solutions = this.getRecommendationsForIssue(issue);
            recommendations[issue] = solutions;

            // Simulate research time
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        return recommendations;
    }

    /**
     * Get recommendations for a specific issue from knowledge base
     * @param {string} issue - Issue category
     * @returns {Array} Array of recommendations
     */
    getRecommendationsForIssue(issue) {
        // Try to get from mock data first
        if (typeof AGENT_MOCK_DATA !== 'undefined' && AGENT_MOCK_DATA.researcher.recommendations[issue]) {
            return AGENT_MOCK_DATA.researcher.recommendations[issue];
        }

        // Fallback to knowledge base
        if (this.knowledgeBase[issue]) {
            return this.knowledgeBase[issue].solutions;
        }

        // Generic fallback
        return [
            `Implement industry best practices for ${issue}`,
            `Follow established guidelines and standards for ${issue}`,
            `Consider professional consultation for ${issue} optimization`
        ];
    }

    /**
     * Find relevant sources for research areas
     * @param {Array} issues - Array of issue categories
     * @returns {Array} Array of relevant sources
     */
    findRelevantSources(issues) {
        // Try to get from mock data first
        if (typeof AGENT_MOCK_DATA !== 'undefined') {
            return AGENT_MOCK_DATA.researcher.sources;
        }

        // Fallback sources
        const sources = new Set();

        issues.forEach(issue => {
            if (this.knowledgeBase[issue] && this.knowledgeBase[issue].sources) {
                this.knowledgeBase[issue].sources.forEach(source => sources.add(source));
            }
        });

        // Add general sources if none found
        if (sources.size === 0) {
            return [
                "W3C Web Standards",
                "Google Developer Documentation",
                "Mozilla Developer Network",
                "Industry Best Practices Database"
            ];
        }

        return Array.from(sources);
    }

    /**
     * Generate best practices based on research
     * @param {Array} issues - Array of issue categories
     * @returns {Object} Best practices by category
     */
    generateBestPractices(issues) {
        const bestPractices = {};

        issues.forEach(issue => {
            if (this.knowledgeBase[issue] && this.knowledgeBase[issue].bestPractices) {
                bestPractices[issue] = this.knowledgeBase[issue].bestPractices;
            } else {
                bestPractices[issue] = [
                    `Follow established standards for ${issue}`,
                    `Regular monitoring and testing of ${issue}`,
                    `Stay updated with latest ${issue} trends`
                ];
            }
        });

        return bestPractices;
    }

    /**
     * Initialize the knowledge base with research data
     * @returns {Object} Knowledge base object
     */
    initializeKnowledgeBase() {
        return {
            performance: {
                solutions: [
                    "Implement lazy loading for images and content",
                    "Use CDN for static asset delivery",
                    "Minimize and compress CSS/JS files",
                    "Optimize images with modern formats (WebP, AVIF)",
                    "Enable browser caching with proper headers"
                ],
                bestPractices: [
                    "Measure Core Web Vitals regularly",
                    "Implement performance budgets",
                    "Use performance monitoring tools",
                    "Optimize critical rendering path"
                ],
                sources: [
                    "Google PageSpeed Insights",
                    "Web.dev Performance Guide",
                    "Core Web Vitals Documentation"
                ]
            },
            seo: {
                solutions: [
                    "Create unique, descriptive meta descriptions",
                    "Implement proper heading structure (H1-H6)",
                    "Add structured data markup (JSON-LD)",
                    "Optimize internal linking structure",
                    "Submit XML sitemap to search engines"
                ],
                bestPractices: [
                    "Focus on user intent and content quality",
                    "Ensure mobile-first indexing compatibility",
                    "Regular SEO audits and monitoring",
                    "Build authoritative backlinks naturally"
                ],
                sources: [
                    "Google Search Central",
                    "Moz SEO Learning Center",
                    "Search Engine Journal"
                ]
            },
            accessibility: {
                solutions: [
                    "Ensure sufficient color contrast (4.5:1 minimum)",
                    "Add proper ARIA labels and landmarks",
                    "Implement keyboard navigation support",
                    "Provide alternative text for images",
                    "Use semantic HTML elements"
                ],
                bestPractices: [
                    "Follow WCAG 2.1 AA guidelines",
                    "Test with screen readers",
                    "Include accessibility in design process",
                    "Regular accessibility audits"
                ],
                sources: [
                    "WCAG 2.1 Guidelines",
                    "WebAIM Resources",
                    "axe Accessibility Testing"
                ]
            },
            security: {
                solutions: [
                    "Implement Content Security Policy (CSP)",
                    "Use HTTPS everywhere",
                    "Add security headers (HSTS, X-Frame-Options)",
                    "Regular security audits and updates",
                    "Input validation and sanitization"
                ],
                bestPractices: [
                    "Follow OWASP security guidelines",
                    "Regular dependency updates",
                    "Implement proper authentication",
                    "Monitor for security vulnerabilities"
                ],
                sources: [
                    "OWASP Security Guidelines",
                    "Mozilla Security Headers",
                    "Security Best Practices Database"
                ]
            }
        };
    }

    /**
     * Get detailed research for a specific topic
     * @param {string} topic - Research topic
     * @returns {Object} Detailed research information
     */
    getDetailedResearch(topic) {
        const research = {
            topic: topic,
            solutions: this.getRecommendationsForIssue(topic),
            bestPractices: this.knowledgeBase[topic]?.bestPractices || [],
            sources: this.knowledgeBase[topic]?.sources || [],
            implementation: this.getImplementationGuidance(topic),
            metrics: this.getSuccessMetrics(topic)
        };

        return research;
    }

    /**
     * Get implementation guidance for a topic
     * @param {string} topic - Research topic
     * @returns {Array} Implementation steps
     */
    getImplementationGuidance(topic) {
        const guidance = {
            performance: [
                "Audit current performance metrics",
                "Identify bottlenecks and optimization opportunities",
                "Implement optimizations in order of impact",
                "Monitor and measure improvements"
            ],
            seo: [
                "Conduct SEO audit",
                "Fix technical SEO issues first",
                "Optimize content and metadata",
                "Build internal linking structure",
                "Monitor search rankings"
            ],
            accessibility: [
                "Run accessibility audit",
                "Fix critical issues first",
                "Implement proper markup and ARIA",
                "Test with assistive technologies",
                "Establish accessibility guidelines"
            ]
        };

        return guidance[topic] || [
            "Assess current state",
            "Plan implementation strategy",
            "Execute improvements",
            "Monitor and maintain"
        ];
    }

    /**
     * Get success metrics for a topic
     * @param {string} topic - Research topic
     * @returns {Array} Success metrics
     */
    getSuccessMetrics(topic) {
        const metrics = {
            performance: [
                "Core Web Vitals scores",
                "Page load times",
                "First Contentful Paint",
                "Time to Interactive"
            ],
            seo: [
                "Search rankings",
                "Organic traffic",
                "Click-through rates",
                "Indexing status"
            ],
            accessibility: [
                "WCAG compliance score",
                "Accessibility audit results",
                "User feedback",
                "Assistive technology compatibility"
            ]
        };

        return metrics[topic] || [
            "Baseline measurements",
            "Improvement targets",
            "User satisfaction",
            "Compliance metrics"
        ];
    }
}

// Make class available globally
if (typeof window !== 'undefined') {
    window.ResearcherAgent = ResearcherAgent;
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResearcherAgent;
}