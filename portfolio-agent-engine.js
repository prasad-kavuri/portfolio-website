// Agentic AI Engine - Intelligent Query Processing
/* eslint no-unused-vars: ["warn", { "argsIgnorePattern": "^_" }] */

class AgentEngine {
    constructor() {
        this.knowledgeBase = {
            experiences: {
                krutrim: {
                    company: 'Krutrim',
                    role: 'Head of AI Engineering',
                    period: 'Mar 2025 - Present',
                    key_achievements: [
                        'Architected India\'s first Agentic AI platform (Kruti.ai)',
                        'Leading 200+ engineers across AI/ML initiatives',
                        'Achieved 50% latency reduction and 40% cost savings',
                        'Built multi-model LLM orchestration system',
                        'Developed sophisticated RAG pipelines',
                        'Created domain-specific AI agents for mobility, payments, content'
                    ],
                    technical_details: {
                        architecture: 'Microservices-based with event-driven architecture',
                        llm_models: 'Multi-model approach using GPT-4, Claude, Llama, and custom models',
                        infrastructure: 'Kubernetes on AWS/Azure hybrid cloud',
                        scale: 'Processing millions of queries daily',
                        team_structure: '12 squads focused on different AI verticals'
                    },
                    metrics: {
                        latency_reduction: '50%',
                        cost_savings: '40%',
                        team_size: '200+',
                        daily_requests: '10M+',
                        uptime: '99.99%'
                    }
                },
                ola: {
                    company: 'Ola',
                    role: 'Senior Director of Engineering',
                    period: 'Sep 2023 - Feb 2025',
                    key_achievements: [
                        'Launched Ola Maps B2B platform',
                        'Scaled to 13,000+ B2B customers',
                        'Reduced infrastructure costs by 70%',
                        'Built AI-powered route optimization',
                        'Enabled predictive analytics for EV operations'
                    ],
                    technical_details: {
                        platform: 'Real-time mapping and location intelligence',
                        tech_stack: 'React, Node.js, PostgreSQL, Redis, Kafka',
                        ai_features: 'Route optimization, ETA prediction, demand forecasting',
                        infrastructure: 'AWS with auto-scaling',
                        team_size: '150+ engineers'
                    },
                    metrics: {
                        customers: '13,000+',
                        cost_reduction: '70%',
                        api_calls: 'Millions daily',
                        revenue: '$10M+ recurring',
                        team_growth: '3x in 18 months'
                    }
                },
                here: {
                    company: 'HERE Technologies',
                    role: 'Director of Engineering',
                    period: 'May 2005 - Aug 2023',
                    key_achievements: [
                        '18-year progression from Senior Engineer to Director',
                        'Led 85+ engineers across global offices',
                        'Delivered autonomous driving datasets',
                        'Drove 50% cost reduction through cloud migration',
                        'Managed P&L for multi-million dollar initiatives'
                    ],
                    technical_details: {
                        focus: 'Autonomous driving and mapping technologies',
                        datasets: 'HD maps for major automotive OEMs',
                        team_distribution: 'North America, Europe, APAC',
                        technologies: 'Computer vision, SLAM, sensor fusion',
                        cloud_migration: 'On-premise to AWS/Azure hybrid'
                    }
                }
            },

            skills: {
                ai_ml: [
                    'Large Language Models (LLMs)',
                    'Agentic AI Systems',
                    'RAG Pipelines',
                    'Multi-model Orchestration',
                    'MLOps & LLMOps',
                    'Vector Databases',
                    'Transformer Models'
                ],
                leadership: [
                    'Team scaling (10 to 200+)',
                    'Cross-functional leadership',
                    'P&L management',
                    'Strategic planning',
                    'Executive communication',
                    'Vendor management'
                ],
                technical: [
                    'Cloud Architecture (AWS, Azure, GCP)',
                    'Kubernetes & Docker',
                    'Microservices',
                    'Event-driven architecture',
                    'API design',
                    'DevOps & CI/CD'
                ],
                business: [
                    'Product strategy',
                    'Go-to-market',
                    'Cost optimization',
                    'Revenue growth',
                    'Digital transformation'
                ]
            },

            leadership_philosophy: {
                principles: [
                    'Lead by example and technical excellence',
                    'Empower teams through autonomy and trust',
                    'Data-driven decision making',
                    'Continuous learning and innovation',
                    'Customer-first approach'
                ],
                management_style: 'Collaborative with clear accountability',
                team_building: 'Focus on diversity, mentorship, and growth',
                communication: 'Transparent, frequent, and bi-directional'
            }
        };

        this.intentClassifier = {
            'technical': ['architecture', 'implementation', 'technical', 'code', 'system', 'api', 'infrastructure'],
            'leadership': ['manage', 'lead', 'team', 'scale', 'hire', 'culture', 'philosophy'],
            'business': ['revenue', 'cost', 'customer', 'market', 'strategy', 'roi', 'growth'],
            'career': ['experience', 'role', 'journey', 'progression', 'achievement'],
            'specific': ['kruti', 'ola', 'here', 'specific', 'project']
        };
    }

    async processQuery(query, context, history) {
        // Classify intent
        const intent = this.classifyIntent(query);
        const depth = this.determineDepth(query, history);

        // Generate contextual response
        let response = {
            message: '',
            topicExplored: intent,
            depthLevel: depth,
            userIntent: intent,
            insights: [],
            skillMatch: null
        };

        // Process based on mode and intent
        if (context.mode === 'explorer') {
            response = this.handleExplorerMode(query, intent, depth);
        } else if (context.mode === 'interview') {
            response = this.handleInterviewMode(query, intent);
        } else if (context.mode === 'technical') {
            response = this.handleTechnicalMode(query, intent);
        } else if (context.mode === 'executive') {
            response = this.handleExecutiveMode(query, intent);
        }

        // Add insights if depth is beyond surface
        if (depth !== 'surface') {
            response.insights = this.generateInsights(query, intent, context);
        }

        // Check for skill matching queries
        if (query.toLowerCase().includes('match') || query.toLowerCase().includes('fit') || query.toLowerCase().includes('qualify')) {
            response.skillMatch = this.analyzeSkillMatch(query);
        }

        return response;
    }

    classifyIntent(query) {
        const lowerQuery = query.toLowerCase();
        let maxScore = 0;
        let detectedIntent = 'general';

        for (const [intent, keywords] of Object.entries(this.intentClassifier)) {
            const score = keywords.filter(keyword => lowerQuery.includes(keyword)).length;
            if (score > maxScore) {
                maxScore = score;
                detectedIntent = intent;
            }
        }

        return detectedIntent;
    }

    determineDepth(query, history) {
        const indicators = {
            surface: ['what', 'who', 'when', 'list', 'summary'],
            medium: ['how', 'why', 'explain', 'describe'],
            deep: ['architecture', 'implementation', 'detail', 'specific', 'technical', 'strategy']
        };

        const lowerQuery = query.toLowerCase();

        if (indicators.deep.some(word => lowerQuery.includes(word))) return 'deep';
        if (indicators.medium.some(word => lowerQuery.includes(word))) return 'medium';
        return 'surface';
    }

    handleExplorerMode(query, intent, depth) {
        const lowerQuery = query.toLowerCase();
        let message = '';

        // Check for specific company mentions
        if (lowerQuery.includes('kruti') || lowerQuery.includes('krutrim')) {
            const exp = this.knowledgeBase.experiences.krutrim;
            message = `<strong>Krutrim - Leading India's First Agentic AI Platform</strong><br><br>`;
            message += `As Head of AI Engineering (${exp.period}), I'm architecting groundbreaking AI systems:<br><br>`;
            message += `<strong>Key Achievements:</strong><ul>`;
            exp.key_achievements.forEach(achievement => {
                message += `<li>${achievement}</li>`;
            });
            message += `</ul>`;

            if (depth === 'deep') {
                message += `<strong>Technical Architecture:</strong><br>`;
                message += `• ${exp.technical_details.architecture}<br>`;
                message += `• LLM Strategy: ${exp.technical_details.llm_models}<br>`;
                message += `• Infrastructure: ${exp.technical_details.infrastructure}<br>`;
                message += `• Scale: ${exp.technical_details.scale}<br>`;
            }
        } else if (lowerQuery.includes('ola')) {
            const exp = this.knowledgeBase.experiences.ola;
            message = `<strong>Ola - Scaling B2B Mapping Platform</strong><br><br>`;
            message += `During my tenure as Senior Director (${exp.period}), I transformed Ola Maps into a major B2B platform:<br><br>`;
            message += `<strong>Impact Metrics:</strong><br>`;
            message += `• Customers: ${exp.metrics.customers}<br>`;
            message += `• Cost Reduction: ${exp.metrics.cost_reduction}<br>`;
            message += `• Revenue: ${exp.metrics.revenue}<br>`;
            message += `• Team Growth: ${exp.metrics.team_growth}<br>`;
        } else if (lowerQuery.includes('llm') || lowerQuery.includes('orchestration')) {
            message = `<strong>Multi-Model LLM Orchestration Expertise</strong><br><br>`;
            message += `At Krutrim, I've built sophisticated LLM orchestration systems that:<br><br>`;
            message += `• <strong>Intelligent Routing:</strong> Dynamically route queries to optimal models based on task complexity<br>`;
            message += `• <strong>Cost Optimization:</strong> 40% reduction through smart model selection<br>`;
            message += `• <strong>Latency Reduction:</strong> 50% improvement via caching and parallel processing<br>`;
            message += `• <strong>Quality Assurance:</strong> Multi-model validation for critical outputs<br><br>`;
            message += `The system handles 10M+ daily requests across GPT-4, Claude, Llama, and custom models.`;
        } else if (lowerQuery.includes('leadership') || lowerQuery.includes('manage')) {
            message = `<strong>Leadership Philosophy & Approach</strong><br><br>`;
            message += `Managing 200+ engineers has taught me that successful leadership requires:<br><br>`;
            this.knowledgeBase.leadership_philosophy.principles.forEach(principle => {
                message += `• ${principle}<br>`;
            });
            message += `<br><strong>Management Style:</strong> ${this.knowledgeBase.leadership_philosophy.management_style}<br>`;
            message += `<strong>Team Building:</strong> ${this.knowledgeBase.leadership_philosophy.team_building}`;
        } else {
            // General exploration response
            message = `I can help you explore various aspects of Prasad's experience. Here are some areas we can dive into:<br><br>`;
            message += `• <strong>Current Role:</strong> Head of AI Engineering at Krutrim - India's first Agentic AI platform<br>`;
            message += `• <strong>Recent Achievement:</strong> Scaled Ola Maps to 13,000+ B2B customers<br>`;
            message += `• <strong>Technical Expertise:</strong> LLM orchestration, RAG pipelines, cloud architecture<br>`;
            message += `• <strong>Leadership Scale:</strong> Currently managing 200+ engineers<br><br>`;
            message += `What specific area interests you most?`;
        }

        return {
            message,
            topicExplored: intent,
            depthLevel: depth,
            userIntent: intent,
            insights: depth === 'deep' ? this.generateInsights(query, intent, {}) : []
        };
    }

    handleInterviewMode(query, intent) {
        const lowerQuery = query.toLowerCase();
        let message = '';

        if (lowerQuery.includes('challenge')) {
            message = `<strong>Biggest Technical Challenge & Solution</strong><br><br>`;
            message += `<strong>Challenge:</strong> At Krutrim, reducing latency for real-time AI responses while managing costs.<br><br>`;
            message += `<strong>Approach:</strong><br>`;
            message += `1. Implemented intelligent caching with Redis for frequent queries<br>`;
            message += `2. Built multi-model orchestration to route by complexity<br>`;
            message += `3. Deployed edge computing for regional optimization<br>`;
            message += `4. Created custom lightweight models for common tasks<br><br>`;
            message += `<strong>Result:</strong> 50% latency reduction, 40% cost savings, 99.99% uptime`;
        } else if (lowerQuery.includes('conflict') || lowerQuery.includes('team')) {
            message = `<strong>Handling Team Conflicts</strong><br><br>`;
            message += `My approach to conflict resolution:<br><br>`;
            message += `1. <strong>Listen First:</strong> Understand all perspectives without judgment<br>`;
            message += `2. <strong>Find Common Ground:</strong> Identify shared goals and values<br>`;
            message += `3. <strong>Data-Driven:</strong> Use metrics and facts to guide decisions<br>`;
            message += `4. <strong>Clear Communication:</strong> Ensure transparency in resolution<br>`;
            message += `5. <strong>Follow-up:</strong> Monitor and adjust as needed<br><br>`;
            message += `Example: Resolved architecture debate between teams by running POCs and measuring performance.`;
        } else {
            message = `<strong>Interview Preparation Mode</strong><br><br>`;
            message += `I can help you prepare for interviews by discussing:<br>`;
            message += `• Technical challenges and solutions<br>`;
            message += `• Leadership scenarios and approaches<br>`;
            message += `• Strategic decision-making examples<br>`;
            message += `• Innovation and transformation stories<br><br>`;
            message += `What type of interview question would you like to explore?`;
        }

        return {
            message,
            topicExplored: intent,
            depthLevel: 'medium',
            userIntent: 'interview_prep'
        };
    }

    handleTechnicalMode(query, intent) {
        const lowerQuery = query.toLowerCase();
        let message = '';

        if (lowerQuery.includes('rag') || lowerQuery.includes('retrieval')) {
            message = `<strong>RAG Pipeline Implementation Details</strong><br><br>`;
            message += `<strong>Architecture Components:</strong><br>`;
            message += `• <strong>Ingestion Layer:</strong> Multi-format document processing (PDF, HTML, JSON)<br>`;
            message += `• <strong>Chunking Strategy:</strong> Semantic chunking with 512-token overlaps<br>`;
            message += `• <strong>Embedding Model:</strong> Custom fine-tuned BERT for domain-specific content<br>`;
            message += `• <strong>Vector Store:</strong> Pinecone with 100M+ vectors, <50ms query time<br>`;
            message += `• <strong>Reranking:</strong> Cross-encoder model for relevance optimization<br>`;
            message += `• <strong>Context Window:</strong> Dynamic sizing based on query complexity<br><br>`;
            message += `<strong>Performance:</strong> 95% accuracy, 200ms average response time`;
        } else if (lowerQuery.includes('scale') || lowerQuery.includes('architecture')) {
            message = `<strong>Scaling Architecture for 10M+ Daily Requests</strong><br><br>`;
            message += `<strong>System Design:</strong><br>`;
            message += `• <strong>API Gateway:</strong> Kong with rate limiting and auth<br>`;
            message += `• <strong>Load Balancing:</strong> AWS ALB with health checks<br>`;
            message += `• <strong>Compute:</strong> EKS with auto-scaling (min: 50 pods, max: 500)<br>`;
            message += `• <strong>Caching:</strong> Redis cluster with 1TB memory<br>`;
            message += `• <strong>Database:</strong> PostgreSQL with read replicas<br>`;
            message += `• <strong>Message Queue:</strong> Kafka for async processing<br>`;
            message += `• <strong>Monitoring:</strong> Datadog, Prometheus, Grafana<br><br>`;
            message += `<strong>Key Optimizations:</strong> Connection pooling, query optimization, CDN for static assets`;
        } else {
            message = `<strong>Technical Deep-Dive Mode</strong><br><br>`;
            message += `Let's explore technical implementations:<br>`;
            message += `• RAG pipeline architecture<br>`;
            message += `• Multi-model LLM orchestration<br>`;
            message += `• Scaling strategies for millions of users<br>`;
            message += `• Cloud infrastructure optimization<br>`;
            message += `• MLOps and deployment pipelines<br><br>`;
            message += `Which technical area would you like to explore?`;
        }

        return {
            message,
            topicExplored: 'technical',
            depthLevel: 'deep',
            userIntent: 'technical_deep_dive'
        };
    }

    handleExecutiveMode(query, intent) {
        let message = `<strong>Executive Summary</strong><br><br>`;
        message += `<strong>Current Impact:</strong><br>`;
        message += `• Leading 200+ engineers at Krutrim on India's first Agentic AI platform<br>`;
        message += `• Achieved 50% latency reduction and 40% cost savings<br>`;
        message += `• Previously scaled Ola Maps to 13,000+ B2B customers<br><br>`;
        message += `<strong>Strategic Capabilities:</strong><br>`;
        message += `• Digital transformation and AI strategy<br>`;
        message += `• P&L management for multi-million dollar initiatives<br>`;
        message += `• Global team leadership across 3 continents<br>`;
        message += `• Vendor partnerships and ecosystem development<br><br>`;
        message += `<strong>ROI Delivered:</strong> 70% cost reductions, $10M+ revenue generation, 3x team productivity`;

        return {
            message,
            topicExplored: 'executive',
            depthLevel: 'strategic',
            userIntent: 'executive_summary'
        };
    }

    generateInsights(query, intent, context) {
        const insights = [];

        if (intent === 'technical') {
            insights.push('Multi-model orchestration can reduce costs by 40% while improving response quality');
            insights.push('Edge computing deployment reduced latency by 50% for regional users');
            insights.push('Semantic caching improved response time by 70% for repeated queries');
        } else if (intent === 'leadership') {
            insights.push('Scaling from 10 to 200+ engineers requires shifting from hands-on to strategic leadership');
            insights.push('Cross-functional collaboration increased project delivery speed by 2x');
            insights.push('Investment in team training yielded 3x productivity improvement');
        } else if (intent === 'business') {
            insights.push('B2B platform approach generated $10M+ recurring revenue at Ola');
            insights.push('Infrastructure optimization delivered 70% cost reduction');
            insights.push('Customer-first approach led to 13,000+ B2B customer acquisition');
        }

        return insights;
    }

    analyzeSkillMatch(query) {
        // Extract requirements from query and match against skills
        const scores = {
            ai_ml: 95,
            leadership: 98,
            technical: 92,
            business: 88,
            innovation: 90,
            scale: 96
        };

        // Adjust scores based on query keywords
        const lowerQuery = query.toLowerCase();
        if (lowerQuery.includes('startup')) {
            scores.innovation += 5;
            scores.scale -= 5;
        }
        if (lowerQuery.includes('enterprise')) {
            scores.scale += 5;
            scores.business += 5;
        }

        return scores;
    }

    generateCaseStudy(context) {
        const activeExp = context.activeExperience || 'krutrim';
        const experience = this.knowledgeBase.experiences[activeExp];

        let caseStudy = `<h1>Case Study: ${experience.company}</h1>`;
        caseStudy += `<h2>Executive Summary</h2>`;
        caseStudy += `<p>Role: ${experience.role} | Period: ${experience.period}</p>`;

        caseStudy += `<h2>Challenge</h2>`;
        if (activeExp === 'krutrim') {
            caseStudy += `<p>Build India's first Agentic AI platform capable of handling enterprise-scale operations while maintaining cost efficiency and low latency.</p>`;
        } else if (activeExp === 'ola') {
            caseStudy += `<p>Transform internal mapping infrastructure into a revenue-generating B2B platform while reducing operational costs.</p>`;
        }

        caseStudy += `<h2>Approach</h2>`;
        caseStudy += `<ul>`;
        experience.key_achievements.slice(0, 3).forEach(achievement => {
            caseStudy += `<li>${achievement}</li>`;
        });
        caseStudy += `</ul>`;

        caseStudy += `<h2>Results</h2>`;
        caseStudy += `<div class="metric">`;
        Object.entries(experience.metrics).forEach(([key, value]) => {
            caseStudy += `<strong>${key.replace(/_/g, ' ').toUpperCase()}:</strong> ${value}<br>`;
        });
        caseStudy += `</div>`;

        caseStudy += `<h2>Key Learnings</h2>`;
        caseStudy += `<ul>`;
        caseStudy += `<li>Importance of multi-model approaches in AI systems</li>`;
        caseStudy += `<li>Value of incremental optimization over complete rebuilds</li>`;
        caseStudy += `<li>Critical role of team alignment in scaling operations</li>`;
        caseStudy += `</ul>`;

        return caseStudy;
    }
}

// Initialize the agent engine
window.agentEngine = new AgentEngine();