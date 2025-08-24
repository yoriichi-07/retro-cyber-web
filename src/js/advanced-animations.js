/* Phase 5: Advanced Animations & Effects System */
/* Complete implementation of Matrix rain, glitch effects, particles, and performance optimization */

/**
 * Advanced Matrix Digital Rain Implementation
 * Features: Multi-color rain, speed variations, brightness gradients, character morphing
 */
class AdvancedMatrixRain {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Configuration
        this.config = {
            fontSize: options.fontSize || 14,
            speed: options.speed || 1,
            density: options.density || 0.8,
            fadeAlpha: options.fadeAlpha || 0.04,
            colorVariation: options.colorVariation || true,
            characterMorphing: options.characterMorphing || true,
            interactiveMode: options.interactiveMode || true,
            ...options
        };
        
        // Character sets for authentic Matrix effect
        this.characterSets = {
            katakana: 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトホモヨョロヲゴゾドボポヴッン',
            numbers: '0123456789',
            letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
            custom: '田由甲申甴电甶男甸甹町画甼甽甾甿畀畁畂畃畄',
            binary: '01',
            hex: '0123456789ABCDEF'
        };
        
        // Combined character string
        this.chars = this.characterSets.katakana + this.characterSets.numbers + this.characterSets.custom;
        
        // Animation properties
        this.columns = 0;
        this.drops = [];
        this.columnSpeeds = [];
        this.columnColors = [];
        this.columnCharSets = [];
        this.lastTime = 0;
        this.animationId = null;
        
        // Interactive properties
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseInfluence = 100;
        
        // Performance monitoring
        this.frameCount = 0;
        this.lastFPSUpdate = 0;
        this.currentFPS = 60;
        
        this.initialize();
        this.setupEventListeners();
    }
    
    initialize() {
        this.resizeCanvas();
        this.initializeColumns();
        
        // Set up canvas properties for high DPI displays
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.ctx.scale(dpr, dpr);
        this.ctx.textBaseline = 'top';
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.config.fontSize);
        this.initializeColumns();
    }
    
    initializeColumns() {
        this.drops = new Array(this.columns).fill(1);
        this.columnSpeeds = new Array(this.columns);
        this.columnColors = new Array(this.columns);
        this.columnCharSets = new Array(this.columns);
        
        // Initialize each column with unique properties
        for (let i = 0; i < this.columns; i++) {
            this.columnSpeeds[i] = 0.5 + Math.random() * 1.5; // Varying speeds
            this.columnColors[i] = this.getRandomColor();
            this.columnCharSets[i] = this.getRandomCharSet();
            this.drops[i] = Math.random() * -100; // Stagger initial positions
        }
    }
    
    getRandomColor() {
        const colors = [
            '#00ff00', // Classic green
            '#00ff41', // Bright green
            '#008f11', // Dark green
            '#00ffff', // Cyan
            '#ffffff', // White (rare)
            '#ffff00', // Yellow (rare)
        ];
        
        if (!this.config.colorVariation) {
            return '#00ff00'; // Classic green only
        }
        
        // Weighted random selection (green variants more common)
        const weights = [40, 30, 20, 5, 3, 2];
        const random = Math.random() * 100;
        let weightSum = 0;
        
        for (let i = 0; i < weights.length; i++) {
            weightSum += weights[i];
            if (random <= weightSum) {
                return colors[i];
            }
        }
        
        return colors[0];
    }
    
    getRandomCharSet() {
        const sets = ['katakana', 'numbers', 'custom', 'binary'];
        const weights = [60, 25, 10, 5]; // Katakana most common
        const random = Math.random() * 100;
        let weightSum = 0;
        
        for (let i = 0; i < weights.length; i++) {
            weightSum += weights[i];
            if (random <= weightSum) {
                return this.characterSets[sets[i]];
            }
        }
        
        return this.characterSets.katakana;
    }
    
    setupEventListeners() {
        if (this.config.interactiveMode) {
            this.canvas.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            });
        }
        
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }
    
    draw(timestamp = 0) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // Performance monitoring
        this.updateFPS(timestamp);
        
        // Create fading effect with semi-transparent black
        this.ctx.fillStyle = `rgba(0, 0, 0, ${this.config.fadeAlpha})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw each column
        for (let i = 0; i < this.drops.length; i++) {
            this.drawColumn(i, deltaTime);
        }
        
        // Schedule next frame
        this.animationId = requestAnimationFrame((timestamp) => this.draw(timestamp));
    }
    
    drawColumn(columnIndex, deltaTime) {
        const x = columnIndex * this.config.fontSize;
        const y = this.drops[columnIndex] * this.config.fontSize;
        
        // Get character from column's character set
        const charSet = this.columnCharSets[columnIndex];
        let char = charSet[Math.floor(Math.random() * charSet.length)];
        
        // Character morphing effect
        if (this.config.characterMorphing && Math.random() < 0.05) {
            this.columnCharSets[columnIndex] = this.getRandomCharSet();
        }
        
        // Interactive mouse effect
        if (this.config.interactiveMode) {
            const distanceToMouse = Math.sqrt(
                Math.pow(x - this.mouseX, 2) + Math.pow(y - this.mouseY, 2)
            );
            
            if (distanceToMouse < this.mouseInfluence) {
                // Change character more frequently near mouse
                char = this.characterSets.symbols[Math.floor(Math.random() * this.characterSets.symbols.length)];
                
                // Brighten color near mouse
                this.ctx.shadowBlur = 20;
                this.ctx.shadowColor = this.columnColors[columnIndex];
            } else {
                this.ctx.shadowBlur = 0;
            }
        }
        
        // Set font and color with brightness gradient
        this.ctx.font = `${this.config.fontSize}px "Courier New", monospace`;
        
        // Create brightness gradient effect
        const brightness = Math.max(0.3, 1 - (this.drops[columnIndex] * 0.02));
        const color = this.adjustColorBrightness(this.columnColors[columnIndex], brightness);
        this.ctx.fillStyle = color;
        
        // Draw the character
        this.ctx.fillText(char, x, y);
        
        // Move drop down with varying speed
        const speed = this.columnSpeeds[columnIndex] * this.config.speed;
        this.drops[columnIndex] += speed;
        
        // Reset drop when it goes off screen
        if (this.drops[columnIndex] * this.config.fontSize > this.canvas.height) {
            if (Math.random() > 0.975) {
                this.drops[columnIndex] = 0;
                // Occasionally change column properties
                if (Math.random() < 0.1) {
                    this.columnColors[columnIndex] = this.getRandomColor();
                    this.columnSpeeds[columnIndex] = 0.5 + Math.random() * 1.5;
                }
            }
        }
    }
    
    adjustColorBrightness(hexColor, brightness) {
        // Convert hex to RGB, adjust brightness, convert back
        const hex = hexColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        const newR = Math.floor(r * brightness);
        const newG = Math.floor(g * brightness);
        const newB = Math.floor(b * brightness);
        
        return `rgb(${newR}, ${newG}, ${newB})`;
    }
    
    updateFPS(timestamp) {
        this.frameCount++;
        
        if (timestamp - this.lastFPSUpdate >= 1000) {
            this.currentFPS = this.frameCount;
            this.frameCount = 0;
            this.lastFPSUpdate = timestamp;
            
            // Trigger quality adjustment if needed
            this.adjustQualityBasedOnFPS();
        }
    }
    
    adjustQualityBasedOnFPS() {
        if (this.currentFPS < 30) {
            // Reduce quality for better performance
            this.config.fadeAlpha = 0.08;
            this.config.characterMorphing = false;
            this.config.colorVariation = false;
        } else if (this.currentFPS > 55) {
            // Increase quality
            this.config.fadeAlpha = 0.04;
            this.config.characterMorphing = true;
            this.config.colorVariation = true;
        }
    }
    
    start() {
        if (!this.animationId) {
            this.animationId = requestAnimationFrame((timestamp) => this.draw(timestamp));
        }
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    intensify(factor = 2) {
        // Increase rain intensity for dramatic effect
        this.config.speed *= factor;
        this.config.density *= factor;
        
        // Add more drops
        for (let i = 0; i < this.columns; i++) {
            if (Math.random() < 0.3) {
                this.drops[i] = Math.random() * -50;
            }
        }
    }
    
    normalize() {
        // Return to normal intensity
        this.config.speed = 1;
        this.config.density = 0.8;
    }
}

/**
 * Advanced Glitch Effects System
 * Multi-layer glitch, RGB split, chromatic aberration, text corruption
 */
class GlitchGenerator {
    constructor() {
        this.activeGlitches = new Set();
        this.glitchStyles = new Map();
        this.intensityLevels = {
            low: 0.3,
            medium: 0.6,
            high: 1.0,
            extreme: 1.5
        };
    }
    
    static applyGlitch(element, intensity = 1, duration = 200) {
        const glitchStyles = [
            `clip-path: inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0)`,
            `transform: translate(${(Math.random() - 0.5) * 10 * intensity}px, ${(Math.random() - 0.5) * 10 * intensity}px)`,
            `filter: hue-rotate(${Math.random() * 360}deg) contrast(${1 + Math.random() * intensity}) saturate(${1 + Math.random() * intensity})`
        ];
        
        const originalStyle = element.style.cssText;
        element.style.cssText += '; ' + glitchStyles.join('; ');
        
        setTimeout(() => {
            element.style.cssText = originalStyle;
        }, duration + Math.random() * 100);
    }
    
    static applyRGBSplit(element, intensity = 1) {
        const offsetX = (Math.random() - 0.5) * 10 * intensity;
        const offsetY = (Math.random() - 0.5) * 10 * intensity;
        
        element.style.textShadow = `
            ${offsetX}px ${offsetY}px 0px #ff00ff,
            ${-offsetX}px ${-offsetY}px 0px #00ffff,
            0px 0px 10px #ffffff
        `;
        
        setTimeout(() => {
            element.style.textShadow = '';
        }, 150 + Math.random() * 100);
    }
    
    static applyChromaticAberration(element, intensity = 1) {
        const offset = intensity * 3;
        element.style.filter = `
            drop-shadow(${offset}px 0 0 #ff0000) 
            drop-shadow(${-offset}px 0 0 #00ffff)
        `;
        
        setTimeout(() => {
            element.style.filter = '';
        }, 100 + Math.random() * 200);
    }
    
    static createMultiLayerGlitch(element, options = {}) {
        const {
            intensity = 1,
            duration = 2000,
            layers = 3
        } = options;
        
        // Add data attribute for CSS-based glitch
        element.setAttribute('data-text', element.textContent);
        element.classList.add('glitch-advanced');
        
        // Apply CSS glitch styles
        const glitchCSS = `
            .glitch-advanced {
                position: relative;
                animation: glitch-main ${duration}ms infinite;
            }
            
            .glitch-advanced::before,
            .glitch-advanced::after {
                content: attr(data-text);
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
            
            .glitch-advanced::before {
                animation: glitch-1 ${duration * 0.75}ms infinite linear alternate-reverse;
                color: #ff00ff;
                z-index: -1;
                clip-path: inset(${Math.random() * 50}% 0 ${Math.random() * 50}% 0);
            }
            
            .glitch-advanced::after {
                animation: glitch-2 ${duration * 0.5}ms infinite linear alternate-reverse;
                color: #00ffff;
                z-index: -2;
                clip-path: inset(${Math.random() * 50}% 0 ${Math.random() * 50}% 0);
            }
            
            @keyframes glitch-main {
                0%, 90%, 100% { transform: translate(0); }
                5%, 15% { transform: translate(${(Math.random() - 0.5) * 4 * intensity}px, ${(Math.random() - 0.5) * 4 * intensity}px); }
                10% { transform: translate(${(Math.random() - 0.5) * 4 * intensity}px, ${(Math.random() - 0.5) * 4 * intensity}px); }
            }
            
            @keyframes glitch-1 {
                0%, 100% { clip-path: inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0); }
                50% { clip-path: inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0); }
            }
            
            @keyframes glitch-2 {
                0%, 100% { clip-path: inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0); }
                50% { clip-path: inset(${Math.random() * 100}% 0 ${Math.random() * 100}% 0); }
            }
        `;
        
        // Inject CSS if not already present
        if (!document.getElementById('glitch-styles')) {
            const style = document.createElement('style');
            style.id = 'glitch-styles';
            style.textContent = glitchCSS;
            document.head.appendChild(style);
        }
        
        // Remove glitch after duration
        setTimeout(() => {
            element.classList.remove('glitch-advanced');
            element.removeAttribute('data-text');
        }, duration);
    }
}

/**
 * Text Corruption Effects
 * Character substitution, wave corruption, binary modes
 */
class TextCorruption {
    constructor() {
        this.glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?01234567890';
        this.binaryChars = '01';
        this.hexChars = '0123456789ABCDEF';
        this.activeCorruptions = new Map();
    }
    
    static corruptText(text, corruption = 0.1, charSet = 'default') {
        const glitchChars = {
            default: '!@#$%^&*()_+-=[]{}|;:,.<>?01234567890',
            binary: '01',
            hex: '0123456789ABCDEF',
            symbols: '▓▒░█▄▀▐│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌',
            matrix: 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピ'
        };
        
        const chars = glitchChars[charSet] || glitchChars.default;
        
        return text.split('').map(char => {
            if (Math.random() < corruption && char !== ' ') {
                return chars[Math.floor(Math.random() * chars.length)];
            }
            return char;
        }).join('');
    }
    
    static animateCorruption(element, duration = 2000, options = {}) {
        const {
            maxCorruption = 0.3,
            charSet = 'default',
            waveEffect = true
        } = options;
        
        const originalText = element.textContent;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                // Wave-based corruption intensity
                const corruption = waveEffect 
                    ? Math.sin(progress * Math.PI) * maxCorruption
                    : maxCorruption * (1 - Math.abs(progress - 0.5) * 2);
                
                element.textContent = TextCorruption.corruptText(originalText, corruption, charSet);
                requestAnimationFrame(animate);
            } else {
                element.textContent = originalText;
            }
        };
        
        animate();
    }
    
    static glitchType(element, text, speed = 50) {
        let currentIndex = 0;
        const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?01234567890';
        
        const typeChar = () => {
            if (currentIndex < text.length) {
                // Add some glitch characters before the real character
                const glitchCount = Math.floor(Math.random() * 3);
                let displayText = text.substring(0, currentIndex);
                
                for (let i = 0; i < glitchCount; i++) {
                    displayText += chars[Math.floor(Math.random() * chars.length)];
                }
                
                element.textContent = displayText;
                
                setTimeout(() => {
                    element.textContent = text.substring(0, currentIndex + 1);
                    currentIndex++;
                    setTimeout(typeChar, speed + Math.random() * speed);
                }, 30);
            }
        };
        
        element.textContent = '';
        typeChar();
    }
}

/**
 * Visual Noise & Static Generator
 * Canvas-based static overlay, animated noise patterns
 */
class StaticNoise {
    constructor(canvas, intensity = 0.1) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.intensity = intensity;
        this.imageData = null;
        this.animationId = null;
        this.patterns = ['white', 'green', 'blue', 'rainbow'];
        this.currentPattern = 'white';
        
        this.initializeImageData();
    }
    
    initializeImageData() {
        this.imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
    }
    
    generate(pattern = 'white') {
        const data = this.imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = Math.random() * 255 * this.intensity;
            
            switch (pattern) {
                case 'green':
                    data[i] = 0;           // Red
                    data[i + 1] = noise;   // Green
                    data[i + 2] = 0;       // Blue
                    break;
                case 'blue':
                    data[i] = 0;           // Red
                    data[i + 1] = 0;       // Green
                    data[i + 2] = noise;   // Blue
                    break;
                case 'rainbow':
                    data[i] = Math.random() * 255 * this.intensity;     // Red
                    data[i + 1] = Math.random() * 255 * this.intensity; // Green
                    data[i + 2] = Math.random() * 255 * this.intensity; // Blue
                    break;
                default: // white
                    data[i] = noise;       // Red
                    data[i + 1] = noise;   // Green
                    data[i + 2] = noise;   // Blue
            }
            
            data[i + 3] = 255; // Alpha
        }
        
        this.ctx.putImageData(this.imageData, 0, 0);
    }
    
    animate(speed = 100, pattern = 'white') {
        this.currentPattern = pattern;
        
        const draw = () => {
            this.generate(this.currentPattern);
            this.animationId = setTimeout(() => {
                requestAnimationFrame(draw);
            }, speed);
        };
        
        draw();
    }
    
    stop() {
        if (this.animationId) {
            clearTimeout(this.animationId);
            this.animationId = null;
        }
        
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    setIntensity(intensity) {
        this.intensity = Math.max(0, Math.min(1, intensity));
    }
    
    pulse(duration = 1000, maxIntensity = 0.5) {
        const originalIntensity = this.intensity;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                // Sine wave pulse
                this.intensity = originalIntensity + (Math.sin(progress * Math.PI) * maxIntensity);
                requestAnimationFrame(animate);
            } else {
                this.intensity = originalIntensity;
            }
        };
        
        animate();
    }
}