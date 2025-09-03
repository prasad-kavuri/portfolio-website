/**
 * End-to-End Tests for RAG Pipeline using Playwright
 * Run with: npx playwright test
 */

const { test, expect } = require('@playwright/test');


test.describe('RAG Pipeline E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the RAG pipeline page
        await page.goto('/rag-pipeline.html');
        await page.waitForLoadState('networkidle');
    });

    test('Page loads successfully', async ({ page }) => {
        // Check title
        await expect(page).toHaveTitle(/RAG Pipeline/);

        // Check main elements are visible
        await expect(page.locator('#queryInput')).toBeVisible();
        await expect(page.locator('#processBtn')).toBeVisible();
        await expect(page.locator('.nav-bar')).toBeVisible();
    });

    test('Navigation links work correctly', async ({ page }) => {
        // Test home link
        const homeLink = page.locator('a[href="index.html"]').first();
        await expect(homeLink).toBeVisible();

        // Check active state on RAG Pipeline link
        const ragLink = page.locator('.nav-link.active');
        await expect(ragLink).toContainText('RAG Pipeline');
    });

    test('Query input accepts text', async ({ page }) => {
        const queryInput = page.locator('#queryInput');

        // Type in the input
        await queryInput.fill('Test query for RAG pipeline');

        // Verify the value
        await expect(queryInput).toHaveValue('Test query for RAG pipeline');
    });

    test('Example query buttons work', async ({ page }) => {
        // Click first example button
        const exampleBtn = page.locator('.example-btn').first();
        await exampleBtn.click();

        // Check if query input is populated
        const queryInput = page.locator('#queryInput');
        await expect(queryInput).not.toBeEmpty();
    });

    test('Process button triggers pipeline', async ({ page }) => {
        // Fill query
        await page.locator('#queryInput').fill('Test query');

        // Click process button
        await page.locator('#processBtn').click();

        // Wait for processing to start
        await page.waitForTimeout(500);

        // Check if button shows processing state
        const processBtn = page.locator('#processBtn');
        await expect(processBtn).toContainText('Processing');

        // Wait for completion (max 10 seconds)
        await page.waitForFunction(
            () => !document.querySelector('#processBtn').disabled,
            { timeout: 10000 }
        );

        // Check if stages are populated
        const stages = page.locator('.pipeline-stage');
        await expect(stages).toHaveCount(4);
    });

    test('Clear pipeline button works', async ({ page }) => {
        // First run a query
        await page.locator('#queryInput').fill('Test query');
        await page.locator('#processBtn').click();

        // Wait for processing
        await page.waitForTimeout(2000);

        // Click clear button
        const clearBtn = page.locator('button:has-text("Clear Pipeline")');
        await clearBtn.click();

        // Check if stages are cleared
        const stagesContainer = page.locator('#pipelineStages');
        await expect(stagesContainer).toBeEmpty();
    });

    test('Error handling for empty query', async ({ page }) => {
        // Clear input
        await page.locator('#queryInput').fill('');

        // Click process button
        await page.locator('#processBtn').click();

        // Check for error message
        const errorMessage = page.locator('#errorMessage');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText('Please enter a query');
    });

    test('Metrics panel shows after processing', async ({ page }) => {
        // Run a query
        await page.locator('#queryInput').fill('Test query');
        await page.locator('#processBtn').click();

        // Wait for processing to complete
        await page.waitForFunction(
            () => !document.querySelector('#processBtn').disabled,
            { timeout: 10000 }
        );

        // Check metrics panel is visible
        const metricsPanel = page.locator('#metricsPanel');
        await expect(metricsPanel).toBeVisible();

        // Check metrics values are populated
        const queryTime = page.locator('#queryTime');
        await expect(queryTime).not.toContainText('-');
    });

    test('Retrieved documents display correctly', async ({ page }) => {
        // Run a query
        await page.locator('#queryInput').fill('Test query');
        await page.locator('#processBtn').click();

        // Wait for processing
        await page.waitForFunction(
            () => !document.querySelector('#processBtn').disabled,
            { timeout: 10000 }
        );

        // Check documents panel
        const docsPanel = page.locator('#retrievedDocsPanel');
        await expect(docsPanel).toBeVisible();

        // Check document items
        const docItems = page.locator('.doc-item');
        await expect(docItems).toHaveCount(3); // Based on mock data
    });

    test('Keyboard shortcuts work', async ({ page }) => {
        // Fill query
        await page.locator('#queryInput').fill('Test query');

        // Press Enter to submit
        await page.locator('#queryInput').press('Enter');

        // Check if processing started
        await page.waitForTimeout(500);
        const processBtn = page.locator('#processBtn');
        await expect(processBtn).toBeDisabled();
    });

    test('Responsive design works on mobile', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        // Check if layout adapts
        const mainContent = page.locator('.main-content');
        await expect(mainContent).toBeVisible();

        // Check if navigation is still accessible
        const navBar = page.locator('.nav-bar');
        await expect(navBar).toBeVisible();
    });

    test('Multiple queries can be run sequentially', async ({ page }) => {
        // First query
        await page.locator('#queryInput').fill('First query');
        await page.locator('#processBtn').click();
        await page.waitForFunction(
            () => !document.querySelector('#processBtn').disabled,
            { timeout: 10000 }
        );

        // Clear
        await page.locator('button:has-text("Clear Pipeline")').click();

        // Second query
        await page.locator('#queryInput').fill('Second query');
        await page.locator('#processBtn').click();
        await page.waitForFunction(
            () => !document.querySelector('#processBtn').disabled,
            { timeout: 10000 }
        );

        // Verify second query completed
        const stages = page.locator('.pipeline-stage');
        await expect(stages).toHaveCount(4);
    });

    test('Knowledge base stats are displayed', async ({ page }) => {
        // Check knowledge base section
        const kbStats = page.locator('.kb-stat');
        await expect(kbStats).toHaveCount(4);

        // Verify specific stats
        await expect(page.locator('.kb-stat:has-text("Documents")')).toContainText('47 docs');
        await expect(page.locator('.kb-stat:has-text("Vector Dimensions")')).toContainText('1536');
    });

    test('Stage animations work correctly', async ({ page }) => {
        // Run a query
        await page.locator('#queryInput').fill('Test query');
        await page.locator('#processBtn').click();

        // Check if stages appear with animation
        const firstStage = page.locator('.pipeline-stage').first();
        await expect(firstStage).toBeVisible();

        // Check animation class
        const hasAnimation = await firstStage.evaluate(el => {
            const styles = window.getComputedStyle(el);
            return styles.animation !== 'none';
        });
        expect(hasAnimation).toBeTruthy();
    });

    test('Success message appears after completion', async ({ page }) => {
        // Run a query
        await page.locator('#queryInput').fill('Test query');
        await page.locator('#processBtn').click();

        // Wait for completion
        await page.waitForFunction(
            () => !document.querySelector('#processBtn').disabled,
            { timeout: 10000 }
        );

        // Check success message
        const successMessage = page.locator('#successMessage');
        await expect(successMessage).toBeVisible();
        await expect(successMessage).toContainText('Pipeline executed successfully');
    });
});

test.describe('Performance Tests', () => {
    test('Page load performance', async ({ page }) => {
        const startTime = Date.now();
        await page.goto('/rag-pipeline.html');
        await page.waitForLoadState('networkidle');
        const loadTime = Date.now() - startTime;

        // Page should load within 3 seconds
        expect(loadTime).toBeLessThan(3000);
    });

    test('Pipeline processing performance', async ({ page }) => {
        await page.goto('/rag-pipeline.html');

        // Measure processing time
        await page.locator('#queryInput').fill('Test query');

        const startTime = Date.now();
        await page.locator('#processBtn').click();

        await page.waitForFunction(
            () => !document.querySelector('#processBtn').disabled,
            { timeout: 10000 }
        );
        const processingTime = Date.now() - startTime;

        // Processing should complete within 5 seconds
        expect(processingTime).toBeLessThan(5000);
    });
});

test.describe('Accessibility Tests', () => {
    test('Keyboard navigation works', async ({ page }) => {
        await page.goto('/rag-pipeline.html');

        // Tab through interactive elements
        await page.keyboard.press('Tab');

        // Check focus is visible
        const focusedElement = await page.evaluate(() => document.activeElement.tagName);
        expect(focusedElement).toBeTruthy();
    });

    test('ARIA labels are present', async ({ page }) => {
        await page.goto('/rag-pipeline.html');

        // Check for proper labels
        const queryInput = page.locator('#queryInput');
        const label = await queryInput.evaluate(el => {
            const labelElement = document.querySelector(`label[for="${el.id}"]`);
            return labelElement ? labelElement.textContent : null;
        });
        expect(label).toBeTruthy();
    });
});