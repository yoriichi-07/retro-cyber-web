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
     * Initialize terminal system
     */
    async initializeTerminal() {
        if (typeof Terminal === 'undefined') {
            throw new Error('Terminal class not loaded');
        }

        this.terminal = new Terminal();
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

        // Keyboard shortcuts
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

        console.log('✅ Event listeners initialized');
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
     * Start Matrix rain animation
     */
    startMatrixRain() {
        if (!this.matrixCanvas || !this.matrixContext) return;

        const canvas = this.matrixCanvas;
        const ctx = this.matrixContext;
        
        // Matrix characters
        const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const chars = matrixChars.split('');
        
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        const draw = () => {
            // Semi-transparent black background for fade effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Green text
            ctx.fillStyle = 'var(--color-accent)';
            ctx.font = `${fontSize}px "Courier New", monospace`;

            // Draw characters
            for (let i = 0; i < drops.length; i++) {
                const text = Utils.randomItem(chars);
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                // Reset drop when it goes off screen
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                
                drops[i]++;
            }
        };

        // Start animation
        this.matrixAnimation = setInterval(draw, 50);
        console.log('✅ Matrix rain started');
    }

    /**
     * Start background effects
     */
    startBackgroundEffects() {
        // Scanline effect
        this.startScanlines();
        
        // Flicker effect
        this.startFlicker();
        
        // Random glitch effects
        this.startRandomGlitches();
        
        console.log('✅ Background effects started');
    }

    /**
     * Start scanline effect
     */
    startScanlines() {
        const terminal = document.getElementById('terminal-content');
        if (!terminal) return;

        // Add scanline overlay
        const scanlines = document.createElement('div');
        scanlines.className = 'scanlines';
        scanlines.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            background: linear-gradient(transparent 50%, rgba(0, 255, 0, 0.03) 51%);
            background-size: 100% 4px;
            animation: scanlines 0.1s linear infinite;
        `;
        
        terminal.appendChild(scanlines);
    }

    /**
     * Start flicker effect
     */
    startFlicker() {
        const terminal = document.getElementById('terminal-content');
        if (!terminal) return;

        setInterval(() => {
            if (Math.random() < 0.02) { // 2% chance every 100ms
                terminal.style.opacity = '0.9';
                setTimeout(() => {
                    terminal.style.opacity = '1';
                }, 50);
            }
        }, 100);
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