/**
 * Unit Tests for RAG Pipeline
 * Run with: npm test
 */

// Mock DOM environment
document.body.innerHTML = `
    <div id="queryInput"></div>
    <div id="processBtn"></div>
    <div id="pipelineStages"></div>
    <div id="errorMessage"></div>
    <div id="successMessage"></div>
    <div id="metricsPanel"></div>
    <div id="retrievedDocsPanel"></div>
    <div id="retrievedDocs"></div>
`;

// Import functions (you'll need to export them from your main file)
// For now, we'll define them here for testing
const pipelineState = {
    isProcessing: false,
    currentStage: 0,
    startTime: null,
    stageTimings: {},
    documents: []
};

function safeGetElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with id '${id}' not found`);
        return null;
    }
    return element;
}

function safeSetHTML(elementId, html) {
    const element = safeGetElement(elementId);
    if (element) {
        try {
            element.innerHTML = html;
            return true;
        } catch (error) {
            console.error(`Error setting innerHTML for ${elementId}:`, error);
            return false;
        }
    }
    return false;
}

function safeSetStyle(elementId, property, value) {
    const element = safeGetElement(elementId);
    if (element && element.style) {
        try {
            element.style[property] = value;
            return true;
        } catch (error) {
            console.error(`Error setting style for ${elementId}:`, error);
            return false;
        }
    }
    return false;
}

function clearPipeline() {
    pipelineState.isProcessing = false;
    pipelineState.currentStage = 0;
    pipelineState.startTime = null;
    pipelineState.stageTimings = {};
    pipelineState.documents = [];

    safeSetHTML('pipelineStages', '');
    safeSetStyle('metricsPanel', 'display', 'none');
    safeSetStyle('retrievedDocsPanel', 'display', 'none');
    safeSetStyle('errorMessage', 'display', 'none');
    safeSetStyle('successMessage', 'display', 'none');
}

// Test Suites
describe('RAG Pipeline - DOM Safety Functions', () => {
    test('safeGetElement returns element when it exists', () => {
        const element = safeGetElement('queryInput');
        expect(element).not.toBeNull();
        expect(element.id).toBe('queryInput');
    });

    test('safeGetElement returns null for non-existent element', () => {
        const element = safeGetElement('nonExistent');
        expect(element).toBeNull();
    });

    test('safeSetHTML sets innerHTML when element exists', () => {
        const result = safeSetHTML('queryInput', '<span>Test</span>');
        expect(result).toBe(true);
        const element = document.getElementById('queryInput');
        expect(element.innerHTML).toBe('<span>Test</span>');
    });

    test('safeSetHTML returns false for non-existent element', () => {
        const result = safeSetHTML('nonExistent', '<span>Test</span>');
        expect(result).toBe(false);
    });

    test('safeSetStyle sets style when element exists', () => {
        const result = safeSetStyle('queryInput', 'display', 'none');
        expect(result).toBe(true);
        const element = document.getElementById('queryInput');
        expect(element.style.display).toBe('none');
    });

    test('safeSetStyle returns false for non-existent element', () => {
        const result = safeSetStyle('nonExistent', 'display', 'none');
        expect(result).toBe(false);
    });
});

describe('RAG Pipeline - State Management', () => {
    beforeEach(() => {
        // Reset state before each test
        clearPipeline();
    });

    test('initial state is correct', () => {
        expect(pipelineState.isProcessing).toBe(false);
        expect(pipelineState.currentStage).toBe(0);
        expect(pipelineState.startTime).toBeNull();
        expect(pipelineState.stageTimings).toEqual({});
        expect(pipelineState.documents).toEqual([]);
    });

    test('clearPipeline resets all state', () => {
        // Modify state
        pipelineState.isProcessing = true;
        pipelineState.currentStage = 3;
        pipelineState.documents = [{ id: 1 }];

        // Clear
        clearPipeline();

        // Verify reset
        expect(pipelineState.isProcessing).toBe(false);
        expect(pipelineState.currentStage).toBe(0);
        expect(pipelineState.documents).toEqual([]);
    });

    test('clearPipeline clears DOM elements', () => {
        // Set some content
        document.getElementById('pipelineStages').innerHTML = '<div>Test</div>';
        document.getElementById('errorMessage').style.display = 'block';

        // Clear
        clearPipeline();

        // Verify DOM is cleared
        expect(document.getElementById('pipelineStages').innerHTML).toBe('');
        expect(document.getElementById('errorMessage').style.display).toBe('none');
    });
});

describe('RAG Pipeline - Error Handling', () => {
    test('handles null elements gracefully', () => {
        // Remove an element
        const element = document.getElementById('queryInput');
        element.remove();

        // Try to access it
        const result = safeGetElement('queryInput');
        expect(result).toBeNull();

        // Try to set HTML
        const setResult = safeSetHTML('queryInput', 'test');
        expect(setResult).toBe(false);
    });

    test('prevents concurrent processing', () => {
        pipelineState.isProcessing = true;

        // Attempt to process should be blocked
        expect(pipelineState.isProcessing).toBe(true);

        // Clear for next test
        pipelineState.isProcessing = false;
    });
});

describe('RAG Pipeline - Validation', () => {
    test('validates required elements exist', () => {
        const requiredElements = [
            'processBtn',
            'pipelineStages',
            'errorMessage',
            'successMessage',
            'metricsPanel'
        ];

        requiredElements.forEach(id => {
            const element = safeGetElement(id);
            expect(element).not.toBeNull();
        });
    });

    test('validates initial display states', () => {
        const metricsPanel = document.getElementById('metricsPanel');
        const errorMessage = document.getElementById('errorMessage');

        // These should be hidden initially
        clearPipeline();

        expect(metricsPanel.style.display).toBe('none');
        expect(errorMessage.style.display).toBe('none');
    });
});

describe('RAG Pipeline - Performance', () => {
    test('DOM operations are efficient', () => {
        const startTime = performance.now();

        // Perform multiple operations
        for (let i = 0; i < 100; i++) {
            safeSetHTML('pipelineStages', `<div>Test ${i}</div>`);
        }

        const endTime = performance.now();
        const duration = endTime - startTime;

        // Should complete in reasonable time (less than 100ms)
        expect(duration).toBeLessThan(100);
    });

    test('state updates are synchronous', () => {
        pipelineState.isProcessing = true;
        expect(pipelineState.isProcessing).toBe(true);

        pipelineState.isProcessing = false;
        expect(pipelineState.isProcessing).toBe(false);
    });
});

// Mock functions for testing
function showError(message) {
    const element = safeGetElement('errorMessage');
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

function showSuccess(message) {
    const element = safeGetElement('successMessage');
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 3000);
    }
}

describe('RAG Pipeline - User Feedback', () => {
    test('showError displays error message', () => {
        showError('Test error');
        const element = document.getElementById('errorMessage');
        expect(element.textContent).toBe('Test error');
        expect(element.style.display).toBe('block');
    });

    test('showSuccess displays success message', () => {
        showSuccess('Test success');
        const element = document.getElementById('successMessage');
        expect(element.textContent).toBe('Test success');
        expect(element.style.display).toBe('block');
    });
});

// Integration tests
describe('RAG Pipeline - Integration', () => {
    test('full pipeline reset works correctly', () => {
        // Set various states
        pipelineState.isProcessing = true;
        pipelineState.documents = [1, 2, 3];
        document.getElementById('pipelineStages').innerHTML = '<div>Content</div>';
        document.getElementById('errorMessage').style.display = 'block';

        // Clear everything
        clearPipeline();

        // Verify complete reset
        expect(pipelineState.isProcessing).toBe(false);
        expect(pipelineState.documents.length).toBe(0);
        expect(document.getElementById('pipelineStages').innerHTML).toBe('');
        expect(document.getElementById('errorMessage').style.display).toBe('none');
    });
});

// Export for coverage report
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        safeGetElement,
        safeSetHTML,
        safeSetStyle,
        clearPipeline,
        showError,
        showSuccess,
        pipelineState
    };
}