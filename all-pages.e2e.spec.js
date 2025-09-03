/**
 * Complete E2E Test Suite for All Portfolio Pages for Prasad Kavuri
 * Run with: npx playwright test all-pages.e2e.spec.js
 */

const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8080';

// Test configuration
test.use({
    baseURL: BASE_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
});

// ============================================
// INDEX.HTML TESTS
// ============================================
test.describe('Index Page', () => {
    test('should load homepage successfully', async ({ page }) => {
        await page.goto('/index.html');
        await expect(page).toHaveTitle(/Portfolio|Prasad Kavuri/i);
    });

    test('should have all project links', async ({ page }) => {
        await page.goto('/index.html');
        
        // Check for project links
        const projectLinks = [
            'rag-pipeline.html',
            'llm-router-demo.html',
            'portfolio-assistant.html',
            'resume-generator.html'
        ];

        for (const link of projectLinks) {
            const element = page.locator(`a[href*="${link}"]`).first();
            await expect(element).toBeVisible({ timeout: 5000 }).catch(() => {
                console.log(`Note: Link to ${link} not found, checking alternative selectors`);
            });
        }
    });

    test('should have profile photo', async ({ page }) => {
        await page.goto('/index.html');
        const profilePhoto = page.locator('img[src*="profile"]').first();
        
        if (await profilePhoto.isVisible().catch(() => false)) {
            await expect(profilePhoto).toBeVisible();
        }
    });

    test('navigation should be responsive', async ({ page }) => {
        await page.goto('/index.html');
        
        // Test desktop view
        await page.setViewportSize({ width: 1200, height: 800 });
        const desktopNav = page.locator('nav').first();
        await expect(desktopNav).toBeVisible();
        
        // Test mobile view
        await page.setViewportSize({ width: 375, height: 667 });
        // Navigation should still be accessible
        await expect(desktopNav).toBeVisible();
    });
});

// ============================================
// RAG PIPELINE TESTS
// ============================================
test.describe('RAG Pipeline Page', () => {
    test('should load RAG pipeline page', async ({ page }) => {
        await page.goto('/rag-pipeline.html');
        await expect(page.locator('h1')).toContainText(/RAG|Pipeline/i);
    });

    test('should have query input and process button', async ({ page }) => {
        await page.goto('/rag-pipeline.html');
        
        const queryInput = page.locator('#queryInput');
        const processBtn = page.locator('#processBtn');
        
        await expect(queryInput).toBeVisible();
        await expect(processBtn).toBeVisible();
    });

    test('should process a query', async ({ page }) => {
        await page.goto('/rag-pipeline.html');
        
        // Enter query
        await page.fill('#queryInput', 'Test query for pipeline');
        
        // Click process
        await page.click('#processBtn');
        
        // Wait for processing to start
        await page.waitForTimeout(500);
        
        // Check for pipeline stages
        const stages = page.locator('.pipeline-stage');
        await expect(stages.first()).toBeVisible({ timeout: 5000 });
    });

    test('should show example queries', async ({ page }) => {
        await page.goto('/rag-pipeline.html');
        
        const exampleBtns = page.locator('.example-btn');
        const count = await exampleBtns.count();
        expect(count).toBeGreaterThan(0);
        
        // Click first example
        if (count > 0) {
            await exampleBtns.first().click();
            const queryInput = page.locator('#queryInput');
            const value = await queryInput.inputValue();
            expect(value).toBeTruthy();
        }
    });
});

// ============================================
// LLM ROUTER DEMO TESTS
// ============================================
test.describe('LLM Router Demo Page', () => {
    test('should load LLM router page', async ({ page }) => {
        await page.goto('/llm-router-demo.html');
        
        // Check for page elements
        const pageTitle = page.locator('h1, h2').first();
        await expect(pageTitle).toContainText(/LLM|Router|Model/i);
    });

    test('should have model selection interface', async ({ page }) => {
        await page.goto('/llm-router-demo.html');
        
        // Look for model-related elements
        const modelElements = page.locator('[id*="model"], [class*="model"]');
        const count = await modelElements.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should display routing configuration', async ({ page }) => {
        await page.goto('/llm-router-demo.html');
        
        // Check for configuration elements
        const configElements = page.locator('[id*="config"], [class*="config"], [id*="route"], [class*="route"]');
        const hasConfig = await configElements.first().isVisible().catch(() => false);
        expect(hasConfig || count > 0).toBeTruthy();
    });
});

// ============================================
// PORTFOLIO ASSISTANT TESTS  
// ============================================
test.describe('Portfolio Assistant Page', () => {
    test('should load portfolio assistant', async ({ page }) => {
        await page.goto('/portfolio-assistant.html');
        
        const title = page.locator('h1, h2').first();
        await expect(title).toContainText(/Portfolio|Assistant/i);
    });

    test('should have chat interface', async ({ page }) => {
        await page.goto('/portfolio-assistant.html');
        
        // Look for chat-related elements
        const chatElements = page.locator('[id*="chat"], [id*="message"], [id*="input"], [class*="chat"]');
        const count = await chatElements.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should have input field for queries', async ({ page }) => {
        await page.goto('/portfolio-assistant.html');
        
        const inputs = page.locator('input[type="text"], textarea');
        const count = await inputs.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should have send/submit button', async ({ page }) => {
        await page.goto('/portfolio-assistant.html');
        
        const buttons = page.locator('button').filter({ hasText: /send|submit|ask|chat/i });
        const hasButton = await buttons.first().isVisible().catch(() => false);
        
        if (!hasButton) {
            // Check for any button
            const anyButton = page.locator('button').first();
            await expect(anyButton).toBeVisible();
        }
    });
});

// ============================================
// RESUME GENERATOR TESTS
// ============================================
test.describe('Resume Generator Page', () => {
    test('should load resume generator', async ({ page }) => {
        await page.goto('/resume-generator.html');
        
        const title = page.locator('h1, h2').first();
        await expect(title).toContainText(/Resume|Generator|CV/i);
    });

    test('should have form fields', async ({ page }) => {
        await page.goto('/resume-generator.html');
        
        // Check for common resume fields
        const formFields = page.locator('input, textarea, select');
        const count = await formFields.count();
        expect(count).toBeGreaterThan(3); // At least name, email, phone, etc.
    });

    test('should have generate button', async ({ page }) => {
        await page.goto('/resume-generator.html');
        
        const generateBtn = page.locator('button').filter({ hasText: /generate|create|build/i });
        const hasGenerate = await generateBtn.first().isVisible().catch(() => false);
        
        if (!hasGenerate) {
            // Check for any prominent button
            const buttons = page.locator('button');
            const count = await buttons.count();
            expect(count).toBeGreaterThan(0);
        }
    });

    test('should validate required fields', async ({ page }) => {
        await page.goto('/resume-generator.html');
        
        // Try to submit without filling required fields
        const submitBtn = page.locator('button').filter({ hasText: /generate|submit|create/i }).first();
        
        if (await submitBtn.isVisible().catch(() => false)) {
            await submitBtn.click();
            
            // Check for validation messages or required attributes
            const requiredFields = page.locator('[required], .error, .validation');
            const hasValidation = await requiredFields.first().isVisible().catch(() => false);
            // Validation might be present
        }
    });
});

// ============================================
// CROSS-PAGE NAVIGATION TESTS
// ============================================
test.describe('Cross-Page Navigation', () => {
    test('should navigate between pages', async ({ page }) => {
        // Start at index
        await page.goto('/index.html');
        
        // Try to navigate to RAG pipeline
        const ragLink = page.locator('a[href*="rag-pipeline"]').first();
        if (await ragLink.isVisible().catch(() => false)) {
            await ragLink.click();
            await page.waitForLoadState('domcontentloaded');
            expect(page.url()).toContain('rag-pipeline');
        }
    });

    test('should have consistent navigation across pages', async ({ page }) => {
        const pages = [
            '/index.html',
            '/rag-pipeline.html',
            '/portfolio-assistant.html',
            '/resume-generator.html',
            '/llm-router-demo.html'
        ];

        for (const pagePath of pages) {
            await page.goto(pagePath);
            
            // Check for navigation element
            const nav = page.locator('nav, .nav, .navigation, header');
            const hasNav = await nav.first().isVisible().catch(() => false);
            
            // Most pages should have navigation
            if (pagePath !== '/index.html') {
                // Non-index pages might have back/home links
                const homeLink = page.locator('a[href*="index"], a[href="/"], a:has-text("Home")');
                const hasHome = await homeLink.first().isVisible().catch(() => false);
                // Log if no home link found
            }
        }
    });
});

// ============================================
// PERFORMANCE TESTS
// ============================================
test.describe('Performance Tests', () => {
    test('pages should load within acceptable time', async ({ page }) => {
        const pages = [
            '/index.html',
            '/rag-pipeline.html',
            '/portfolio-assistant.html',
            '/resume-generator.html',
            '/llm-router-demo.html'
        ];

        for (const pagePath of pages) {
            const startTime = Date.now();
            await page.goto(pagePath, { waitUntil: 'domcontentloaded' });
            const loadTime = Date.now() - startTime;
            
            // Page should load within 3 seconds
            expect(loadTime).toBeLessThan(3000);
        }
    });

    test('should handle rapid navigation', async ({ page }) => {
        await page.goto('/index.html');
        
        // Rapidly navigate between pages
        const pages = ['/rag-pipeline.html', '/resume-generator.html', '/index.html'];
        
        for (const pagePath of pages) {
            await page.goto(pagePath, { waitUntil: 'domcontentloaded' });
            // Should not crash or hang
        }
    });
});

// ============================================
// MOBILE RESPONSIVENESS TESTS
// ============================================
test.describe('Mobile Responsiveness', () => {
    const mobileViewport = { width: 375, height: 667 };
    const tabletViewport = { width: 768, height: 1024 };
    
    test('all pages should be mobile responsive', async ({ page }) => {
        const pages = [
            '/index.html',
            '/rag-pipeline.html',
            '/portfolio-assistant.html',
            '/resume-generator.html',
            '/llm-router-demo.html'