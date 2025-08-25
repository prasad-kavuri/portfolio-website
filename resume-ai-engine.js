// Resume AI Engine - Intelligent Resume Generation
class ResumeAIEngine {
    constructor() {
        this.keywords = {
            ai_ml: ['AI', 'ML', 'Machine Learning', 'Deep Learning', 'LLM', 'Neural Networks', 'NLP', 'Computer Vision', 'Transformer', 'BERT', 'GPT', 'RAG', 'Embeddings', 'Vector Search', 'MLOps', 'Model Training', 'Fine-tuning'],
            leadership: ['Led', 'Managed', 'Directed', 'Oversaw', 'Spearheaded', 'Championed', 'Orchestrated', 'Coordinated', 'Drove', 'Established', 'Built', 'Scaled', 'Transformed'],
            achievements: ['Achieved', 'Delivered', 'Reduced', 'Increased', 'Improved', 'Optimized', 'Saved', 'Generated', 'Launched', 'Implemented', 'Accelerated', 'Enhanced'],
            technical: ['Architected', 'Developed', 'Engineered', 'Designed', 'Implemented', 'Deployed', 'Integrated', 'Automated', 'Optimized', 'Migrated', 'Configured'],
            business: ['Revenue', 'ROI', 'Cost Reduction', 'Efficiency', 'Growth', 'Scale', 'Performance', 'Optimization', 'Strategy', 'Transformation', 'Innovation']
        };
    }

    analyzeJobDescription(jobDescription) {
        const analysis = {
            keywords: [],
            skills: [],
            requirements: [],
            focus: ''
        };

        // Extract keywords
        const desc = jobDescription.toLowerCase();

        // Determine focus area
        if (desc.includes('ai') || desc.includes('machine learning') || desc.includes('llm')) {
            analysis.focus = 'ai_ml';
        } else if (desc.includes('leadership') || desc.includes('director') || desc.includes('head')) {
            analysis.focus = 'leadership';
        } else if (desc.includes('architect') || desc.includes('technical')) {
            analysis.focus = 'technical';
        } else {
            analysis.focus = 'balanced';
        }

        // Extract key requirements
        const sentences = jobDescription.split(/[.!?]+/);
        sentences.forEach(sentence => {
            if (sentence.includes('required') || sentence.includes('must have')) {
                analysis.requirements.push(sentence.trim());
            }
        });

        return analysis;
    }

    generateResume(formData, prasadData) {
        const jobAnalysis = this.analyzeJobDescription(formData.jobDescription);
        const tone = formData.tone;
        const emphasis = formData.emphasis;

        // Select appropriate summary
        let summary = tone === 'technical' ? prasadData.summary.technical : prasadData.summary.executive;

        // Customize summary based on job
        if (formData.companyName) {
            summary = this.customizeSummary(summary, formData.jobTitle, formData.companyName, jobAnalysis);
        }

        // Build experience section
        const experiences = this.buildExperiences(formData.selectedExperiences, prasadData.experiences, jobAnalysis, emphasis);

        // Build skills section
        const skills = this.buildSkills(prasadData.skills, jobAnalysis, formData.selectedSkills);

        // Generate HTML
        return this.generateHTML(prasadData, summary, experiences, skills, formData.format);
    }

    customizeSummary(summary, jobTitle, company, analysis) {
        let customized = summary;

        // Add targeted opening if company is specified
        if (company) {
            const opening = `Accomplished ${jobTitle} candidate with proven expertise aligned to ${company}'s needs. `;
            customized = opening + summary;
        }

        // Emphasize relevant keywords based on analysis
        if (analysis.focus === 'ai_ml') {
            customized = customized.replace('AI/ML', '<strong>AI/ML</strong>');
            customized = customized.replace('LLM', '<strong>LLM</strong>');
        }

        return customized;
    }

    buildExperiences(selected, experiences, analysis, emphasis) {
        let experienceHTML = '';

        selected.forEach(exp => {
            if (experiences[exp]) {
                const expData = experiences[exp];
                let achievements = [...expData.achievements];

                // Prioritize achievements based on emphasis
                if (emphasis === 'leadership') {
                    achievements = this.prioritizeLeadership(achievements);
                } else if (emphasis === 'technical') {
                    achievements = this.prioritizeTechnical(achievements);
                } else if (emphasis === 'innovation') {
                    achievements = this.prioritizeInnovation(achievements);
                } else if (emphasis === 'results') {
                    achievements = this.prioritizeResults(achievements);
                }

                // Limit achievements based on resume length
                achievements = achievements.slice(0, 5);

                experienceHTML += `
                    <div class="experience-item">
                        <div class="exp-header">
                            <div>
                                <h3>${expData.title}</h3>
                                <h4>${expData.company} | ${expData.location}</h4>
                            </div>
                            <span class="exp-date">${expData.period}</span>
                        </div>
                        <ul class="achievements">
                            ${achievements.map(a => `<li>${this.highlightKeywords(a, analysis)}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }
        });

        return experienceHTML;
    }

    prioritizeLeadership(achievements) {
        return achievements.sort((a, b) => {
            const aScore = this.countKeywords(a, this.keywords.leadership);
            const bScore = this.countKeywords(b, this.keywords.leadership);
            return bScore - aScore;
        });
    }

    prioritizeTechnical(achievements) {
        return achievements.sort((a, b) => {
            const aScore = this.countKeywords(a, this.keywords.technical);
            const bScore = this.countKeywords(b, this.keywords.technical);
            return bScore - aScore;
        });
    }

    prioritizeInnovation(achievements) {
        return achievements.sort((a, b) => {
            const innovationKeywords = ['first', 'innovative', 'breakthrough', 'pioneered', 'launched', 'created'];
            const aScore = this.countKeywords(a, innovationKeywords);
            const bScore = this.countKeywords(b, innovationKeywords);
            return bScore - aScore;
        });
    }

    prioritizeResults(achievements) {
        return achievements.sort((a, b) => {
            const aScore = this.countKeywords(a, this.keywords.business);
            const bScore = this.countKeywords(b, this.keywords.business);
            return bScore - aScore;
        });
    }

    countKeywords(text, keywords) {
        let count = 0;
        keywords.forEach(keyword => {
            if (text.toLowerCase().includes(keyword.toLowerCase())) {
                count++;
            }
        });
        return count;
    }

    highlightKeywords(text, analysis) {
        // Highlight numbers and percentages
        text = text.replace(/(\d+%|\d+\+|\$[\d,]+M?|\d+[KM]?\+?)/g, '<strong>$1</strong>');

        // Highlight key action words
        this.keywords.achievements.forEach(keyword => {
            const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
            text = text.replace(regex, '<strong>$1</strong>');
        });

        return text;
    }

    buildSkills(skillsData, analysis, selectedSkills) {
        const categories = [];

        // AI/ML Skills
        if (analysis.focus === 'ai_ml' || selectedSkills.includes('Agentic AI')) {
            categories.push({
                title: 'AI/ML Technologies',
                skills: skillsData.ai_ml
            });
        }

        // Leadership Skills
        categories.push({
            title: 'Leadership & Management',
            skills: skillsData.leadership
        });

        // Technical Skills
        categories.push({
            title: 'Technical Expertise',
            skills: skillsData.technical
        });

        // Business Skills
        if (analysis.focus === 'leadership' || analysis.focus === 'balanced') {
            categories.push({
                title: 'Business & Strategy',
                skills: skillsData.business
            });
        }

        return categories;
    }

    generateHTML(prasadData, summary, experiences, skills, format) {
        const styles = this.getResumeStyles(format);

        return `
            <div class="resume-content" style="${styles.container}">
                <!-- Header -->
                <div class="resume-header" style="${styles.header}">
                    <h1 style="${styles.name}">${prasadData.name}</h1>
                    <p style="${styles.title}">${prasadData.title}</p>
                    <div class="contact-info" style="${styles.contact}">
                        <span>${prasadData.email}</span> | 
                        <span>${prasadData.linkedin}</span> | 
                        <span>${prasadData.location}</span>
                    </div>
                </div>
                
                <!-- Summary -->
                <div class="resume-section" style="${styles.section}">
                    <h2 style="${styles.sectionTitle}">EXECUTIVE SUMMARY</h2>
                    <p style="${styles.summary}">${summary}</p>
                </div>
                
                <!-- Experience -->
                <div class="resume-section" style="${styles.section}">
                    <h2 style="${styles.sectionTitle}">PROFESSIONAL EXPERIENCE</h2>
                    ${experiences}
                </div>
                
                <!-- Skills -->
                <div class="resume-section" style="${styles.section}">
                    <h2 style="${styles.sectionTitle}">CORE COMPETENCIES</h2>
                    <div class="skills-grid" style="${styles.skillsGrid}">
                        ${skills.map(category => `
                            <div class="skill-category">
                                <h3 style="${styles.skillTitle}">${category.title}</h3>
                                <p style="${styles.skillList}">${category.skills.join(' • ')}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Education -->
                <div class="resume-section" style="${styles.section}">
                    <h2 style="${styles.sectionTitle}">EDUCATION</h2>
                    <p style="${styles.education}">
                        <strong>Master of Science in Computer Science</strong><br>
                        Focus: Artificial Intelligence & Machine Learning<br>
                        <strong>Bachelor of Technology in Computer Engineering</strong>
                    </p>
                </div>
                
                <!-- Key Achievements -->
                <div class="resume-section" style="${styles.section}">
                    <h2 style="${styles.sectionTitle}">KEY ACHIEVEMENTS</h2>
                    <ul style="${styles.achievementList}">
                        <li>Launched India's first Agentic AI platform serving millions of users</li>
                        <li>Scaled engineering organizations from startup to 200+ engineers</li>
                        <li>Delivered 50-70% cost reductions across multiple organizations</li>
                        <li>Built platforms generating $10M+ in recurring revenue</li>
                        <li>Led global teams across 3 continents with 24/7 operations</li>
                    </ul>
                </div>
            </div>
        `;
    }

    getResumeStyles(format) {
        const baseStyles = {
            container: 'font-family: "Calibri", Arial, sans-serif; line-height: 1.6; color: #333;',
            header: 'text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #2c3e50;',
            name: 'font-size: 28px; font-weight: bold; margin: 0; color: #2c3e50;',
            title: 'font-size: 18px; color: #666; margin: 5px 0;',
            contact: 'font-size: 14px; color: #666; margin-top: 10px;',
            section: 'margin-bottom: 25px;',
            sectionTitle: 'font-size: 16px; font-weight: bold; color: #2c3e50; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 15px;',
            summary: 'font-size: 14px; line-height: 1.8; text-align: justify;',
            education: 'font-size: 14px; line-height: 1.6;',
            skillsGrid: 'display: grid; grid-template-columns: 1fr 1fr; gap: 20px;',
            skillTitle: 'font-size: 14px; font-weight: bold; color: #444; margin-bottom: 5px;',
            skillList: 'font-size: 13px; color: #666; line-height: 1.5;',
            achievementList: 'font-size: 14px; line-height: 1.8; padding-left: 20px;'
        };

        if (format === 'executive') {
            baseStyles.name = 'font-size: 32px; font-weight: 300; margin: 0; color: #1a1a1a; letter-spacing: 1px;';
            baseStyles.sectionTitle = 'font-size: 14px; font-weight: 600; color: #1a1a1a; letter-spacing: 2px; text-transform: uppercase;';
        } else if (format === 'creative') {
            baseStyles.header = 'background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px;';
            baseStyles.name = 'font-size: 32px; font-weight: bold; margin: 0; color: white;';
            baseStyles.title = 'font-size: 18px; color: rgba(255,255,255,0.9); margin: 5px 0;';
            baseStyles.contact = 'font-size: 14px; color: rgba(255,255,255,0.8); margin-top: 10px;';
        }

        return baseStyles;
    }
}

// Initialize AI Engine and make it globally available
window.aiEngine = new ResumeAIEngine();