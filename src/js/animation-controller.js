/* Context-Responsive Animation System & Performance Optimization */
/* Animation state management, adaptive quality, performance monitoring */

/**
 * Animation State Manager
 * Manages animation states and transitions based on application context
 */
class AnimationController {
    constructor() {
        this.currentState = 'idle';
        this.previousState = null;
        this.animations = new Map();
        this.activeAnimations = new Set();
        this.stateTransitions = new Map();
        this.globalIntensity = 1.0;
        
        // Animation states
        this.states = {
            idle: { intensity: 0.5, priority: 1 },
            typing: { intensity: 0.8, priority: 2 },
            glitching: { intensity: 1.5, priority: 4 },
            success: { intensity: 1.2, priority: 3 },
            error: { intensity: 1.8, priority: 5 },
            discovery: { intensity: 2.0, priority: 6 },
            puzzle: { intensity: 1.3, priority: 3 },
            completion: { intensity: 3.0, priority: 7 }
        };
        
        this.initializeStateTransitions();
    }
    
    initializeStateTransitions() {
        // Define valid state transitions and their effects
        this.stateTransitions.set('idle->typing', {
            duration: 300,
            easing: 'ease-out',
            effects: ['increaseMatrixSpeed', 'enableParticleTrail']
        });
        
        this.stateTransitions.set('typing->idle', {
            duration: 500,
            easing: 'ease-in',
            effects: ['normalizeMatrixSpeed', 'fadeParticleTrail']
        });
        
        this.stateTransitions.set('*->glitching', {
            duration: 100,
            easing: 'ease-in-out',
            effects: ['intensifyGlitch', 'increaseStatic', 'matrixChaos']
        });
        
        this.stateTransitions.set('*->success', {
            duration: 200,
            easing: 'ease-out',
            effects: ['greenPulse', 'successParticles', 'matrixFlow']
        });
        
        this.stateTransitions.set('*->error', {
            duration: 150,
            easing: 'ease-in',
            effects: ['redGlitch', 'errorStatic', 'matrixDistortion']
        });
        
        this.stateTransitions.set('*->discovery', {
            duration: 800,
            easing: 'ease-out',
            effects: ['discoveryExplosion', 'matrixIntensify', 'particleBurst']
        });
        
        this.stateTransitions.set('*->completion', {
            duration: 2000,
            easing: 'ease-in-out',
            effects: ['epicCompletion', 'matrixRainbow', 'massiveParticles']
        });
    }
    
    setState(newState, forced = false) {
        if (this.currentState === newState && !forced) return;
        
        const currentPriority = this.states[this.currentState]?.priority || 0;
        const newPriority = this.states[newState]?.priority || 0;
        
        // Don't interrupt higher priority states unless forced
        if (newPriority < currentPriority && !forced) {
            setTimeout(() => this.setState(newState), 1000);
            return;
        }
        
        this.previousState = this.currentState;
        this.executeTransition(this.currentState, newState);
        this.currentState = newState;
        
        // Update global intensity
        this.globalIntensity = this.states[newState]?.intensity || 1.0;
        
        console.log(`Animation state: ${this.previousState} -> ${newState} (intensity: ${this.globalIntensity})`);
    }
    
    executeTransition(fromState, toState) {
        const transitionKey = `${fromState}->${toState}`;
        const wildcardKey = `*->${toState}`;
        
        const transition = this.stateTransitions.get(transitionKey) || 
                          this.stateTransitions.get(wildcardKey);
        
        if (transition) {
            this.applyTransitionEffects(transition);
        }
        
        // Notify all animation systems
        this.notifyAnimationSystems(fromState, toState, transition);
    }
    
    applyTransitionEffects(transition) {
        transition.effects.forEach(effect => {
            this.executeEffect(effect, transition.duration);
        });
    }
    
    executeEffect(effectName, duration) {
        const animationSystems = window.animationSystems || {};
        
        switch (effectName) {
            case 'increaseMatrixSpeed':
                if (animationSystems.matrixRain) {
                    animationSystems.matrixRain.config.speed = 1.5;
                }
                break;
                
            case 'normalizeMatrixSpeed':
                if (animationSystems.matrixRain) {
                    animationSystems.matrixRain.config.speed = 1.0;
                }
                break;
                
            case 'intensifyGlitch':
                if (animationSystems.glitchGenerator) {
                    this.triggerIntensiveGlitch(duration);
                }
                break;
                
            case 'increaseStatic':
                if (animationSystems.staticNoise) {
                    animationSystems.staticNoise.setIntensity(0.3);
                    animationSystems.staticNoise.animate(50, 'white');
                }
                break;
                
            case 'matrixChaos':
                if (animationSystems.matrixRain) {
                    animationSystems.matrixRain.intensify(2);
                }
                break;
                
            case 'greenPulse':
                this.triggerColorPulse('#00ff00', duration);
                break;
                
            case 'successParticles':
                if (animationSystems.interactiveParticles) {
                    animationSystems.interactiveParticles.triggerCommandEffect(true);
                }
                break;
                
            case 'redGlitch':
                this.triggerColorGlitch('#ff0000', duration);
                break;
                
            case 'errorStatic':
                if (animationSystems.staticNoise) {
                    animationSystems.staticNoise.setIntensity(0.5);
                    animationSystems.staticNoise.animate(30, 'red');
                }
                break;
                
            case 'discoveryExplosion':
                if (animationSystems.interactiveParticles) {
                    animationSystems.interactiveParticles.triggerPuzzleEffect('discovery');
                }
                break;
                
            case 'epicCompletion':
                if (animationSystems.interactiveParticles) {
                    animationSystems.interactiveParticles.triggerPuzzleEffect('completion');
                }
                break;
                
            case 'matrixRainbow':
                if (animationSystems.matrixRain) {
                    animationSystems.matrixRain.config.colorVariation = true;
                    animationSystems.matrixRain.intensify(3);
                }
                break;
        }
        
        // Auto-reset effects after duration
        setTimeout(() => {
            this.resetEffect(effectName);
        }, duration);
    }
    
    resetEffect(effectName) {
        const animationSystems = window.animationSystems || {};
        
        switch (effectName) {
            case 'increaseStatic':
            case 'errorStatic':
                if (animationSystems.staticNoise) {
                    animationSystems.staticNoise.stop();
                }
                break;
                
            case 'matrixChaos':
            case 'matrixRainbow':
                if (animationSystems.matrixRain) {
                    animationSystems.matrixRain.normalize();
                }
                break;
        }
    }
    
    triggerIntensiveGlitch(duration) {
        const terminal = document.getElementById('terminal-content');
        if (!terminal) return;
        
        const glitchInterval = setInterval(() => {
            GlitchGenerator.applyGlitch(terminal, 2);
            
            // Random additional effects
            if (Math.random() < 0.3) {
                GlitchGenerator.applyRGBSplit(terminal, 1.5);
            }
            
            if (Math.random() < 0.2) {
                GlitchGenerator.applyChromaticAberration(terminal, 2);
            }
        }, 100);
        
        setTimeout(() => {
            clearInterval(glitchInterval);
        }, duration);
    }
    
    triggerColorPulse(color, duration) {
        const terminal = document.getElementById('terminal-content');
        if (!terminal) return;
        
        const originalBoxShadow = terminal.style.boxShadow;
        
        const pulseAnimation = () => {
            const intensity = Math.sin(Date.now() * 0.01) * 0.5 + 0.5;
            terminal.style.boxShadow = `0 0 ${20 + intensity * 30}px ${color}`;
        };
        
        const interval = setInterval(pulseAnimation, 50);
        
        setTimeout(() => {
            clearInterval(interval);
            terminal.style.boxShadow = originalBoxShadow;
        }, duration);
    }
    
    triggerColorGlitch(color, duration) {
        const terminal = document.getElementById('terminal-content');
        if (!terminal) return;
        
        const glitchInterval = setInterval(() => {
            terminal.style.filter = `hue-rotate(${Math.random() * 360}deg) contrast(1.5)`;
            terminal.style.textShadow = `2px 0 0 ${color}, -2px 0 0 #00ffff`;
            
            setTimeout(() => {
                terminal.style.filter = '';
                terminal.style.textShadow = '';
            }, 50);
        }, 100);
        
        setTimeout(() => {
            clearInterval(glitchInterval);
        }, duration);
    }
    
    notifyAnimationSystems(fromState, toState, transition) {
        // Custom event for other systems to listen to
        const event = new CustomEvent('animationStateChange', {
            detail: {
                fromState,
                toState,
                transition,
                intensity: this.globalIntensity
            }
        });
        
        document.dispatchEvent(event);
    }
    
    registerAnimation(name, animation) {
        this.animations.set(name, animation);
    }
    
    getState() {
        return {
            current: this.currentState,
            previous: this.previousState,
            intensity: this.globalIntensity
        };
    }
}

/**
 * Performance Monitor
 * Tracks FPS, memory usage, and automatically adjusts quality
 */
class PerformanceMonitor {
    constructor() {
        this.frameRate = 60;
        this.frameHistory = [];
        this.maxFrameHistory = 120; // 2 seconds at 60fps
        this.qualityLevel = 'high';
        this.lastQualityCheck = 0;
        this.qualityCheckInterval = 2000; // Check every 2 seconds
        
        // Performance thresholds
        this.thresholds = {
            low: { fps: 25, memory: 100 },      // MB
            medium: { fps: 45, memory: 75 },
            high: { fps: 55, memory: 50 }
        };
        
        // Quality settings
        this.qualitySettings = {
            low: {
                matrixDensity: 0.3,
                particleLimit: 200,
                glitchIntensity: 0.5,
                staticEnabled: false,
                trailsEnabled: false
            },
            medium: {
                matrixDensity: 0.6,
                particleLimit: 500,
                glitchIntensity: 0.8,
                staticEnabled: true,
                trailsEnabled: false
            },
            high: {
                matrixDensity: 1.0,
                particleLimit: 1000,
                glitchIntensity: 1.0,
                staticEnabled: true,
                trailsEnabled: true
            }
        };
        
        // Memory tracking
        this.memoryUsage = 0;
        this.lastMemoryCheck = 0;
        
        this.startMonitoring();
    }
    
    startMonitoring() {
        this.monitorFrame();
        this.monitorMemory();
        
        console.log('🔬 Performance monitoring started');
    }
    
    monitorFrame() {
        const now = performance.now();
        this.frameHistory.push(now);
        
        // Keep only recent frames
        if (this.frameHistory.length > this.maxFrameHistory) {
            this.frameHistory.shift();
        }
        
        // Calculate FPS
        if (this.frameHistory.length >= 60) {
            const duration = now - this.frameHistory[this.frameHistory.length - 60];
            this.frameRate = Math.round(60000 / duration);
        }
        
        // Check if we need to adjust quality
        if (now - this.lastQualityCheck >= this.qualityCheckInterval) {
            this.adjustQuality();
            this.lastQualityCheck = now;
        }
        
        requestAnimationFrame(() => this.monitorFrame());
    }
    
    monitorMemory() {
        if (performance.memory) {
            this.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
        }
        
        setTimeout(() => this.monitorMemory(), 1000);
    }
    
    adjustQuality() {
        const newQuality = this.determineOptimalQuality();
        
        if (newQuality !== this.qualityLevel) {
            console.log(`🎛️ Quality adjustment: ${this.qualityLevel} -> ${newQuality} (FPS: ${this.frameRate}, Memory: ${this.memoryUsage}MB)`);
            
            this.qualityLevel = newQuality;
            this.applyQualitySettings();
            
            // Notify systems
            const event = new CustomEvent('qualityChange', {
                detail: {
                    level: this.qualityLevel,
                    settings: this.qualitySettings[this.qualityLevel],
                    fps: this.frameRate,
                    memory: this.memoryUsage
                }
            });
            
            document.dispatchEvent(event);
        }
    }
    
    determineOptimalQuality() {
        // Check against thresholds (higher quality first)
        if (this.frameRate >= this.thresholds.high.fps && 
            this.memoryUsage <= this.thresholds.high.memory) {
            return 'high';
        }
        
        if (this.frameRate >= this.thresholds.medium.fps && 
            this.memoryUsage <= this.thresholds.medium.memory) {
            return 'medium';
        }
        
        return 'low';
    }
    
    applyQualitySettings() {
        const settings = this.qualitySettings[this.qualityLevel];
        const animationSystems = window.animationSystems || {};
        
        // Apply to Matrix rain
        if (animationSystems.matrixRain) {
            animationSystems.matrixRain.config.density = settings.matrixDensity;
        }
        
        // Apply to particle system
        if (animationSystems.particleSystem) {
            animationSystems.particleSystem.maxParticles = settings.particleLimit;
        }
        
        // Apply to interactive particles
        if (animationSystems.interactiveParticles) {
            animationSystems.interactiveParticles.setTrailIntensity(
                settings.trailsEnabled ? 1 : 0
            );
        }
        
        // Apply to static noise
        if (animationSystems.staticNoise && !settings.staticEnabled) {
            animationSystems.staticNoise.stop();
        }
    }
    
    getMetrics() {
        return {
            fps: this.frameRate,
            memory: this.memoryUsage,
            quality: this.qualityLevel,
            frameHistory: this.frameHistory.length
        };
    }
    
    forceQuality(level) {
        if (this.qualitySettings[level]) {
            this.qualityLevel = level;
            this.applyQualitySettings();
            console.log(`🎛️ Quality manually set to: ${level}`);
        }
    }
}

/**
 * Accessibility Manager
 * Handles reduced motion preferences and accessibility features
 */
class AccessibilityManager {
    constructor() {
        this.reducedMotion = false;
        this.highContrast = false;
        this.reducedTransparency = false;
        
        this.detectPreferences();
        this.setupEventListeners();
    }
    
    detectPreferences() {
        // Check for prefers-reduced-motion
        if (window.matchMedia) {
            this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            this.highContrast = window.matchMedia('(prefers-contrast: high)').matches;
            this.reducedTransparency = window.matchMedia('(prefers-reduced-transparency: reduce)').matches;
        }
        
        console.log(`♿ Accessibility preferences: reduced-motion: ${this.reducedMotion}, high-contrast: ${this.highContrast}`);
    }
    
    setupEventListeners() {
        if (window.matchMedia) {
            // Listen for preference changes
            window.matchMedia('(prefers-reduced-motion: reduce)').addListener((e) => {
                this.reducedMotion = e.matches;
                this.applyAccessibilitySettings();
            });
            
            window.matchMedia('(prefers-contrast: high)').addListener((e) => {
                this.highContrast = e.matches;
                this.applyAccessibilitySettings();
            });
        }
    }
    
    applyAccessibilitySettings() {
        const animationSystems = window.animationSystems || {};
        
        if (this.reducedMotion) {
            // Disable or reduce animations
            if (animationSystems.matrixRain) {
                animationSystems.matrixRain.config.speed = 0.2;
                animationSystems.matrixRain.config.characterMorphing = false;
            }
            
            if (animationSystems.particleSystem) {
                animationSystems.particleSystem.maxParticles = 50;
            }
            
            if (animationSystems.interactiveParticles) {
                animationSystems.interactiveParticles.enableClickEffects(false);
                animationSystems.interactiveParticles.enableKeyboardEffects(false);
            }
            
            if (animationSystems.staticNoise) {
                animationSystems.staticNoise.stop();
            }
            
            // Add reduced motion class to body
            document.body.classList.add('reduced-motion');
        } else {
            document.body.classList.remove('reduced-motion');
        }
        
        if (this.highContrast) {
            // Increase contrast and reduce transparency
            document.body.classList.add('high-contrast');
            
            if (animationSystems.matrixRain) {
                animationSystems.matrixRain.config.colorVariation = false;
                animationSystems.matrixRain.config.fadeAlpha = 0.1;
            }
        } else {
            document.body.classList.remove('high-contrast');
        }
        
        // Notify about accessibility changes
        const event = new CustomEvent('accessibilityChange', {
            detail: {
                reducedMotion: this.reducedMotion,
                highContrast: this.highContrast,
                reducedTransparency: this.reducedTransparency
            }
        });
        
        document.dispatchEvent(event);
    }
    
    getPreferences() {
        return {
            reducedMotion: this.reducedMotion,
            highContrast: this.highContrast,
            reducedTransparency: this.reducedTransparency
        };
    }
}

/**
 * Animation Integration Manager
 * Coordinates all animation systems and provides unified interface
 */
class AnimationIntegration {
    constructor() {
        this.systems = {};
        this.initialized = false;
        this.canvas = null;
        
        // Global animation controls
        this.masterIntensity = 1.0;
        this.animationsEnabled = true;
        
        this.animationController = new AnimationController();
        this.performanceMonitor = new PerformanceMonitor();
        this.accessibilityManager = new AccessibilityManager();
        
        this.setupEventListeners();
    }
    
    async initialize(canvas) {
        this.canvas = canvas;
        
        try {
            // Initialize all animation systems
            this.systems.matrixRain = new AdvancedMatrixRain(canvas, {
                fontSize: 14,
                speed: 1,
                density: 0.8,
                colorVariation: true,
                characterMorphing: true,
                interactiveMode: true
            });
            
            this.systems.particleSystem = new ParticleSystem(canvas, 1000);
            this.systems.interactiveParticles = new InteractiveParticles(this.systems.particleSystem);
            this.systems.staticNoise = new StaticNoise(canvas, 0.1);
            
            // Make systems globally available
            window.animationSystems = this.systems;
            
            // Start animation loops
            this.startAnimationLoops();
            
            // Apply initial accessibility settings
            this.accessibilityManager.applyAccessibilitySettings();
            
            this.initialized = true;
            console.log('🎬 Advanced animation systems initialized');
            
        } catch (error) {
            console.error('❌ Failed to initialize animation systems:', error);
        }
    }
    
    startAnimationLoops() {
        // Main animation loop
        const animate = (timestamp) => {
            if (!this.animationsEnabled) {
                requestAnimationFrame(animate);
                return;
            }
            
            // Clear canvas
            const ctx = this.canvas.getContext('2d');
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Update and render systems
            if (this.systems.matrixRain) {
                this.systems.matrixRain.draw(timestamp);
            }
            
            if (this.systems.particleSystem) {
                this.systems.particleSystem.update(timestamp);
                this.systems.particleSystem.render();
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    setupEventListeners() {
        // Listen for application events
        document.addEventListener('animationStateChange', (e) => {
            this.handleStateChange(e.detail);
        });
        
        document.addEventListener('qualityChange', (e) => {
            this.handleQualityChange(e.detail);
        });
        
        document.addEventListener('accessibilityChange', (e) => {
            this.handleAccessibilityChange(e.detail);
        });
        
        // Terminal events
        document.addEventListener('terminalCommand', (e) => {
            this.handleTerminalEvent(e.detail);
        });
        
        document.addEventListener('puzzleEvent', (e) => {
            this.handlePuzzleEvent(e.detail);
        });
    }
    
    handleStateChange(detail) {
        const { toState, intensity } = detail;
        this.masterIntensity = intensity;
        
        // Apply state-specific animations
        switch (toState) {
            case 'typing':
                this.systems.matrixRain?.intensify(1.2);
                break;
            case 'glitching':
                this.triggerGlitchSequence();
                break;
            case 'success':
                this.triggerSuccessSequence();
                break;
            case 'error':
                this.triggerErrorSequence();
                break;
            case 'discovery':
                this.triggerDiscoverySequence();
                break;
            case 'completion':
                this.triggerCompletionSequence();
                break;
        }
    }
    
    handleQualityChange(detail) {
        console.log(`🎛️ Quality changed to ${detail.level}`);
        // Quality adjustments are handled by individual systems
    }
    
    handleAccessibilityChange(detail) {
        if (detail.reducedMotion) {
            this.setMasterIntensity(0.3);
        } else {
            this.setMasterIntensity(1.0);
        }
    }
    
    handleTerminalEvent(detail) {
        const { type, success, command } = detail;
        
        switch (type) {
            case 'command':
                this.animationController.setState('typing');
                break;
            case 'result':
                this.animationController.setState(success ? 'success' : 'error');
                this.systems.interactiveParticles?.triggerCommandEffect(success);
                break;
        }
        
        // Auto-return to idle after delay
        setTimeout(() => {
            this.animationController.setState('idle');
        }, 2000);
    }
    
    handlePuzzleEvent(detail) {
        const { type, stage } = detail;
        
        switch (type) {
            case 'discovery':
                this.animationController.setState('discovery');
                break;
            case 'completion':
                this.animationController.setState('completion');
                break;
            case 'glitch':
                this.animationController.setState('glitching');
                break;
        }
    }
    
    triggerGlitchSequence() {
        // Intense glitch effect across all systems
        if (this.systems.staticNoise) {
            this.systems.staticNoise.pulse(1000, 0.8);
        }
        
        this.systems.matrixRain?.intensify(2);
        
        setTimeout(() => {
            this.systems.matrixRain?.normalize();
        }, 1500);
    }
    
    triggerSuccessSequence() {
        // Green success effects
        this.systems.interactiveParticles?.triggerCommandEffect(true);
    }
    
    triggerErrorSequence() {
        // Red error effects
        this.systems.interactiveParticles?.triggerCommandEffect(false);
        
        if (this.systems.staticNoise) {
            this.systems.staticNoise.animate(100, 'red');
            setTimeout(() => {
                this.systems.staticNoise.stop();
            }, 500);
        }
    }
    
    triggerDiscoverySequence() {
        // Epic discovery celebration
        this.systems.interactiveParticles?.triggerPuzzleEffect('discovery');
        this.systems.matrixRain?.intensify(1.8);
        
        setTimeout(() => {
            this.systems.matrixRain?.normalize();
        }, 3000);
    }
    
    triggerCompletionSequence() {
        // Ultimate completion celebration
        this.systems.interactiveParticles?.triggerPuzzleEffect('completion');
        this.systems.matrixRain?.intensify(3);
        
        if (this.systems.staticNoise) {
            this.systems.staticNoise.animate(50, 'rainbow');
        }
        
        setTimeout(() => {
            this.systems.matrixRain?.normalize();
            this.systems.staticNoise?.stop();
        }, 5000);
    }
    
    setMasterIntensity(intensity) {
        this.masterIntensity = Math.max(0, Math.min(2, intensity));
        
        // Apply to all systems
        if (this.systems.matrixRain) {
            this.systems.matrixRain.config.speed = this.masterIntensity;
        }
        
        if (this.systems.interactiveParticles) {
            this.systems.interactiveParticles.setTrailIntensity(this.masterIntensity);
        }
    }
    
    enableAnimations(enabled = true) {
        this.animationsEnabled = enabled;
        
        if (!enabled) {
            // Stop all animations
            this.systems.matrixRain?.stop();
            this.systems.staticNoise?.stop();
        } else {
            // Restart animations
            this.systems.matrixRain?.start();
        }
    }
    
    getStatus() {
        return {
            initialized: this.initialized,
            enabled: this.animationsEnabled,
            intensity: this.masterIntensity,
            state: this.animationController.getState(),
            performance: this.performanceMonitor.getMetrics(),
            accessibility: this.accessibilityManager.getPreferences(),
            systems: Object.keys(this.systems)
        };
    }
}