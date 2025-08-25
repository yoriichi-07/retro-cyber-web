/* Phase 5 Completion Verification Script */
/* Validates that all Phase 5 systems are properly integrated */

class Phase5Verification {
    constructor() {
        this.systems = [
            'AdvancedMatrixRain',
            'ParticleSystem', 
            'InteractiveParticles',
            'AnimationController',
            'PerformanceMonitor',
            'AccessibilityManager',
            'AnimationIntegration',
            'CinematicEffects',
            'ScreenDistortion',
            'AtmosphereEnhancement'
        ];
        
        this.results = {
            classesLoaded: [],
            classesFailedToLoad: [],
            animationSystemInitialized: false,
            terminalIntegrated: false,
            performanceOptimized: false,
            accessibilitySupported: false
        };
    }
    
    async verify() {
        console.log('🎬 Phase 5 Advanced Animation Systems - Verification Starting...');
        console.log('========================================================');
        
        // Check if all classes are loaded
        this.checkClassAvailability();
        
        // Check terminal integration
        this.checkTerminalIntegration();
        
        // Check canvas and animation initialization
        await this.checkAnimationInitialization();
        
        // Check performance systems
        this.checkPerformanceSystems();
        
        // Check accessibility features
        this.checkAccessibilityFeatures();
        
        // Generate final report
        this.generateVerificationReport();
        
        return this.results;
    }
    
    checkClassAvailability() {
        console.log('📦 Checking Animation Class Availability...');
        
        this.systems.forEach(className => {
            if (typeof window[className] !== 'undefined') {
                this.results.classesLoaded.push(className);
                console.log(`✅ ${className} - Loaded`);
            } else {
                this.results.classesFailedToLoad.push(className);
                console.log(`❌ ${className} - Failed to Load`);
            }
        });
        
        console.log(`\n📊 Classes: ${this.results.classesLoaded.length}/${this.systems.length} loaded successfully\n`);
    }
    
    checkTerminalIntegration() {
        console.log('🖥️ Checking Terminal Integration...');
        
        try {
            // Check if Terminal class has Phase 5 methods
            if (typeof Terminal !== 'undefined') {
                const terminal = new Terminal();
                
                const phase5Methods = [
                    'initializeAdvancedAnimations',
                    'triggerAnimationEvent',
                    'processCommandWithAnimations',
                    'getAnimationStatus',
                    'setAnimationEnabled',
                    'setAnimationIntensity'
                ];
                
                const methodsPresent = phase5Methods.filter(method => 
                    typeof terminal[method] === 'function'
                );
                
                if (methodsPresent.length === phase5Methods.length) {
                    this.results.terminalIntegrated = true;
                    console.log('✅ Terminal has all Phase 5 animation methods');
                } else {
                    console.log(`❌ Terminal missing methods: ${phase5Methods.filter(m => !methodsPresent.includes(m)).join(', ')}`);
                }
                
                // Check if animation canvas exists
                const animationCanvas = document.getElementById('animation-canvas');
                if (animationCanvas) {
                    console.log('✅ Animation canvas found in DOM');
                } else {
                    console.log('⚠️ Animation canvas not found (will be created on terminal init)');
                }
                
            } else {
                console.log('❌ Terminal class not available');
            }
        } catch (error) {
            console.log('❌ Terminal integration check failed:', error.message);
        }
        
        console.log('');
    }
    
    async checkAnimationInitialization() {
        console.log('🎨 Checking Animation System Initialization...');
        
        try {
            // Create test canvas
            const testCanvas = document.createElement('canvas');
            testCanvas.width = 800;
            testCanvas.height = 600;
            document.body.appendChild(testCanvas);
            
            // Test AnimationIntegration
            if (typeof AnimationIntegration !== 'undefined') {
                const integration = new AnimationIntegration();
                await integration.initialize(testCanvas);
                
                if (integration.initialized) {
                    this.results.animationSystemInitialized = true;
                    console.log('✅ AnimationIntegration initialized successfully');
                    console.log(`✅ Systems loaded: ${Object.keys(integration.systems).join(', ')}`);
                } else {
                    console.log('❌ AnimationIntegration failed to initialize');
                }
                
                // Cleanup
                document.body.removeChild(testCanvas);
            } else {
                console.log('❌ AnimationIntegration class not available');
            }
            
        } catch (error) {
            console.log('❌ Animation initialization check failed:', error.message);
        }
        
        console.log('');
    }
    
    checkPerformanceSystems() {
        console.log('⚡ Checking Performance Systems...');
        
        try {
            if (typeof PerformanceMonitor !== 'undefined') {
                const monitor = new PerformanceMonitor();
                
                // Check if performance monitoring is working
                const metrics = monitor.getMetrics();
                if (metrics && typeof metrics.fps === 'number') {
                    this.results.performanceOptimized = true;
                    console.log('✅ PerformanceMonitor working');
                    console.log(`✅ Current FPS: ${metrics.fps}, Quality: ${metrics.quality}`);
                } else {
                    console.log('❌ PerformanceMonitor metrics not available');
                }
                
                // Test quality adjustment
                monitor.forceQuality('low');
                if (monitor.qualityLevel === 'low') {
                    console.log('✅ Quality scaling functional');
                } else {
                    console.log('❌ Quality scaling not working');
                }
                
            } else {
                console.log('❌ PerformanceMonitor class not available');
            }
        } catch (error) {
            console.log('❌ Performance system check failed:', error.message);
        }
        
        console.log('');
    }
    
    checkAccessibilityFeatures() {
        console.log('♿ Checking Accessibility Features...');
        
        try {
            if (typeof AccessibilityManager !== 'undefined') {
                const accessibility = new AccessibilityManager();
                
                const prefs = accessibility.getPreferences();
                if (prefs && typeof prefs.reducedMotion === 'boolean') {
                    this.results.accessibilitySupported = true;
                    console.log('✅ AccessibilityManager working');
                    console.log(`✅ Reduced motion: ${prefs.reducedMotion}, High contrast: ${prefs.highContrast}`);
                } else {
                    console.log('❌ AccessibilityManager preferences not available');
                }
                
                // Test settings application
                accessibility.applyAccessibilitySettings();
                console.log('✅ Accessibility settings application functional');
                
            } else {
                console.log('❌ AccessibilityManager class not available');
            }
        } catch (error) {
            console.log('❌ Accessibility system check failed:', error.message);
        }
        
        console.log('');
    }
    
    generateVerificationReport() {
        console.log('📊 PHASE 5 VERIFICATION REPORT');
        console.log('===============================');
        
        const totalSystems = this.systems.length;
        const loadedSystems = this.results.classesLoaded.length;
        const successRate = (loadedSystems / totalSystems) * 100;
        
        console.log(`Animation Classes: ${loadedSystems}/${totalSystems} (${successRate.toFixed(1)}%)`);
        console.log(`Terminal Integration: ${this.results.terminalIntegrated ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`Animation System: ${this.results.animationSystemInitialized ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`Performance Optimization: ${this.results.performanceOptimized ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`Accessibility Support: ${this.results.accessibilitySupported ? '✅ PASS' : '❌ FAIL'}`);
        
        const overallPass = this.results.terminalIntegrated && 
                           this.results.animationSystemInitialized && 
                           this.results.performanceOptimized && 
                           this.results.accessibilitySupported &&
                           this.results.classesFailedToLoad.length === 0;
        
        console.log('===============================');
        console.log(`PHASE 5 STATUS: ${overallPass ? '✅ COMPLETE' : '❌ INCOMPLETE'}`);
        
        if (!overallPass) {
            console.log('\n❌ ISSUES DETECTED:');
            if (this.results.classesFailedToLoad.length > 0) {
                console.log(`  - Missing classes: ${this.results.classesFailedToLoad.join(', ')}`);
            }
            if (!this.results.terminalIntegrated) {
                console.log('  - Terminal integration incomplete');
            }
            if (!this.results.animationSystemInitialized) {
                console.log('  - Animation system initialization failed');
            }
            if (!this.results.performanceOptimized) {
                console.log('  - Performance optimization not working');
            }
            if (!this.results.accessibilitySupported) {
                console.log('  - Accessibility features not functioning');
            }
        }
        
        console.log('\n🎬 Phase 5 Advanced Animation Systems verification complete!');
        return overallPass;
    }
}

// Auto-run verification when script loads - DISABLED FOR SIMPLIFIED UX
// document.addEventListener('DOMContentLoaded', async () => {
//     // Wait a moment for all systems to load
//     setTimeout(async () => {
//         const verification = new Phase5Verification();
//         const result = await verification.verify();
//         
//         // Make results globally available
//         window.phase5VerificationResults = result;
//     }, 1000);
// });

// Export for manual use
window.Phase5Verification = Phase5Verification;

console.log('🔍 Phase 5 Verification Script loaded');