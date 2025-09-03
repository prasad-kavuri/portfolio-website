class PrasadAIChatbot {
    constructor() {
        this.chatToggle = document.getElementById('chatToggle');
        this.chatContainer = document.getElementById('chatbotContainer');
        this.closeBtn = document.getElementById('closeChat');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.typingIndicator = document.getElementById('typingIndicator');

        this.isOpen = false;
        this.isTyping = false;

        // Prasad's detailed professional information
        this.prasadData = {
            name: "Prasad Kavuri",
            title: "Head of AI Engineering | AI/ML Executive Leader",
            specializations: [
                "Agentic AI", "LLM Platforms", "Applied AI Strategy",
                "Global Engineering Leadership"
            ],

            currentRole: {
                company: "Krutrim",
                year: "2025",
                position: "Head of AI Engineering",
                achievements: [
                    "Architected and launched Kruti.ai with 200+ engineers",
                    "Delivered 50% latency reduction and 40% cost savings",
                    "Built multi-model LLM orchestration and RAG pipelines",
                    "Created domain-specific AI agents across mobility, payments, and content generation",
                    "Built enterprise-grade 24/7 PaaS capabilities with SDK/API integration"
                ]
            },

            experience: {
                ola: {
                    years: "2023-2025",
                    position: "Engineering Leader",
                    achievements: [
                        "Launched Ola Maps B2B platform with 150+ engineers",
                        "Acquired 13,000+ customers and created new recurring revenue channel",
                        "Reduced infrastructure costs by 70%",
                        "Scaled to millions of daily API calls",
                        "Introduced AI-powered real-time route optimization",
                        "Improved ETA accuracy and customer satisfaction across millions of rides"
                    ]
                },
                here: {
                    years: "2005-2023",
                    position: "18-year progression from Senior Engineer to Director",
                    achievements: [
                        "Led 85+ engineers across North America, Europe, and APAC",
                        "Delivered autonomous driving datasets for major OEMs",
                        "Drove 50% cost reduction through cloud migration strategies",
                        "Delivered autonomous driving solutions for major OEMs"
                    ]
                }
            },

            expertise: {
                ai_ml: [
                    "Agentic AI Platforms", "Large Language Models (LLMs)",
                    "Multi-model LLM Orchestration", "RAG Pipelines",
                    "Applied AI Strategy", "AI Agent Development"
                ],
                leadership: [
                    "Global Engineering Teams (200+ engineers)",
                    "Cross-functional Team Leadership", "B2B Platform Strategy",
                    "Enterprise AI Architecture", "24/7 PaaS Operations"
                ],
                technical: [
                    "Cloud Migration & DevOps", "Infrastructure-as-Code",
                    "Real-time Systems", "API Development & Scaling",
                    "Cost Optimization", "Enterprise Integration"
                ]
            },

            achievements: [
                "India's first Agentic AI platform (Kruti.ai)",
                "50% latency reduction with 40% cost savings",
                "13,000+ B2B customers for Ola Maps",
                "70% infrastructure cost reduction at scale",
                "20+ years of transformative technology leadership"
            ]
        };

        this.init();
    }

    init() {
        if (!this.chatToggle) {
            console.error('Chatbot elements not found. Make sure the HTML structure is added.');
            return;
        }

        this.chatToggle.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.closeChat());
        this.sendBtn.addEventListener('click', () => this.sendMessage());

        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        this.chatInput.addEventListener('input', () => {
            this.autoResize();
            this.sendBtn.disabled = !this.chatInput.value.trim();
        });

        // Auto-resize textarea
        this.autoResize();
    }

    autoResize() {
        this.chatInput.style.height = 'auto';
        this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 100) + 'px';
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.isOpen = true;
        this.chatContainer.classList.add('open');
        this.chatToggle.classList.add('hidden');
        setTimeout(() => this.chatInput.focus(), 300);
    }

    closeChat() {
        this.isOpen = false;
        this.chatContainer.classList.remove('open');
        this.chatToggle.classList.remove('hidden');
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || this.isTyping) return;

        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.autoResize();
        this.sendBtn.disabled = true;

        this.showTyping();

        // Simulate realistic AI response time
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.hideTyping();
            this.addMessage(response, 'claude');
        }, 1200 + Math.random() * 800);
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTyping() {
        this.isTyping = true;
        this.typingIndicator.style.display = 'block';
        this.scrollToBottom();
    }

    hideTyping() {
        this.isTyping = false;
        this.typingIndicator.style.display = 'none';
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();

        // Kruti.ai and current role
        if (lowerMessage.includes('kruti') || lowerMessage.includes('current') || lowerMessage.includes('krutrim')) {
            return `Prasad is currently the Head of AI Engineering at Krutrim, where he's leading groundbreaking work on India's first Agentic AI platform - Kruti.ai.

Key achievements at Krutrim:
• Architected and launched Kruti.ai with a team of 200+ engineers
• Delivered 50% latency reduction and 40% cost savings through multi-model LLM orchestration
• Built sophisticated RAG pipelines and domain-specific AI agents
• Created enterprise-grade 24/7 PaaS capabilities with SDK/API integration
• Developed AI agents across mobility, payments, and content generation

This platform represents a major breakthrough in Agentic AI technology in India!`;
        }

        // Ola experience
        if (lowerMessage.includes('ola') || lowerMessage.includes('maps') || lowerMessage.includes('b2b')) {
            return `At Ola (2023-2025), Prasad demonstrated exceptional leadership in scaling B2B platforms:

🗺️ **Ola Maps B2B Platform:**
• Led 150+ engineers to launch comprehensive mapping platform
• Acquired 13,000+ B2B customers, creating new recurring revenue streams
• Scaled to handle millions of daily API calls
• Achieved 70% infrastructure cost reduction while scaling

🤖 **AI Innovation:**
• Introduced AI-powered real-time route optimization
• Improved ETA accuracy across millions of rides
• Enhanced customer satisfaction through predictive analytics
• Enabled AI-driven electric mobility operations

This work established Ola as a major player in the B2B mapping and location intelligence space.`;
        }

        // HERE Technologies experience
        if (lowerMessage.includes('here') || lowerMessage.includes('autonomous') || lowerMessage.includes('18')) {
            return `Prasad's 18-year journey at HERE Technologies (2005-2023) showcases remarkable career progression:

📈 **Career Growth:** Senior Engineer → Director
👥 **Global Leadership:** Led 85+ engineers across North America, Europe, and APAC
🚗 **Autonomous Driving:** Delivered cutting-edge datasets for major automotive OEMs
☁️ **Cloud Transformation:** Drove 50% cost reduction through strategic cloud migration
🏗️ **Infrastructure:** Implemented DevOps practices and infrastructure-as-code globally

His work at HERE was instrumental in shaping the autonomous driving industry and established him as a leader in large-scale engineering operations.`;
        }

        // AI and technical expertise
        if (lowerMessage.includes('ai') || lowerMessage.includes('technical') || lowerMessage.includes('expertise') || lowerMessage.includes('skills')) {
            return `Prasad's technical expertise spans cutting-edge AI and enterprise engineering:

🤖 **AI/ML Specializations:**
• Agentic AI Platforms & Architecture
• Large Language Models (LLMs) & Multi-model Orchestration
• RAG Pipelines & AI Agent Development
• Applied AI Strategy & Enterprise Integration

👨‍💼 **Leadership Excellence:**
• Global engineering teams (200+ engineers currently)
• Cross-functional team coordination across US, Europe, APAC
• B2B platform strategy and execution
• 24/7 enterprise operations management

⚙️ **Technical Foundation:**
• Cloud migration & infrastructure optimization
• DevOps & Infrastructure-as-Code
• Real-time systems at massive scale
• API development & performance optimization

His unique combination of deep technical knowledge and executive leadership makes him exceptionally effective in driving AI transformation at enterprise scale.`;
        }

        // Leadership and achievements
        if (lowerMessage.includes('leadership') || lowerMessage.includes('achievement') || lowerMessage.includes('success')) {
            return `Prasad's leadership achievements demonstrate consistent excellence across 20+ years:

🏆 **Major Achievements:**
• Launched India's first Agentic AI platform (Kruti.ai)
• 50% latency reduction + 40% cost savings through LLM optimization
• Scaled Ola Maps to 13,000+ B2B customers
• 70% infrastructure cost reduction while scaling operations
• Led autonomous driving dataset delivery for major OEMs

📊 **Scale of Impact:**
• Currently managing 200+ engineers at Krutrim
• Previously led 150+ engineers for Ola Maps
• Managed 85+ engineers globally at HERE Technologies
• Delivered solutions affecting millions of daily users

💡 **Innovation Focus:**
• Transforming AI research into commercial products
• Building enterprise-grade AI platforms from ground up
• Driving cost optimization while scaling performance
• Creating new revenue streams through B2B platforms

His track record shows exceptional ability to combine technical innovation with business impact.`;
        }

        // Contact information
        if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('connect')) {
            return `You can connect with Prasad through his professional website and portfolio:

🌐 **Website:** prasadkavuri.com
📧 **Professional Inquiries:** Available through his website contact form
💼 **LinkedIn:** Connect with him for professional networking
📊 **Portfolio:** View his detailed project showcase and career journey

Given his executive role as Head of AI Engineering and his expertise in Agentic AI platforms, he's particularly interested in:
• AI/ML leadership opportunities
• Enterprise AI strategy discussions  
• Agentic AI and LLM platform collaborations
• Technical advisory roles in AI startups

Feel free to reach out through his website for professional discussions!`;
        }

        // Greeting responses
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return `Hello! 👋 Great to meet you! I'm here to share insights about Prasad Kavuri's impressive AI Engineering leadership journey.

As Head of AI Engineering at Krutrim, he's currently leading India's first Agentic AI platform (Kruti.ai) with 200+ engineers. His 20+ year career spans transformative roles at Ola, HERE Technologies, and now Krutrim.

What would you like to know about?
• His current work on Kruti.ai platform
• His AI leadership achievements  
• His experience scaling Ola Maps to 13,000+ customers
• His technical expertise in LLMs and Agentic AI
• How to connect with him professionally`;
        }

        // Default responses
        const responses = [
            "That's a great question! I can share detailed information about Prasad's AI Engineering leadership, his work at Krutrim on Kruti.ai, his achievements at Ola and HERE Technologies, or his technical expertise. What specific area interests you most?",
            "I'd be happy to help! Prasad has an impressive 20+ year track record in AI/ML leadership. Feel free to ask about his current role at Krutrim, his platform scaling achievements, or his technical specializations in Agentic AI and LLMs.",
            "Excellent! I can provide insights into Prasad's executive leadership journey, from his 18-year progression at HERE Technologies to launching Ola Maps B2B platform, to now leading India's first Agentic AI platform. What would you like to explore?"
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }
}


// Quick message function for action buttons
function sendQuickMessage(message) {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    if (chatInput && sendBtn) {
        chatInput.value = message;
        chatInput.dispatchEvent(new Event('input'));
        sendBtn.click();
    }
}

// Expose to the page (so inline HTML like onclick="sendQuickMessage('Hi')" works)
// and so ESLint sees the function as “used”.
if (typeof window !== 'undefined') {
    window.sendQuickMessage = sendQuickMessage;
}

// (Optional) Export for tests so Jest can import it without touching window.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sendQuickMessage };
}


// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.prasadChatbot = new PrasadAIChatbot();
});