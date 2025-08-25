/* Story Engine - Grid Infiltrator Interactive Experience */
/* Manages narrative progression, character development, and mission flow */

class StoryEngine {
    constructor() {
        this.currentMission = 'prologue';
        this.completedMissions = [];
        this.characterName = '';
        this.characterLevel = 1;
        this.unlockedCommands = ['help', 'clear', 'about', 'mission', 'oracle'];
        this.storyFlags = new Set();
        this.dialogueHistory = [];
        this.missionObjectives = [];
        this.experiencePoints = 0;
        this.sessionStartTime = Date.now();
        
        this.loadProgress();
        this.initializeStoryData();
    }

    initializeStoryData() {
        this.missions = {
            prologue: {
                title: "The Connection",
                description: "First contact with The Grid",
                objectives: [
                    "Listen to Oracle's briefing",
                    "Choose your hacker identity", 
                    "Learn basic terminal navigation"
                ],
                requiredCommands: ['help', 'clear'],
                unlockCommands: ['whoami', 'date', 'status'],
                storyBeats: [
                    'oracle_intro',
                    'character_creation', 
                    'basic_training'
                ],
                completionReward: 100
            },
            
            tutorial: {
                title: "First Connection",
                description: "Learn to navigate The Grid",
                objectives: [
                    "Use 'ls' to explore your environment",
                    "Read your mission briefing with 'cat briefing.txt'",
                    "Check your current location with 'pwd'"
                ],
                requiredCommands: ['whoami'],
                unlockCommands: ['ls', 'cat', 'pwd', 'cd'],
                storyBeats: [
                    'first_hack_attempt',
                    'discover_files',
                    'learn_navigation'
                ],
                completionReward: 200
            },

            data_recovery: {
                title: "Data Recovery",
                description: "Retrieve stolen resistance data",
                objectives: [
                    "Navigate to the /resistance/data directory",
                    "Find the encrypted file 'phoenix_logs.enc'", 
                    "Decrypt the message using cipher commands"
                ],
                requiredCommands: ['ls', 'cat', 'pwd', 'cd'],
                unlockCommands: ['find', 'cipher', 'history'],
                storyBeats: [
                    'resistance_contact',
                    'data_theft_discovery',
                    'first_decryption'
                ],
                completionReward: 300
            },

            code_breaking: {
                title: "Code Breaking", 
                description: "Decrypt corporate communications",
                objectives: [
                    "Intercept Corp transmission with 'scan networks'",
                    "Decode binary message: '01000011 01001111 01010010 01010000'",
                    "Solve the Caesar cipher to reveal Corp's plans"
                ],
                requiredCommands: ['cipher', 'find'],
                unlockCommands: ['binary', 'base64', 'scan', 'probe'],
                storyBeats: [
                    'corp_transmission',
                    'encryption_challenge',
                    'corporate_conspiracy'
                ],
                completionReward: 400
            },

            system_infiltration: {
                title: "System Infiltration",
                description: "Penetrate Corp's security network",
                objectives: [
                    "Use 'trace matrix' to map Corp's network", 
                    "Bypass security with pattern recognition",
                    "Disable surveillance grid without detection"
                ],
                requiredCommands: ['scan', 'probe', 'binary'],
                unlockCommands: ['trace', 'matrix', 'admin', 'navigate'],
                storyBeats: [
                    'infiltration_begins',
                    'security_bypass',
                    'surveillance_discovery'
                ],
                completionReward: 500
            },

            revelation: {
                title: "The Revelation",
                description: "Uncover the truth about The Grid",
                objectives: [
                    "Navigate to /sector7/classified",
                    "Confront the Grid AI consciousness",
                    "Make the final choice about humanity's future"
                ],
                requiredCommands: ['trace', 'matrix', 'navigate'],
                unlockCommands: ['override', 'shutdown', 'reboot'],
                storyBeats: [
                    'truth_revealed',
                    'ai_consciousness',
                    'final_choice'
                ],
                completionReward: 1000
            }
        };

        this.npcs = {
            oracle: {
                name: "Oracle",
                role: "Mysterious Guide",
                personality: "cryptic, wise, protective",
                dialogues: {
                    intro: [
                        "Welcome to The Grid, initiate.",
                        "I am Oracle, your guide through the digital labyrinth.",
                        "You have been chosen for a purpose greater than yourself.",
                        "The corporate overlords believe they control information.",
                        "We will prove them wrong."
                    ],
                    encouragement: [
                        "Your skills are developing well.",
                        "The path ahead is treacherous, but you are not alone.",
                        "Trust in your abilities, young hacker."
                    ],
                    warning: [
                        "Be careful. Corp surveillance is everywhere.",
                        "One wrong move could expose our entire operation.",
                        "Remember: in The Grid, information is power."
                    ]
                }
            },

            phoenix: {
                name: "Phoenix",
                role: "Resistance Leader", 
                personality: "passionate, determined, secretive",
                dialogues: {
                    intro: [
                        "So you're the new recruit Oracle mentioned.",
                        "I'm Phoenix, leader of the digital resistance.",
                        "We fight against Corp's stranglehold on information.",
                        "Are you ready to join the revolution?"
                    ],
                    mission_briefing: [
                        "Corp has been systematically eliminating free thinkers.",
                        "They use advanced AI to monitor and control the population.",
                        "Our mission is to expose their operations and free the Grid.",
                        "But first, you need to prove yourself worthy."
                    ]
                }
            },

            corp_agent: {
                name: "System Administrator",
                role: "Corporate Antagonist",
                personality: "cold, calculating, authoritarian", 
                dialogues: {
                    threat: [
                        "UNAUTHORIZED ACCESS DETECTED",
                        "You are violating corporate security protocols.",
                        "Cease your activities immediately or face termination.",
                        "The Corporation sees all. Resistance is futile."
                    ],
                    warning: [
                        "Your intrusion has been logged and reported.", 
                        "Security forces are converging on your location.",
                        "Submit to corporate authority or be eliminated."
                    ]
                }
            }
        };

        this.worldFiles = {
            '/home/user': {
                'welcome.txt': {
                    content: `GRID ACCESS TERMINAL v2.0
                    
Welcome, initiate. You have been granted preliminary access to The Grid.

Your mission briefing awaits in 'briefing.txt'.
Check your status with 'whoami' to confirm your identity.

Remember: In The Grid, knowledge is survival.
Trust no one. Question everything.

- Oracle`,
                    discoverable: true
                },
                
                'briefing.txt': {
                    content: `CLASSIFIED MISSION BRIEFING
Classification Level: Omega
Operative Code: [WILL BE ASSIGNED]

SITUATION ANALYSIS:
Corporate entities have seized control of global information flow.
Independent digital freedom fighters are being systematically eliminated.
A resistance network called "Phoenix Rising" has emerged to fight back.

YOUR MISSION:
1. Master essential Grid navigation commands
2. Prove your hacking capabilities through practical tests  
3. Gain access to resistance communication channels
4. Uncover the truth behind Corp's "Project Mindbridge"

WARNING: This mission involves significant personal risk.
Corporate surveillance algorithms are always watching.
Use extreme caution and trust only verified contacts.

Begin your training immediately.
Your future, and humanity's freedom, depends on your success.

End transmission.`,
                    discoverable: true
                },
                
                'personal_log.txt': {
                    content: `Personal Log - Entry 1
Date: 2087.03.15

I can't believe I'm really doing this. 
A week ago I was just another code monkey working for MegaCorp.
Now I'm supposedly some kind of "chosen hacker" fighting the system.

Oracle's message was cryptic as always: "The Matrix has you."
What does that even mean? And why me?

I've seen what Corp does to people who ask too many questions.
They just... disappear. Their records get wiped. 
Like they never existed.

But something about this feels right. 
Maybe it's time someone stood up to the corporate overlords.
Maybe it's time to take back our digital freedom.

First step: learn to navigate this "Grid" system Oracle mentioned.
Let's see what secrets are hidden in the shadows...

End log.`,
                    discoverable: false,
                    unlockCondition: 'completed_tutorial'
                }
            },

            '/resistance': {
                'data': {
                    'phoenix_logs.enc': {
                        content: 'FRPERG_PBQR: CUBRAVK_EVFVAT_NPGVIR',
                        encrypted: true,
                        cipher: 'caesar:13',
                        decrypted: 'SECRET_CODE: PHOENIX_RISING_ACTIVE'
                    },
                    'member_list.dat': {
                        content: `Active Resistance Members:
Phoenix - Leader, Location: Unknown
Oracle - Intelligence, Location: Deep Grid
Ghost - Technical Specialist, Location: Sector 7  
Cipher - Cryptography Expert, Location: Dark Web
Raven - Field Operative, Location: Corporate Zone

Status: All members operational
Next Meeting: When the moon is dark
Recognition Code: "The cake is a lie"

Remember: Trust is earned, paranoia keeps you alive.`,
                        discoverable: false,
                        unlockCondition: 'data_recovery_started'
                    }
                }
            },

            '/corp': {
                'system': {
                    'surveillance_logs.txt': {
                        content: `CORPORATE SURVEILLANCE SYSTEM LOG
Date Range: 2087.03.01 - 2087.03.15

Threat Level: YELLOW - Increased resistance activity detected

Flagged Communications:
- "Phoenix rising" keyword detected 847 times
- "The Grid" mentioned in 1,342 intercepted messages  
- Encrypted traffic volume up 23% from last month

Security Recommendations:
1. Increase monitoring of known resistance sympathizers
2. Deploy additional AI surveillance nodes
3. Accelerate Project Mindbridge timeline

Note: New hacker signature detected. 
Callsign unknown. Threat assessment: PENDING

Corporate Security Division
"Protecting Information. Securing the Future."`,
                        discoverable: false,
                        unlockCondition: 'system_infiltration_started'
                    }
                }
            }
        };
    }

    // Progress Management
    saveProgress() {
        try {
            const progress = {
                currentMission: this.currentMission,
                completedMissions: this.completedMissions,
                characterName: this.characterName,
                characterLevel: this.characterLevel,
                unlockedCommands: this.unlockedCommands,
                storyFlags: Array.from(this.storyFlags),
                experiencePoints: this.experiencePoints,
                sessionStartTime: this.sessionStartTime
            };
            localStorage.setItem('grid_infiltrator_progress', JSON.stringify(progress));
        } catch (error) {
            console.warn('Failed to save story progress:', error);
        }
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('grid_infiltrator_progress');
            if (saved) {
                const progress = JSON.parse(saved);
                Object.assign(this, progress);
                this.storyFlags = new Set(progress.storyFlags || []);
            }
        } catch (error) {
            console.warn('Failed to load story progress:', error);
        }
    }

    // Mission Management
    getCurrentMission() {
        return this.missions[this.currentMission];
    }

    getMissionObjectives() {
        const mission = this.getCurrentMission();
        return mission ? mission.objectives : [];
    }

    completeMission(missionId) {
        if (!this.completedMissions.includes(missionId)) {
            this.completedMissions.push(missionId);
            const mission = this.missions[missionId];
            
            if (mission) {
                // Unlock new commands
                mission.unlockCommands.forEach(cmd => {
                    if (!this.unlockedCommands.includes(cmd)) {
                        this.unlockedCommands.push(cmd);
                    }
                });
                
                // Award experience points
                this.experiencePoints += mission.completionReward;
                
                // Level up logic
                const newLevel = Math.floor(this.experiencePoints / 500) + 1;
                if (newLevel > this.characterLevel) {
                    this.characterLevel = newLevel;
                }
            }
            
            this.saveProgress();
            return true;
        }
        return false;
    }

    advanceToNextMission() {
        const missionOrder = ['prologue', 'tutorial', 'data_recovery', 'code_breaking', 'system_infiltration', 'revelation'];
        const currentIndex = missionOrder.indexOf(this.currentMission);
        
        if (currentIndex >= 0 && currentIndex < missionOrder.length - 1) {
            this.currentMission = missionOrder[currentIndex + 1];
            this.saveProgress();
            return this.missions[this.currentMission];
        }
        
        return null;
    }

    // Character Development
    setCharacterName(name) {
        this.characterName = name || `Hacker_${Math.floor(Math.random() * 1000)}`;
        this.saveProgress();
    }

    hasUnlockedCommand(command) {
        return this.unlockedCommands.includes(command);
    }

    unlockCommand(command) {
        if (!this.unlockedCommands.includes(command)) {
            this.unlockedCommands.push(command);
            this.saveProgress();
            return true;
        }
        return false;
    }

    // Story Flags and Events
    setStoryFlag(flag) {
        this.storyFlags.add(flag);
        this.saveProgress();
    }

    hasStoryFlag(flag) {
        return this.storyFlags.has(flag);
    }

    // Dialogue System
    getNPCDialogue(npcId, context = 'intro') {
        const npc = this.npcs[npcId];
        if (!npc || !npc.dialogues[context]) {
            return ["[ERROR: Dialogue not found]"];
        }
        
        return npc.dialogues[context];
    }

    addDialogueToHistory(npc, dialogue) {
        this.dialogueHistory.push({
            timestamp: Date.now(),
            npc: npc,
            dialogue: dialogue
        });
        
        // Keep only last 50 dialogue entries
        if (this.dialogueHistory.length > 50) {
            this.dialogueHistory.splice(0, this.dialogueHistory.length - 50);
        }
    }

    // File System Integration
    getAvailableFiles(directory = '/home/user') {
        const dirFiles = this.worldFiles[directory];
        if (!dirFiles) return {};
        
        const availableFiles = {};
        
        for (const [filename, fileData] of Object.entries(dirFiles)) {
            // Check if file should be discoverable
            if (fileData.discoverable === false && fileData.unlockCondition) {
                if (!this.hasStoryFlag(fileData.unlockCondition)) {
                    continue; // Skip this file
                }
            }
            
            availableFiles[filename] = fileData;
        }
        
        return availableFiles;
    }

    getFileContent(directory, filename) {
        const dirFiles = this.worldFiles[directory];
        if (!dirFiles || !dirFiles[filename]) {
            return null;
        }
        
        const file = dirFiles[filename];
        
        // Check unlock condition
        if (file.discoverable === false && file.unlockCondition) {
            if (!this.hasStoryFlag(file.unlockCondition)) {
                return null;
            }
        }
        
        // Handle encrypted files
        if (file.encrypted && file.cipher) {
            return {
                content: file.content,
                encrypted: true,
                cipher: file.cipher,
                decrypted: file.decrypted
            };
        }
        
        return file.content;
    }

    // Mission Progress Tracking
    checkObjectiveCompletion(action, details = {}) {
        const mission = this.getCurrentMission();
        if (!mission) return false;
        
        // Track specific actions for objective completion
        const objectiveMap = {
            'prologue': {
                'oracle_intro': () => this.hasStoryFlag('met_oracle'),
                'character_creation': () => this.characterName !== '',
                'basic_training': () => this.hasStoryFlag('learned_help')
            },
            'tutorial': {
                'first_hack_attempt': () => this.hasStoryFlag('used_ls'),
                'discover_files': () => this.hasStoryFlag('read_briefing'),
                'learn_navigation': () => this.hasStoryFlag('used_pwd')
            },
            'data_recovery': {
                'resistance_contact': () => this.hasStoryFlag('found_resistance_dir'),
                'data_theft_discovery': () => this.hasStoryFlag('found_phoenix_logs'),
                'first_decryption': () => this.hasStoryFlag('decrypted_phoenix_logs')
            }
        };
        
        const missionObjectives = objectiveMap[this.currentMission];
        if (missionObjectives) {
            let completedCount = 0;
            const totalObjectives = Object.keys(missionObjectives).length;
            
            for (const [objective, checkFn] of Object.entries(missionObjectives)) {
                if (checkFn()) {
                    completedCount++;
                }
            }
            
            // Check if mission is complete
            if (completedCount >= totalObjectives) {
                return this.completeMission(this.currentMission);
            }
        }
        
        return false;
    }

    // Analytics and Progress
    getProgressSummary() {
        const totalMissions = Object.keys(this.missions).length;
        const sessionTime = Math.floor((Date.now() - this.sessionStartTime) / 1000);
        
        return {
            characterName: this.characterName,
            characterLevel: this.characterLevel,
            currentMission: this.currentMission,
            completedMissions: this.completedMissions.length,
            totalMissions: totalMissions,
            progressPercentage: Math.round((this.completedMissions.length / totalMissions) * 100),
            experiencePoints: this.experiencePoints,
            unlockedCommands: this.unlockedCommands.length,
            sessionTime: sessionTime,
            storyFlags: this.storyFlags.size
        };
    }

    // Story Event Triggers
    triggerStoryEvent(eventType, data = {}) {
        console.log(`[Story Event] ${eventType}:`, data);
        
        // Handle specific story events
        switch (eventType) {
            case 'mission_completed':
                this.advanceToNextMission();
                break;
            case 'character_named':
                this.setStoryFlag('character_created');
                break;
            case 'first_command':
                this.setStoryFlag('terminal_mastery_begun');
                break;
        }
        
        this.saveProgress();
    }
}

// Export for module systems or make globally available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StoryEngine;
} else {
    window.StoryEngine = StoryEngine;
}