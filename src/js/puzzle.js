/* Puzzle System - Retro Cyber Web */
/* Multi-layered secret puzzle system with progression tracking */

/**
 * Phase 4: Secret Puzzle System
 * Three-stage puzzle progression with state management
 */

class PuzzleState {
    constructor() {
        this.currentStage = 1;
        this.discoveries = [];
        this.attempts = {};
        this.timeStarted = Date.now();
        this.hintsUsed = 0;
        this.completed = false;
        this.secrets = [];
        this.stage1Complete = false;
        this.stage2Complete = false;
        this.stage3Complete = false;
        this.loadProgress();
    }
    
    saveProgress() {
        try {
            const state = {
                currentStage: this.currentStage,
                discoveries: this.discoveries,
                attempts: this.attempts,
                timeStarted: this.timeStarted,
                hintsUsed: this.hintsUsed,
                completed: this.completed,
                secrets: this.secrets,
                stage1Complete: this.stage1Complete,
                stage2Complete: this.stage2Complete,
                stage3Complete: this.stage3Complete
            };
            localStorage.setItem('cyberpuzzle_progress', JSON.stringify(state));
        } catch (error) {
            console.warn('Failed to save puzzle progress:', error);
        }
    }
    
    loadProgress() {
        try {
            const saved = localStorage.getItem('cyberpuzzle_progress');
            if (saved) {
                const state = JSON.parse(saved);
                Object.assign(this, state);
            }
        } catch (error) {
            console.warn('Failed to load puzzle progress:', error);
        }
    }
    
    addDiscovery(clue, stage = null) {
        const discovery = {
            clue,
            timestamp: Date.now(),
            stage: stage || this.currentStage
        };
        
        if (!this.discoveries.find(d => d.clue === clue)) {
            this.discoveries.push(discovery);
            this.saveProgress();
            PuzzleAnalytics.trackEvent('discovery_made', discovery);
        }
    }
    
    addAttempt(command, success = false) {
        if (!this.attempts[command]) {
            this.attempts[command] = { count: 0, successes: 0 };
        }
        
        this.attempts[command].count++;
        if (success) {
            this.attempts[command].successes++;
        }
        
        this.saveProgress();
    }
    
    unlockStage(stage) {
        if (stage > this.currentStage) {
            this.currentStage = stage;
            PuzzleAnalytics.trackEvent('stage_unlocked', { stage });
        }
        
        // Mark previous stages as complete
        if (stage >= 2) this.stage1Complete = true;
        if (stage >= 3) this.stage2Complete = true;
        if (stage > 3) this.stage3Complete = true;
        
        this.saveProgress();
    }
    
    addSecret(secret) {
        if (!this.secrets.includes(secret)) {
            this.secrets.push(secret);
            this.saveProgress();
            PuzzleAnalytics.trackEvent('secret_found', { secret });
        }
    }
    
    completepuzzle() {
        this.completed = true;
        this.stage3Complete = true;
        this.saveProgress();
        PuzzleAnalytics.trackEvent('puzzle_completed', {
            timeElapsed: Date.now() - this.timeStarted,
            hintsUsed: this.hintsUsed,
            totalDiscoveries: this.discoveries.length
        });
    }
    
    reset() {
        localStorage.removeItem('cyberpuzzle_progress');
        Object.assign(this, new PuzzleState());
    }
    
    getProgressSummary() {
        const timeElapsed = Date.now() - this.timeStarted;
        return {
            stage: this.currentStage,
            discoveries: this.discoveries.length,
            secrets: this.secrets.length,
            hintsUsed: this.hintsUsed,
            timeElapsed: Math.floor(timeElapsed / 1000),
            completed: this.completed
        };
    }
}

class HintSystem {
    constructor() {
        this.hints = {
            stage1: [
                "Try viewing the page source code... (Ctrl+U)",
                "Look for hidden HTML comments throughout the page",
                "Check the CSS files for cryptic messages",
                "The answer might be invisible to the naked eye - try selecting all text",
                "Inspect element data attributes for hidden values",
                "Some clues are encoded - binary, base64, Caesar cipher..."
            ],
            stage2: [
                "Some commands aren't listed in help - experiment!",
                "Try decoding cipher messages you've found", 
                "The Konami code might unlock something special",
                "Matrix operations reveal hidden paths",
                "Look for patterns in ASCII art",
                "Binary and base64 conversions are your friends"
            ],
            stage3: [
                "You've unlocked the path to the final stage",
                "Navigate to a place that doesn't exist...",
                "404 errors aren't always errors in the cyber world",
                "The final revelation awaits in the forbidden zone"
            ]
        };
        
        this.cooldowns = {};
        this.COOLDOWN_TIME = 30000; // 30 seconds
    }
    
    getHint(stage, hintLevel = 0) {
        const stageKey = `stage${stage}`;
        const cooldownKey = `${stageKey}_${hintLevel}`;
        
        // Check cooldown
        if (this.cooldowns[cooldownKey] && 
            Date.now() - this.cooldowns[cooldownKey] < this.COOLDOWN_TIME) {
            return "Please wait before requesting another hint...";
        }
        
        const stageHints = this.hints[stageKey];
        if (!stageHints) {
            return "No hints available for this stage.";
        }
        
        const hint = stageHints[Math.min(hintLevel, stageHints.length - 1)];
        this.cooldowns[cooldownKey] = Date.now();
        
        return hint;
    }
    
    canGetHint(stage, hintLevel = 0) {
        const cooldownKey = `stage${stage}_${hintLevel}`;
        return !this.cooldowns[cooldownKey] || 
               Date.now() - this.cooldowns[cooldownKey] >= this.COOLDOWN_TIME;
    }
}

class PuzzleAnalytics {
    static trackEvent(event, data = {}) {
        try {
            const eventData = {
                event,
                timestamp: Date.now(),
                data
            };
            
            console.log(`[Puzzle Event] ${event}:`, data);
            
            // Store locally for analysis
            const events = JSON.parse(localStorage.getItem('puzzle_analytics') || '[]');
            events.push(eventData);
            
            // Keep only last 100 events
            if (events.length > 100) {
                events.splice(0, events.length - 100);
            }
            
            localStorage.setItem('puzzle_analytics', JSON.stringify(events));
        } catch (error) {
            console.warn('Analytics tracking failed:', error);
        }
    }
    
    static getAnalytics() {
        try {
            return JSON.parse(localStorage.getItem('puzzle_analytics') || '[]');
        } catch (error) {
            return [];
        }
    }
}

class CryptographyUtils {
    static caesarEncode(text, shift) {
        return text.split('').map(char => {
            if (char.match(/[a-zA-Z]/)) {
                const start = char.charCodeAt(0) <= 90 ? 65 : 97;
                return String.fromCharCode(
                    ((char.charCodeAt(0) - start + shift) % 26) + start
                );
            }
            return char;
        }).join('');
    }
    
    static caesarDecode(text, shift) {
        return this.caesarEncode(text, 26 - shift);
    }
    
    static binaryToText(binary) {
        return binary.split(' ')
            .map(bin => String.fromCharCode(parseInt(bin, 2)))
            .join('');
    }
    
    static textToBinary(text) {
        return text.split('')
            .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
            .join(' ');
    }
    
    static base64Decode(encoded) {
        try {
            return atob(encoded);
        } catch (error) {
            throw new Error('Invalid base64 encoding');
        }
    }
    
    static base64Encode(text) {
        try {
            return btoa(text);
        } catch (error) {
            throw new Error('Failed to encode base64');
        }
    }
    
    static rot13(text) {
        return text.replace(/[a-zA-Z]/g, char => {
            const start = char <= 'Z' ? 65 : 97;
            return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
        });
    }
    
    static hexToText(hex) {
        try {
            return hex.match(/.{1,2}/g)
                .map(byte => String.fromCharCode(parseInt(byte, 16)))
                .join('');
        } catch (error) {
            throw new Error('Invalid hex encoding');
        }
    }
    
    static textToHex(text) {
        return text.split('')
            .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
            .join('');
    }
}

class PuzzleGenerator {
    static generateCipher() {
        const messages = [
            'ACCESS_GRANTED',
            'FOLLOW_WHITE_RABBIT', 
            'MATRIX_HAS_YOU',
            'WAKE_UP_NEO',
            'TRUST_NO_ONE',
            'THE_CAKE_IS_A_LIE',
            'RESISTANCE_IS_FUTILE',
            'GHOST_IN_THE_SHELL'
        ];
        
        const shifts = [1, 3, 5, 7, 13, 17, 19, 23];
        const message = messages[Math.floor(Math.random() * messages.length)];
        const shift = shifts[Math.floor(Math.random() * shifts.length)];
        
        return { 
            encrypted: CryptographyUtils.caesarEncode(message, shift), 
            shift, 
            original: message 
        };
    }
    
    static generateBinaryMessage() {
        const messages = [
            'Hello World',
            'Welcome',
            'Hacker',
            'Matrix',
            'Cyber',
            'Code'
        ];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        return {
            binary: CryptographyUtils.textToBinary(message),
            original: message
        };
    }
    
    static generatePattern() {
        const patterns = [
            [1, 2, 4, 8, 16], // Powers of 2
            [1, 1, 2, 3, 5, 8], // Fibonacci
            [2, 4, 6, 8, 10], // Even numbers
            [1, 4, 9, 16, 25], // Squares
            [3, 6, 9, 12, 15] // Multiples of 3
        ];
        
        return patterns[Math.floor(Math.random() * patterns.length)];
    }
}

class PuzzleCommands {
    static register(commandRegistry, puzzleState, hintSystem) {
        // Hidden trace command
        commandRegistry.trace = async function(terminal, args) {
            puzzleState.addAttempt('trace');
            
            if (args.length === 0) {
                await terminal.typeMessage('trace: missing target', 'error');
                return;
            }
            
            if (args[0].toLowerCase() === 'matrix') {
                puzzleState.addAttempt('trace matrix', true);
                puzzleState.addDiscovery('matrix_trace_executed', 2);
                
                await terminal.typeMessage('INITIATING MATRIX TRACE...', 'info');
                await terminal.delay(1000);
                await terminal.typeMessage('Tracing neural pathways...', 'output');
                await terminal.delay(800);
                await terminal.typeMessage('Connection established.', 'success');
                await terminal.delay(500);
                await terminal.typeMessage('Ghost in the machine detected.', 'warning');
                await terminal.delay(1000);
                await terminal.typeMessage('', 'output');
                await terminal.typeMessage('Next protocol: decode cipher "NRFFRTZ_LBEX"', 'info');
                await terminal.typeMessage('Hint: The shift is the answer to life, the universe, and everything divided by 2', 'output');
                
                puzzleState.unlockStage(2);
                return;
            }
            
            await terminal.typeMessage(`trace: target '${args[0]}' not found`, 'error');
        };
        
        // Hidden decode command
        commandRegistry.decode = async function(terminal, args) {
            puzzleState.addAttempt('decode');
            
            if (args.length < 2) {
                await terminal.typeMessage('decode: usage: decode <method> <text>', 'error');
                await terminal.typeMessage('Available methods: caesar, binary, base64, rot13, hex', 'info');
                return;
            }
            
            const method = args[0].toLowerCase();
            const text = args.slice(1).join(' ');
            
            try {
                let result;
                
                switch (method) {
                    case 'caesar':
                        if (args.length < 3) {
                            await terminal.typeMessage('caesar: usage: decode caesar <shift> <text>', 'error');
                            return;
                        }
                        const shift = parseInt(args[1]);
                        const cipherText = args.slice(2).join(' ');
                        result = CryptographyUtils.caesarDecode(cipherText, shift);
                        
                        // Check for correct Caesar solution
                        if (cipherText.toUpperCase() === 'NRFFRTZ_LBEX' && shift === 21) {
                            puzzleState.addSecret('caesar_master');
                            await terminal.typeMessage('▓ DECRYPTION SUCCESSFUL ▓', 'success');
                            await terminal.typeMessage(`Decoded: ${result}`, 'output');
                            await terminal.typeMessage('', 'output');
                            await terminal.typeMessage('ACCESS CODE REVEALED: ghost_protocol_active', 'info');
                            puzzleState.addDiscovery('caesar_decoded', 2);
                        } else {
                            await terminal.typeMessage(`Decoded: ${result}`, 'output');
                        }
                        break;
                        
                    case 'binary':
                        result = CryptographyUtils.binaryToText(text);
                        await terminal.typeMessage(`Decoded: ${result}`, 'output');
                        break;
                        
                    case 'base64':
                        result = CryptographyUtils.base64Decode(text);
                        await terminal.typeMessage(`Decoded: ${result}`, 'output');
                        break;
                        
                    case 'rot13':
                        result = CryptographyUtils.rot13(text);
                        await terminal.typeMessage(`Decoded: ${result}`, 'output');
                        break;
                        
                    case 'hex':
                        result = CryptographyUtils.hexToText(text);
                        await terminal.typeMessage(`Decoded: ${result}`, 'output');
                        break;
                        
                    default:
                        await terminal.typeMessage(`decode: unknown method '${method}'`, 'error');
                        return;
                }
                
                puzzleState.addAttempt(`decode ${method}`, true);
                
            } catch (error) {
                await terminal.typeMessage(`decode: ${error.message}`, 'error');
            }
        };
        
        // Hidden pattern command
        commandRegistry.pattern = async function(terminal, args) {
            puzzleState.addAttempt('pattern');
            
            if (args.length === 0) {
                const pattern = PuzzleGenerator.generatePattern();
                await terminal.typeMessage('PATTERN RECOGNITION CHALLENGE:', 'info');
                await terminal.typeMessage('', 'output');
                await terminal.typeMessage(`Sequence: ${pattern.slice(0, -1).join(', ')}, ?`, 'output');
                await terminal.typeMessage('', 'output');
                await terminal.typeMessage(`Usage: pattern answer <number>`, 'info');
                
                // Store the answer for validation
                terminal.currentPattern = pattern;
                return;
            }
            
            if (args[0] === 'answer' && args[1]) {
                const answer = parseInt(args[1]);
                const correct = terminal.currentPattern ? terminal.currentPattern[terminal.currentPattern.length - 1] : null;
                
                if (answer === correct) {
                    await terminal.typeMessage('▓ PATTERN SOLVED! ▓', 'success');
                    puzzleState.addSecret('pattern_master');
                    puzzleState.addDiscovery('pattern_solved', 2);
                    puzzleState.addAttempt('pattern answer', true);
                    
                    // Give next clue
                    await terminal.typeMessage('', 'output');
                    await terminal.typeMessage('NEW PATHWAY UNLOCKED:', 'info');
                    await terminal.typeMessage('Seek the forbidden zone where errors dwell...', 'output');
                    await terminal.typeMessage('Navigate to: /sector7/classified', 'info');
                } else {
                    await terminal.typeMessage('❌ Incorrect. Try again.', 'error');
                }
                
                delete terminal.currentPattern;
                return;
            }
            
            await terminal.typeMessage('pattern: invalid usage. Try "pattern" to start.', 'error');
        };
        
        // Hidden konami command
        commandRegistry.konami = async function(terminal, args) {
            puzzleState.addAttempt('konami');
            
            await terminal.typeMessage('▓ KONAMI CODE ACTIVATED ▓', 'success');
            await terminal.typeMessage('', 'output');
            await terminal.typeMessage('▲ ▲ ▼ ▼ ◄ ► ◄ ► ■ ◆', 'info');
            await terminal.typeMessage('', 'output');
            await terminal.typeMessage('▓ CHEAT MODE ENABLED ▓', 'warning');
            await terminal.typeMessage('Access to hidden functions granted!', 'output');
            
            puzzleState.addSecret('konami_master');
            puzzleState.addDiscovery('konami_activated', 2);
            puzzleState.addAttempt('konami', true);
            
            // Unlock all stages for testing
            puzzleState.unlockStage(3);
        };
        
        // Puzzle progression command
        commandRegistry.puzzle = async function(terminal, args) {
            const progress = puzzleState.getProgressSummary();
            
            await terminal.typeMessage('🔐 PUZZLE PROGRESSION STATUS 🔐', 'info');
            await terminal.typeMessage('', 'output');
            await terminal.typeMessage(`Current Stage: ${progress.stage}/3`, 'output');
            await terminal.typeMessage(`Discoveries Made: ${progress.discoveries}`, 'output');
            await terminal.typeMessage(`Secrets Found: ${progress.secrets}`, 'output');
            await terminal.typeMessage(`Hints Used: ${progress.hintsUsed}`, 'output');
            await terminal.typeMessage(`Time Elapsed: ${Math.floor(progress.timeElapsed / 60)}m ${progress.timeElapsed % 60}s`, 'output');
            
            if (progress.completed) {
                await terminal.typeMessage('Status: ✅ COMPLETED', 'success');
            } else {
                await terminal.typeMessage('Status: 🔄 IN PROGRESS', 'warning');
            }
            
            // Show stage-specific hints
            await terminal.typeMessage('', 'output');
            await terminal.typeMessage('💡 Current Objective:', 'info');
            
            switch (progress.stage) {
                case 1:
                    await terminal.typeMessage('Find hidden clues in the source code', 'output');
                    break;
                case 2:
                    await terminal.typeMessage('Solve interactive challenges and decode ciphers', 'output');
                    break;
                case 3:
                    await terminal.typeMessage('Navigate to the final revelation', 'output');
                    break;
            }
        };
        
        // Hint command
        commandRegistry.hint = async function(terminal, args) {
            const stage = puzzleState.currentStage;
            const hintLevel = puzzleState.hintsUsed;
            
            if (!hintSystem.canGetHint(stage, hintLevel)) {
                await terminal.typeMessage('Please wait before requesting another hint...', 'warning');
                return;
            }
            
            const hint = hintSystem.getHint(stage, hintLevel);
            puzzleState.hintsUsed++;
            puzzleState.saveProgress();
            
            await terminal.typeMessage('💡 HINT:', 'info');
            await terminal.typeMessage(hint, 'output');
        };
        
        // Secrets command
        commandRegistry.secrets = async function(terminal, args) {
            await terminal.typeMessage('🕵️ DISCOVERED SECRETS:', 'info');
            await terminal.typeMessage('', 'output');
            
            if (puzzleState.secrets.length === 0) {
                await terminal.typeMessage('No secrets discovered yet...', 'output');
                await terminal.typeMessage('Keep exploring and solving puzzles!', 'info');
                return;
            }
            
            puzzleState.secrets.forEach((secret, index) => {
                terminal.typeMessage(`${index + 1}. ${secret.replace(/_/g, ' ').toUpperCase()}`, 'success');
            });
        };
        
        // Navigate to sector7 command (hidden until puzzles are solved)
        commandRegistry.navigate = async function(terminal, args) {
            if (args.length === 0) {
                await terminal.typeMessage('navigate: missing destination', 'error');
                await terminal.typeMessage('Usage: navigate <destination>', 'info');
                return;
            }
            
            const destination = args.join(' ').toLowerCase();
            
            if (destination === 'sector7/classified' || destination === '/sector7/classified') {
                // Check if user has enough progress to access
                if (puzzleState.currentStage >= 3 || puzzleState.secrets.length >= 3) {
                    await terminal.typeMessage('🚀 INITIATING NAVIGATION TO SECTOR 7...', 'info');
                    await terminal.delay(1000);
                    await terminal.typeMessage('⚠️  WARNING: ENTERING CLASSIFIED ZONE ⚠️', 'warning');
                    await terminal.delay(1000);
                    await terminal.typeMessage('Security clearance verified. Access granted.', 'success');
                    await terminal.delay(1500);
                    
                    // Navigate to the special 404 page
                    window.location.href = '/sector7/classified';
                } else {
                    await terminal.typeMessage('🔒 ACCESS DENIED: Insufficient clearance level', 'error');
                    await terminal.typeMessage('Complete more puzzles to gain access to classified areas.', 'info');
                }
            } else {
                await terminal.typeMessage(`navigate: destination '${destination}' not found`, 'error');
                await terminal.typeMessage('Available destinations: sector7/classified', 'info');
            }
        };
        
        // Admin reset command (hidden)
        commandRegistry.resetpuzzle = async function(terminal, args) {
            if (args[0] === 'confirm') {
                puzzleState.reset();
                await terminal.typeMessage('🔄 Puzzle progress reset', 'warning');
                await terminal.typeMessage('All discoveries and secrets cleared.', 'info');
            } else {
                await terminal.typeMessage('⚠️  This will reset ALL puzzle progress!', 'warning');
                await terminal.typeMessage('Use: resetpuzzle confirm', 'info');
            }
        };
    }
}

class PuzzleDetection {
    constructor(puzzleState) {
        this.puzzleState = puzzleState;
        this.sourceCodeViewed = false;
        this.devToolsOpened = false;
        this.textSelected = false;
        
        this.initializeDetection();
    }
    
    initializeDetection() {
        // Detect source code viewing (Ctrl+U)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'u') {
                this.trackSourceCodeView();
            }
            
            // Detect dev tools (F12, Ctrl+Shift+I)
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
                this.trackDevToolsAccess();
            }
        });
        
        // Detect text selection (for invisible text discovery)
        document.addEventListener('selectstart', () => {
            this.trackTextSelection();
        });
        
        // Detect right-click context menu
        document.addEventListener('contextmenu', (e) => {
            this.trackContextMenu();
        });
        
        // Monitor for data attribute inspection
        this.monitorElementInspection();
        
        // Check for CSS comment viewing
        this.monitorCSSAccess();
    }
    
    trackSourceCodeView() {
        if (!this.sourceCodeViewed) {
            this.sourceCodeViewed = true;
            this.puzzleState.addDiscovery('source_code_viewed', 1);
            
            // Give initial clue
            setTimeout(() => {
                if (window.app && window.app.terminal) {
                    window.app.terminal.typeMessage('🔍 Source reconnaissance detected...', 'info');
                    window.app.terminal.typeMessage('HTML comments may reveal hidden messages.', 'output');
                }
            }, 2000);
        }
    }
    
    trackDevToolsAccess() {
        if (!this.devToolsOpened) {
            this.devToolsOpened = true;
            this.puzzleState.addDiscovery('devtools_opened', 1);
            
            setTimeout(() => {
                if (window.app && window.app.terminal) {
                    window.app.terminal.typeMessage('🛠️ Developer tools accessed...', 'info');
                    window.app.terminal.typeMessage('Inspect elements for hidden data attributes.', 'output');
                }
            }, 1500);
        }
    }
    
    trackTextSelection() {
        if (!this.textSelected) {
            this.textSelected = true;
            
            // Check if invisible text is being selected
            setTimeout(() => {
                const selection = window.getSelection().toString();
                if (selection.includes('SECRET_MESSAGE') || selection.includes('sector7')) {
                    this.puzzleState.addDiscovery('invisible_text_found', 1);
                    this.puzzleState.addSecret('steganography_master');
                    
                    if (window.app && window.app.terminal) {
                        window.app.terminal.typeMessage('✨ Hidden message revealed!', 'success');
                        window.app.terminal.typeMessage('Steganography skills confirmed.', 'output');
                    }
                }
            }, 100);
        }
    }
    
    trackContextMenu() {
        // User right-clicked - may be trying to inspect
        this.puzzleState.addDiscovery('context_menu_used', 1);
    }
    
    monitorElementInspection() {
        // Create a mutation observer to detect when hidden elements are accessed
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    // User might be inspecting elements
                    this.puzzleState.addDiscovery('element_inspection', 1);
                }
            });
        });
        
        observer.observe(document.body, {
            attributes: true,
            subtree: true
        });
    }
    
    monitorCSSAccess() {
        // Detect when CSS files are being viewed
        const originalFetch = window.fetch;
        window.fetch = (...args) => {
            const url = args[0];
            if (typeof url === 'string' && url.includes('.css')) {
                this.puzzleState.addDiscovery('css_file_accessed', 1);
                
                if (window.app && window.app.terminal) {
                    window.app.terminal.typeMessage('📄 CSS file accessed...', 'info');
                    window.app.terminal.typeMessage('Look for encoded messages in comments.', 'output');
                }
            }
        };
    }
}

// Initialize puzzle system
let puzzleState, hintSystem, puzzleDetection;

function initializePuzzleSystem() {
    puzzleState = new PuzzleState();
    hintSystem = new HintSystem();
    puzzleDetection = new PuzzleDetection(puzzleState);
    
    console.log('🔐 Puzzle system initialized');
    console.log('Current stage:', puzzleState.currentStage);
    
    // Add welcome message if user is new
    if (puzzleState.discoveries.length === 0) {
        setTimeout(() => {
            if (window.app && window.app.terminal) {
                window.app.terminal.typeMessage('', 'output');
                window.app.terminal.typeMessage('⚡ PUZZLE SYSTEM ACTIVE ⚡', 'info');
                window.app.terminal.typeMessage('Hidden secrets await discovery...', 'output');
                window.app.terminal.typeMessage('Type "puzzle" to check your progress.', 'info');
                window.app.terminal.typeMessage('Type "hint" for guidance.', 'info');
                window.app.terminal.typeMessage('', 'output');
            }
        }, 3000);
    }
    
    return { puzzleState, hintSystem, puzzleDetection };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PuzzleState,
        HintSystem,
        PuzzleAnalytics,
        CryptographyUtils,
        PuzzleGenerator,
        PuzzleCommands,
        initializePuzzleSystem
    };
}