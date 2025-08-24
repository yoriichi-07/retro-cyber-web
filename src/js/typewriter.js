/* Typewriter Effect System for Retro Cyber World */
/* Handles text animation and effects throughout the interface */

class Typewriter {
    constructor() {
        this.queue = [];
        this.isTyping = false;
        this.defaultSpeed = 50;
        this.defaultPause = 1000;
        this.canSkip = false;
        this.currentTask = null;
    }

    /**
     * Add typing task to queue
     * @param {Object} task - Typing task configuration
     */
    addToQueue(task) {
        this.queue.push(task);
        if (!this.isTyping) {
            this.processQueue();
        }
        return this;
    }

    /**
     * Type text with options - main public method
     * @param {Element|string} element - Target element
     * @param {string} text - Text to type
     * @param {Object} options - Typing options
     */
    type(element, text, options = {}) {
        return new Promise((resolve) => {
            this.addToQueue({
                type: 'type',
                element,
                text,
                resolve,
                ...options
            });
        });
    }

    /**
     * Process typing queue with improved management
     */
    async processQueue() {
        if (this.queue.length === 0) {
            this.isTyping = false;
            this.currentTask = null;
            return;
        }

        this.isTyping = true;
        const task = this.queue.shift();
        this.currentTask = task;
        
        try {
            await this.executeTask(task);
            if (task.resolve) task.resolve();
        } catch (error) {
            console.error('Typewriter error:', error);
            if (task.resolve) task.resolve();
        }

        // Process next task with dynamic delay
        const delay = task.nextDelay || task.pause || 100;
        setTimeout(() => this.processQueue(), delay);
    }

    /**
     * Skip current typing animation
     */
    skip() {
        if (this.currentTask && this.currentTask.canSkip !== false) {
            this.currentTask.skip = true;
        }
    }

    /**
     * Set typing speed for next operations
     * @param {number} speed - Milliseconds per character
     */
    setSpeed(speed) {
        this.defaultSpeed = speed;
        return this;
    }

    /**
     * Execute typing task
     * @param {Object} task - Task to execute
     */
    async executeTask(task) {
        switch (task.type) {
            case 'type':
                await this.typeText(task);
                break;
            case 'clear':
                await this.clearElement(task);
                break;
            case 'replace':
                await this.replaceText(task);
                break;
            case 'append':
                await this.appendText(task);
                break;
            case 'glitch':
                await this.glitchText(task);
                break;
            default:
                console.warn('Unknown typewriter task type:', task.type);
        }
    }

    /**
     * Type text with character-by-character animation (Enhanced)
     * @param {Object} task - Typing task
     */
    async typeText(task) {
        const { 
            element, 
            text, 
            speed = this.defaultSpeed, 
            cursor = true, 
            sound = false,
            variableSpeed = true,
            corrections = false,
            htmlSupport = false
        } = task;
        
        if (typeof element === 'string') {
            task.element = document.querySelector(element);
        }
        
        if (!task.element) {
            console.warn('Typewriter target element not found');
            return;
        }

        // Clear element
        task.element.textContent = '';
        
        // Add cursor if requested
        if (cursor) {
            task.element.classList.add('typing-cursor');
        }

        // Enhanced typing with realistic variations
        for (let i = 0; i <= text.length; i++) {
            // Check for skip
            if (task.skip) {
                task.element.textContent = text;
                break;
            }

            const currentText = text.substring(0, i);
            
            if (htmlSupport) {
                task.element.innerHTML = currentText;
            } else {
                task.element.textContent = currentText;
            }
            
            // Simulate typing errors and corrections
            if (corrections && Math.random() < 0.02 && i < text.length - 1) {
                // Type wrong character
                const wrongChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                task.element.textContent = currentText + wrongChar;
                await Utils.delay(speed * 2);
                
                // Backspace
                task.element.textContent = currentText;
                await Utils.delay(speed);
            }
            
            // Play typing sound with variation
            if (sound && Math.random() < 0.8) {
                this.playTypingSound(0.01 + Math.random() * 0.02);
            }
            
            // Variable typing speed for realism
            let delay = speed;
            if (variableSpeed) {
                // Slower after punctuation, faster for common letters
                const char = text[i - 1];
                if (char === '.' || char === '!' || char === '?') {
                    delay = speed * 3;
                } else if (char === ',' || char === ';') {
                    delay = speed * 2;
                } else if (char === ' ') {
                    delay = speed * 0.5;
                } else {
                    delay = speed + (Math.random() * 30 - 15);
                }
            }
            
            await Utils.delay(Math.max(10, delay));
        }

        // Remove cursor
        if (cursor) {
            task.element.classList.remove('typing-cursor');
        }
    }

    /**
     * Clear element content
     * @param {Object} task - Clear task
     */
    async clearElement(task) {
        if (typeof task.element === 'string') {
            task.element = document.querySelector(task.element);
        }
        
        if (task.element) {
            task.element.textContent = '';
        }
    }

    /**
     * Replace text with typing animation
     * @param {Object} task - Replace task
     */
    async replaceText(task) {
        // First clear, then type
        await this.clearElement(task);
        await Utils.delay(200);
        await this.typeText(task);
    }

    /**
     * Append text to existing content
     * @param {Object} task - Append task
     */
    async appendText(task) {
        const { element, text, speed = this.defaultSpeed } = task;
        
        if (typeof element === 'string') {
            task.element = document.querySelector(element);
        }
        
        if (!task.element) return;

        const existingText = task.element.textContent;
        
        for (let i = 0; i < text.length; i++) {
            task.element.textContent = existingText + text.substring(0, i + 1);
            await Utils.delay(speed + (Math.random() * 10 - 5));
        }
    }

    /**
     * Create glitch effect on text
     * @param {Object} task - Glitch task
     */
    async glitchText(task) {
        const { element, text, duration = 2000, intensity = 5 } = task;
        
        if (typeof element === 'string') {
            task.element = document.querySelector(element);
        }
        
        if (!task.element) return;

        const originalText = task.element.textContent;
        const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?~`1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        
        const startTime = Date.now();
        
        while (Date.now() - startTime < duration) {
            let glitchedText = '';
            
            for (let i = 0; i < text.length; i++) {
                if (Math.random() < intensity / 100) {
                    glitchedText += Utils.randomItem(chars.split(''));
                } else {
                    glitchedText += text[i];
                }
            }
            
            task.element.textContent = glitchedText;
            await Utils.delay(50 + Math.random() * 50);
        }
        
        // End with correct text
        task.element.textContent = text;
    }

    /**
     * Type multiple lines with delays
     * @param {Array} lines - Array of line objects
     * @param {Element|string} container - Container element
     */
    async typeLines(lines, container) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (!container) return;

        for (const line of lines) {
            const lineElement = document.createElement('div');
            lineElement.className = line.className || 'terminal-line';
            container.appendChild(lineElement);
            
            await this.typeText({
                element: lineElement,
                text: line.text,
                speed: line.speed || this.defaultSpeed,
                cursor: line.cursor !== false
            });
            
            await Utils.delay(line.pause || 300);
        }
    }

    /**
     * Matrix-style digital rain effect
     * @param {Element|string} element - Target element
     * @param {Object} options - Effect options
     */
    async matrixRain(element, options = {}) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return;

        const {
            duration = 5000,
            density = 0.1,
            speed = 100,
            characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
        } = options;

        const chars = characters.split('');
        const startTime = Date.now();
        
        while (Date.now() - startTime < duration) {
            if (Math.random() < density) {
                const span = document.createElement('span');
                span.className = 'matrix-char';
                span.textContent = Utils.randomItem(chars);
                span.style.color = `hsl(${120 + Math.random() * 60}, 100%, ${50 + Math.random() * 50}%)`;
                
                element.appendChild(span);
                
                // Remove after animation
                setTimeout(() => {
                    if (span.parentNode) {
                        span.parentNode.removeChild(span);
                    }
                }, 2000);
            }
            
            await Utils.delay(speed);
        }
    }

    /**
     * Scramble text effect
     * @param {Element|string} element - Target element
     * @param {string} finalText - Final text to reveal
     * @param {Object} options - Effect options
     */
    async scrambleText(element, finalText, options = {}) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return;

        const {
            duration = 2000,
            scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()',
            revealDelay = 50
        } = options;

        const chars = scrambleChars.split('');
        const textLength = finalText.length;
        let revealedCount = 0;
        
        const scrambleInterval = setInterval(() => {
            let displayText = '';
            
            for (let i = 0; i < textLength; i++) {
                if (i < revealedCount) {
                    displayText += finalText[i];
                } else {
                    displayText += Utils.randomItem(chars);
                }
            }
            
            element.textContent = displayText;
        }, 50);

        // Gradually reveal characters
        const revealInterval = setInterval(() => {
            revealedCount++;
            if (revealedCount >= textLength) {
                clearInterval(revealInterval);
                clearInterval(scrambleInterval);
                element.textContent = finalText;
            }
        }, revealDelay);
    }

    /**
     * Binary countdown effect
     * @param {Element|string} element - Target element
     * @param {number} from - Starting number
     * @param {number} to - Ending number
     * @param {Object} options - Effect options
     */
    async binaryCountdown(element, from, to, options = {}) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (!element) return;

        const { duration = 3000, showDecimal = false } = options;
        const step = (from - to) / (duration / 100);
        let current = from;

        const interval = setInterval(() => {
            const binary = Math.floor(current).toString(2).padStart(8, '0');
            let displayText = binary;
            
            if (showDecimal) {
                displayText += ` (${Math.floor(current)})`;
            }
            
            element.textContent = displayText;
            current -= step;
            
            if (current <= to) {
                clearInterval(interval);
                const finalBinary = to.toString(2).padStart(8, '0');
                element.textContent = showDecimal ? `${finalBinary} (${to})` : finalBinary;
            }
        }, 100);
    }

    /**
     * Play enhanced typing sound effect
     * @param {number} volume - Sound volume (0-1)
     */
    playTypingSound(volume = 0.01) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Vary frequency for different key sounds
            const baseFreq = 800 + Math.random() * 400;
            oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.08);
        } catch (e) {
            // Audio not supported or blocked
        }
    }

    /**
     * Type multiple lines with automatic paragraph breaks
     * @param {Array} lines - Array of strings or line objects
     * @param {Element|string} container - Container element
     * @param {Object} options - Typing options
     */
    async typeMultipleLines(lines, container, options = {}) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (!container) return;

        for (let i = 0; i < lines.length; i++) {
            const line = typeof lines[i] === 'string' ? { text: lines[i] } : lines[i];
            
            const lineElement = document.createElement('div');
            lineElement.className = line.className || 'terminal-line';
            container.appendChild(lineElement);
            
            await this.type(lineElement, line.text, {
                speed: line.speed || options.speed || this.defaultSpeed,
                cursor: line.cursor !== false,
                sound: line.sound || options.sound,
                variableSpeed: line.variableSpeed !== false,
                corrections: line.corrections || options.corrections
            });
            
            // Scroll into view
            lineElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
            
            await Utils.delay(line.pause || options.linePause || 200);
        }
    }

    /**
     * Type with dramatic pauses for storytelling
     * @param {Element|string} element - Target element
     * @param {string} text - Text to type
     * @param {Object} options - Options including pause markers
     */
    async typeDramatic(element, text, options = {}) {
        const pauseMarker = options.pauseMarker || '...';
        const shortPause = options.shortPause || 500;
        const longPause = options.longPause || 1500;
        
        const segments = text.split(pauseMarker);
        
        for (let i = 0; i < segments.length; i++) {
            await this.type(element, segments[i], {
                ...options,
                cursor: i === segments.length - 1 // Only show cursor on last segment
            });
            
            if (i < segments.length - 1) {
                await Utils.delay(text.includes('...') ? longPause : shortPause);
            }
        }
    }

    /**
     * Pause all typing operations
     */
    pause() {
        this.isPaused = true;
    }

    /**
     * Resume typing operations
     */
    resume() {
        this.isPaused = false;
    }

    /**
     * Clear all queued tasks
     */
    clearQueue() {
        this.queue = [];
        this.isTyping = false;
    }

    /**
     * Get queue status
     */
    getStatus() {
        return {
            isTyping: this.isTyping,
            queueLength: this.queue.length
        };
    }
}

// Create global instance
const typewriter = new Typewriter();

// Export for module systems or make globally available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Typewriter, typewriter };
} else {
    window.Typewriter = Typewriter;
    window.typewriter = typewriter;
}