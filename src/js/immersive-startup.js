/* Immersive Startup Sequence - Grid Infiltrator */
/* Story-driven onboarding that introduces users to their role as a hacker */

class ImmersiveStartup {
    constructor(terminal, storyEngine) {
        this.terminal = terminal;
        this.story = storyEngine;
        this.isFirstTime = !this.story.hasStoryFlag('completed_intro');
        this.animationSpeed = terminal.animationSpeed || 'smart';
    }

    async begin() {
        if (this.isFirstTime) {
            await this.showFirstTimeExperience();
        } else {
            await this.showReturningUserExperience();
        }
    }

    async showFirstTimeExperience() {
        // Clear any existing content
        this.terminal.clearScreen();
        
        // Show system boot sequence
        await this.showSystemBoot();
        
        // Oracle introduction
        await this.showOracleIntroduction();
        
        // Character creation
        await this.showCharacterCreation();
        
        // Basic tutorial
        await this.showBasicTutorial();
        
        // Mark intro as completed
        this.story.setStoryFlag('completed_intro');
        this.story.setStoryFlag('met_oracle');
        
        // Start the actual game
        await this.transitionToGame();
    }

    async showReturningUserExperience() {
        // Clear any existing content
        this.terminal.clearScreen();
        
        // Show welcome back message
        await this.showWelcomeBack();
        
        // Show current mission status
        await this.showMissionStatus();
        
        // Transition to current mission
        await this.transitionToGame();
    }

    async showSystemBoot() {
        const bootSequence = [
            '',
            '████████████████████████████████████████████████████████████',
            '██                                                        ██',
            '██              GRID ACCESS TERMINAL v2.1                 ██', 
            '██                  INITIALIZING...                       ██',
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
            'WARNING: Unauthorized access detected.',
            'Initiating counter-surveillance measures...',
            'Identity masking: ACTIVE',
            'Location spoofing: ACTIVE',
            'Data encryption: MAXIMUM',
            '',
            '[OK] SECURE TUNNEL ESTABLISHED',
            ''
        ];

        for (const line of bootSequence) {
            await this.terminal.typeMessage(line, 'system');
            if (line.includes('>>') || line.includes('[OK]')) {
                await Utils.delay(800);
            }
        }
    }

    async showOracleIntroduction() {
        await Utils.delay(1000);
        
        // Oracle's dramatic entrance
        await this.terminal.typeMessage('▲ INCOMING TRANSMISSION ▲', 'warning');
        await this.terminal.typeMessage('Source: UNKNOWN', 'info');
        await this.terminal.typeMessage('Encryption: QUANTUM LEVEL', 'info');
        await this.terminal.typeMessage('', 'output');
        
        await Utils.delay(1500);
        
        // Oracle's introduction dialogue
        const oracleIntro = this.story.getNPCDialogue('oracle', 'intro');
        
        await this.terminal.typeMessage('╔══════════════════════════════════════════════════════════════╗', 'info');
        await this.terminal.typeMessage('║                           ORACLE                             ║', 'info');
        await this.terminal.typeMessage('╚══════════════════════════════════════════════════════════════╝', 'info');
        await this.terminal.typeMessage('', 'output');
        
        for (const line of oracleIntro) {
            await this.terminal.typeMessage(`◆ Oracle: ${line}`, 'story');
            await Utils.delay(1200);
        }
        
        await this.terminal.typeMessage('', 'output');
        await this.terminal.typeMessage('◆ Oracle: But first, you need an identity in The Grid.', 'story');
        await this.terminal.typeMessage('◆ Oracle: Choose your hacker callsign wisely...', 'story');
        await this.terminal.typeMessage('', 'output');
        
        // Mark that user has met Oracle
        this.story.setStoryFlag('met_oracle');
        
        await this.terminal.typeMessage('► Oracle\'s briefing received!', 'success');
        await this.terminal.typeMessage('► First objective complete - Continue with character creation', 'info');
        await this.terminal.typeMessage('', 'output');
    }

    async showCharacterCreation() {
        await this.terminal.typeMessage('═══════════════════════════════════════════════════════════', 'info');
        await this.terminal.typeMessage('                    CHARACTER CREATION', 'info');
        await this.terminal.typeMessage('═══════════════════════════════════════════════════════════', 'info');
        await this.terminal.typeMessage('', 'output');
        
        await this.terminal.typeMessage('In The Grid, your identity is everything.', 'story');
        await this.terminal.typeMessage('Choose a hacker callsign that will strike fear into Corp hearts.', 'story');
        await this.terminal.typeMessage('', 'output');
        
        await this.terminal.typeMessage('* Suggestion: Try names like "Ghost", "Cipher", "Phoenix", "Neo"', 'info');
        await this.terminal.typeMessage('* Or create your own unique identity!', 'info');
        await this.terminal.typeMessage('', 'output');
        
        // Get character name from user
        const userName = await this.promptForUsername();
        this.story.setCharacterName(userName);
        
        await this.terminal.typeMessage('', 'output');
        await this.terminal.typeMessage(`[ID] Identity confirmed: ${userName}`, 'success');
        await this.terminal.typeMessage('◆ Oracle: Excellent choice. You now exist in The Grid.', 'story');
        await this.terminal.typeMessage('◆ Oracle: Welcome to the resistance, young hacker.', 'story');
        await this.terminal.typeMessage('', 'output');
        
        this.story.triggerStoryEvent('character_named', { name: userName });
    }

    async promptForUsername() {
        return new Promise((resolve) => {
            // Use terminal's direct input mode to bypass command processing
            this.terminal.enterInputMode((input) => {
                if (input.length > 0) {
                    resolve(input);
                } else {
                    // If empty input, prompt again
                    this.terminal.typeMessage('Please enter a valid callsign:', 'warning');
                    this.terminal.enterInputMode((retryInput) => {
                        resolve(retryInput || 'Anonymous');
                    }, 'Enter your hacker callsign: ');
                }
            }, 'Enter your hacker callsign: ');
        });
    }

    async showBasicTutorial() {
        await Utils.delay(1000);
        
        await this.terminal.typeMessage('═══════════════════════════════════════════════════════════', 'info');
        await this.terminal.typeMessage('                    BASIC TRAINING', 'info');
        await this.terminal.typeMessage('═══════════════════════════════════════════════════════════', 'info');
        await this.terminal.typeMessage('', 'output');
        
        await this.terminal.typeMessage('◆ Oracle: Before you can join the resistance, you must master the basics.', 'story');
        await this.terminal.typeMessage('◆ Oracle: The Grid responds to specific commands.', 'story');
        await this.terminal.typeMessage('', 'output');
        
        await this.terminal.typeMessage('[LESSON] LESSON 1: Getting Help', 'info');
        await this.terminal.typeMessage('   Type "help" to see available commands.', 'output');
        await this.terminal.typeMessage('   This is your lifeline when lost.', 'output');
        await this.terminal.typeMessage('', 'output');
        
        await this.terminal.typeMessage('[LESSON] LESSON 2: Your Identity', 'info');
        await this.terminal.typeMessage('   Type "whoami" to confirm your identity.', 'output');
        await this.terminal.typeMessage('   Never forget who you are in The Grid.', 'output');
        await this.terminal.typeMessage('', 'output');
        
        await this.terminal.typeMessage('[LESSON] LESSON 3: Clearing the Screen', 'info');
        await this.terminal.typeMessage('   Type "clear" to wipe the terminal.', 'output');
        await this.terminal.typeMessage('   Sometimes a fresh start is necessary.', 'output');
        await this.terminal.typeMessage('', 'output');
        
        await this.terminal.typeMessage('[TEST] Try these commands now to prove your readiness:', 'warning');
        await this.terminal.typeMessage('   1. Type "help" to see your capabilities', 'output');
        await this.terminal.typeMessage('   2. Type "whoami" to confirm your identity', 'output');
        await this.terminal.typeMessage('   3. Type "mission" to receive your first assignment', 'output');
        await this.terminal.typeMessage('', 'output');
        
        this.story.setStoryFlag('learned_help');
        this.story.unlockCommand('whoami');
        this.story.unlockCommand('mission');
    }

    async transitionToGame() {
        await Utils.delay(1500);
        
        await this.terminal.typeMessage('>> INITIALIZATION COMPLETE <<', 'success');
        await this.terminal.typeMessage('', 'output');
        await this.terminal.typeMessage('You are now connected to The Grid.', 'story');
        await this.terminal.typeMessage('Your journey as a digital freedom fighter begins now.', 'story');
        await this.terminal.typeMessage('', 'output');
        
        // Show current mission
        const mission = this.story.getCurrentMission();
        if (mission) {
            await this.terminal.typeMessage(`[MISSION] Current Mission: ${mission.title}`, 'info');
            await this.terminal.typeMessage(`[OBJ] Objective: ${mission.description}`, 'output');
            await this.terminal.typeMessage('', 'output');
        }
        
        await this.terminal.typeMessage('Type "help" to see available commands.', 'info');
        await this.terminal.typeMessage('Type "mission" to view your current objectives.', 'info');
        await this.terminal.typeMessage('', 'output');
        
        // Update terminal prompt to show character name
        if (this.story.characterName) {
            this.terminal.setPrompt(`${this.story.characterName}@GRID:~$`);
        }
    }

    async showWelcomeBack() {
        console.log('=== SHOW WELCOME BACK CALLED ===');
        const progress = this.story.getProgressSummary();
        
        await this.terminal.typeMessage('>> RECONNECTING TO THE GRID <<', 'system');
        await this.terminal.typeMessage('', 'output');
        await this.terminal.typeMessage(`Welcome back, ${progress.characterName}.`, 'story');
        await this.terminal.typeMessage('Your secure connection has been re-established.', 'info');
        await this.terminal.typeMessage('', 'output');
        
        console.log('Oracle flag check:', this.story.hasStoryFlag('met_oracle'));
        // Check if Oracle briefing is needed
        if (!this.story.hasStoryFlag('met_oracle')) {
            console.log('Triggering Oracle introduction...');
            await this.showOracleIntroduction();
        } else {
            console.log('Oracle flag is already set, skipping introduction');
        }
        
        // Show progress summary
        await this.terminal.typeMessage('═══════════════════════════════════════════════════════════', 'info');
        await this.terminal.typeMessage('                    PROGRESS SUMMARY', 'info');
        await this.terminal.typeMessage('═══════════════════════════════════════════════════════════', 'info');
        await this.terminal.typeMessage('', 'output');
        
        await this.terminal.typeMessage(`[LVL] Hacker Level: ${progress.characterLevel}`, 'output');
        await this.terminal.typeMessage(`[PROGRESS] Missions Completed: ${progress.completedMissions}/${progress.totalMissions}`, 'output');
        await this.terminal.typeMessage(`[XP] Experience Points: ${progress.experiencePoints}`, 'output');
        await this.terminal.typeMessage(`[CMD] Commands Unlocked: ${progress.unlockedCommands}`, 'output');
        await this.terminal.typeMessage(`[STATUS] Progress: ${progress.progressPercentage}%`, 'output');
        await this.terminal.typeMessage('', 'output');
        
        // Update terminal prompt
        this.terminal.setPrompt(`${progress.characterName}@GRID:~$`);
    }

    async showMissionStatus() {
        const mission = this.story.getCurrentMission();
        
        if (mission) {
            await this.terminal.typeMessage('═══════════════════════════════════════════════════════════', 'info');
            await this.terminal.typeMessage('                    CURRENT MISSION', 'info');
            await this.terminal.typeMessage('═══════════════════════════════════════════════════════════', 'info');
            await this.terminal.typeMessage('', 'output');
            
            await this.terminal.typeMessage(`[MISSION] Mission: ${mission.title}`, 'info');
            await this.terminal.typeMessage(`[DESC] Description: ${mission.description}`, 'output');
            await this.terminal.typeMessage('', 'output');
            
            await this.terminal.typeMessage('[TODO] Current Objectives:', 'info');
            mission.objectives.forEach((objective, index) => {
                this.terminal.typeMessage(`   ${index + 1}. ${objective}`, 'output');
            });
            
            await this.terminal.typeMessage('', 'output');
            await this.terminal.typeMessage('Type "mission" for detailed objectives.', 'info');
            await this.terminal.typeMessage('Type "help" to see available commands.', 'info');
            await this.terminal.typeMessage('', 'output');
        }
    }
}

// Export for module systems or make globally available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImmersiveStartup;
} else {
    window.ImmersiveStartup = ImmersiveStartup;
}