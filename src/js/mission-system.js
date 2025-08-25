/* Mission System - Story-Driven Objectives and Guidance */
/* Provides clear objectives, progress tracking, and contextual hints */

class MissionSystem {
    constructor(terminal, storyEngine) {
        this.terminal = terminal;
        this.story = storyEngine;
        this.activeObjectives = [];
        this.completedObjectives = [];
        this.currentHints = [];
    }

    // Mission Command Han            prologue: "▓ Master the basics first - every expert was once a beginner!",ler
    async handleMissionCommand(args) {
        if (!args || args.length === 0) {
            await this.showCurrentMission();
            return;
        }

        const subcommand = args[0].toLowerCase();
        
        switch (subcommand) {
            case 'objectives':
            case 'obj':
                await this.showObjectives();
                break;
            case 'hint':
                await this.showHint();
                break;
            case 'progress':
                await this.showProgress();
                break;
            case 'briefing':
                await this.showMissionBriefing();
                break;
            case 'all':
                await this.showAllMissions();
                break;
            default:
                await this.showMissionHelp();
        }
    }

    async showCurrentMission() {
        const mission = this.story.getCurrentMission();
        if (!mission) {
            await this.terminal.typeMessage('No active mission found.', 'error');
            return;
        }

        await this.terminal.typeMessage('╔══════════════════════════════════════════════════════════════╗', 'info');
        await this.terminal.typeMessage('║                        CURRENT MISSION                      ║', 'info');
        await this.terminal.typeMessage('╚══════════════════════════════════════════════════════════════╝', 'info');
        await this.terminal.typeMessage('', 'output');
        
        await this.terminal.typeMessage(`► Mission: ${mission.title}`, 'info');
        await this.terminal.typeMessage(`► Description: ${mission.description}`, 'output');
        await this.terminal.typeMessage('', 'output');
        
        await this.terminal.typeMessage('■ Objectives:', 'info');
        mission.objectives.forEach((objective, index) => {
            const status = this.isObjectiveCompleted(objective) ? '◆' : '◇';
            this.terminal.typeMessage(`   ${status} ${index + 1}. ${objective}`, 'output');
        });
        
        await this.terminal.typeMessage('', 'output');
        await this.terminal.typeMessage('* Type "mission hint" for guidance', 'info');
        await this.terminal.typeMessage('* Type "mission progress" to see your advancement', 'info');
        await this.terminal.typeMessage('', 'output');
        
        // Show contextual advice based on current mission
        await this.showContextualAdvice(mission);
    }

    async showObjectives() {
        const mission = this.story.getCurrentMission();
        if (!mission) return;

        await this.terminal.typeMessage('╔══════════════════════════════════════════════════════════════╗', 'info');
        await this.terminal.typeMessage('║                     MISSION OBJECTIVES                      ║', 'info');
        await this.terminal.typeMessage('╚══════════════════════════════════════════════════════════════╝', 'info');
        await this.terminal.typeMessage('', 'output');
        
        mission.objectives.forEach((objective, index) => {
            const status = this.isObjectiveCompleted(objective) ? '◆ COMPLETED' : '◇ IN PROGRESS';
            this.terminal.typeMessage(`${index + 1}. ${objective}`, 'output');
            this.terminal.typeMessage(`   Status: ${status}`, status.includes('COMPLETED') ? 'success' : 'warning');
            this.terminal.typeMessage('', 'output');
        });
        
        // Show required commands for this mission
        if (mission.unlockCommands && mission.unlockCommands.length > 0) {
            await this.terminal.typeMessage('▓ Commands you\'ll learn in this mission:', 'info');
            mission.unlockCommands.forEach(cmd => {
                const unlocked = this.story.hasUnlockedCommand(cmd) ? '◆' : '▒';
                this.terminal.typeMessage(`   ${unlocked} ${cmd}`, 'output');
            });
            await this.terminal.typeMessage('', 'output');
        }
    }

    async showHint() {
        console.log('=== SHOWHINT FUNCTION CALLED ===');
        const mission = this.story.getCurrentMission();
        console.log('showHint called - mission:', mission);
        console.log('current mission ID:', this.story.currentMission);
        console.log('has met oracle flag:', this.story.hasStoryFlag('met_oracle'));
        
        if (!mission) return;

        // Special handling for prologue mission - trigger Oracle's briefing
        if (this.story.currentMission === 'prologue' && !this.story.hasStoryFlag('met_oracle')) {
            console.log('Triggering Oracle briefing!');
            await this.triggerOracleBriefing();
            return;
        }

        const hints = this.getContextualHints(mission);
        
        if (hints.length === 0) {
            await this.terminal.typeMessage('No hints available for current objectives.', 'info');
            return;
        }

        await this.terminal.typeMessage('* MISSION HINT:', 'info');
        await this.terminal.typeMessage('', 'output');
        
        // Select appropriate hint based on progress
        const hint = this.selectBestHint(hints, mission);
        await this.terminal.typeMessage(`► ${hint}`, 'story');
        await this.terminal.typeMessage('', 'output');
        
        // Add follow-up guidance
        await this.showFollowUpGuidance(mission);
    }

    async triggerOracleBriefing() {
        await this.terminal.typeMessage('╔══════════════════════════════════════════════════════════════╗', 'info');
        await this.terminal.typeMessage('║                      ORACLE CONNECTION                      ║', 'info');
        await this.terminal.typeMessage('╚══════════════════════════════════════════════════════════════╝', 'info');
        await this.terminal.typeMessage('', 'output');
        
        await this.terminal.typeMessage('▓ Establishing secure connection to Oracle...', 'info');
        await this.terminal.typeMessage('▓ Quantum encryption protocols active...', 'info');
        await this.terminal.typeMessage('', 'output');
        
        // Get Oracle's dialogue from story engine
        const introDialogue = this.story.getNPCDialogue('oracle', 'intro');
        for (const line of introDialogue) {
            await this.terminal.typeMessage(`[Oracle]: ${line}`, 'story');
        }
        
        await this.terminal.typeMessage('', 'output');
        await this.terminal.typeMessage('► Oracle\'s briefing received!', 'success');
        await this.terminal.typeMessage('► You are now ready to begin your journey.', 'info');
        await this.terminal.typeMessage('', 'output');
        await this.terminal.typeMessage('► Next steps: Use "whoami" to choose your hacker identity', 'info');
        await this.terminal.typeMessage('► Type "mission" to view your current objectives', 'info');
        await this.terminal.typeMessage('', 'output');
        await this.terminal.typeMessage('▓ Oracle connection terminated.', 'info');
        
        // Mark that user has met Oracle and completed first objective
        this.story.setStoryFlag('met_oracle');
        this.story.addDialogueToHistory('oracle', introDialogue);
        
        // Track this action for mission progress
        this.trackAction('oracle_briefing', { firstTime: true });
    }

    getContextualHints(mission) {
        const hintsMap = {
            prologue: [
                "Start by typing 'help' to see what you can do.",
                "Use 'whoami' to confirm your hacker identity.",
                "Type 'clear' if you need a fresh screen."
            ],
            tutorial: [
                "Try 'ls' to see what files are in your current location.",
                "Use 'cat briefing.txt' to read your mission briefing.",
                "Type 'pwd' to see where you are in the file system."
            ],
            data_recovery: [
                "Navigate to directories using 'cd directory_name'.",
                "Look for the /resistance directory - that's where the data is hidden.",
                "Encrypted files often have a .enc extension.",
                "Use cipher commands to decrypt messages once you find them."
            ],
            code_breaking: [
                "Scan for network communications with 'scan networks'.",
                "Binary messages are sequences of 1s and 0s - decode them!",
                "Caesar ciphers shift letters by a fixed amount - try different shift values.",
                "Corporate messages might reveal their plans if decoded correctly."
            ],
            system_infiltration: [
                "Use 'trace matrix' to map network connections.",
                "Pattern recognition is key - look for sequences and relationships.",
                "Stealth is important - avoid detection while infiltrating.",
                "Advanced commands unlock as you prove your skills."
            ],
            revelation: [
                "Navigate to restricted areas that others can't access.",
                "/sector7/classified holds the ultimate truth.",
                "Your choices here will determine the fate of The Grid.",
                "Use everything you've learned to make the right decision."
            ]
        };

        return hintsMap[mission.title] || hintsMap[this.story.currentMission] || [];
    }

    selectBestHint(hints, mission) {
        // Select hint based on current progress and what the user needs most
        const completedObjectives = mission.objectives.filter(obj => this.isObjectiveCompleted(obj)).length;
        const hintIndex = Math.min(completedObjectives, hints.length - 1);
        
        return hints[hintIndex] || hints[0] || "Keep exploring and trying different commands!";
    }

    async showFollowUpGuidance(mission) {
        // Provide specific next steps based on current mission state
        const guidanceMap = {
            prologue: [
                "Remember: Every command you learn makes you more powerful.",
                "The resistance is counting on you to master these basics."
            ],
            tutorial: [
                "File navigation is essential for any hacker.",
                "Take time to explore - you might find hidden information."
            ],
            data_recovery: [
                "The resistance needs that data to plan their next move.",
                "Encrypted messages protect valuable secrets."
            ],
            code_breaking: [
                "Corporate communications reveal their weaknesses.",
                "Master cryptography to stay ahead of their surveillance."
            ],
            system_infiltration: [
                "You're entering dangerous territory now.",
                "Advanced hackers use pattern recognition and logical thinking."
            ],
            revelation: [
                "This is your final test - everything depends on your choices.",
                "Trust your instincts and the skills you've developed."
            ]
        };

        const guidance = guidanceMap[this.story.currentMission];
        if (guidance && guidance.length > 0) {
            const advice = guidance[Math.floor(Math.random() * guidance.length)];
            await this.terminal.typeMessage(`► ${advice}`, 'info');
        }
    }

    async showProgress() {
        const progress = this.story.getProgressSummary();
        const mission = this.story.getCurrentMission();

        await this.terminal.typeMessage('╔══════════════════════════════════════════════════════════════╗', 'info');
        await this.terminal.typeMessage('║                     MISSION PROGRESS                        ║', 'info');
        await this.terminal.typeMessage('╚══════════════════════════════════════════════════════════════╝', 'info');
        await this.terminal.typeMessage('', 'output');
        
        // Overall progress
        await this.terminal.typeMessage('▓ HACKER PROFILE:', 'info');
        await this.terminal.typeMessage(`   Name: ${progress.characterName}`, 'output');
        await this.terminal.typeMessage(`   Level: ${progress.characterLevel}`, 'output');
        await this.terminal.typeMessage(`   Experience: ${progress.experiencePoints} XP`, 'output');
        await this.terminal.typeMessage('', 'output');
        
        // Mission progress
        await this.terminal.typeMessage('▓ MISSION STATUS:', 'info');
        await this.terminal.typeMessage(`   Current: ${mission ? mission.title : 'None'}`, 'output');
        await this.terminal.typeMessage(`   Completed: ${progress.completedMissions}/${progress.totalMissions}`, 'output');
        await this.terminal.typeMessage(`   Overall Progress: ${progress.progressPercentage}%`, 'output');
        await this.terminal.typeMessage('', 'output');
        
        // Skills and capabilities
        await this.terminal.typeMessage('▓ CAPABILITIES:', 'info');
        await this.terminal.typeMessage(`   Commands Unlocked: ${progress.unlockedCommands}`, 'output');
        await this.terminal.typeMessage(`   Session Time: ${Math.floor(progress.sessionTime / 60)}m ${progress.sessionTime % 60}s`, 'output');
        await this.terminal.typeMessage('', 'output');
        
        // Show progress bar
        await this.showProgressBar(progress.progressPercentage);
    }

    async showProgressBar(percentage) {
        const barLength = 50;
        const filledLength = Math.floor((percentage / 100) * barLength);
        const emptyLength = barLength - filledLength;
        
        const filledBar = '█'.repeat(filledLength);
        const emptyBar = '░'.repeat(emptyLength);
        
        await this.terminal.typeMessage('▓ OVERALL PROGRESS:', 'info');
        await this.terminal.typeMessage(`[${filledBar}${emptyBar}] ${percentage}%`, 'success');
        await this.terminal.typeMessage('', 'output');
    }

    async showMissionBriefing() {
        const mission = this.story.getCurrentMission();
        if (!mission) return;

        // Show detailed mission briefing with story context
        await this.terminal.typeMessage('╔══════════════════════════════════════════════════════════════╗', 'info');
        await this.terminal.typeMessage('║                     MISSION BRIEFING                        ║', 'info');
        await this.terminal.typeMessage('╚══════════════════════════════════════════════════════════════╝', 'info');
        await this.terminal.typeMessage('', 'output');
        
        // Mission-specific briefings
        const briefings = {
            prologue: [
                "◆ Oracle: Welcome to your first day as a Grid operative.",
                "◆ Oracle: The corporate overlords think they control all information flow.",
                "◆ Oracle: We're going to prove them wrong, one hack at a time.",
                "◆ Oracle: But first, you need to learn the fundamentals of Grid navigation."
            ],
            tutorial: [
                "◆ Oracle: Every master hacker started with the basics.",
                "◆ Oracle: File navigation is the foundation of digital exploration.",
                "◆ Oracle: Learn to read files and explore directories like your life depends on it.",
                "◆ Oracle: Because in The Grid, it actually does."
            ],
            data_recovery: [
                "[URGENT] Phoenix: One of our operatives was compromised.",
                "[URGENT] Phoenix: Corporate security captured their data before they could escape.",
                "[URGENT] Phoenix: We need you to infiltrate their servers and retrieve the stolen information.",
                "[URGENT] Phoenix: The resistance's future depends on recovering that data."
            ],
            code_breaking: [
                "[URGENT] Phoenix: We've intercepted corporate communications.",
                "[URGENT] Phoenix: They're planning something big - a major crackdown on free hackers.",
                "[URGENT] Phoenix: Break their codes and decode their messages.",
                "[URGENT] Phoenix: We need to know their plans before they execute them."
            ],
            system_infiltration: [
                "◆ Oracle: You've proven yourself capable, young hacker.",
                "◆ Oracle: Now comes the real test - infiltrating Corp's secure network.",
                "◆ Oracle: Use stealth, logic, and pattern recognition.",
                "◆ Oracle: One wrong move and you'll trigger their security protocols."
            ],
            revelation: [
                "◆ Oracle: The time has come for the final revelation.",
                "◆ Oracle: Everything you've learned has led to this moment.",
                "◆ Oracle: The truth about The Grid, about Corp, about the nature of reality itself.",
                "◆ Oracle: Choose wisely - the future of digital freedom hangs in the balance."
            ]
        };

        const briefing = briefings[this.story.currentMission] || ["Mission briefing not available."];
        for (const line of briefing) {
            await this.terminal.typeMessage(line, 'story');
        }
        
        await this.terminal.typeMessage('', 'output');
        await this.terminal.typeMessage('[INFO] Type "mission objectives" to see specific tasks.', 'info');
        await this.terminal.typeMessage('▓ Type "mission hint" if you need guidance.', 'info');
    }

    async showAllMissions() {
        await this.terminal.typeMessage('╔══════════════════════════════════════════════════════════════╗', 'info');
        await this.terminal.typeMessage('║                      MISSION OVERVIEW                       ║', 'info');
        await this.terminal.typeMessage('╚══════════════════════════════════════════════════════════════╝', 'info');
        await this.terminal.typeMessage('', 'output');
        
        const allMissions = this.story.missions;
        const missionOrder = ['prologue', 'tutorial', 'data_recovery', 'code_breaking', 'system_infiltration', 'revelation'];
        
        missionOrder.forEach((missionId, index) => {
            const mission = allMissions[missionId];
            if (!mission) return;
            
            const isCompleted = this.story.completedMissions.includes(missionId);
            const isCurrent = this.story.currentMission === missionId;
            const isLocked = !isCompleted && !isCurrent;
            
            let status = '';
            if (isCompleted) status = '[OK] COMPLETED';
            else if (isCurrent) status = '⏳ CURRENT';
            else status = '🔒 LOCKED';
            
            this.terminal.typeMessage(`${index + 1}. ${mission.title} - ${status}`, 'output');
            this.terminal.typeMessage(`   ${mission.description}`, 'info');
            if (!isLocked) {
                this.terminal.typeMessage(`   Reward: ${mission.completionReward} XP`, 'success');
            }
            this.terminal.typeMessage('', 'output');
        });
    }

    async showMissionHelp() {
        await this.terminal.typeMessage('╔══════════════════════════════════════════════════════════════╗', 'info');
        await this.terminal.typeMessage('║                      MISSION COMMANDS                       ║', 'info');
        await this.terminal.typeMessage('╚══════════════════════════════════════════════════════════════╝', 'info');
        await this.terminal.typeMessage('', 'output');
        
        const helpCommands = [
            ['mission', 'Show current mission overview'],
            ['mission objectives', 'View detailed mission objectives'],
            ['mission hint', 'Get contextual guidance for current tasks'],
            ['mission progress', 'Show your overall progress and stats'],
            ['mission briefing', 'Read detailed mission background story'],
            ['mission all', 'View all missions and completion status']
        ];
        
        helpCommands.forEach(([cmd, desc]) => {
            this.terminal.typeMessage(`  ${cmd.padEnd(20)} - ${desc}`, 'output');
        });
        
        await this.terminal.typeMessage('', 'output');
        await this.terminal.typeMessage('▓ Pro tip: Use mission hints when you\'re stuck!', 'info');
    }

    async showContextualAdvice(mission) {
        // Show specific advice based on current mission and user progress
        const adviceMap = {
            prologue: "◆ Master the basics first - every expert was once a beginner!",
            tutorial: "◆ Take your time exploring - hidden secrets await thorough investigators.",
            data_recovery: "◆ The resistance is counting on you - decode carefully!",
            code_breaking: "◆ Corporate encryption has patterns - look for the logic behind the chaos.",
            system_infiltration: "◆ Stealth and intelligence triumph over brute force.",
            revelation: "◆ Trust your instincts - you've come too far to fail now."
        };

        const advice = adviceMap[this.story.currentMission];
        if (advice) {
            await this.terminal.typeMessage(advice, 'info');
        }
    }

    // Helper Methods
    isObjectiveCompleted(objective) {
        // Check if specific objective is completed based on story flags
        const objectiveCompletionMap = {
            "Listen to Oracle's briefing": () => this.story.hasStoryFlag('met_oracle'),
            "Choose your hacker identity": () => this.story.characterName !== '',
            "Learn basic terminal navigation": () => this.story.hasStoryFlag('learned_help'),
            "Use 'ls' to explore your environment": () => this.story.hasStoryFlag('used_ls'),
            "Read your mission briefing with 'cat briefing.txt'": () => this.story.hasStoryFlag('read_briefing'),
            "Check your current location with 'pwd'": () => this.story.hasStoryFlag('used_pwd')
        };

        const checkFunction = objectiveCompletionMap[objective];
        return checkFunction ? checkFunction() : false;
    }

    // Track objective completion when user performs actions
    trackAction(action, details = {}) {
        // This will be called by the command system to track user progress
        switch (action) {
            case 'used_ls':
                this.story.setStoryFlag('used_ls');
                break;
            case 'read_file':
                if (details.filename === 'briefing.txt') {
                    this.story.setStoryFlag('read_briefing');
                }
                break;
            case 'used_pwd':
                this.story.setStoryFlag('used_pwd');
                break;
        }
        
        // Check if mission objectives are completed
        this.story.checkObjectiveCompletion(action, details);
    }
}

// Export for module systems or make globally available  
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MissionSystem;
} else {
    window.MissionSystem = MissionSystem;
}