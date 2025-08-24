/* Command System for Retro Cyber World */
/* All available terminal commands and their implementations */

const Commands = {
    /**
     * Display help information
     */
    help: async function(terminal, args) {
        const helpText = [
            'GRID TERMINAL COMMANDS:',
            '',
            'BASIC COMMANDS:',
            '  help                    - Show this help',
            '  clear                   - Clear the terminal',
            '  ls [directory]          - List directory contents',
            '  cat <file>              - Display file contents',
            '  cd <directory>          - Change directory',
            '  pwd                     - Show current directory',
            '  whoami                  - Display current user',
            '  date                    - Show current date/time',
            '',
            'SYSTEM COMMANDS:',
            '  status                  - Show system status',
            '  processes               - List running processes',
            '  memory                  - Display memory usage',
            '  network                 - Show network information',
            '',
            'GAME COMMANDS:',
            '  tutorial                - Start interactive tutorial',
            '  puzzle                  - Current puzzle information',
            '  hint                    - Get a hint for current puzzle',
            '  inventory               - Show your items',
            '  score                   - Display current score',
            '',
            'TOOLS:',
            '  cipher <text>           - Encrypt/decrypt text',
            '  binary <text>           - Convert to/from binary',
            '  base64 <text>           - Encode/decode base64',
            '  probe <target>          - Analyze target',
            '  scan                    - Scan current area',
            '',
            'SPECIAL:',
            '  matrix                  - Activate Matrix mode',
            '  glitch                  - System diagnostic',
            '  secrets                 - Show found secrets',
            '  admin                   - Administrative access (if authorized)',
            ''
        ];

        for (const line of helpText) {
            await terminal.typeMessage(line, 'info');
        }
    },

    /**
     * Clear terminal screen
     */
    clear: async function(terminal, args) {
        terminal.clearScreen();
    },

    /**
     * List directory contents
     */
    ls: async function(terminal, args) {
        const targetDir = args[0] || terminal.currentDirectory;
        const contents = terminal.getCurrentDirectoryContents();
        
        if (!contents) {
            await terminal.typeMessage(`ls: cannot access '${targetDir}': No such file or directory`, 'error');
            return;
        }

        await terminal.typeMessage(`Contents of ${terminal.currentDirectory}:`, 'info');
        
        const entries = Object.entries(contents);
        if (entries.length === 0) {
            await terminal.typeMessage('(empty directory)', 'info');
            return;
        }

        for (const [name, item] of entries) {
            const type = item.type === 'directory' ? 'DIR' : 
                        item.type === 'executable' ? 'EXE' : 'FILE';
            const size = item.content ? item.content.length : '-';
            const indicator = item.type === 'directory' ? '/' : 
                             item.type === 'executable' ? '*' : '';
            
            await terminal.typeMessage(`${type.padEnd(4)} ${size.toString().padStart(6)} ${name}${indicator}`, 'output');
        }
    },

    /**
     * Display file contents
     */
    cat: async function(terminal, args) {
        if (!args[0]) {
            await terminal.typeMessage('cat: missing file operand', 'error');
            return;
        }

        const filename = args[0];
        const contents = terminal.getCurrentDirectoryContents();
        
        if (!contents[filename]) {
            await terminal.typeMessage(`cat: ${filename}: No such file or directory`, 'error');
            return;
        }

        const file = contents[filename];
        if (file.type !== 'file') {
            await terminal.typeMessage(`cat: ${filename}: Is a ${file.type}`, 'error');
            return;
        }

        const lines = file.content.split('\n');
        for (const line of lines) {
            await terminal.typeMessage(line, 'output');
        }
    },

    /**
     * Change directory
     */
    cd: async function(terminal, args) {
        // For now, basic implementation
        const targetDir = args[0] || '/home/user';
        
        if (targetDir === '..') {
            const parts = terminal.currentDirectory.split('/').filter(p => p);
            parts.pop();
            terminal.currentDirectory = '/' + parts.join('/');
            if (terminal.currentDirectory === '/') terminal.currentDirectory = '/';
        } else if (targetDir.startsWith('/')) {
            terminal.currentDirectory = targetDir;
        } else {
            terminal.currentDirectory = terminal.currentDirectory + '/' + targetDir;
        }
        
        terminal.currentDirectory = terminal.currentDirectory.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
        await terminal.typeMessage(`Changed to: ${terminal.currentDirectory}`, 'info');
    },

    /**
     * Show current directory
     */
    pwd: async function(terminal, args) {
        await terminal.typeMessage(terminal.currentDirectory, 'output');
    },

    /**
     * Show current user
     */
    whoami: async function(terminal, args) {
        await terminal.typeMessage(terminal.currentUser, 'output');
    },

    /**
     * Show current date
     */
    date: async function(terminal, args) {
        await terminal.typeMessage(Utils.getCyberDate(), 'output');
    },

    /**
     * Show system status
     */
    status: async function(terminal, args) {
        const uptime = Math.floor(Math.random() * 1000000);
        const load = (Math.random() * 2).toFixed(2);
        const memory = Math.floor(Math.random() * 8192);
        
        await terminal.typeMessage('GRID SYSTEM STATUS:', 'info');
        await terminal.typeMessage(`Uptime: ${uptime} cycles`, 'output');
        await terminal.typeMessage(`Load average: ${load}`, 'output');
        await terminal.typeMessage(`Memory usage: ${memory}MB / 8192MB`, 'output');
        await terminal.typeMessage(`Neural pathways: ${95 + Math.floor(Math.random() * 5)}% stable`, 'output');
        await terminal.typeMessage(`Quantum coherence: ${85 + Math.floor(Math.random() * 15)}%`, 'output');
    },

    /**
     * List running processes
     */
    processes: async function(terminal, args) {
        const processes = [
            'PID    NAME                CPU    MEM',
            '1      grid-kernel         12.3%  128MB',
            '42     neural-link         8.7%   256MB',
            '99     quantum-sync        15.2%  64MB',
            '127    memory-guard        3.1%   32MB',
            '256    cipher-daemon       5.5%   48MB',
            '512    grid-interface      22.8%  384MB'
        ];

        for (const line of processes) {
            await terminal.typeMessage(line, 'output');
        }
    },

    /**
     * Display memory usage
     */
    memory: async function(terminal, args) {
        await terminal.typeMessage('MEMORY BANKS:', 'info');
        await terminal.typeMessage('             total       used       free     shared    buffers     cached', 'output');
        await terminal.typeMessage('Mem:      8192000    6144000    2048000      64000     128000     512000', 'output');
        await terminal.typeMessage('Neural:   4096000    3072000    1024000          0     256000     384000', 'output');
        await terminal.typeMessage('Quantum:  2048000    1536000     512000          0      32000      64000', 'output');
    },

    /**
     * Show network information
     */
    network: async function(terminal, args) {
        await terminal.typeMessage('NETWORK INTERFACES:', 'info');
        await terminal.typeMessage('grid0: UP 10.0.0.42/24 MTU:1500', 'output');
        await terminal.typeMessage('neural0: UP 192.168.1.1/24 MTU:1500', 'output');
        await terminal.typeMessage('quantum0: UP fe80::1/64 MTU:1500', 'output');
        await terminal.typeMessage('', 'output');
        await terminal.typeMessage('ACTIVE CONNECTIONS:', 'info');
        await terminal.typeMessage('grid.core.net:443 - ESTABLISHED', 'output');
        await terminal.typeMessage('neural.link.sys:22 - LISTENING', 'output');
    },

    /**
     * Start tutorial
     */
    tutorial: async function(terminal, args) {
        await terminal.typeMessage('GRID TUTORIAL - INITIATION SEQUENCE', 'system');
        await terminal.typeMessage('', 'output');
        await terminal.typeMessage('Welcome to the GRID, new user.', 'story');
        await terminal.typeMessage('You are now connected to a vast network of digital consciousness.', 'story');
        await terminal.typeMessage('', 'output');
        await terminal.typeMessage('LESSON 1: Basic Navigation', 'info');
        await terminal.typeMessage('- Use "ls" to list files and directories', 'output');
        await terminal.typeMessage('- Use "cat <filename>" to read files', 'output');
        await terminal.typeMessage('- Use "cd <directory>" to change location', 'output');
        await terminal.typeMessage('', 'output');
        await terminal.typeMessage('Try reading your notes.txt file now: cat notes.txt', 'info');
    },

    /**
     * Show current puzzle
     */
    puzzle: async function(terminal, args) {
        await terminal.typeMessage('CURRENT PUZZLE: The Hidden Code', 'system');
        await terminal.typeMessage('', 'output');
        await terminal.typeMessage('Your notes contain a mysterious code fragment: 4A4F48', 'story');
        await terminal.typeMessage('This appears to be hexadecimal. Can you decode it?', 'story');
        await terminal.typeMessage('', 'output');
        await terminal.typeMessage('HINT: Try using the cipher command with different methods.', 'info');
    },

    /**
     * Provide hint
     */
    hint: async function(terminal, args) {
        const hints = [
            'Look carefully at the file contents - codes might be hidden.',
            'The cipher command can convert between different formats.',
            'Hexadecimal codes can represent ASCII characters.',
            'Try: cipher hex2ascii 4A4F48',
            'System logs often contain clues about what\'s happening.',
            'Some commands have hidden functionality when used with special parameters.'
        ];
        
        terminal.gameState.hintsUsed++;
        const hint = Utils.randomItem(hints);
        
        await terminal.typeMessage(`HINT #${terminal.gameState.hintsUsed}: ${hint}`, 'info');
    },

    /**
     * Show inventory
     */
    inventory: async function(terminal, args) {
        await terminal.typeMessage('DIGITAL INVENTORY:', 'info');
        await terminal.typeMessage('- Terminal access key', 'output');
        await terminal.typeMessage('- Basic cipher tools', 'output');
        await terminal.typeMessage('- Memory fragment: "4A4F48"', 'output');
        await terminal.typeMessage(`- Hints used: ${terminal.gameState.hintsUsed}`, 'output');
    },

    /**
     * Display current score
     */
    score: async function(terminal, args) {
        await terminal.typeMessage(`CURRENT SCORE: ${terminal.gameState.score}`, 'info');
        await terminal.typeMessage(`LEVEL: ${terminal.gameState.level}`, 'output');
        await terminal.typeMessage(`SECRETS FOUND: ${terminal.gameState.foundSecrets.length}`, 'output');
        await terminal.typeMessage(`HINTS USED: ${terminal.gameState.hintsUsed}`, 'output');
    },

    /**
     * Cipher tool
     */
    cipher: async function(terminal, args) {
        if (!args[0]) {
            await terminal.typeMessage('CIPHER TOOL - Available methods:', 'info');
            await terminal.typeMessage('  cipher caesar <text> [shift]     - Caesar cipher', 'output');
            await terminal.typeMessage('  cipher hex2ascii <hex>           - Hex to ASCII', 'output');
            await terminal.typeMessage('  cipher ascii2hex <text>          - ASCII to hex', 'output');
            await terminal.typeMessage('  cipher base64enc <text>          - Base64 encode', 'output');
            await terminal.typeMessage('  cipher base64dec <encoded>       - Base64 decode', 'output');
            return;
        }

        const method = args[0];
        const input = args.slice(1).join(' ');

        switch (method) {
            case 'caesar':
                const shift = args[args.length - 1];
                const text = args.slice(1, -1).join(' ');
                const result = Utils.caesarCipher(text, parseInt(shift) || 3);
                await terminal.typeMessage(`Result: ${result}`, 'output');
                break;
                
            case 'hex2ascii':
                try {
                    const hex = input.replace(/\s/g, '');
                    let ascii = '';
                    for (let i = 0; i < hex.length; i += 2) {
                        ascii += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
                    }
                    await terminal.typeMessage(`Result: ${ascii}`, 'output');
                    
                    // Check if this reveals a secret
                    if (hex === '4A4F48') {
                        await terminal.typeMessage('*** SECRET REVEALED! ***', 'success');
                        await terminal.typeMessage('You decoded "JOH" - the beginning of something important...', 'story');
                        terminal.gameState.foundSecrets.push('first_decode');
                        terminal.gameState.score += 100;
                    }
                } catch (e) {
                    await terminal.typeMessage('Error: Invalid hexadecimal input', 'error');
                }
                break;
                
            case 'ascii2hex':
                const hexResult = input.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
                await terminal.typeMessage(`Result: ${hexResult}`, 'output');
                break;
                
            case 'base64enc':
                const encoded = Utils.base64Encode(input);
                await terminal.typeMessage(`Result: ${encoded}`, 'output');
                break;
                
            case 'base64dec':
                const decoded = Utils.base64Decode(input);
                await terminal.typeMessage(`Result: ${decoded}`, 'output');
                break;
                
            default:
                await terminal.typeMessage(`Unknown cipher method: ${method}`, 'error');
        }
    },

    /**
     * Binary converter
     */
    binary: async function(terminal, args) {
        if (!args[0]) {
            await terminal.typeMessage('Usage: binary <text|binary>', 'error');
            return;
        }

        const input = args.join(' ');
        
        if (/^[01\s]+$/.test(input)) {
            // Convert from binary
            const result = Utils.binaryToText(input);
            await terminal.typeMessage(`Binary to text: ${result}`, 'output');
        } else {
            // Convert to binary
            const result = Utils.textToBinary(input);
            await terminal.typeMessage(`Text to binary: ${result}`, 'output');
        }
    },

    /**
     * Base64 encoder/decoder
     */
    base64: async function(terminal, args) {
        if (!args[0]) {
            await terminal.typeMessage('Usage: base64 <text>', 'error');
            return;
        }

        const input = args.join(' ');
        
        try {
            // Try to decode first
            const decoded = Utils.base64Decode(input);
            if (decoded !== 'Invalid base64 string') {
                await terminal.typeMessage(`Decoded: ${decoded}`, 'output');
            } else {
                // Encode
                const encoded = Utils.base64Encode(input);
                await terminal.typeMessage(`Encoded: ${encoded}`, 'output');
            }
        } catch (e) {
            const encoded = Utils.base64Encode(input);
            await terminal.typeMessage(`Encoded: ${encoded}`, 'output');
        }
    },

    /**
     * Probe command
     */
    probe: async function(terminal, args) {
        if (!args[0]) {
            await terminal.typeMessage('Usage: probe <target>', 'error');
            return;
        }

        const target = args[0];
        await terminal.typeMessage(`Probing ${target}...`, 'info');
        await Utils.delay(1000);
        
        await terminal.typeMessage('PROBE RESULTS:', 'info');
        await terminal.typeMessage(`Target: ${target}`, 'output');
        await terminal.typeMessage(`Status: ${Math.random() > 0.5 ? 'ACTIVE' : 'INACTIVE'}`, 'output');
        await terminal.typeMessage(`Security: ${Utils.randomItem(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])}`, 'output');
        await terminal.typeMessage(`Encryption: ${Utils.randomItem(['AES-256', 'RSA-2048', 'QUANTUM', 'UNKNOWN'])}`, 'output');
    },

    /**
     * Scan current area
     */
    scan: async function(terminal, args) {
        await terminal.typeMessage('Scanning current area...', 'info');
        await Utils.delay(1500);
        
        await terminal.typeMessage('SCAN RESULTS:', 'info');
        await terminal.typeMessage('- 3 active data streams detected', 'output');
        await terminal.typeMessage('- 1 encrypted file signature found', 'output');
        await terminal.typeMessage('- Neural pathway anomaly detected', 'output');
        await terminal.typeMessage('- Hidden process activity: LOW', 'output');
    },

    /**
     * Matrix mode
     */
    matrix: async function(terminal, args) {
        await terminal.typeMessage('Entering Matrix visualization mode...', 'system');
        
        // Add matrix effect to terminal
        const canvas = document.getElementById('matrix-canvas');
        if (canvas) {
            canvas.style.opacity = '0.8';
            await terminal.typeMessage('Matrix mode activated. The code flows around you...', 'success');
            
            setTimeout(() => {
                canvas.style.opacity = '0.3';
            }, 5000);
        }
    },

    /**
     * System diagnostic
     */
    glitch: async function(terminal, args) {
        await terminal.typeMessage('Running system diagnostic...', 'info');
        
        // Create glitch effect
        const glitchMessages = [
            'M3M0RY_C0RRUPT10N_D3T3CT3D',
            'N3UR4L_P4THW4Y_4N0M4LY',
            'QU4NTUM_FL4CTU4T10N_1N_PR0GR355',
            'ERROR_ERROR_ERROR_ERROR',
            'REALITY.EXE HAS STOPPED WORKING'
        ];
        
        for (const msg of glitchMessages) {
            await terminal.typeMessage(msg, 'error');
            await Utils.delay(200);
        }
        
        await terminal.typeMessage('', 'output');
        await terminal.typeMessage('Diagnostic complete. Minor anomalies detected.', 'system');
        await terminal.typeMessage('Recommendation: Continue with caution.', 'info');
    },

    /**
     * Show found secrets
     */
    secrets: async function(terminal, args) {
        await terminal.typeMessage('DISCOVERED SECRETS:', 'info');
        
        if (terminal.gameState.foundSecrets.length === 0) {
            await terminal.typeMessage('No secrets discovered yet.', 'output');
            await terminal.typeMessage('Keep exploring and solving puzzles to uncover the truth.', 'info');
        } else {
            for (const secret of terminal.gameState.foundSecrets) {
                switch (secret) {
                    case 'first_decode':
                        await terminal.typeMessage('✓ The First Code - Decoded hexadecimal message', 'success');
                        break;
                    default:
                        await terminal.typeMessage(`✓ ${secret}`, 'success');
                }
            }
        }
    },

    /**
     * Administrative access
     */
    admin: async function(terminal, args) {
        await terminal.typeMessage('ACCESS DENIED', 'error');
        await terminal.typeMessage('Administrative privileges required.', 'error');
        await terminal.typeMessage('Your clearance level is insufficient.', 'error');
        await terminal.typeMessage('', 'output');
        await terminal.typeMessage('Contact your system administrator for access.', 'info');
    }
};

// Export for module systems or make globally available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Commands;
} else {
    window.Commands = Commands;
}