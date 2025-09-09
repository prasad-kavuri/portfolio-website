// multimodal-assistant.e2e.spec.js
// End-to-end tests for Multi-Modal AI Assistant

const { test, expect } = require('@playwright/test');

test.describe('Multi-Modal AI Assistant E2E Tests', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to the assistant
        await page.goto('/multimodal-assistant.html');

        // Wait for the page to load
        await page.waitForSelector('.container');
        await page.waitForSelector('#analyzeBtn');

        // Wait for initialization to complete
        await page.waitForFunction(() => window.multiModalAssistant !== undefined, { timeout: 10000 });
    });

    test('should load the assistant with correct elements', async ({ page }) => {
        // Check header elements
        await expect(page.locator('h1')).toContainText('Multi-Modal AI Assistant');
        await expect(page.locator('.subtitle')).toBeVisible();

        // Check navigation link
        await expect(page.locator('.nav-back')).toBeVisible();
        await expect(page.locator('.nav-back')).toContainText('Back to Portfolio');

        // Check demo mode cards
        const modeCards = page.locator('.mode-card');
        await expect(modeCards).toHaveCount(4);

        // Check that image analysis is active by default
        await expect(page.locator('.mode-card.active')).toContainText('Image Analysis');

        // Check main interface elements
        await expect(page.locator('#textInput')).toBeVisible();
        await expect(page.locator('#fileInput')).toBeVisible();
        await expect(page.locator('#analyzeBtn')).toBeVisible();
        await expect(page.locator('#clearBtn')).toBeVisible();

        // Check file drop zone
        await expect(page.locator('#fileDropZone')).toBeVisible();
        await expect(page.locator('.drop-zone-content')).toContainText('Drag and drop files here');
    });

    test('should switch between demo modes', async ({ page }) => {
        // Click on document intelligence mode
        await page.locator('[data-mode="document-intelligence"]').click();
        await expect(page.locator('[data-mode="document-intelligence"]')).toHaveClass(/active/);

        // Check that placeholder text updates
        const placeholder = await page.locator('#textInput').getAttribute('placeholder');
        expect(placeholder).toContain('document');

        // Click on visual Q&A mode
        await page.locator('[data-mode="visual-qa"]').click();
        await expect(page.locator('[data-mode="visual-qa"]')).toHaveClass(/active/);

        // Click on multimodal fusion mode
        await page.locator('[data-mode="multimodal-fusion"]').click();
        await expect(page.locator('[data-mode="multimodal-fusion"]')).toHaveClass(/active/);

        // Click back to image analysis
        await page.locator('[data-mode="image-analysis"]').click();
        await expect(page.locator('[data-mode="image-analysis"]')).toHaveClass(/active/);
    });

    test('should handle text input', async ({ page }) => {
        // Enter text in the input
        const testText = 'Analyze this image for objects and colors';
        await page.fill('#textInput', testText);

        // Verify text was entered
        const inputValue = await page.locator('#textInput').inputValue();
        expect(inputValue).toBe(testText);

        // Button should be enabled with text input
        await expect(page.locator('#analyzeBtn')).not.toBeDisabled();
    });

    test('should handle drag and drop zone interactions', async ({ page }) => {
        const dropZone = page.locator('#fileDropZone');

        // Test hover state
        await dropZone.hover();
        await expect(dropZone).toBeVisible();

        // Test that drop zone responds to interaction
        await dropZone.click();
        // This should trigger the file input
        await expect(page.locator('#fileInput')).toBeVisible();
    });

    test('should clear all content', async ({ page }) => {
        // Add some text
        await page.fill('#textInput', 'Test content to clear');

        // Click clear button
        await page.click('#clearBtn');

        // Check that text input is cleared
        const inputValue = await page.locator('#textInput').inputValue();
        expect(inputValue).toBe('');

        // Check that results show welcome message
        await expect(page.locator('.welcome-message')).toBeVisible();

        // Check that metrics section is hidden
        const metricsVisible = await page.locator('#metricsSection').isVisible();
        expect(metricsVisible).toBe(false);
    });

    test('should handle advanced options', async ({ page }) => {
        // Open advanced options
        await page.locator('.advanced-options summary').click();

        // Check options are visible
        await expect(page.locator('#modelSelect')).toBeVisible();
        await expect(page.locator('#confidenceThreshold')).toBeVisible();
        await expect(page.locator('#maxResults')).toBeVisible();

        // Change model selection
        await page.selectOption('#modelSelect', 'florence-2');
        const selectedValue = await page.locator('#modelSelect').inputValue();
        expect(selectedValue).toBe('florence-2');

        // Adjust confidence threshold
        await page.locator('#confidenceThreshold').fill('0.8');
        await expect(page.locator('#confidenceValue')).toContainText('0.8');

        // Change max results
        await page.selectOption('#maxResults', '10');
        const maxResultsValue = await page.locator('#maxResults').inputValue();
        expect(maxResultsValue).toBe('10');
    });

    test('should load example scenarios', async ({ page }) => {
        // Click on business card example
        await page.locator('[data-example="business-card"]').click();

        // Should switch to document intelligence mode
        await expect(page.locator('[data-mode="document-intelligence"]')).toHaveClass(/active/);

        // Should populate text input
        const inputValue = await page.locator('#textInput').inputValue();
        expect(inputValue).toContain('contact information');

        // Try chart analysis example
        await page.locator('[data-example="chart-analysis"]').click();

        // Should switch to visual Q&A mode
        await expect(page.locator('[data-mode="visual-qa"]')).toHaveClass(/active/);

        // Should populate with chart-related text
        const chartInputValue = await page.locator('#textInput').inputValue();
        expect(chartInputValue).toContain('chart');
    });

    test('should perform demo analysis with text input', async ({ page }) => {
        // Add text input
        await page.fill('#textInput', 'Test analysis query');

        // Click analyze button
        const analyzePromise = page.click('#analyzeBtn');

        // Should show loading state
        await expect(page.locator('#loadingSpinner')).toBeVisible();
        await expect(page.locator('#analyzeText')).toContainText('Processing');

        // Wait for processing to complete
        await analyzePromise;

        // Wait for processing to finish
        await page.waitForFunction(
            () => !document.getElementById('loadingSpinner') ||
                document.getElementById('loadingSpinner').style.display === 'none',
            { timeout: 15000 }
        );

        // Should show results
        await expect(page.locator('#resultsContainer')).toBeVisible();

        // Should show metrics
        await expect(page.locator('#metricsSection')).toBeVisible();
    });

    test('should be responsive on mobile viewport', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        // Check that main elements are still visible
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('#textInput')).toBeVisible();
        await expect(page.locator('#analyzeBtn')).toBeVisible();

        // Mode cards should be stacked vertically
        const modeCards = page.locator('.mode-card');
        const firstCard = modeCards.first();
        const secondCard = modeCards.nth(1);

        const firstCardBox = await firstCard.boundingBox();
        const secondCardBox = await secondCard.boundingBox();

        // Second card should be below first card on mobile
        expect(secondCardBox.y).toBeGreaterThan(firstCardBox.y);
    });

    test('should handle keyboard navigation', async ({ page }) => {
        // Test text input focus
        await page.locator('#textInput').focus();
        await page.keyboard.type('Keyboard input test');

        const inputValue = await page.locator('#textInput').inputValue();
        expect(inputValue).toBe('Keyboard input test');

        // Test that tab navigation works (don't assume specific focus order)
        await page.keyboard.press('Tab');
        const focusedElement = await page.evaluate(() => document.activeElement.id);
        // Just verify that some element has focus after tab
        expect(focusedElement).toBeTruthy();
    });

    test('should show welcome message initially', async ({ page }) => {
        // Check welcome message is displayed
        await expect(page.locator('.welcome-message')).toBeVisible();
        await expect(page.locator('.welcome-message h4')).toContainText('Welcome');

        // Check feature list is shown - use proper count check
        const featureCount = await page.locator('.feature-item').count();
        expect(featureCount).toBeGreaterThan(0);

        // Metrics should be hidden initially
        const metricsVisible = await page.locator('#metricsSection').isVisible();
        expect(metricsVisible).toBe(false);
    });

    test('should handle footer links', async ({ page }) => {
        // Check footer is visible
        await expect(page.locator('.footer')).toBeVisible();

        // Check footer links - use proper count check
        const linkCount = await page.locator('.footer-links a').count();
        expect(linkCount).toBeGreaterThan(0);

        // Test portfolio link
        const portfolioLink = page.locator('.footer-links a').first();
        await expect(portfolioLink).toHaveAttribute('href', 'index.html');
    });

    test('should display technical information', async ({ page }) => {
        // Open technical info section
        await page.locator('.technical-info summary').click();

        // Check that technical details are visible
        await expect(page.locator('.tech-details')).toBeVisible();
        await expect(page.locator('.tech-details')).toContainText('Transformers.js');
        await expect(page.locator('.tech-details')).toContainText('Florence-2');
        await expect(page.locator('.tech-details')).toContainText('browser');
        await expect(page.locator('.tech-details')).toContainText('Privacy & Performance');
    });
});