// Agent Mock Data - Realistic sample data for agent responses
const AGENT_MOCK_DATA = {
    analyzer: {
        findings: {
            performance: [
                "Large bundle size (2.3MB) causing slow initial load",
                "Unoptimized images increasing page weight by 40%",
                "No lazy loading implemented for below-fold content",
                "Critical render path blocked by 6 synchronous scripts",
                "Time to First Contentful Paint exceeds 3 seconds"
            ],
            seo: [
                "Missing meta descriptions on 12 pages",
                "Duplicate title tags found on product pages",
                "No structured data markup for rich snippets",
                "Internal linking structure needs optimization",
                "Missing alt text on 23% of images"
            ],
            accessibility: [
                "Color contrast ratio below 4.5:1 on buttons",
                "No skip navigation links for keyboard users",
                "Form fields missing proper labels",
                "Images lacking descriptive alt attributes",
                "No ARIA landmarks for screen readers"
            ],
            technical: [
                "No Content Security Policy headers",
                "Mixed HTTP/HTTPS content warnings",
                "Missing robots.txt file",
                "No sitemap.xml present",
                "Cache headers not optimized"
            ]
        },
        categories: ["Performance", "SEO", "Accessibility", "Security", "Technical"]
    },

    researcher: {
        recommendations: {
            performance: [
                "Implement code splitting and tree shaking to reduce bundle size",
                "Use WebP format for images with fallbacks",
                "Add intersection observer API for lazy loading",
                "Implement critical CSS inlining",
                "Use HTTP/2 server push for critical resources"
            ],
            seo: [
                "Create unique, descriptive meta descriptions for each page",
                "Implement canonical URLs to prevent duplicate content",
                "Add JSON-LD structured data for better search visibility",
                "Optimize internal linking with descriptive anchor text",
                "Implement proper heading hierarchy (H1-H6)"
            ],
            accessibility: [
                "Use WCAG AA compliant color combinations",
                "Add skip links and keyboard navigation support",
                "Implement proper form labeling and error handling",
                "Add ARIA labels and landmarks for screen readers",
                "Ensure minimum 44px touch targets on mobile"
            ]
        },
        sources: [
            "Web.dev Performance Best Practices",
            "Google SEO Starter Guide 2024",
            "WCAG 2.1 Guidelines",
            "Mozilla Developer Network",
            "Core Web Vitals Documentation",
            "Schema.org Structured Data",
            "Lighthouse Performance Audits"
        ]
    },

    strategist: {
        priorities: [
            {
                title: "Critical Performance Optimization",
                description: "Address core web vitals and loading performance issues",
                impact: "High",
                effort: "Medium",
                timeline: "2-4 weeks",
                tasks: [
                    "Implement image optimization and WebP conversion",
                    "Add lazy loading for below-fold content",
                    "Optimize critical render path",
                    "Enable gzip compression and caching"
                ]
            },
            {
                title: "SEO Foundation Improvements",
                description: "Fix technical SEO issues and improve search visibility",
                impact: "High",
                effort: "Low",
                timeline: "1-2 weeks",
                tasks: [
                    "Add missing meta descriptions",
                    "Fix duplicate title tags",
                    "Implement structured data markup",
                    "Create and submit sitemap"
                ]
            },
            {
                title: "Accessibility Compliance",
                description: "Ensure WCAG 2.1 AA compliance for better user experience",
                impact: "Medium",
                effort: "Medium",
                timeline: "3-4 weeks",
                tasks: [
                    "Fix color contrast issues",
                    "Add proper ARIA labels",
                    "Implement keyboard navigation",
                    "Add skip links and landmarks"
                ]
            },
            {
                title: "Security Hardening",
                description: "Implement security best practices and headers",
                impact: "Medium",
                effort: "Low",
                timeline: "1 week",
                tasks: [
                    "Add Content Security Policy",
                    "Implement HTTPS everywhere",
                    "Add security headers",
                    "Fix mixed content warnings"
                ]
            }
        ],
        timeline: "6-8 weeks total implementation",
        estimatedCost: "$15,000 - $25,000",
        resourcesNeeded: "1 Frontend Developer, 1 SEO Specialist"
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AGENT_MOCK_DATA;
}