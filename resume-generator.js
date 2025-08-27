// Resume Generator Main JavaScript
class ResumeGenerator {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {
            jobTitle: '',
            companyName: '',
            jobDescription: '',
            industry: '',
            selectedExperiences: ['krutrim', 'ola', 'here'],
            selectedSkills: [],
            resumeLength: '2',
            tone: 'executive',
            format: 'modern',
            emphasis: 'leadership',
            additionalNotes: ''
        };

        this.prasadData = {
            name: "Prasad Kavuri",
            title: "Head of AI Engineering | AI/ML Executive Leader",
            email: "vbkpkavuri@gmail.com",
            linkedin: "https://www.linkedin.com/in/pkavuri/",
            location: "Naperville, IL",

            summary: {
                executive: "Visionary AI/ML executive with 20+ years driving transformative technology strategies across enterprise platforms and AI ecosystems. Currently leading India's first Agentic AI platform (Kruti.ai) at Krutrim, achieving 50% latency reduction and 40% cost savings. Previously scaled Ola Maps to 13,000+ B2B customers with 150+ engineers while reducing infrastructure costs by 70%.",
                technical: "Senior engineering leader with deep expertise in AI/ML systems, specializing in LLM platforms, multi-model orchestration, and enterprise-scale AI deployment. Architected India's first Agentic AI platform handling millions of requests with 50% latency reduction. Expert in cloud-native architectures, MLOps, and building high-performance engineering teams."
            },

            experiences: {
                krutrim: {
                    company: "Krutrim",
                    title: "Head of AI Engineering",
                    period: "Mar 2025 - Present",
                    location: "India",
                    achievements: [
                        "Architected and launched India's first Agentic AI platform (Kruti.ai) with 200+ engineers",
                        "Achieved 50% latency reduction and 40% cost savings through multi-model LLM orchestration",
                        "Built sophisticated RAG pipelines processing millions of queries daily",
                        "Developed domain-specific AI agents across mobility, payments, and content generation",
                        "Established enterprise-grade 24/7 PaaS capabilities with comprehensive SDK/API integration",
                        "Led cross-functional teams to deliver AI solutions impacting B2B and B2C markets"
                    ]
                },
                ola: {
                    company: "Ola",
                    title: "Senior Director of Engineering",
                    period: "Sep 2023 - Feb 2025",
                    location: "Bangalore, India",
                    achievements: [
                        "Launched Ola Maps B2B platform with 150+ engineers, acquiring 13,000+ customers",
                        "Reduced infrastructure costs by 70% while scaling to millions of daily API calls",
                        "Introduced AI-powered real-time route optimization improving ETA accuracy",
                        "Built comprehensive mapping and location intelligence platform",
                        "Enabled predictive analytics for electric mobility operations",
                        "Created new recurring revenue streams through B2B platform expansion"
                    ]
                },
                here: {
                    company: "HERE Technologies",
                    title: "Director of Engineering",
                    period: "May 2005 - Aug 2023",
                    location: "Chicago, IL",
                    achievements: [
                        "18-year progression from Senior Engineer to Director, leading 85+ engineers globally",
                        "Delivered autonomous driving datasets for major automotive OEMs",
                        "Drove 50% cost reduction through strategic cloud migration initiatives",
                        "Led teams across North America, Europe, and APAC regions",
                        "Implemented DevOps practices and infrastructure-as-code across global teams",
                        "Managed P&L for multi-million dollar engineering initiatives"
                    ]
                }
            },

            skills: {
                leadership: ["Global Team Leadership (200+ engineers)", "Cross-functional Collaboration", "P&L Management", "Strategic Planning", "Executive Stakeholder Management"],
                ai_ml: ["Agentic AI Platforms", "Large Language Models (LLMs)", "Multi-model Orchestration", "RAG Pipelines", "MLOps & LLMOps", "AI Agent Development"],
                technical: ["Cloud Architecture (AWS, Azure, GCP)", "Kubernetes & Microservices", "API Development", "DevOps & CI/CD", "Infrastructure as Code"],
                business: ["B2B Platform Strategy", "Cost Optimization", "Digital Transformation", "Enterprise Integration", "Product Development"]
            }
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateProgressBar();
    }

    setupEventListeners() {
        // Experience card selection
        document.querySelectorAll('.experience-card').forEach(card => {
            card.addEventListener('click', (e) => this.toggleExperience(e));
        });

        // Skill tag selection
        document.querySelectorAll('.skill-tag input').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.updateSkills(e));
        });
    }

    toggleExperience(e) {
        const card = e.currentTarget;
        const exp = card.dataset.exp;
        card.classList.toggle('selected');

        if (card.classList.contains('selected')) {
            if (!this.formData.selectedExperiences.includes(exp)) {
                this.formData.selectedExperiences.push(exp);
            }
        } else {
            this.formData.selectedExperiences = this.formData.selectedExperiences.filter(e => e !== exp);
        }
    }

    updateSkills(e) {
        const skill = e.target.parentElement.textContent.trim();
        if (e.target.checked) {
            if (!this.formData.selectedSkills.includes(skill)) {
                this.formData.selectedSkills.push(skill);
            }
        } else {
            this.formData.selectedSkills = this.formData.selectedSkills.filter(s => s !== skill);
        }
    }

    nextStep() {
        if (this.validateStep()) {
            this.saveStepData();
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.updateView();
            }
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateView();
        }
    }

    validateStep() {
        let isValid = true;

        if (this.currentStep === 1) {
            const jobTitle = document.getElementById('jobTitle').value;
            const jobDescription = document.getElementById('jobDescription').value;

            if (!jobTitle || !jobDescription) {
                alert('Please fill in the required fields: Job Title and Job Description');
                isValid = false;
            }
        }

        return isValid;
    }

    saveStepData() {
        if (this.currentStep === 1) {
            this.formData.jobTitle = document.getElementById('jobTitle').value;
            this.formData.companyName = document.getElementById('companyName').value;
            this.formData.jobDescription = document.getElementById('jobDescription').value;
            this.formData.industry = document.getElementById('industry').value;
        } else if (this.currentStep === 3) {
            this.formData.resumeLength = document.getElementById('resumeLength').value;
            this.formData.tone = document.getElementById('tone').value;
            this.formData.format = document.getElementById('format').value;
            this.formData.emphasis = document.getElementById('emphasis').value;
            this.formData.additionalNotes = document.getElementById('additionalNotes').value;
        }

        if (this.currentStep === 3) {
            this.updateSummary();
        }
    }

    updateView() {
        // Hide all sections
        document.querySelectorAll('.form-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show current section
        document.getElementById(`step${this.currentStep}`).classList.add('active');

        // Update progress
        this.updateProgressBar();

        // Update step indicators
        document.querySelectorAll('.step').forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            if (stepNum <= this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    updateProgressBar() {
        const progress = (this.currentStep / this.totalSteps) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
    }

    updateSummary() {
        const summaryContent = document.getElementById('summaryContent');
        const company = this.formData.companyName ? `at ${this.formData.companyName}` : '';

        summaryContent.innerHTML = `
            <div class="summary-item"><strong>Target Position:</strong> ${this.formData.jobTitle} ${company}</div>
            <div class="summary-item"><strong>Industry:</strong> ${this.formData.industry || 'Not specified'}</div>
            <div class="summary-item"><strong>Experience Focus:</strong> ${this.formData.selectedExperiences.map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(', ')}</div>
            <div class="summary-item"><strong>Resume Length:</strong> ${this.formData.resumeLength} page(s)</div>
            <div class="summary-item"><strong>Tone:</strong> ${this.formData.tone.charAt(0).toUpperCase() + this.formData.tone.slice(1)}</div>
            <div class="summary-item"><strong>Format:</strong> ${this.formData.format.charAt(0).toUpperCase() + this.formData.format.slice(1)}</div>
        `;
    }

    async generateResume() {
        // Show loading overlay
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.classList.add('active');

        // Simulate AI processing with different messages
        const messages = [
            "Analyzing job requirements...",
            "Matching relevant experiences...",
            "Optimizing for ATS systems...",
            "Crafting compelling achievements...",
            "Finalizing resume structure..."
        ];

        let messageIndex = 0;
        const messageInterval = setInterval(() => {
            if (messageIndex < messages.length) {
                document.getElementById('loadingMessage').textContent = messages[messageIndex];
                messageIndex++;
            }
        }, 1000);

        // Generate resume using AI engine
        setTimeout(() => {
            clearInterval(messageInterval);
            loadingOverlay.classList.remove('active');

            // Generate and display resume
            const resume = aiEngine.generateResume(this.formData, this.prasadData);
            this.displayResume(resume);
        }, 5000);
    }

    displayResume(resumeHTML) {
        document.getElementById('resumePreview').innerHTML = resumeHTML;

        // Hide step 4 and show output
        document.getElementById('step4').style.display = 'none';
        document.getElementById('resumeOutput').style.display = 'block';

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    editResume() {
        const resumePreview = document.getElementById('resumePreview');
        resumePreview.contentEditable = true;
        resumePreview.style.border = '2px dashed #667eea';
        resumePreview.style.padding = '20px';

        // Add save button
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn btn-primary';
        saveBtn.textContent = 'Save Changes';
        saveBtn.onclick = () => {
            resumePreview.contentEditable = false;
            resumePreview.style.border = '2px solid #e2e8f0';
            saveBtn.remove();
        };

        resumePreview.parentElement.insertBefore(saveBtn, resumePreview.nextSibling);
    }

    downloadResume(format, button) {
        const resumeContent = document.getElementById('resumePreview');
        const fileName = `${this.prasadData.name.replace(' ', '_')}_Resume_${this.formData.jobTitle.replace(/\s+/g, '_')}`;

        if (format === 'pdf') {
            // Show loading state if button is provided
            let originalBtnText = '';
            if (button) {
                originalBtnText = button.innerHTML;
                button.innerHTML = '⟳ Generating PDF...';
                button.disabled = true;
            }

            // Use html2canvas to capture the resume preview as an image
            html2canvas(resumeContent, {
                scale: 2, // Higher quality
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');

                // Initialize jsPDF
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                // Calculate dimensions
                const imgWidth = 210; // A4 width in mm
                const pageHeight = 297; // A4 height in mm
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;

                // Add image to PDF
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                // Add new pages if content is longer than one page
                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                // Save the PDF
                pdf.save(`${fileName}.pdf`);

                // Restore button if it was provided
                if (button) {
                    button.innerHTML = originalBtnText;
                    button.disabled = false;
                }
            }).catch(error => {
                console.error('Error generating PDF:', error);
                alert('Error generating PDF. Please try again.');
                if (button) {
                    button.innerHTML = originalBtnText;
                    button.disabled = false;
                }
            });

        } else if (format === 'docx') {
            // Create a Blob with the HTML content
            const htmlContent = `
                <!DOCTYPE html>
                <html xmlns:o='urn:schemas-microsoft-com:office:office' 
                      xmlns:w='urn:schemas-microsoft-com:office:word' 
                      xmlns='http://www.w3.org/TR/REC-html40'>
                <head>
                    <meta charset='utf-8'>
                    <title>${this.prasadData.name} - Resume</title>
                    <style>
                        body { font-family: Calibri, Arial, sans-serif; line-height: 1.6; color: #333; }
                        h1 { font-size: 24pt; color: #2c3e50; }
                        h2 { font-size: 14pt; color: #2c3e50; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
                        h3 { font-size: 12pt; color: #444; }
                        h4 { font-size: 11pt; color: #666; }
                        .exp-header { margin-bottom: 10px; }
                        .exp-date { color: #666; font-size: 10pt; }
                        ul { margin: 10px 0; padding-left: 20px; }
                        li { margin-bottom: 5px; }
                        strong { font-weight: bold; }
                    </style>
                </head>
                <body>
                    ${resumeContent.innerHTML}
                </body>
                </html>
            `;

            const blob = new Blob(['\ufeff', htmlContent], {
                type: 'application/msword'
            });

            // Create download link
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = `${fileName}.doc`;

            // Trigger download
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            // Clean up
            setTimeout(() => URL.revokeObjectURL(downloadLink.href), 100);
        }
    }

    regenerate() {
        this.generateResume();
    }

    startOver() {
        this.currentStep = 1;
        this.formData = {
            jobTitle: '',
            companyName: '',
            jobDescription: '',
            industry: '',
            selectedExperiences: ['krutrim', 'ola', 'here'],
            selectedSkills: [],
            resumeLength: '2',
            tone: 'executive',
            format: 'modern',
            emphasis: 'leadership',
            additionalNotes: ''
        };

        // Reset form
        document.getElementById('jobTitle').value = '';
        document.getElementById('companyName').value = '';
        document.getElementById('jobDescription').value = '';
        document.getElementById('industry').value = '';

        // Reset view
        document.getElementById('resumeOutput').style.display = 'none';
        document.getElementById('step1').style.display = 'block';
        this.updateView();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.resumeGenerator = new ResumeGenerator();
});