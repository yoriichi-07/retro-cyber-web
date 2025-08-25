/* Terminal Controller for Retro Cyber World */
/* Main terminal interface and command processing */

class Terminal {
    constructor() {
        this.initializeElements();
        this.initializeState();
        this.initializeEventListeners();
        this.initializeHistory();
        this.setupPrompt();
        
        // Delay boot sequence to allow story system attachment
        setTimeout(() => {
            this.startBootSequence();
        }, 100);
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        this.terminal = document.getElementById('terminal-content');
        this.output = document.getElementById('terminal-output');
        this.inputContainer = document.getElementById('terminal-input-container');
        this.prompt = document.getElementById('terminal-prompt');
        this.input = document.getElementById('terminal-input');
        this.cursor = null; // Will create if needed

        if (!this.terminal) {
            throw new Error('PHASE2_UPDATED: Terminal element (#terminal-content) not found');
        }
        if (!this.output) {
            throw new Error('PHASE2_UPDATED: Output element (#terminal-output) not found');
        }
        if (!this.input) {
            throw new Error('PHASE2_UPDATED: Input element (#terminal-input) not found');
        }
    }

    /**
     * Initialize terminal state
     */
    initializeState() {
        this.isBooting = true;
        this.isLocked = false;
        this.currentUser = 'anonymous';
        this.currentDirectory = '/home/user';
        this.commandHistory = [];
        this.historyIndex = -1;
        this.maxHistory = 100;
        this.maxOutputLines = 1000;
        this.fileSystem = this.initializeFileSystem();
        this.gameState = {
            level: 1,
            score: 0,
            hintsUsed: 0,
            foundSecrets: [],
            unlockedAreas: ['home'],
            achievements: [],
            sessionStart: Date.now()
        };
        
        // Advanced terminal state
        this.currentTheme = 'dystopian-noir';
        this.soundEnabled = false;
        this.animations = true;
        this.autoSave = true;
        
        // Command state tracking
        this.lastCommand = '';
        this.commandCount = 0;
        this.errorCount = 0;
        
        // Performance monitoring
        this.performanceStats = {
            frameRate: 60,
            lastFrameTime: performance.now(),
            isTyping: false,
            animationSkipped: false
        };
        
        // EMERGENCY: User control for animation speed
        this.animationSpeed = 'smart'; // 'instant', 'fast', 'smart', 'animated'
        this.skipAnimations = false;
        
        // Input mode for story input (bypasses command processing)
        this.inputMode = null; // null = command mode, 'direct' = direct input mode
        this.inputCallback = null; // callback for direct input mode
    }

    /**
     * Initialize event listeners (Enhanced)
     */
    initializeEventListeners() {
        // Input handling with advanced features
        this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.input.addEventListener('input', (e) => this.handleInput(e));
        this.input.addEventListener('paste', (e) => this.handlePaste(e));
        
        // Terminal click focus
        this.terminal.addEventListener('click', () => this.focusInput());
        
        // Window focus/blur
        window.addEventListener('focus', () => this.onWindowFocus());
        window.addEventListener('blur', () => this.onWindowBlur());
        
        // Prevent context menu for immersion (optional right-click menu later)
        this.terminal.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e);
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleGlobalKeyDown(e));
        
        // Auto-save game state
        if (this.autoSave) {
            setInterval(() => this.saveState(), 30000); // Save every 30 seconds
        }
        
        // Dynamic prompt updates
        setInterval(() => this.updatePrompt(), 1000);
    }

    /**
     * Handle global keyboard shortcuts
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleGlobalKeyDown(e) {
        // Ctrl+Alt+C - Clear screen
        if (e.ctrlKey && e.altKey && e.key === 'c') {
            e.preventDefault();
            this.clearScreen();
        }
        
        // Ctrl+Alt+T - Toggle theme
        if (e.ctrlKey && e.altKey && e.key === 't') {
            e.preventDefault();
            this.executeCommand('theme next');
        }
        
        // Ctrl+Alt+M - Toggle matrix
        if (e.ctrlKey && e.altKey && e.key === 'm') {
            e.preventDefault();
            this.executeCommand('matrix');
        }
        
        // Escape - Focus terminal
        if (e.key === 'Escape') {
            e.preventDefault();
            this.focusInput();
        }
    }

    /**
     * Handle paste events
     * @param {ClipboardEvent} e - Paste event
     */
    handlePaste(e) {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData('text');
        
        // Security: limit paste length and clean content
        const cleanPaste = paste.substring(0, 500).replace(/[\r\n]/g, ' ');
        
        this.input.value += cleanPaste;
        this.typeMessage('Pasted content from clipboard', 'info');
    }

    /**
     * Show context menu (future feature)
     * @param {MouseEvent} e - Mouse event
     */
    showContextMenu(e) {
        // Placeholder for future context menu implementation
        // Could include: Copy, Paste, Clear, Theme selection, etc.
    }

    /**
     * Initialize command history from storage (Enhanced)
     */
    initializeHistory() {
        const stored = Utils.storage('terminalHistory');
        if (stored) {
            if (Array.isArray(stored)) {
                // Legacy format
                this.commandHistory = stored.slice(-50);
            } else if (stored.commands) {
                // New format with metadata
                this.commandHistory = stored.commands.slice(-50);
            }
        }
    }

    /**
     * Save current terminal state
     */
    saveState() {
        if (!this.autoSave) return;
        
        const state = {
            gameState: this.gameState,
            currentDirectory: this.currentDirectory,
            currentUser: this.currentUser,
            currentTheme: this.currentTheme,
            settings: {
                soundEnabled: this.soundEnabled,
                animations: this.animations,
                autoSave: this.autoSave
            },
            stats: {
                commandCount: this.commandCount,
                errorCount: this.errorCount,
                sessionStart: this.gameState.sessionStart,
                lastActive: Date.now()
            }
        };
        
        Utils.storage('terminalState', state);
    }

    /**
     * Load saved terminal state
     */
    loadState() {
        const state = Utils.storage('terminalState');
        if (!state) return;
        
        if (state.gameState) {
            this.gameState = { ...this.gameState, ...state.gameState };
        }
        
        if (state.currentDirectory) {
            this.currentDirectory = state.currentDirectory;
        }
        
        if (state.currentUser) {
            this.currentUser = state.currentUser;
        }
        
        if (state.settings) {
            this.soundEnabled = state.settings.soundEnabled || false;
            this.animations = state.settings.animations !== false;
            this.autoSave = state.settings.autoSave !== false;
        }
        
        if (state.stats) {
            this.commandCount = state.stats.commandCount || 0;
            this.errorCount = state.stats.errorCount || 0;
        }
    }

    /**
     * Get terminal statistics
     */
    getStats() {
        const sessionTime = Date.now() - this.gameState.sessionStart;
        
        return {
            commandCount: this.commandCount,
            errorCount: this.errorCount,
            successRate: this.commandCount > 0 ? ((this.commandCount - this.errorCount) / this.commandCount * 100).toFixed(1) : 100,
            sessionTime: Math.floor(sessionTime / 1000),
            averageCommandTime: this.commandCount > 0 ? Math.floor(sessionTime / this.commandCount / 1000) : 0,
            hintsUsed: this.gameState.hintsUsed,
            secretsFound: this.gameState.foundSecrets.length,
            score: this.gameState.score,
            level: this.gameState.level
        };
    }

    /**
     * Toggle terminal features
     */
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.typeMessage(`Sound ${this.soundEnabled ? 'enabled' : 'disabled'}`, 'info');
        this.saveState();
    }

    toggleAnimations() {
        this.animations = !this.animations;
        this.typeMessage(`Animations ${this.animations ? 'enabled' : 'disabled'}`, 'info');
        this.saveState();
    }

    /**
     * Setup terminal prompt
     */
    setupPrompt() {
        this.updatePrompt();
    }

    /**
     * Update terminal prompt display
     */
    updatePrompt() {
        if (this.prompt) {
            const timestamp = Utils.getCyberDate().split(' ')[1];
            this.prompt.textContent = `[${timestamp}] ${this.currentUser}@GRID:${this.currentDirectory}$ `;
        }
    }

    /**
     * Set custom prompt text (used by story system)
     */
    setPrompt(promptText) {
        if (this.prompt) {
            this.prompt.textContent = promptText;
        }
    }

    /**
     * Boot sequence animation - UPDATED FOR MANUAL START
     */
    async startBootSequence() {
        this.isBooting = true;
        this.input.disabled = true;
        
        window.storyDebug?.log('Terminal boot sequence starting...');
        
        // Always show standard boot - story system only starts on "start" command
        const bootMessages = [
            '████████████████████████████████████████████████████████████',
            '██                                                        ██',
            '██                GRID ACCESS TERMINAL v2.1               ██',
            '██                    INITIALIZING...                     ██',
            '██                                                        ██',
            '████████████████████████████████████████████████████████████',
            '',
            'Establishing secure connection...',
            'Bypassing corporate firewalls...',
            'Initializing quantum encryption...',
            'Loading neural interface protocols...',
            '',
            '>> CONNECTION ESTABLISHED <<',
            '',
            '═══════════════════════════════════════════════════════════════',
            '║  WELCOME TO THE GRID                                        ║',
            '║                                                             ║',
            '║  Standard Mode: Type "help" for available commands          ║',
            '║  Story Mode: Type "start" to begin Grid Infiltrator         ║',
            '║                                                             ║',
            '═══════════════════════════════════════════════════════════════',
            ''
        ];

        for (let i = 0; i < bootMessages.length; i++) {
            await this.typeMessage(bootMessages[i], 'system');
            await Utils.delay(200); // Faster boot sequence
        }

        this.isBooting = false;
        this.input.disabled = false;
        this.focusInput();
    }

    /**
     * Type message with ULTRA-HIGH-PERFORMANCE animation - EMERGENCY SPEED FIX
     * @param {string} message - Message to type
     * @param {string} type - Message type (system, error, success, info)
     */
    async typeMessage(message, type = 'output') {
        const line = document.createElement('div');
        line.className = `terminal-line terminal-${type}`;
        
        // Add timestamp for system messages
        if (type === 'system' || type === 'error') {
            const timestamp = new Date().toLocaleTimeString();
            line.setAttribute('data-timestamp', timestamp);
        }
        
        if (message === '') {
            line.innerHTML = '&nbsp;';
            this.output.appendChild(line);
            this.manageLinesMemory();
            this.scrollToBottom();
            return;
        }

        this.output.appendChild(line);
        this.manageLinesMemory();
        
        // EMERGENCY SPEED SCALING - Content length determines speed
        const messageLength = message.length;
        
        // OVERRIDE: Check user preference for instant mode
        if (this.animationSpeed === 'instant' || this.skipAnimations) {
            line.textContent = message;
            this.scrollToBottom();
            return;
        }
        
        // FOR USABILITY: Long content gets instant or super-fast display
        if (messageLength > 500 || type === 'help' || message.includes('COMMAND') || message.includes('help')) {
            // INSTANT display for help/documentation - NO MORE 2-MINUTE WAITS!
            line.textContent = message;
            this.scrollToBottom();
            return;
        } else if (this.animationSpeed === 'fast' || messageLength > 200) {
            // SUPER FAST for medium content (1ms per char = 0.2-0.5 seconds total)
            return this.ultraFastTypewriter(line, message, 1);
        } else if (messageLength > 100) {
            // FAST for short-medium content (3ms per char = 0.3 seconds total)
            return this.ultraFastTypewriter(line, message, 3);
        } else if (type === 'system' || type === 'info') {
            // ANIMATED for very short content only (5ms per char = 0.5 seconds max)
            const delay = this.animationSpeed === 'animated' ? 5 : 2;
            return this.ultraFastTypewriter(line, message, delay);
        } else if (type === 'error') {
            // INSTANT for errors - usability critical
            line.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
            line.textContent = message;
            setTimeout(() => {
                line.style.backgroundColor = '';
            }, 200);
            this.errorCount++;
            this.scrollToBottom();
        } else {
            // INSTANT for regular output
            line.textContent = message;
            this.scrollToBottom();
        }
    }
    
    /**
     * Ultra-fast typewriter with maximum performance
     */
    async ultraFastTypewriter(line, message, charDelay) {
        // EMERGENCY: Signal typing in progress for animation priority
        this.performanceStats.isTyping = true;
        
        // Pause heavy animations during typing for performance
        if (window.retroCyberApp && window.retroCyberApp.pauseHeavyAnimations) {
            window.retroCyberApp.pauseHeavyAnimations();
        }
        
        return new Promise((resolve) => {
            let charIndex = 0;
            let lastFrameTime = performance.now();
            
            const typeFrame = (currentTime) => {
                // Check for emergency skip
                if (this.skipAnimations) {
                    line.textContent = message;
                    this.scrollToBottom();
                    this.performanceStats.isTyping = false;
                    // Resume animations
                    if (window.retroCyberApp && window.retroCyberApp.resumeHeavyAnimations) {
                        window.retroCyberApp.resumeHeavyAnimations();
                    }
                    resolve();
                    return;
                }
                
                // Process multiple characters per frame for speed
                const timeDiff = currentTime - lastFrameTime;
                const charsToAdd = Math.max(1, Math.floor(timeDiff / charDelay));
                
                if (charIndex < message.length) {
                    const endIndex = Math.min(charIndex + charsToAdd, message.length);
                    line.textContent = message.substring(0, endIndex);
                    charIndex = endIndex;
                    lastFrameTime = currentTime;
                    
                    // Throttled scrolling for performance
                    if (charIndex % 10 === 0 || charIndex >= message.length) {
                        this.scrollToBottom();
                    }
                } else {
                    this.scrollToBottom();
                    this.performanceStats.isTyping = false;
                    // Resume animations
                    if (window.retroCyberApp && window.retroCyberApp.resumeHeavyAnimations) {
                        window.retroCyberApp.resumeHeavyAnimations();
                    }
                    resolve();
                    return;
                }
                requestAnimationFrame(typeFrame);
            };
            
            requestAnimationFrame(typeFrame);
        });
    }

    /**
     * Skip current animation - EMERGENCY USER CONTROL
     */
    skipCurrentAnimation() {
        this.skipAnimations = true;
        this.performanceStats.animationSkipped = true;
        
        // Force complete any ongoing animations
        const lines = this.output.querySelectorAll('.terminal-line');
        lines.forEach(line => {
            if (line.getAttribute('data-animating')) {
                line.removeAttribute('data-animating');
            }
        });
        
        this.typeMessage('[SKIP] Animation skipped - instant mode activated', 'info');
    }
    
    /**
     * Toggle animation speed - USER CONTROL
     */
    toggleAnimationSpeed() {
        const speeds = ['instant', 'fast', 'smart', 'animated'];
        const currentIndex = speeds.indexOf(this.animationSpeed);
        const nextIndex = (currentIndex + 1) % speeds.length;
        this.animationSpeed = speeds[nextIndex];
        
        this.typeMessage(`[SPEED] Animation speed: ${this.animationSpeed}`, 'info');
    }
    
    /**
     * Set instant mode for emergency usability
     */
    setInstantMode() {
        this.animationSpeed = 'instant';
        this.typeMessage('[INSTANT] INSTANT MODE: All animations disabled for maximum speed', 'info');
    }

    /**
     * Manage terminal output lines to prevent memory issues
     */
    manageLinesMemory() {
        const lines = this.output.children;
        
        if (lines.length > this.maxOutputLines) {
            // Remove oldest lines, but keep important ones
            const linesToRemove = lines.length - this.maxOutputLines;
            
            for (let i = 0; i < linesToRemove; i++) {
                const line = lines[0];
                
                // Keep system messages and errors
                if (!line.classList.contains('terminal-system') && 
                    !line.classList.contains('terminal-error')) {
                    line.remove();
                } else if (i < linesToRemove / 2) {
                    // Remove some system messages if we have too many
                    line.remove();
                }
            }
        }
    }

    /**
     * Handle key down events (Enhanced)
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyDown(e) {
        if (this.isBooting || this.isLocked) {
            // Allow Ctrl+C even during boot/lock
            if (e.ctrlKey && e.key === 'c') {
                this.interrupt();
            }
            return;
        }

        // Handle direct input mode (for story input like character names)
        if (this.inputMode === 'direct') {
            if (e.key === 'Enter') {
                e.preventDefault();
                const input = this.input.value.trim();
                this.input.value = '';
                
                // Display the input
                this.typeMessage(input, 'input');
                
                // Call the callback and exit input mode
                if (this.inputCallback) {
                    this.inputCallback(input);
                    this.inputCallback = null;
                }
                this.inputMode = null;
                this.updatePrompt();
            }
            return; // Don't process normal command shortcuts in input mode
        }

        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                this.processCommand();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.navigateHistory(-1);
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                this.navigateHistory(1);
                break;
                
            case 'Tab':
                e.preventDefault();
                this.autocomplete();
                break;
                
            case 'Home':
                e.preventDefault();
                this.input.setSelectionRange(0, 0);
                break;
                
            case 'End':
                e.preventDefault();
                this.input.setSelectionRange(this.input.value.length, this.input.value.length);
                break;
                
            // Keyboard shortcuts
            case 'l':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.clearScreen();
                }
                break;
                
            case 'c':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.interrupt();
                }
                break;
                
            // EMERGENCY: Escape key to skip animations
            case 'Escape':
                e.preventDefault();
                this.skipCurrentAnimation();
                break;
                
            // EMERGENCY: Speed control shortcuts
            case 'F1':
                e.preventDefault();
                this.toggleAnimationSpeed();
                break;
                
            case 'u':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.input.value = '';
                }
                break;
                
            case 'k':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.input.value = this.input.value.substring(0, this.input.selectionStart);
                }
                break;
                
            case 'a':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.input.setSelectionRange(0, 0);
                }
                break;
                
            case 'e':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.input.setSelectionRange(this.input.value.length, this.input.value.length);
                }
                break;
                
            case 'w':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.deleteLastWord();
                }
                break;
        }
    }

    /**
     * Interrupt current operation (Ctrl+C)
     */
    interrupt() {
        this.typeMessage('^C', 'error');
        this.input.value = '';
        this.isLocked = false;
        this.focusInput();
        
        // Stop any running typewriter operations
        if (window.typewriter) {
            window.typewriter.skip();
        }
    }

    /**
     * Delete last word from input (Ctrl+W)
     */
    deleteLastWord() {
        const value = this.input.value;
        const words = value.split(' ');
        if (words.length > 1) {
            words.pop();
            this.input.value = words.join(' ') + ' ';
        } else {
            this.input.value = '';
        }
    }

    /**
     * Handle input events
     * @param {InputEvent} e - Input event
     */
    handleInput(e) {
        // Update prompt in real-time
        this.updatePrompt();
    }

    /**
     * Process command input
     */
    async processCommand() {
        const command = this.input.value.trim();
        this.input.value = '';

        if (!command) return;

        // Add to history
        this.addToHistory(command);

        // Display command
        await this.typeMessage(`${this.prompt.textContent}${command}`, 'input');

        // Process command
        await this.executeCommand(command);
        
        this.updatePrompt();
        this.focusInput();
    }

    /**
     * Execute command
     * @param {string} commandLine - Full command line
     */
    async executeCommand(commandLine) {
        const [command, ...args] = commandLine.split(' ');
        const cmd = command.toLowerCase();

        try {
            if (typeof Commands !== 'undefined' && Commands[cmd]) {
                await Commands[cmd](this, args);
            } else {
                await this.typeMessage(`Command not found: ${command}`, 'error');
                await this.typeMessage('Type "help" for available commands.', 'info');
            }
        } catch (error) {
            await this.typeMessage(`Error executing command: ${error.message}`, 'error');
            console.error('Command execution error:', error);
        }
    }

    /**
     * Add command to history (Enhanced)
     * @param {string} command - Command to add
     */
    addToHistory(command) {
        // Don't add empty commands or duplicates
        if (!command.trim() || this.commandHistory[this.commandHistory.length - 1] === command) {
            return;
        }
        
        this.commandHistory.push(command);
        this.commandCount++;
        
        // Limit history size
        if (this.commandHistory.length > this.maxHistory) {
            this.commandHistory.shift();
        }
        
        this.historyIndex = this.commandHistory.length;
        
        // Save to storage with timestamp
        Utils.storage('terminalHistory', {
            commands: this.commandHistory.slice(-50),
            lastSession: Date.now()
        });
    }

    /**
     * Navigate command history (Enhanced)
     * @param {number} direction - Direction (-1 for up, 1 for down)
     */
    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;

        const previousIndex = this.historyIndex;
        this.historyIndex += direction;
        
        // Boundary checks
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length;
            this.input.value = '';
            return;
        }

        // Visual feedback for history navigation
        if (this.historyIndex !== previousIndex) {
            this.input.value = this.commandHistory[this.historyIndex] || '';
            
            // Show history indicator briefly
            if (this.commandHistory.length > 1) {
                this.showHistoryIndicator();
            }
        }
    }

    /**
     * Show history navigation indicator
     */
    showHistoryIndicator() {
        // Create temporary indicator
        const indicator = document.createElement('span');
        indicator.className = 'history-indicator';
        indicator.textContent = `[${this.historyIndex + 1}/${this.commandHistory.length}]`;
        indicator.style.cssText = 'position: absolute; right: 10px; color: var(--secondary-color); font-size: 0.8em; opacity: 0.7;';
        
        this.inputContainer.style.position = 'relative';
        this.inputContainer.appendChild(indicator);
        
        // Remove after 1 second
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 1000);
    }

    /**
     * Enhanced autocomplete with smart suggestions
     */
    autocomplete() {
        const input = this.input.value.trim();
        const cursorPos = this.input.selectionStart;
        const beforeCursor = input.substring(0, cursorPos);
        const afterCursor = input.substring(cursorPos);
        
        // Split into words to get current word being typed
        const words = beforeCursor.split(' ');
        const currentWord = words[words.length - 1];
        
        if (words.length === 1) {
            // Command completion
            this.autocompleteCommand(currentWord, afterCursor);
        } else {
            // Argument completion
            this.autocompleteArgument(words[0], currentWord, words.length - 1);
        }
    }

    /**
     * Autocomplete command names
     * @param {string} partial - Partial command
     * @param {string} afterCursor - Text after cursor
     */
    autocompleteCommand(partial, afterCursor) {
        const commands = Object.keys(Commands || {});
        const matches = commands.filter(cmd => cmd.startsWith(partial.toLowerCase()));
        
        if (matches.length === 1) {
            // Single match - complete it
            const completion = matches[0].substring(partial.length);
            this.input.value = matches[0] + (afterCursor ? ' ' + afterCursor : ' ');
            this.input.setSelectionRange(matches[0].length + 1, matches[0].length + 1);
        } else if (matches.length > 1) {
            // Multiple matches - show them
            this.typeMessage(`Suggestions: ${matches.join(', ')}`, 'info');
            
            // Find common prefix
            const commonPrefix = this.findCommonPrefix(matches);
            if (commonPrefix.length > partial.length) {
                this.input.value = commonPrefix + afterCursor;
                this.input.setSelectionRange(commonPrefix.length, commonPrefix.length);
            }
        } else if (partial.length > 0) {
            // No matches - suggest similar commands
            const suggestions = this.findSimilarCommands(partial, commands);
            if (suggestions.length > 0) {
                this.typeMessage(`Did you mean: ${suggestions.join(', ')}?`, 'info');
            }
        }
    }

    /**
     * Autocomplete command arguments
     * @param {string} command - Command name
     * @param {string} partial - Partial argument
     * @param {number} argIndex - Argument index
     */
    autocompleteArgument(command, partial, argIndex) {
        switch (command.toLowerCase()) {
            case 'ls':
            case 'cd':
                this.autocompleteDirectory(partial);
                break;
            case 'cat':
                this.autocompleteFile(partial);
                break;
            case 'cipher':
                if (argIndex === 1) {
                    const methods = ['caesar', 'hex2ascii', 'ascii2hex', 'base64enc', 'base64dec'];
                    this.autocompleteFromList(partial, methods);
                }
                break;
            case 'theme':
                const themes = ['dystopian-noir', 'synthwave', 'acid-burn', 'ghost-shell', 'digital-decay'];
                this.autocompleteFromList(partial, themes);
                break;
            default:
                // Generic file/directory completion
                this.autocompleteFile(partial);
        }
    }

    /**
     * Autocomplete from a list of options
     * @param {string} partial - Partial input
     * @param {Array} options - Available options
     */
    autocompleteFromList(partial, options) {
        const matches = options.filter(opt => opt.startsWith(partial.toLowerCase()));
        
        if (matches.length === 1) {
            const currentInput = this.input.value;
            const words = currentInput.split(' ');
            words[words.length - 1] = matches[0];
            this.input.value = words.join(' ') + ' ';
        } else if (matches.length > 1) {
            this.typeMessage(`Options: ${matches.join(', ')}`, 'info');
        }
    }

    /**
     * Autocomplete directory names
     * @param {string} partial - Partial directory name
     */
    autocompleteDirectory(partial) {
        const contents = this.getCurrentDirectoryContents();
        if (!contents) return;
        
        const dirs = Object.keys(contents).filter(name => 
            contents[name].type === 'directory' && name.startsWith(partial)
        );
        
        this.autocompleteFromList(partial, dirs);
    }

    /**
     * Autocomplete file names
     * @param {string} partial - Partial file name
     */
    autocompleteFile(partial) {
        const contents = this.getCurrentDirectoryContents();
        if (!contents) return;
        
        const files = Object.keys(contents).filter(name => 
            name.startsWith(partial)
        );
        
        this.autocompleteFromList(partial, files);
    }

    /**
     * Find common prefix of strings
     * @param {Array} strings - Array of strings
     * @returns {string} Common prefix
     */
    findCommonPrefix(strings) {
        if (strings.length === 0) return '';
        
        let prefix = strings[0];
        for (let i = 1; i < strings.length; i++) {
            while (strings[i].indexOf(prefix) !== 0) {
                prefix = prefix.substring(0, prefix.length - 1);
                if (prefix === '') return '';
            }
        }
        return prefix;
    }

    /**
     * Find similar commands using simple string distance
     * @param {string} input - Input string
     * @param {Array} commands - Available commands
     * @returns {Array} Similar commands
     */
    findSimilarCommands(input, commands) {
        return commands
            .map(cmd => ({ cmd, distance: this.levenshteinDistance(input, cmd) }))
            .filter(item => item.distance <= 2)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 3)
            .map(item => item.cmd);
    }

    /**
     * Calculate Levenshtein distance between two strings
     * @param {string} a - First string
     * @param {string} b - Second string
     * @returns {number} Distance
     */
    levenshteinDistance(a, b) {
        const matrix = [];
        
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[b.length][a.length];
    }

    /**
     * Clear terminal screen
     */
    clearScreen() {
        this.output.innerHTML = '';
    }

    /**
     * Focus input field
     */
    focusInput() {
        if (!this.isBooting && !this.isLocked) {
            this.input.focus();
        }
    }

    /**
     * Scroll to bottom of terminal
     */
    scrollToBottom() {
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }

    /**
     * Window focus handler
     */
    onWindowFocus() {
        this.focusInput();
    }

    /**
     * Window blur handler
     */
    onWindowBlur() {
        // Could add pause functionality here
    }

    /**
     * Initialize file system
     */
    initializeFileSystem() {
        return {
            '/': {
                type: 'directory',
                contents: {
                    'home': {
                        type: 'directory',
                        contents: {
                            'user': {
                                type: 'directory',
                                contents: {
                                    'readme.txt': {
                                        type: 'file',
                                        content: 'Welcome to the GRID. Your journey begins here.\nUse "ls" to list files and "cat" to read them.'
                                    },
                                    'notes.txt': {
                                        type: 'file',
                                        content: 'Personal notes:\n- The system seems different today\n- Strange messages in the logs\n- Code fragments: 4A4F48'
                                    }
                                }
                            }
                        }
                    },
                    'var': {
                        type: 'directory',
                        contents: {
                            'log': {
                                type: 'directory',
                                contents: {
                                    'system.log': {
                                        type: 'file',
                                        content: '[ERROR] Neural pathway corruption detected\n[WARN] Memory banks showing anomalies\n[INFO] Backup protocols initiated'
                                    }
                                }
                            }
                        }
                    },
                    'bin': {
                        type: 'directory',
                        contents: {
                            'cipher': {
                                type: 'executable',
                                description: 'Text encryption utility'
                            },
                            'probe': {
                                type: 'executable',
                                description: 'Network analysis tool'
                            }
                        }
                    }
                }
            }
        };
    }

    /**
     * Get current directory contents
     */
    getCurrentDirectoryContents() {
        const path = this.currentDirectory === '/' ? [''] : this.currentDirectory.split('/').filter(p => p);
        let current = this.fileSystem['/'];
        
        for (const segment of path) {
            if (current.contents && current.contents[segment]) {
                current = current.contents[segment];
            } else {
                return null;
            }
        }
        
        return current.contents || {};
    }

    /**
     * Lock terminal
     */
    lock() {
        this.isLocked = true;
        this.input.disabled = true;
    }

    /**
     * Unlock terminal
     */
    unlock() {
        this.isLocked = false;
        this.input.disabled = false;
        this.focusInput();
    }

    /**
     * PHASE 5: Initialize Advanced Animation Systems
     */
    async initializeAdvancedAnimations() {
        try {
            // Create background canvas for animations
            const animationCanvas = document.createElement('canvas');
            animationCanvas.id = 'animation-canvas';
            animationCanvas.style.position = 'fixed';
            animationCanvas.style.top = '0';
            animationCanvas.style.left = '0';
            animationCanvas.style.width = '100%';
            animationCanvas.style.height = '100%';
            animationCanvas.style.pointerEvents = 'none';
            animationCanvas.style.zIndex = '-1';
            document.body.prepend(animationCanvas);

            // Set canvas size
            this.resizeAnimationCanvas(animationCanvas);
            window.addEventListener('resize', () => this.resizeAnimationCanvas(animationCanvas));

            // Initialize animation integration system
            this.animationIntegration = new AnimationIntegration();
            await this.animationIntegration.initialize(animationCanvas);

            // Initialize visual effects
            this.cinematicEffects = new CinematicEffects(animationCanvas);
            this.screenDistortion = new ScreenDistortion(animationCanvas);
            this.atmosphereEnhancement = new AtmosphereEnhancement(animationCanvas);

            // Start environmental atmosphere
            this.atmosphereEnhancement.setAmbientLevel(0.3);
            this.atmosphereEnhancement.setColorTint('#002010');

            // Activate base cinematic effects
            this.cinematicEffects.activateEffect('scanlines', { intensity: 0.2 });
            this.cinematicEffects.activateEffect('vignette', { intensity: 0.3 });
            this.cinematicEffects.activateEffect('filmGrain', { intensity: 0.1 });

            // Setup animation event handlers
            this.setupAnimationEventHandlers();

            console.log('🎬 Phase 5 Advanced Animation Systems Initialized');
            return true;

        } catch (error) {
            console.error('❌ Failed to initialize advanced animations:', error);
            return false;
        }
    }

    /**
     * Resize animation canvas to match viewport
     */
    resizeAnimationCanvas(canvas) {
        const dpr = window.devicePixelRatio || 1;
        const rect = document.body.getBoundingClientRect();
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
    }

    /**
     * Setup animation event handlers for terminal interactions
     */
    setupAnimationEventHandlers() {
        // Command execution events
        const originalExecuteCommand = this.executeCommand.bind(this);
        this.executeCommand = (command) => {
            // Trigger typing animation state
            this.triggerAnimationEvent('command', { command, type: 'start' });
            
            // Execute original command
            const result = originalExecuteCommand(command);
            
            // Trigger result animation state
            this.triggerAnimationEvent('command', { 
                command, 
                type: 'result', 
                success: !command.startsWith('error') 
            });
            
            return result;
        };

        // Error handling with glitch effects
        const originalTypeMessage = this.typeMessage.bind(this);
        this.typeMessage = (message, type = 'output') => {
            if (type === 'error') {
                this.triggerAnimationEvent('error', { message });
            }
            return originalTypeMessage(message, type);
        };

        // Boot sequence with cinematic effects
        const originalStartBootSequence = this.startBootSequence.bind(this);
        this.startBootSequence = () => {
            this.cinematicEffects.activateEffect('systemBoot', { duration: 5000 });
            return originalStartBootSequence();
        };

        // Listen for puzzle events
        document.addEventListener('puzzleDiscovered', (e) => {
            this.triggerAnimationEvent('discovery', e.detail);
        });

        document.addEventListener('puzzleCompleted', (e) => {
            this.triggerAnimationEvent('completion', e.detail);
        });
    }

    /**
     * Trigger animation events for different terminal states
     */
    triggerAnimationEvent(type, data = {}) {
        if (!this.animationIntegration) return;

        switch (type) {
            case 'command':
                if (data.type === 'start') {
                    this.animationIntegration.animationController.setState('typing');
                } else if (data.type === 'result') {
                    this.animationIntegration.animationController.setState(
                        data.success ? 'success' : 'error'
                    );
                }
                break;

            case 'error':
                this.animationIntegration.animationController.setState('error');
                this.screenDistortion.applyDistortion('glitch', 0.8, 500);
                this.atmosphereEnhancement.triggerEnvironmentalEvent('lightning', {
                    intensity: 0.5
                });
                break;

            case 'discovery':
                this.animationIntegration.animationController.setState('discovery');
                this.cinematicEffects.activateEffect('dataCorruption', { 
                    duration: 1000, 
                    intensity: 0.7 
                });
                this.atmosphereEnhancement.triggerEnvironmentalEvent('energyPulse', {
                    color: '#00ff80'
                });
                break;

            case 'completion':
                this.animationIntegration.animationController.setState('completion');
                this.cinematicEffects.activateEffect('matrixOverlay', { 
                    duration: 3000, 
                    intensity: 1.0 
                });
                this.atmosphereEnhancement.triggerEnvironmentalEvent('dataStorm', {
                    duration: 2000
                });
                break;

            case 'glitch':
                this.animationIntegration.animationController.setState('glitching');
                this.screenDistortion.applyDistortion('wave', 1.2, 800);
                this.screenDistortion.applyDistortion('ripple', 0.8, 1200);
                break;

            case 'network':
                this.cinematicEffects.activateEffect('networkTrace', { 
                    duration: 4000, 
                    intensity: 0.8 
                });
                break;

            case 'memory':
                this.cinematicEffects.activateEffect('memoryLeak', { 
                    duration: 3000, 
                    intensity: 0.9 
                });
                break;
        }

        // Dispatch custom event for external listeners
        const event = new CustomEvent('terminalAnimation', {
            detail: { type, data, timestamp: Date.now() }
        });
        document.dispatchEvent(event);
    }

    /**
     * Enhanced command processing with animation triggers
     */
    processCommandWithAnimations(command) {
        const cmd = command.toLowerCase().trim();
        
        // Special animation triggers for specific commands
        const animationTriggers = {
            'hack': 'glitch',
            'virus': 'glitch',
            'decrypt': 'discovery',
            'crack': 'discovery',
            'matrix': 'discovery',
            'trace': 'network',
            'ping': 'network',
            'connect': 'network',
            'memory': 'memory',
            'debug': 'memory',
            'core': 'memory'
        };

        // Check for animation triggers
        for (const [trigger, animationType] of Object.entries(animationTriggers)) {
            if (cmd.includes(trigger)) {
                this.triggerAnimationEvent(animationType, { command: cmd });
                break;
            }
        }
    }

    /**
     * Get animation system status
     */
    getAnimationStatus() {
        if (!this.animationIntegration) {
            return { enabled: false, status: 'not_initialized' };
        }

        return this.animationIntegration.getStatus();
    }

    /**
     * Control animation systems
     */
    setAnimationEnabled(enabled) {
        if (this.animationIntegration) {
            this.animationIntegration.enableAnimations(enabled);
        }
        this.animations = enabled;
    }

    /**
     * Set master animation intensity
     */
    setAnimationIntensity(intensity) {
        if (this.animationIntegration) {
            this.animationIntegration.setMasterIntensity(intensity);
        }
    }

    /**
     * Enter direct input mode for story input (bypasses command processing)
     * @param {function} callback - Function to call with the input value
     * @param {string} promptText - Optional prompt text to display
     */
    enterInputMode(callback, promptText = '') {
        this.inputMode = 'direct';
        this.inputCallback = callback;
        if (promptText) {
            this.typeMessage(promptText, 'input');
        }
        this.focusInput();
    }

    /**
     * Exit direct input mode and return to command processing
     */
    exitInputMode() {
        this.inputMode = null;
        this.inputCallback = null;
        this.updatePrompt();
    }

    /**
     * Check if terminal is in direct input mode
     */
    isInInputMode() {
        return this.inputMode === 'direct';
    }
}

// Export for module systems or make globally available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Terminal;
} else {
    window.Terminal = Terminal;
}