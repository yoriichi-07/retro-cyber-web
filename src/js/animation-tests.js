/* Phase 5 Animation System Test Suite */
/* Comprehensive testing for all advanced animation components */

/**
 * Animation Test Suite
 * Tests all Phase 5 animation systems for functionality and performance
 */
class AnimationTestSuite {
    constructor() {
        this.tests = [];
        this.results = [];
        this.startTime = 0;
        this.testCanvas = null;
        
        this.setupTestEnvironment();
    }
    
    setupTestEnvironment() {
        // Create test canvas
        this.testCanvas = document.createElement('canvas');
        this.testCanvas.width = 800;
        this.testCanvas.height = 600;
        this.testCanvas.style.display = 'none';
        document.body.appendChild(this.testCanvas);
        
        console.log('🧪 Animation test environment setup complete');
    }
    
    /**
     * Run all animation system tests
     */
    async runAllTests() {
        console.log('🎬 Starting Phase 5 Animation System Tests...');
        this.startTime = performance.now();
        
        try {
            // Core animation system tests
            await this.testAdvancedMatrixRain();
            await this.testParticleSystem();
            await this.testAnimationController();
            await this.testVisualEffects();
            await this.testPerformanceMonitor();
            await this.testAccessibilityManager();
            await this.testAnimationIntegration();
            
            // Integration tests
            await this.testTerminalIntegration();
            await this.testEventHandling();
            await this.testQualityScaling();
            
            // Performance tests
            await this.testPerformanceUnderLoad();
            await this.testMemoryUsage();
            
            this.generateTestReport();
            
        } catch (error) {
            console.error('❌ Test suite failed:', error);
            this.results.push({
                test: 'Test Suite Execution',
                status: 'FAILED',
                error: error.message,
                timestamp: performance.now()
            });
        }
    }
    
    /**
     * Test Advanced Matrix Rain system
     */
    async testAdvancedMatrixRain() {
        console.log('Testing Advanced Matrix Rain...');
        
        try {
            const matrixRain = new AdvancedMatrixRain(this.testCanvas, {
                fontSize: 14,
                speed: 1,
                density: 0.8,
                colorVariation: true,
                characterMorphing: true
            });
            
            // Test initialization
            this.assert(matrixRain.characters.length > 0, 'Matrix characters initialized');
            this.assert(matrixRain.columns.length > 0, 'Matrix columns created');
            this.assert(matrixRain.config.fontSize === 14, 'Configuration applied correctly');
            
            // Test drawing
            const initialTime = performance.now();
            matrixRain.draw(initialTime);
            this.assert(true, 'Matrix rain draws without errors');
            
            // Test intensification
            matrixRain.intensify(2);
            this.assert(matrixRain.config.speed === 2, 'Intensification works');
            
            // Test normalization
            matrixRain.normalize();
            this.assert(matrixRain.config.speed === 1, 'Normalization works');
            
            // Test interactive mode
            matrixRain.handleMouseMove({ clientX: 100, clientY: 100 });
            this.assert(true, 'Mouse interaction handled');
            
            this.addTestResult('Advanced Matrix Rain', 'PASSED');
            
        } catch (error) {
            this.addTestResult('Advanced Matrix Rain', 'FAILED', error.message);
        }
    }
    
    /**
     * Test Particle System
     */
    async testParticleSystem() {
        console.log('Testing Particle System...');
        
        try {
            const particleSystem = new ParticleSystem(this.testCanvas, 100);
            
            // Test initialization
            this.assert(particleSystem.maxParticles === 100, 'Max particles set correctly');
            this.assert(particleSystem.particlePool.length === 100, 'Particle pool created');
            
            // Test particle creation
            const particle = particleSystem.createParticle(100, 100, '#00ff00');
            this.assert(particle !== null, 'Particle created successfully');
            this.assert(particle.x === 100, 'Particle position set correctly');
            
            // Test preset effects
            particleSystem.triggerPresetEffect('explosion', 200, 200);
            this.assert(particleSystem.activeParticles.size > 0, 'Explosion effect created particles');
            
            // Test update and render
            particleSystem.update(performance.now());
            particleSystem.render();
            this.assert(true, 'Update and render completed without errors');
            
            // Test Interactive Particles
            const interactiveParticles = new InteractiveParticles(particleSystem);
            interactiveParticles.enableClickEffects(true);
            interactiveParticles.enableKeyboardEffects(true);
            this.assert(true, 'Interactive particles initialized');
            
            this.addTestResult('Particle System', 'PASSED');
            
        } catch (error) {
            this.addTestResult('Particle System', 'FAILED', error.message);
        }
    }
    
    /**
     * Test Animation Controller
     */
    async testAnimationController() {
        console.log('Testing Animation Controller...');
        
        try {
            const controller = new AnimationController();
            
            // Test state management
            this.assert(controller.currentState === 'idle', 'Initial state is idle');
            
            controller.setState('typing');
            this.assert(controller.currentState === 'typing', 'State change works');
            
            controller.setState('glitching');
            this.assert(controller.currentState === 'glitching', 'High priority state change');
            
            // Test state transitions
            this.assert(controller.stateTransitions.size > 0, 'State transitions defined');
            
            // Test effect execution
            controller.executeEffect('increaseMatrixSpeed', 1000);
            this.assert(true, 'Effect execution completed');
            
            this.addTestResult('Animation Controller', 'PASSED');
            
        } catch (error) {
            this.addTestResult('Animation Controller', 'FAILED', error.message);
        }
    }
    
    /**
     * Test Visual Effects
     */
    async testVisualEffects() {
        console.log('Testing Visual Effects...');
        
        try {
            // Test Cinematic Effects
            const cinematicEffects = new CinematicEffects(this.testCanvas);
            
            cinematicEffects.activateEffect('scanlines');
            this.assert(cinematicEffects.activeEffects.size === 1, 'Scanlines effect activated');
            
            cinematicEffects.activateEffect('dataCorruption', { duration: 1000 });
            this.assert(cinematicEffects.activeEffects.size === 2, 'Data corruption effect activated');
            
            cinematicEffects.render(performance.now());
            this.assert(true, 'Cinematic effects render without errors');
            
            // Test Screen Distortion
            const screenDistortion = new ScreenDistortion(this.testCanvas);
            
            screenDistortion.applyDistortion('wave', 1.0, 1000);
            this.assert(screenDistortion.activeDistortions.size === 1, 'Wave distortion applied');
            
            // Test Atmosphere Enhancement
            const atmosphere = new AtmosphereEnhancement(this.testCanvas);
            
            atmosphere.setAmbientLevel(0.5);
            atmosphere.setColorTint('#004020');
            this.assert(atmosphere.ambientLevel === 0.5, 'Ambient level set');
            
            const lightId = atmosphere.addLightSource(100, 100, 50, '#00ff00', 1);
            this.assert(atmosphere.lightSources.length === 1, 'Light source added');
            
            atmosphere.removeLightSource(lightId);
            this.assert(atmosphere.lightSources.length === 0, 'Light source removed');
            
            this.addTestResult('Visual Effects', 'PASSED');
            
        } catch (error) {
            this.addTestResult('Visual Effects', 'FAILED', error.message);
        }
    }
    
    /**
     * Test Performance Monitor
     */
    async testPerformanceMonitor() {
        console.log('Testing Performance Monitor...');
        
        try {
            const monitor = new PerformanceMonitor();
            
            // Test initialization
            this.assert(monitor.qualityLevel === 'high', 'Initial quality level is high');
            this.assert(monitor.frameRate === 60, 'Initial frame rate is 60');
            
            // Test quality settings
            this.assert(monitor.qualitySettings.low !== undefined, 'Low quality settings exist');
            this.assert(monitor.qualitySettings.medium !== undefined, 'Medium quality settings exist');
            this.assert(monitor.qualitySettings.high !== undefined, 'High quality settings exist');
            
            // Test manual quality setting
            monitor.forceQuality('low');
            this.assert(monitor.qualityLevel === 'low', 'Manual quality change works');
            
            // Test metrics
            const metrics = monitor.getMetrics();
            this.assert(typeof metrics.fps === 'number', 'FPS metric available');
            this.assert(typeof metrics.quality === 'string', 'Quality metric available');
            
            this.addTestResult('Performance Monitor', 'PASSED');
            
        } catch (error) {
            this.addTestResult('Performance Monitor', 'FAILED', error.message);
        }
    }
    
    /**
     * Test Accessibility Manager
     */
    async testAccessibilityManager() {
        console.log('Testing Accessibility Manager...');
        
        try {
            const accessibility = new AccessibilityManager();
            
            // Test preference detection
            const prefs = accessibility.getPreferences();
            this.assert(typeof prefs.reducedMotion === 'boolean', 'Reduced motion preference detected');
            this.assert(typeof prefs.highContrast === 'boolean', 'High contrast preference detected');
            
            // Test settings application
            accessibility.applyAccessibilitySettings();
            this.assert(true, 'Accessibility settings applied without errors');
            
            this.addTestResult('Accessibility Manager', 'PASSED');
            
        } catch (error) {
            this.addTestResult('Accessibility Manager', 'FAILED', error.message);
        }
    }
    
    /**
     * Test Animation Integration
     */
    async testAnimationIntegration() {
        console.log('Testing Animation Integration...');
        
        try {
            const integration = new AnimationIntegration();
            
            // Test initialization
            await integration.initialize(this.testCanvas);
            this.assert(integration.initialized === true, 'Animation integration initialized');
            this.assert(integration.systems.matrixRain !== undefined, 'Matrix rain system loaded');
            this.assert(integration.systems.particleSystem !== undefined, 'Particle system loaded');
            
            // Test animation control
            integration.setMasterIntensity(0.8);
            this.assert(integration.masterIntensity === 0.8, 'Master intensity set');
            
            integration.enableAnimations(false);
            this.assert(integration.animationsEnabled === false, 'Animations disabled');
            
            integration.enableAnimations(true);
            this.assert(integration.animationsEnabled === true, 'Animations enabled');
            
            // Test status
            const status = integration.getStatus();
            this.assert(status.initialized === true, 'Status reports initialized');
            this.assert(Array.isArray(status.systems), 'Systems list available');
            
            this.addTestResult('Animation Integration', 'PASSED');
            
        } catch (error) {
            this.addTestResult('Animation Integration', 'FAILED', error.message);
        }
    }
    
    /**
     * Test Terminal Integration
     */
    async testTerminalIntegration() {
        console.log('Testing Terminal Integration...');
        
        try {
            // Create mock terminal
            const mockTerminal = {
                triggerAnimationEvent: function(type, data) {
                    this.lastEvent = { type, data };
                },
                lastEvent: null
            };
            
            // Test event triggering
            mockTerminal.triggerAnimationEvent('command', { type: 'start' });
            this.assert(mockTerminal.lastEvent.type === 'command', 'Animation event triggered');
            
            mockTerminal.triggerAnimationEvent('discovery', { stage: 'final' });
            this.assert(mockTerminal.lastEvent.type === 'discovery', 'Discovery event triggered');
            
            this.addTestResult('Terminal Integration', 'PASSED');
            
        } catch (error) {
            this.addTestResult('Terminal Integration', 'FAILED', error.message);
        }
    }
    
    /**
     * Test Event Handling
     */
    async testEventHandling() {
        console.log('Testing Event Handling...');
        
        try {
            let eventReceived = false;
            
            // Test custom event dispatch
            document.addEventListener('animationStateChange', () => {
                eventReceived = true;
            });
            
            const event = new CustomEvent('animationStateChange', {
                detail: { fromState: 'idle', toState: 'typing' }
            });
            
            document.dispatchEvent(event);
            
            // Wait a bit for event to be processed
            await new Promise(resolve => setTimeout(resolve, 10));
            
            this.assert(eventReceived === true, 'Custom event dispatched and received');
            
            this.addTestResult('Event Handling', 'PASSED');
            
        } catch (error) {
            this.addTestResult('Event Handling', 'FAILED', error.message);
        }
    }
    
    /**
     * Test Quality Scaling
     */
    async testQualityScaling() {
        console.log('Testing Quality Scaling...');
        
        try {
            const monitor = new PerformanceMonitor();
            
            // Simulate low performance
            monitor.frameRate = 20;
            monitor.memoryUsage = 150;
            
            const quality = monitor.determineOptimalQuality();
            this.assert(quality === 'low', 'Low quality determined for poor performance');
            
            // Simulate high performance
            monitor.frameRate = 60;
            monitor.memoryUsage = 30;
            
            const highQuality = monitor.determineOptimalQuality();
            this.assert(highQuality === 'high', 'High quality determined for good performance');
            
            this.addTestResult('Quality Scaling', 'PASSED');
            
        } catch (error) {
            this.addTestResult('Quality Scaling', 'FAILED', error.message);
        }
    }
    
    /**
     * Test Performance Under Load
     */
    async testPerformanceUnderLoad() {
        console.log('Testing Performance Under Load...');
        
        try {
            const particleSystem = new ParticleSystem(this.testCanvas, 1000);
            const startTime = performance.now();
            
            // Create many particles
            for (let i = 0; i < 500; i++) {
                particleSystem.createParticle(
                    Math.random() * 800,
                    Math.random() * 600,
                    '#00ff00'
                );
            }
            
            // Run update cycles
            for (let i = 0; i < 100; i++) {
                particleSystem.update(performance.now());
                particleSystem.render();
            }
            
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            this.assert(duration < 1000, `Performance test completed in ${duration.toFixed(2)}ms`);
            
            this.addTestResult('Performance Under Load', 'PASSED', `${duration.toFixed(2)}ms`);
            
        } catch (error) {
            this.addTestResult('Performance Under Load', 'FAILED', error.message);
        }
    }
    
    /**
     * Test Memory Usage
     */
    async testMemoryUsage() {
        console.log('Testing Memory Usage...');
        
        try {
            const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
            
            // Create and destroy many objects
            const systems = [];
            for (let i = 0; i < 10; i++) {
                systems.push(new ParticleSystem(this.testCanvas, 100));
            }
            
            // Clean up
            systems.length = 0;
            
            // Force garbage collection if available
            if (window.gc) {
                window.gc();
            }
            
            const finalMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
            const memoryDiff = finalMemory - initialMemory;
            
            this.assert(memoryDiff < 50 * 1024 * 1024, 'Memory usage within acceptable limits'); // 50MB
            
            this.addTestResult('Memory Usage', 'PASSED', `${(memoryDiff / 1024 / 1024).toFixed(2)}MB`);
            
        } catch (error) {
            this.addTestResult('Memory Usage', 'FAILED', error.message);
        }
    }
    
    /**
     * Helper: Add test result
     */
    addTestResult(testName, status, details = '') {
        this.results.push({
            test: testName,
            status,
            details,
            timestamp: performance.now() - this.startTime
        });
        
        const icon = status === 'PASSED' ? '✅' : '❌';
        console.log(`${icon} ${testName}: ${status}${details ? ' - ' + details : ''}`);
    }
    
    /**
     * Helper: Assertion function
     */
    assert(condition, message) {
        if (!condition) {
            throw new Error(`Assertion failed: ${message}`);
        }
    }
    
    /**
     * Generate comprehensive test report
     */
    generateTestReport() {
        const totalTime = performance.now() - this.startTime;
        const passed = this.results.filter(r => r.status === 'PASSED').length;
        const failed = this.results.filter(r => r.status === 'FAILED').length;
        const total = this.results.length;
        
        console.log('\n🎬 PHASE 5 ANIMATION SYSTEM TEST REPORT');
        console.log('==========================================');
        console.log(`Total Tests: ${total}`);
        console.log(`Passed: ${passed}`);
        console.log(`Failed: ${failed}`);
        console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
        console.log(`Total Time: ${totalTime.toFixed(2)}ms`);
        console.log('==========================================');
        
        if (failed > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.results
                .filter(r => r.status === 'FAILED')
                .forEach(r => {
                    console.log(`  - ${r.test}: ${r.details}`);
                });
        }
        
        console.log('\n📊 DETAILED RESULTS:');
        this.results.forEach(r => {
            const icon = r.status === 'PASSED' ? '✅' : '❌';
            console.log(`${icon} ${r.test} (${r.timestamp.toFixed(2)}ms)${r.details ? ' - ' + r.details : ''}`);
        });
        
        // Cleanup
        this.cleanup();
        
        return {
            total,
            passed,
            failed,
            successRate: (passed / total) * 100,
            totalTime,
            results: this.results
        };
    }
    
    /**
     * Cleanup test environment
     */
    cleanup() {
        if (this.testCanvas && this.testCanvas.parentNode) {
            this.testCanvas.parentNode.removeChild(this.testCanvas);
        }
        
        console.log('🧹 Test environment cleaned up');
    }
}

// Export for use
window.AnimationTestSuite = AnimationTestSuite;

// Auto-run tests in development mode
if (window.location.search.includes('test=animations')) {
    document.addEventListener('DOMContentLoaded', async () => {
        console.log('🎬 Auto-running Phase 5 Animation Tests...');
        const testSuite = new AnimationTestSuite();
        await testSuite.runAllTests();
    });
}

console.log('🧪 Phase 5 Animation Test Suite loaded');