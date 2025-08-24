/**
 * Phase 6: Cross-Browser Compatibility Testing Suite
 * 
 * This test suite validates the retro-cyber-web application
 * across different browsers and versions.
 */

class CrossBrowserTestSuite {
    constructor() {
        this.testResults = {
            chrome: { passed: 0, failed: 0, tests: [] },
            firefox: { passed: 0, failed: 0, tests: [] },
            safari: { passed: 0, failed: 0, tests: [] },
            edge: { passed: 0, failed: 0, tests: [] }
        };
        
        this.currentBrowser = this.detectBrowser();
        this.startTime = Date.now();
        
        console.log(`🧪 Starting Cross-Browser Testing on ${this.currentBrowser}`);
    }
    
    detectBrowser() {
        const userAgent = navigator.userAgent;
        
        if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edge') === -1) {
            return 'chrome';
        } else if (userAgent.indexOf('Firefox') > -1) {
            return 'firefox';
        } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
            return 'safari';
        } else if (userAgent.indexOf('Edge') > -1) {
            return 'edge';
        }
        return 'unknown';
    }
    
    async runAllTests() {
        console.log('🚀 Running comprehensive cross-browser tests...');
        
        // Core functionality tests
        await this.testTerminalFunctionality();
        await this.testCSSAnimations();
        await this.testCanvasAPI();
        await this.testLocalStorage();
        await this.testPuzzleMechanics();
        
        // Browser-specific tests
        await this.testBrowserSpecificFeatures();
        
        // Performance tests
        await this.testPerformanceBaseline();
        
        this.generateReport();
    }
    
    async testTerminalFunctionality() {
        const testName = 'Terminal Command Processing';
        console.log(`🔍 Testing: ${testName}`);
        
        try {
            // Test if terminal is available
            if (!window.app || !window.app.terminal) {
                throw new Error('Terminal not available');
            }
            
            const terminal = window.app.terminal;
            
            // Test basic commands
            const commands = ['help', 'clear', 'about', 'matrix', 'glitch'];
            const results = [];
            
            for (const cmd of commands) {
                try {
                    terminal.executeCommand(cmd);
                    results.push({ command: cmd, status: 'passed' });
                } catch (error) {
                    results.push({ command: cmd, status: 'failed', error: error.message });
                }
            }
            
            const passed = results.filter(r => r.status === 'passed').length;
            const failed = results.filter(r => r.status === 'failed').length;
            
            this.recordTest(testName, passed === commands.length, {
                passed: passed,
                failed: failed,
                details: results
            });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testCSSAnimations() {
        const testName = 'CSS Animations and Effects';
        console.log(`🎨 Testing: ${testName}`);
        
        try {
            const tests = [];
            
            // Test CSS animation support
            const element = document.createElement('div');
            element.style.animation = 'test 1s ease-in-out';
            tests.push({
                name: 'CSS Animation Support',
                passed: element.style.animation !== ''
            });
            
            // Test transform support
            element.style.transform = 'translateX(10px)';
            tests.push({
                name: 'CSS Transform Support',
                passed: element.style.transform !== ''
            });
            
            // Test keyframes support
            try {
                const keyframes = new KeyframeEffect(element, [
                    { opacity: 0 },
                    { opacity: 1 }
                ], 1000);
                tests.push({
                    name: 'Web Animations API',
                    passed: keyframes instanceof KeyframeEffect
                });
            } catch (error) {
                tests.push({
                    name: 'Web Animations API',
                    passed: false,
                    error: error.message
                });
            }
            
            // Test CSS Grid support
            element.style.display = 'grid';
            tests.push({
                name: 'CSS Grid Support',
                passed: element.style.display === 'grid'
            });
            
            const allPassed = tests.every(test => test.passed);
            this.recordTest(testName, allPassed, { tests });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testCanvasAPI() {
        const testName = 'Canvas API Compatibility';
        console.log(`🖼️ Testing: ${testName}`);
        
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            const tests = [];
            
            // Test basic canvas support
            tests.push({
                name: 'Canvas Element Support',
                passed: canvas instanceof HTMLCanvasElement
            });
            
            // Test 2D context
            tests.push({
                name: '2D Context Support',
                passed: ctx instanceof CanvasRenderingContext2D
            });
            
            // Test canvas methods
            const methods = ['fillRect', 'strokeRect', 'fillText', 'arc', 'beginPath'];
            methods.forEach(method => {
                tests.push({
                    name: `Canvas ${method} method`,
                    passed: typeof ctx[method] === 'function'
                });
            });
            
            // Test performance timing
            const start = performance.now();
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(0, 0, 100, 100);
            const duration = performance.now() - start;
            
            tests.push({
                name: 'Canvas Rendering Performance',
                passed: duration < 50, // Should render in less than 50ms
                duration: duration
            });
            
            const allPassed = tests.every(test => test.passed);
            this.recordTest(testName, allPassed, { tests });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testLocalStorage() {
        const testName = 'Local Storage Functionality';
        console.log(`💾 Testing: ${testName}`);
        
        try {
            const tests = [];
            
            // Test localStorage availability
            tests.push({
                name: 'LocalStorage Available',
                passed: typeof localStorage !== 'undefined'
            });
            
            // Test write/read operations
            const testKey = 'crossBrowserTest';
            const testValue = 'testData123';
            
            localStorage.setItem(testKey, testValue);
            const retrieved = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
            
            tests.push({
                name: 'LocalStorage Read/Write',
                passed: retrieved === testValue
            });
            
            // Test JSON storage
            const jsonData = { test: true, number: 42 };
            localStorage.setItem(testKey, JSON.stringify(jsonData));
            const retrievedJson = JSON.parse(localStorage.getItem(testKey));
            localStorage.removeItem(testKey);
            
            tests.push({
                name: 'LocalStorage JSON Support',
                passed: retrievedJson.test === true && retrievedJson.number === 42
            });
            
            // Test storage quota (rough estimate)
            let storageSize = 0;
            try {
                const testData = new Array(1024).join('x'); // 1KB
                for (let i = 0; i < 1000; i++) {
                    localStorage.setItem(`test_${i}`, testData);
                    storageSize += testData.length;
                }
                
                // Clean up
                for (let i = 0; i < 1000; i++) {
                    localStorage.removeItem(`test_${i}`);
                }
                
                tests.push({
                    name: 'Storage Quota Test',
                    passed: storageSize > 500000, // At least 500KB
                    storageSize: storageSize
                });
                
            } catch (error) {
                tests.push({
                    name: 'Storage Quota Test',
                    passed: false,
                    error: error.message
                });
            }
            
            const allPassed = tests.every(test => test.passed);
            this.recordTest(testName, allPassed, { tests });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testPuzzleMechanics() {
        const testName = 'Puzzle System Mechanics';
        console.log(`🧩 Testing: ${testName}`);
        
        try {
            const tests = [];
            
            // Test puzzle system availability
            const puzzleAvailable = window.app && window.app.puzzleSystem;
            tests.push({
                name: 'Puzzle System Available',
                passed: puzzleAvailable
            });
            
            if (puzzleAvailable) {
                const puzzleSystem = window.app.puzzleSystem;
                
                // Test puzzle state
                tests.push({
                    name: 'Puzzle State Management',
                    passed: typeof puzzleSystem.currentStage !== 'undefined'
                });
                
                // Test hint system
                if (window.app.terminal) {
                    try {
                        window.app.terminal.executeCommand('hint');
                        tests.push({
                            name: 'Hint System',
                            passed: true
                        });
                    } catch (error) {
                        tests.push({
                            name: 'Hint System',
                            passed: false,
                            error: error.message
                        });
                    }
                }
            }
            
            const allPassed = tests.every(test => test.passed);
            this.recordTest(testName, allPassed, { tests });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testBrowserSpecificFeatures() {
        const testName = 'Browser-Specific Features';
        console.log(`🌐 Testing: ${testName}`);
        
        try {
            const tests = [];
            
            // Test vendor prefixes based on browser
            switch (this.currentBrowser) {
                case 'chrome':
                    tests.push(...this.testChromeFeatures());
                    break;
                case 'firefox':
                    tests.push(...this.testFirefoxFeatures());
                    break;
                case 'safari':
                    tests.push(...this.testSafariFeatures());
                    break;
                case 'edge':
                    tests.push(...this.testEdgeFeatures());
                    break;
            }
            
            const allPassed = tests.every(test => test.passed);
            this.recordTest(testName, allPassed, { tests, browser: this.currentBrowser });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    testChromeFeatures() {
        return [
            {
                name: 'Chrome DevTools Console',
                passed: typeof console.trace === 'function'
            },
            {
                name: 'Chrome Performance API',
                passed: typeof performance.getEntriesByType === 'function'
            }
        ];
    }
    
    testFirefoxFeatures() {
        return [
            {
                name: 'Firefox Console',
                passed: typeof console.trace === 'function'
            },
            {
                name: 'Firefox WebGL',
                passed: this.testWebGLSupport()
            }
        ];
    }
    
    testSafariFeatures() {
        return [
            {
                name: 'Safari Touch Events',
                passed: 'ontouchstart' in window
            },
            {
                name: 'Safari Local Storage Limits',
                passed: this.testSafariStorageLimits()
            }
        ];
    }
    
    testEdgeFeatures() {
        return [
            {
                name: 'Edge Chromium Compatibility',
                passed: typeof CSS !== 'undefined' && typeof CSS.supports === 'function'
            }
        ];
    }
    
    testWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (error) {
            return false;
        }
    }
    
    testSafariStorageLimits() {
        try {
            // Safari has stricter localStorage limits in private mode
            const testData = new Array(100).join('x');
            localStorage.setItem('safariTest', testData);
            const result = localStorage.getItem('safariTest') === testData;
            localStorage.removeItem('safariTest');
            return result;
        } catch (error) {
            return false;
        }
    }
    
    async testPerformanceBaseline() {
        const testName = 'Performance Baseline';
        console.log(`⚡ Testing: ${testName}`);
        
        try {
            const tests = [];
            
            // Test initial load performance
            const loadTiming = performance.getEntriesByType('navigation')[0];
            if (loadTiming) {
                const loadTime = loadTiming.loadEventEnd - loadTiming.loadEventStart;
                tests.push({
                    name: 'Page Load Time',
                    passed: loadTime < 3000, // Less than 3 seconds
                    loadTime: loadTime
                });
            }
            
            // Test animation frame rate
            let frameCount = 0;
            const startTime = performance.now();
            
            const countFrames = () => {
                frameCount++;
                const elapsed = performance.now() - startTime;
                
                if (elapsed < 1000) {
                    requestAnimationFrame(countFrames);
                } else {
                    const fps = Math.round(frameCount / (elapsed / 1000));
                    tests.push({
                        name: 'Animation Frame Rate',
                        passed: fps >= 30, // At least 30 FPS
                        fps: fps
                    });
                    
                    const allPassed = tests.every(test => test.passed);
                    this.recordTest(testName, allPassed, { tests });
                }
            };
            
            requestAnimationFrame(countFrames);
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    recordTest(testName, passed, details = {}) {
        const result = {
            name: testName,
            passed: passed,
            timestamp: new Date().toISOString(),
            browser: this.currentBrowser,
            details: details
        };
        
        if (this.testResults[this.currentBrowser]) {
            this.testResults[this.currentBrowser].tests.push(result);
            
            if (passed) {
                this.testResults[this.currentBrowser].passed++;
            } else {
                this.testResults[this.currentBrowser].failed++;
            }
        }
        
        console.log(`${passed ? '✅' : '❌'} ${testName}: ${passed ? 'PASSED' : 'FAILED'}`);
        if (!passed && details.error) {
            console.error(`   Error: ${details.error}`);
        }
    }
    
    generateReport() {
        const endTime = Date.now();
        const duration = endTime - this.startTime;
        
        console.log('\n📊 Cross-Browser Testing Report');
        console.log('================================');
        console.log(`Browser: ${this.currentBrowser.toUpperCase()}`);
        console.log(`Duration: ${duration}ms`);
        
        const browserResult = this.testResults[this.currentBrowser];
        const total = browserResult.passed + browserResult.failed;
        const successRate = total > 0 ? Math.round((browserResult.passed / total) * 100) : 0;
        
        console.log(`\nResults:`);
        console.log(`  ✅ Passed: ${browserResult.passed}`);
        console.log(`  ❌ Failed: ${browserResult.failed}`);
        console.log(`  📈 Success Rate: ${successRate}%`);
        
        // Store results for later comparison
        localStorage.setItem('crossBrowserTestResults', JSON.stringify({
            browser: this.currentBrowser,
            timestamp: new Date().toISOString(),
            results: browserResult,
            successRate: successRate,
            duration: duration
        }));
        
        console.log('\n✨ Cross-browser testing completed!');
        
        return {
            browser: this.currentBrowser,
            results: browserResult,
            successRate: successRate,
            duration: duration
        };
    }
}

// Auto-run if loaded in browser
if (typeof window !== 'undefined') {
    window.CrossBrowserTestSuite = CrossBrowserTestSuite;
    
    // Auto-start testing after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            const testSuite = new CrossBrowserTestSuite();
            testSuite.runAllTests();
        }, 2000); // Wait 2 seconds for app to initialize
    });
}

export default CrossBrowserTestSuite;