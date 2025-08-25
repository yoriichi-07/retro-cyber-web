/* Main Entry Point for Retro Cyber World */
/* Initializes the application and coordinates all systems */

/**
 * Application class - main coordinator
 */
class App {
    constructor() {
        this.terminal = null;
        this.matrixCanvas = null;
        this.matrixContext = null;
        this.matrixAnimation = null;
        this.isInitialized = false;
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('🚀 Initializing Retro Cyber World...');
            
            // Initialize systems in order
            await this.initializeCanvas();
            await this.initializeTerminal();
            this.initializeEventListeners();
            this.initializeTheme();
            
            // Start background effects
            this.startMatrixRain();
            this.startBackgroundEffects();
            
            this.isInitialized = true;
            console.log('✅ Application initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize application:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Initialize Matrix canvas
     */
    async initializeCanvas() {
        this.matrixCanvas = document.getElementById('matrix-canvas');
        if (!this.matrixCanvas) {
            console.warn('Matrix canvas not found');
            return;
        }

        this.matrixContext = this.matrixCanvas.getContext('2d');
        this.resizeCanvas();
        
        // Set initial canvas properties
        this.matrixContext.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.matrixContext.font = '12px "Courier New", monospace';
        
        console.log('✅ Canvas initialized');
    }

    /**
     * Initialize terminal system with story integration
     */
    async initializeTerminal() {
        if (typeof Terminal === 'undefined') {
            throw new Error('Terminal class not loaded');
        }

        // STORY SYSTEM INTEGRATION - Initialize story system FIRST
        console.log('📖 Initializing Story-Driven Experience...');
        window.storyDebug?.log('Starting story system initialization...');
        let storyEngine = null;
        let missionSystem = null;
        let immersiveStartup = null;
        
        try {
            // Initialize story engine BEFORE terminal
            if (typeof StoryEngine !== 'undefined') {
                storyEngine = new StoryEngine();
                console.log('✅ StoryEngine created');
                window.storyDebug?.logSuccess('StoryEngine created');
                
                // Initialize mission system
                if (typeof MissionSystem !== 'undefined') {
                    // We'll create this after terminal is created
                    console.log('✅ MissionSystem ready for creation');
                    window.storyDebug?.logSuccess('MissionSystem ready');
                }
                
                // Initialize immersive startup
                if (typeof ImmersiveStartup !== 'undefined') {
                    // We'll create this after terminal is created
                    console.log('✅ ImmersiveStartup ready for creation');
                    window.storyDebug?.logSuccess('ImmersiveStartup ready');
                }
                
                console.log('✅ Story systems prepared');
                window.storyDebug?.logSuccess('Story systems prepared');
            } else {
                console.warn('⚠️ Story system not loaded - falling back to classic mode');
                window.storyDebug?.logError('Story system classes not found');
            }
        } catch (error) {
            console.error('❌ Story system initialization error:', error);
            window.storyDebug?.logError(`Story system init error: ${error.message}`);
        }

        // Create terminal with story system pre-attached
        window.storyDebug?.log('Creating terminal...');
        this.terminal = new Terminal();
        
        // Attach story systems to terminal
        if (storyEngine) {
            this.terminal.story = storyEngine;
            this.storyEngine = storyEngine;
            console.log('✅ StoryEngine attached to terminal');
            window.storyDebug?.logSuccess('StoryEngine attached to terminal');
            
            // Create mission system now that terminal exists
            if (typeof MissionSystem !== 'undefined') {
                this.missionSystem = new MissionSystem(this.terminal, storyEngine);
                this.terminal.missionSystem = this.missionSystem;
                console.log('✅ MissionSystem attached to terminal');
                window.storyDebug?.logSuccess('MissionSystem attached');
            }
            
            // Create immersive startup (but don't auto-start)
            if (typeof ImmersiveStartup !== 'undefined') {
                this.immersiveStartup = new ImmersiveStartup(this.terminal, storyEngine);
                console.log('✅ ImmersiveStartup initialized');
                window.storyDebug?.logSuccess('ImmersiveStartup initialized');
                
                // Make immersive startup available for manual trigger
                window.startStoryExperience = async () => {
                    console.log('🎬 Starting immersive experience...');
                    window.storyDebug?.logSystem('Starting immersive experience...');
                    await this.immersiveStartup.begin();
                };
            }
        }
        
        // PHASE 5: Initialize advanced animation systems
        console.log('🎬 Initializing Phase 5 Advanced Animation Systems...');
        try {
            // Check if animation classes are available
            if (typeof AnimationIntegration !== 'undefined') {
                const animationSuccess = await this.terminal.initializeAdvancedAnimations();
                if (animationSuccess) {
                    console.log('✅ Phase 5 Advanced Animations integrated with terminal');
                } else {
                    console.warn('⚠️ Phase 5 Advanced Animations failed to initialize');
                }
            } else {
                console.warn('⚠️ Phase 5 Animation classes not loaded');
            }
        } catch (error) {
            console.error('❌ Phase 5 Animation initialization error:', error);
        }
        
        // Initialize legacy puzzle system for compatibility (if story system fails)
        if (!this.storyEngine && typeof initializePuzzleSystem !== 'undefined') {
            const { puzzleState, hintSystem, puzzleDetection } = initializePuzzleSystem();
            this.puzzleState = puzzleState;
            this.hintSystem = hintSystem;
            this.puzzleDetection = puzzleDetection;
            
            // Register puzzle commands with terminal
            if (typeof PuzzleCommands !== 'undefined') {
                PuzzleCommands.register(Commands, puzzleState, hintSystem);
            }
            
            console.log('🔐 Legacy puzzle system integrated');
        }
        
        console.log('✅ Terminal system initialized');
    }

    /**
     * Initialize global event listeners
     */
    initializeEventListeners() {
        // Window resize
        window.addEventListener('resize', Utils.debounce(() => {
            this.resizeCanvas();
        }, 250));

        // Keyboard shortcuts and puzzle interactions
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeydown(e);
        });

        // Prevent zoom on mobile
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        });

        // Handle visibility changes
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Theme toggle button if present
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.cycleTheme());
        }

        // Initialize Konami code detection
        this.initializeKonamiCode();

        console.log('✅ Event listeners initialized');
    }

    /**
     * Initialize Konami code detection
     */
    initializeKonamiCode() {
        this.konamiSequence = [];
        this.konamiCode = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];

        document.addEventListener('keydown', (e) => {
            this.konamiSequence.push(e.code);
            
            // Keep only the last 10 keys
            if (this.konamiSequence.length > this.konamiCode.length) {
                this.konamiSequence.shift();
            }
            
            // Check if sequence matches
            if (this.konamiSequence.length === this.konamiCode.length) {
                if (this.konamiSequence.every((key, index) => key === this.konamiCode[index])) {
                    this.triggerKonamiCode();
                }
            }
        });
    }

    /**
     * Trigger Konami code effects
     */
    triggerKonamiCode() {
        if (this.terminal && this.terminal.commands.konami) {
            this.terminal.commands.konami(this.terminal, []);
        } else {
            console.log('🎮 Konami code activated!');
        }
        
        // Reset sequence
        this.konamiSequence = [];
    }

    /**
     * Initialize theme system
     */
    initializeTheme() {
        // Load saved theme or use default
        const savedTheme = Utils.storage('selectedTheme') || 'dystopian-noir';
        this.setTheme(savedTheme);
        
        console.log(`✅ Theme initialized: ${savedTheme}`);
    }

    /**
     * Resize canvas to fill window
     */
    resizeCanvas() {
        if (!this.matrixCanvas) return;

        this.matrixCanvas.width = window.innerWidth;
        this.matrixCanvas.height = window.innerHeight;
        
        // Reinitialize context properties after resize
        if (this.matrixContext) {
            this.matrixContext.fillStyle = 'rgba(0, 0, 0, 0.05)';
            this.matrixContext.font = '12px "Courier New", monospace';
        }
    }

    /**
     * Start Matrix rain animation - HIGH-PERFORMANCE 60fps VERSION
     */
    startMatrixRain() {
        if (!this.matrixCanvas || !this.matrixContext) return;

        const canvas = this.matrixCanvas;
        const ctx = this.matrixContext;
        
        // Matrix characters - reduced set for better performance
        const chars = '01アイウエオカキク'.split('');
        
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = Array(columns).fill(1);
        
        let animationId;
        let lastFrameTime = 0;
        const targetFPS = 30; // 30fps for good balance of smoothness and performance
        const frameDelay = 1000 / targetFPS;

        const draw = (currentTime) => {
            // Frame rate control
            if (currentTime - lastFrameTime < frameDelay) {
                animationId = requestAnimationFrame(draw);
                return;
            }
            
            lastFrameTime = currentTime;
            
            // Semi-transparent black background for fade effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.06)'; // Slightly more opaque for better performance
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Green text
            ctx.fillStyle = '#00ff00'; // Direct color instead of CSS var for performance
            ctx.font = `${fontSize}px "Courier New", monospace`;

            // Draw characters - optimized loop
            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                // Reset drop when it goes off screen - simplified logic
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                
                drops[i]++;
            }
            
            animationId = requestAnimationFrame(draw);
        };

        // Start high-performance animation
        animationId = requestAnimationFrame(draw);
        this.matrixAnimation = animationId;
        console.log('✅ Matrix rain started (60fps optimized)');
    }

    /**
     * Start background effects - PERFORMANCE OPTIMIZED
     */
    startBackgroundEffects() {
        // Only start essential effects for better performance
        this.startScanlines();
        
        // Reduce frequency of expensive effects
        this.startOptimizedFlicker();
        
        console.log('✅ Background effects started (performance optimized)');
    }

    /**
     * Start scanline effect - CSS optimized
     */
    startScanlines() {
        const terminal = document.getElementById('terminal-content');
        if (!terminal) return;

        // Add scanline overlay with GPU acceleration
        const scanlines = document.createElement('div');
        scanlines.className = 'scanlines';
        scanlines.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            background: linear-gradient(transparent 50%, rgba(0, 255, 0, 0.02) 51%);
            background-size: 100% 4px;
            will-change: transform;
            animation: scanlines 0.1s linear infinite;
        `;
        
        terminal.appendChild(scanlines);
    }

    /**
     * Start optimized flicker effect - Reduced frequency for performance
     */
    startOptimizedFlicker() {
        const terminal = document.getElementById('terminal-content');
        if (!terminal) return;

        // Use requestAnimationFrame for smoother performance
        let lastFlicker = 0;
        const flickerCheck = (currentTime) => {
            if (currentTime - lastFlicker > 500) { // Check every 500ms instead of 100ms
                if (Math.random() < 0.01) { // 1% chance (reduced from 2%)
                    terminal.style.opacity = '0.95';
                    setTimeout(() => {
                        terminal.style.opacity = '1';
                    }, 30); // Shorter flicker for better performance
                }
                lastFlicker = currentTime;
            }
            requestAnimationFrame(flickerCheck);
        };
        
        requestAnimationFrame(flickerCheck);
    }

    /**
     * Start random glitch effects
     */
    startRandomGlitches() {
        setInterval(() => {
            if (Math.random() < 0.005) { // 0.5% chance every second
                this.triggerGlitchEffect();
            }
        }, 1000);
    }

    /**
     * Trigger glitch effect
     */
    triggerGlitchEffect() {
        const terminal = document.getElementById('terminal-content');
        if (!terminal) return;

        terminal.classList.add('glitch');
        setTimeout(() => {
            terminal.classList.remove('glitch');
        }, 200);
    }

    /**
     * Handle global keyboard shortcuts
     */
    handleGlobalKeydown(e) {
        // Prevent F12 dev tools (for immersion)
        if (e.key === 'F12') {
            e.preventDefault();
            if (this.terminal) {
                this.terminal.typeMessage('Access denied. System security protocols active.', 'error');
            }
        }

        // Ctrl+Shift+I (dev tools)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            if (this.terminal) {
                this.terminal.typeMessage('Unauthorized inspection attempt detected.', 'error');
            }
        }

        // Alt+F4 (close window) - show message instead
        if (e.altKey && e.key === 'F4') {
            e.preventDefault();
            if (this.terminal) {
                this.terminal.typeMessage('Cannot exit the GRID. You are part of the system now.', 'system');
            }
        }

        // Theme cycling with Ctrl+T
        if (e.ctrlKey && e.key === 't') {
            e.preventDefault();
            this.cycleTheme();
        }
    }

    /**
     * Handle visibility changes (tab switching)
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Pause animations when tab is hidden
            if (this.matrixAnimation) {
                clearInterval(this.matrixAnimation);
            }
        } else {
            // Resume animations when tab becomes visible
            this.startMatrixRain();
        }
    }

    /**
     * Set theme
     */
    setTheme(themeName) {
        const root = document.documentElement;
        const themes = ['dystopian-noir', 'synthwave', 'acid-burn', 'ghost-shell', 'digital-decay'];
        
        // Remove all theme classes
        themes.forEach(theme => root.classList.remove(theme));
        
        // Add new theme
        if (themes.includes(themeName)) {
            root.classList.add(themeName);
            Utils.storage('selectedTheme', themeName);
            
            if (this.terminal) {
                this.terminal.typeMessage(`Theme changed to: ${themeName}`, 'info');
            }
        }
    }

    /**
     * Cycle through themes
     */
    cycleTheme() {
        const themes = ['dystopian-noir', 'synthwave', 'acid-burn', 'ghost-shell', 'digital-decay'];
        const current = Utils.storage('selectedTheme') || 'dystopian-noir';
        const currentIndex = themes.indexOf(current);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        
        this.setTheme(nextTheme);
    }

    /**
     * Handle initialization errors
     */
    handleInitializationError(error) {
        // Create basic error display
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #000;
            color: #f00;
            padding: 20px;
            border: 1px solid #f00;
            font-family: monospace;
            z-index: 9999;
        `;
        errorDiv.innerHTML = `
            <h2>SYSTEM ERROR</h2>
            <p>Failed to initialize GRID interface.</p>
            <p>Error: ${error.message}</p>
            <p>Please refresh to try again.</p>
        `;
        
        document.body.appendChild(errorDiv);
    }

    /**
     * Shutdown the application
     */
    shutdown() {
        if (this.matrixAnimation) {
            clearInterval(this.matrixAnimation);
        }
        
        console.log('🔌 Application shutdown');
    }

    /**
     * Get application status
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            terminalReady: this.terminal !== null,
            canvasReady: this.matrixCanvas !== null
        };
    }
}

// Initialize application when script loads
const app = new App();

// Make app globally available for debugging
window.app = app;

// Handle page unload
window.addEventListener('beforeunload', () => {
    app.shutdown();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}

console.log('🌐 Retro Cyber World loaded');