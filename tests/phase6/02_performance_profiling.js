/**
 * Phase 6: Performance Optimization & Profiling Suite
 * 
 * This module provides comprehensive performance testing,
 * profiling, and optimization for the retro-cyber-web application.
 */

class PerformanceProfiler {
    constructor() {
        this.measurements = [];
        this.startTime = Date.now();
        this.frameRateData = [];
        this.memoryData = [];
        
        console.log('⚡ Performance Profiler initialized');
    }
    
    static startProfiling(label) {
        console.time(label);
        performance.mark(`${label}-start`);
    }
    
    static endProfiling(label) {
        console.timeEnd(label);
        performance.mark(`${label}-end`);
        performance.measure(label, `${label}-start`, `${label}-end`);
        
        // Return the measurement
        const measures = performance.getEntriesByName(label, 'measure');
        return measures.length > 0 ? measures[measures.length - 1].duration : null;
    }
    
    async runPerformanceAudit() {
        console.log('🔍 Starting comprehensive performance audit...');
        
        // Core performance tests
        await this.profileJavaScriptPerformance();
        await this.profileCSSPerformance();
        await this.profileCanvasPerformance();
        await this.profileMemoryUsage();
        await this.profileNetworkPerformance();
        
        // Generate optimization recommendations
        this.generateOptimizationReport();
        
        return this.measurements;
    }
    
    async profileJavaScriptPerformance() {
        console.log('📊 Profiling JavaScript Performance...');
        
        // Test typewriter animation performance
        const typewriterDuration = await this.testTypewriterPerformance();
        this.recordMeasurement('Typewriter Animation', typewriterDuration, 'ms', typewriterDuration < 16.67); // 60fps
        
        // Test Matrix rain performance
        const matrixDuration = await this.testMatrixRainPerformance();
        this.recordMeasurement('Matrix Rain Animation', matrixDuration, 'ms', matrixDuration < 16.67);
        
        // Test command processing performance
        const commandDuration = await this.testCommandProcessingPerformance();
        this.recordMeasurement('Command Processing', commandDuration, 'ms', commandDuration < 100);
        
        // Test DOM manipulation performance
        const domDuration = await this.testDOMPerformance();
        this.recordMeasurement('DOM Manipulation', domDuration, 'ms', domDuration < 50);
    }
    
    async testTypewriterPerformance() {
        if (!window.app || !window.app.terminal) {
            return null;
        }
        
        PerformanceProfiler.startProfiling('typewriter-test');
        
        // Simulate typewriter effect
        const testText = 'Performance test message for typewriter animation';
        const terminal = window.app.terminal;
        
        try {
            // Test direct typewriter call if available
            if (terminal.typeWriter) {
                terminal.typeWriter(testText, 0); // No delay for testing
            }
        } catch (error) {
            console.warn('Typewriter test failed:', error.message);
        }
        
        return PerformanceProfiler.endProfiling('typewriter-test');
    }
    
    async testMatrixRainPerformance() {
        PerformanceProfiler.startProfiling('matrix-rain-test');
        
        try {
            // Test Matrix rain if available
            if (window.app && window.app.matrixRain) {
                const matrixRain = window.app.matrixRain;
                
                // Render one frame
                if (matrixRain.render) {
                    matrixRain.render();
                }
            } else {
                // Simulate Matrix rain rendering
                const canvas = document.createElement('canvas');
                canvas.width = 800;
                canvas.height = 600;
                const ctx = canvas.getContext('2d');
                
                // Simulate character rendering
                ctx.fillStyle = '#0f0';
                ctx.font = '14px monospace';
                
                for (let i = 0; i < 100; i++) {
                    ctx.fillText(String.fromCharCode(Math.random() * 65536), 
                               Math.random() * 800, Math.random() * 600);
                }
            }
        } catch (error) {
            console.warn('Matrix rain test failed:', error.message);
        }
        
        return PerformanceProfiler.endProfiling('matrix-rain-test');
    }
    
    async testCommandProcessingPerformance() {
        if (!window.app || !window.app.terminal) {
            return null;
        }
        
        PerformanceProfiler.startProfiling('command-processing-test');
        
        try {
            const terminal = window.app.terminal;
            
            // Test various commands
            const commands = ['help', 'about', 'clear'];
            
            for (const cmd of commands) {
                terminal.executeCommand(cmd);
            }
        } catch (error) {
            console.warn('Command processing test failed:', error.message);
        }
        
        return PerformanceProfiler.endProfiling('command-processing-test');
    }
    
    async testDOMPerformance() {
        PerformanceProfiler.startProfiling('dom-performance-test');
        
        try {
            // Test DOM creation and manipulation
            const container = document.createElement('div');
            container.className = 'performance-test-container';
            
            // Create multiple elements
            for (let i = 0; i < 100; i++) {
                const element = document.createElement('span');
                element.textContent = `Test element ${i}`;
                element.className = 'test-element';
                container.appendChild(element);
            }
            
            // Add to DOM temporarily
            document.body.appendChild(container);
            
            // Force reflow
            container.offsetHeight;
            
            // Clean up
            document.body.removeChild(container);
            
        } catch (error) {
            console.warn('DOM performance test failed:', error.message);
        }
        
        return PerformanceProfiler.endProfiling('dom-performance-test');
    }
    
    async profileCSSPerformance() {
        console.log('🎨 Profiling CSS Performance...');
        
        // Test CSS animation performance
        const animationDuration = await this.testCSSAnimationPerformance();
        this.recordMeasurement('CSS Animations', animationDuration, 'ms', animationDuration < 100);
        
        // Test CSS rendering performance
        const renderDuration = await this.testCSSRenderingPerformance();
        this.recordMeasurement('CSS Rendering', renderDuration, 'ms', renderDuration < 50);
    }
    
    async testCSSAnimationPerformance() {
        PerformanceProfiler.startProfiling('css-animation-test');
        
        try {
            // Create test element with animation
            const testElement = document.createElement('div');
            testElement.style.cssText = `
                position: absolute;
                top: -100px;
                left: -100px;
                width: 50px;
                height: 50px;
                background: #0f0;
                transition: transform 0.5s ease-in-out;
            `;
            
            document.body.appendChild(testElement);
            
            // Force initial layout
            testElement.offsetHeight;
            
            // Trigger animation
            testElement.style.transform = 'translateX(100px)';
            
            // Wait for animation to complete
            await new Promise(resolve => {
                testElement.addEventListener('transitionend', resolve, { once: true });
                setTimeout(resolve, 600); // Fallback timeout
            });
            
            // Clean up
            document.body.removeChild(testElement);
            
        } catch (error) {
            console.warn('CSS animation test failed:', error.message);
        }
        
        return PerformanceProfiler.endProfiling('css-animation-test');
    }
    
    async testCSSRenderingPerformance() {
        PerformanceProfiler.startProfiling('css-rendering-test');
        
        try {
            // Test complex CSS rendering
            const container = document.createElement('div');
            container.style.cssText = `
                position: absolute;
                top: -1000px;
                left: -1000px;
                width: 500px;
                height: 500px;
                background: linear-gradient(45deg, #0f0, #f0f);
                border-radius: 50%;
                box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
                transform: rotate(45deg) scale(0.8);
            `;
            
            document.body.appendChild(container);
            
            // Create multiple child elements
            for (let i = 0; i < 20; i++) {
                const child = document.createElement('div');
                child.style.cssText = `
                    position: absolute;
                    top: ${i * 20}px;
                    left: ${i * 20}px;
                    width: 20px;
                    height: 20px;
                    background: rgba(0, 255, 0, 0.${i});
                    border-radius: 50%;
                `;
                container.appendChild(child);
            }
            
            // Force layout calculation
            container.offsetHeight;
            
            // Clean up
            document.body.removeChild(container);
            
        } catch (error) {
            console.warn('CSS rendering test failed:', error.message);
        }
        
        return PerformanceProfiler.endProfiling('css-rendering-test');
    }
    
    async profileCanvasPerformance() {
        console.log('🖼️ Profiling Canvas Performance...');
        
        const canvasTests = [
            { name: 'Basic Drawing', test: this.testBasicCanvasDrawing.bind(this) },
            { name: 'Complex Rendering', test: this.testComplexCanvasRendering.bind(this) },
            { name: 'Text Rendering', test: this.testCanvasTextRendering.bind(this) },
            { name: 'Image Processing', test: this.testCanvasImageProcessing.bind(this) }
        ];
        
        for (const { name, test } of canvasTests) {
            const duration = await test();
            this.recordMeasurement(`Canvas ${name}`, duration, 'ms', duration < 50);
        }
    }
    
    async testBasicCanvasDrawing() {
        PerformanceProfiler.startProfiling('canvas-basic-drawing');
        
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 600;
            const ctx = canvas.getContext('2d');
            
            // Basic drawing operations
            ctx.fillStyle = '#0f0';
            for (let i = 0; i < 1000; i++) {
                ctx.fillRect(Math.random() * 800, Math.random() * 600, 5, 5);
            }
            
        } catch (error) {
            console.warn('Canvas basic drawing test failed:', error.message);
        }
        
        return PerformanceProfiler.endProfiling('canvas-basic-drawing');
    }
    
    async testComplexCanvasRendering() {
        PerformanceProfiler.startProfiling('canvas-complex-rendering');
        
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 600;
            const ctx = canvas.getContext('2d');
            
            // Complex rendering operations
            for (let i = 0; i < 100; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * 800, Math.random() * 600, Math.random() * 50, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 255, 0, ${Math.random()})`;
                ctx.fill();
                
                ctx.beginPath();
                ctx.moveTo(Math.random() * 800, Math.random() * 600);
                ctx.lineTo(Math.random() * 800, Math.random() * 600);
                ctx.strokeStyle = `rgba(0, 255, 0, ${Math.random()})`;
                ctx.stroke();
            }
            
        } catch (error) {
            console.warn('Canvas complex rendering test failed:', error.message);
        }
        
        return PerformanceProfiler.endProfiling('canvas-complex-rendering');
    }
    
    async testCanvasTextRendering() {
        PerformanceProfiler.startProfiling('canvas-text-rendering');
        
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 600;
            const ctx = canvas.getContext('2d');
            
            // Text rendering
            ctx.font = '14px monospace';
            ctx.fillStyle = '#0f0';
            
            const chars = 'アィウェオカキクケコサシスセソタチツテト01';
            for (let i = 0; i < 500; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(char, Math.random() * 800, Math.random() * 600);
            }
            
        } catch (error) {
            console.warn('Canvas text rendering test failed:', error.message);
        }
        
        return PerformanceProfiler.endProfiling('canvas-text-rendering');
    }
    
    async testCanvasImageProcessing() {
        PerformanceProfiler.startProfiling('canvas-image-processing');
        
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 300;
            const ctx = canvas.getContext('2d');
            
            // Create test image data
            const imageData = ctx.createImageData(400, 300);
            const data = imageData.data;
            
            // Fill with random data
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.random() * 255;     // Red
                data[i + 1] = Math.random() * 255; // Green
                data[i + 2] = Math.random() * 255; // Blue
                data[i + 3] = 255;                 // Alpha
            }
            
            // Process image data
            ctx.putImageData(imageData, 0, 0);
            
        } catch (error) {
            console.warn('Canvas image processing test failed:', error.message);
        }
        
        return PerformanceProfiler.endProfiling('canvas-image-processing');
    }
    
    async profileMemoryUsage() {
        console.log('💾 Profiling Memory Usage...');
        
        try {
            // Get memory information if available
            const memInfo = this.getMemoryInfo();
            
            if (memInfo) {
                this.recordMeasurement('Heap Used', memInfo.usedJSHeapSize, 'bytes', 
                                     memInfo.usedJSHeapSize < 100 * 1024 * 1024); // Less than 100MB
                
                this.recordMeasurement('Heap Total', memInfo.totalJSHeapSize, 'bytes',
                                     memInfo.totalJSHeapSize < 200 * 1024 * 1024); // Less than 200MB
                
                this.recordMeasurement('Heap Limit', memInfo.jsHeapSizeLimit, 'bytes',
                                     memInfo.jsHeapSizeLimit > 1024 * 1024 * 1024); // At least 1GB
            }
            
            // Test for memory leaks
            await this.testForMemoryLeaks();
            
        } catch (error) {
            console.warn('Memory profiling failed:', error.message);
        }
    }
    
    getMemoryInfo() {
        if ('memory' in performance) {
            return performance.memory;
        }
        return null;
    }
    
    async testForMemoryLeaks() {
        const initialMemory = this.getMemoryInfo();
        if (!initialMemory) return;
        
        // Create and destroy objects to test for leaks
        const objects = [];
        
        // Create objects
        for (let i = 0; i < 1000; i++) {
            objects.push({
                id: i,
                data: new Array(1000).fill('test'),
                element: document.createElement('div')
            });
        }
        
        // Clear references
        objects.length = 0;
        
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
        
        // Wait a bit
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const finalMemory = this.getMemoryInfo();
        const memoryIncrease = finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;
        
        this.recordMeasurement('Memory Leak Test', memoryIncrease, 'bytes',
                             memoryIncrease < 10 * 1024 * 1024); // Less than 10MB increase
    }
    
    async profileNetworkPerformance() {
        console.log('🌐 Profiling Network Performance...');
        
        try {
            // Get navigation timing
            const navTiming = performance.getEntriesByType('navigation')[0];
            
            if (navTiming) {
                const metrics = {
                    'DNS Lookup': navTiming.domainLookupEnd - navTiming.domainLookupStart,
                    'TCP Connect': navTiming.connectEnd - navTiming.connectStart,
                    'Request Time': navTiming.responseStart - navTiming.requestStart,
                    'Response Time': navTiming.responseEnd - navTiming.responseStart,
                    'DOM Processing': navTiming.domContentLoadedEventEnd - navTiming.domContentLoadedEventStart,
                    'Load Complete': navTiming.loadEventEnd - navTiming.loadEventStart
                };
                
                for (const [name, duration] of Object.entries(metrics)) {
                    this.recordMeasurement(`Network: ${name}`, duration, 'ms', duration < 1000);
                }
            }
            
            // Get resource timing
            const resources = performance.getEntriesByType('resource');
            
            let totalSize = 0;
            let totalDuration = 0;
            
            resources.forEach(resource => {
                if (resource.transferSize) {
                    totalSize += resource.transferSize;
                }
                totalDuration += resource.duration;
            });
            
            this.recordMeasurement('Total Resource Size', totalSize, 'bytes', totalSize < 5 * 1024 * 1024); // Less than 5MB
            this.recordMeasurement('Average Resource Load Time', totalDuration / resources.length, 'ms', 
                                 (totalDuration / resources.length) < 200);
            
        } catch (error) {
            console.warn('Network profiling failed:', error.message);
        }
    }
    
    measureFrameRate() {
        return new Promise((resolve) => {
            let lastTime = performance.now();
            let frames = 0;
            const startTime = lastTime;
            
            function tick() {
                frames++;
                const currentTime = performance.now();
                
                if (currentTime >= startTime + 5000) { // Measure for 5 seconds
                    const fps = Math.round(frames / 5);
                    resolve(fps);
                } else {
                    requestAnimationFrame(tick);
                }
            }
            
            requestAnimationFrame(tick);
        });
    }
    
    recordMeasurement(name, value, unit, passed = true) {
        const measurement = {
            name,
            value,
            unit,
            passed,
            timestamp: Date.now()
        };
        
        this.measurements.push(measurement);
        
        const status = passed ? '✅' : '❌';
        const formattedValue = typeof value === 'number' ? 
                              (unit === 'bytes' ? this.formatBytes(value) : `${value.toFixed(2)}${unit}`) :
                              value;
        
        console.log(`${status} ${name}: ${formattedValue}`);
    }
    
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    generateOptimizationReport() {
        console.log('\n📊 Performance Optimization Report');
        console.log('====================================');
        
        const passed = this.measurements.filter(m => m.passed).length;
        const total = this.measurements.length;
        const successRate = Math.round((passed / total) * 100);
        
        console.log(`Overall Performance Score: ${successRate}%`);
        console.log(`Tests Passed: ${passed}/${total}`);
        
        // Categorize measurements
        const categories = {};
        this.measurements.forEach(measurement => {
            const category = measurement.name.split(':')[0].split(' ')[0];
            if (!categories[category]) {
                categories[category] = { passed: 0, failed: 0, measurements: [] };
            }
            
            categories[category].measurements.push(measurement);
            if (measurement.passed) {
                categories[category].passed++;
            } else {
                categories[category].failed++;
            }
        });
        
        console.log('\n📈 Performance by Category:');
        Object.entries(categories).forEach(([category, data]) => {
            const categorySuccess = Math.round((data.passed / (data.passed + data.failed)) * 100);
            console.log(`  ${category}: ${categorySuccess}% (${data.passed}/${data.passed + data.failed})`);
        });
        
        // Generate recommendations
        console.log('\n💡 Optimization Recommendations:');
        this.generateRecommendations();
        
        // Store results
        const report = {
            timestamp: new Date().toISOString(),
            measurements: this.measurements,
            successRate: successRate,
            categories: categories,
            recommendations: this.getRecommendations()
        };
        
        localStorage.setItem('performanceReport', JSON.stringify(report));
        
        return report;
    }
    
    generateRecommendations() {
        const failedTests = this.measurements.filter(m => !m.passed);
        
        if (failedTests.length === 0) {
            console.log('  🎉 All performance tests passed! No optimizations needed.');
            return;
        }
        
        failedTests.forEach(test => {
            const recommendation = this.getRecommendationForTest(test);
            if (recommendation) {
                console.log(`  • ${test.name}: ${recommendation}`);
            }
        });
    }
    
    getRecommendationForTest(test) {
        const name = test.name.toLowerCase();
        
        if (name.includes('animation')) {
            return 'Consider using CSS transforms instead of changing layout properties. Use will-change property for better performance.';
        }
        
        if (name.includes('canvas')) {
            return 'Implement object pooling and dirty rectangle rendering. Consider using OffscreenCanvas for heavy operations.';
        }
        
        if (name.includes('memory')) {
            return 'Check for memory leaks. Ensure proper cleanup of event listeners and references.';
        }
        
        if (name.includes('network')) {
            return 'Optimize asset sizes, implement compression, and consider resource preloading.';
        }
        
        if (name.includes('dom')) {
            return 'Minimize DOM manipulations and batch updates. Use DocumentFragment for multiple insertions.';
        }
        
        return 'Review implementation for potential optimizations.';
    }
    
    getRecommendations() {
        return [
            'Use CSS transforms and opacity for animations',
            'Implement object pooling for frequently created objects',
            'Use OffscreenCanvas for complex canvas operations',
            'Minimize DOM manipulations and batch updates',
            'Implement proper memory management and cleanup',
            'Optimize asset loading and compression',
            'Use will-change property strategically',
            'Consider implementing virtual scrolling for large lists'
        ];
    }
}

// Auto-initialize for browser usage
if (typeof window !== 'undefined') {
    window.PerformanceProfiler = PerformanceProfiler;
    
    // Add global frame rate monitor
    let frameCount = 0;
    let lastTime = performance.now();
    
    function monitorFrameRate() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime >= lastTime + 1000) {
            const fps = Math.round(frameCount * 1000 / (currentTime - lastTime));
            
            // Only log if FPS is below threshold
            if (fps < 30) {
                console.warn(`⚠️ Low FPS detected: ${fps} fps`);
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(monitorFrameRate);
    }
    
    // Performance monitoring disabled for cleaner user experience  
    // To run performance tests, use terminal command: test performance
    /*
    // Start monitoring after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            monitorFrameRate();
        }, 5000); // Start monitoring after 5 seconds
    });
    */
}

export default PerformanceProfiler;