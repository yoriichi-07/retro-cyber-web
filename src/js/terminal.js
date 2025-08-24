/* Terminal Controller for Retro Cyber World */
/* Main terminal interface and command processing */

class Terminal {
    constructor() {
        this.initializeElements();
        this.initializeState();
        this.initializeEventListeners();
        this.initializeHistory();
        this.setupPrompt();
        
        // Boot sequence
        this.startBootSequence();
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
        this.cursor = document.getElementById('terminal-cursor');

        if (!this.terminal || !this.output || !this.input) {
            throw new Error('Required terminal elements not found');
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
        this.fileSystem = this.initializeFileSystem();
        this.gameState = {
            level: 1,
            score: 0,
            hintsUsed: 0,
            foundSecrets: [],
            unlockedAreas: ['home']
        };
    }

    /**
     * Initialize event listeners
     */
    initializeEventListeners() {
        // Input handling
        this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.input.addEventListener('input', (e) => this.handleInput(e));
        
        // Terminal click focus
        this.terminal.addEventListener('click', () => this.focusInput());
        
        // Window focus/blur
        window.addEventListener('focus', () => this.onWindowFocus());
        window.addEventListener('blur', () => this.onWindowBlur());
        
        // Prevent context menu for immersion
        this.terminal.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    /**
     * Initialize command history from storage
     */
    initializeHistory() {
        const stored = Utils.storage('terminalHistory');
        if (stored && Array.isArray(stored)) {
            this.commandHistory = stored.slice(-50); // Keep last 50 commands
        }
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
     * Boot sequence animation
     */
    async startBootSequence() {
        this.isBooting = true;
        this.input.disabled = true;
        
        const bootMessages = [
            'GRID TERMINAL v2.0.47 - INITIALIZING...',
            'Checking memory banks... [OK]',
            'Loading neural pathways... [OK]',
            'Establishing quantum link... [OK]',
            'Syncing with the Grid... [OK]',
            'Security protocols active... [OK]',
            '',
            'Welcome to the GRID, user.',
            'Type "help" for available commands.',
            'Type "tutorial" to begin your journey.',
            ''
        ];

        for (let i = 0; i < bootMessages.length; i++) {
            await this.typeMessage(bootMessages[i], 'system');
            await Utils.delay(300 + Math.random() * 200);
        }

        this.isBooting = false;
        this.input.disabled = false;
        this.focusInput();
    }

    /**
     * Type message with animation
     * @param {string} message - Message to type
     * @param {string} type - Message type (system, error, success, info)
     */
    async typeMessage(message, type = 'output') {
        const line = document.createElement('div');
        line.className = `terminal-line terminal-${type}`;
        
        if (message === '') {
            line.innerHTML = '&nbsp;';
            this.output.appendChild(line);
            this.scrollToBottom();
            return;
        }

        this.output.appendChild(line);
        
        // Type character by character for important messages
        if (type === 'system' || type === 'story') {
            for (let i = 0; i < message.length; i++) {
                line.textContent = message.substring(0, i + 1);
                await Utils.delay(20 + Math.random() * 10);
                this.scrollToBottom();
            }
        } else {
            line.textContent = message;
            this.scrollToBottom();
        }
    }

    /**
     * Handle key down events
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyDown(e) {
        if (this.isBooting || this.isLocked) return;

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
                
            case 'l':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.clearScreen();
                }
                break;
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
     * Add command to history
     * @param {string} command - Command to add
     */
    addToHistory(command) {
        this.commandHistory.push(command);
        this.historyIndex = this.commandHistory.length;
        
        // Save to storage
        Utils.storage('terminalHistory', this.commandHistory.slice(-50));
    }

    /**
     * Navigate command history
     * @param {number} direction - Direction (-1 for up, 1 for down)
     */
    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;

        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.commandHistory.length) {
            this.historyIndex = this.commandHistory.length;
            this.input.value = '';
            return;
        }

        this.input.value = this.commandHistory[this.historyIndex] || '';
    }

    /**
     * Basic autocomplete
     */
    autocomplete() {
        const input = this.input.value;
        if (!input) return;

        const commands = Object.keys(Commands || {});
        const matches = commands.filter(cmd => cmd.startsWith(input.toLowerCase()));
        
        if (matches.length === 1) {
            this.input.value = matches[0];
        } else if (matches.length > 1) {
            this.typeMessage(`Available: ${matches.join(', ')}`, 'info');
        }
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
}

// Export for module systems or make globally available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Terminal;
} else {
    window.Terminal = Terminal;
}