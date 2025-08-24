# 🌐 Retro Cyber World - Interactive Cyberpunk Terminal Game

> **Welcome to the GRID. A multi-layered cyberpunk puzzle adventure awaits...**

An immersive interactive cyberpunk terminal experience featuring hidden puzzles, secret codes, and mystery storylines. Navigate through a digital world using authentic terminal commands while uncovering hidden secrets and solving complex puzzles.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Play%20Now-00ff41?style=for-the-badge)](https://retro-cyber-world.netlify.app)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-00ff41?style=for-the-badge)]()

---

## 🎮 How to Play the Game

### 🚀 Getting Started

1. **Visit the live game**: [https://retro-cyber-world.netlify.app](https://retro-cyber-world.netlify.app)
2. **Start with the tutorial**: Type `tutorial` and press Enter
3. **Explore the terminal**: Use `help` to see all available commands
4. **Begin your journey**: Type `about` to learn about your mission

### 🕹️ Game Overview

You are a digital explorer navigating through a mysterious cyberpunk terminal system. Your goal is to:
- **Uncover hidden secrets** scattered throughout the system
- **Solve multi-layered puzzles** using terminal commands and cipher tools
- **Navigate to forbidden areas** by finding access codes
- **Decode encrypted messages** using various cryptographic methods
- **Discover the ultimate truth** hidden in the depths of the GRID

### 🎯 Puzzle Layers & Progression

The game features **3 main stages** of increasing complexity:

#### **Stage 1: Source Code Reconnaissance** 🔍
- **Objective**: Find 5 hidden clues in the HTML source code
- **How to play**: 
  - Right-click on the page and select "View Page Source"
  - Look for HTML comments containing hidden messages
  - Search for Base64 encoded strings, binary messages, and cipher text
  - Use the terminal's `decode` command to decrypt found codes
- **Clues to find**:
  - Binary message that translates to a command
  - Caesar cipher with shift 13
  - Fibonacci sequence puzzle
  - Konami code reference
  - Base64 encoded secret key

#### **Stage 2: Interactive Terminal Puzzles** 💻
- **Objective**: Solve complex puzzles using terminal commands
- **Key Commands**:
  - `puzzle` - Check current puzzle status
  - `hint` - Get helpful clues
  - `cipher <method> <text>` - Decrypt messages
  - `binary <text>` - Convert binary to text
  - `base64 <text>` - Decode Base64 strings
  - `pattern` - Work with number sequences
  - `secrets` - Review discovered secrets
- **Puzzle Types**:
  - **Caesar Cipher**: `cipher caesar <shift> <text>`
  - **Binary Decoding**: `binary 01110100 01110010 01100001...`
  - **Base64 Decoding**: `base64 U2VjcmV0IGtleTpgZ2hvc3Q...`
  - **Pattern Recognition**: Complete Fibonacci and other sequences
  - **Command Combinations**: Use multiple commands in sequence

#### **Stage 3: The Forbidden Zone** 🚫
- **Objective**: Navigate to the secret 404 area where "404 becomes revelation"
- **How to access**: 
  - Combine all secrets found in previous stages
  - Use the `navigate` command with the correct path
  - Access `/sector7/classified` - the forbidden zone
  - Discover the final revelation where 404 errors become the ultimate truth

### 🎮 Essential Game Commands

#### **Basic Navigation**
```bash
help                    # Show all available commands
help <command>          # Get detailed help for specific command
tutorial               # Start interactive tutorial
about                  # Learn about your mission
clear                  # Clear terminal screen
history                # View command history
```

#### **File System Exploration**
```bash
ls [directory]          # List directory contents
cat <file>             # Display file contents
cd <directory>         # Change directory
pwd                    # Show current directory path
```

#### **Puzzle Solving Tools**
```bash
puzzle                 # Check current puzzle status
hint                   # Get helpful hints
cipher <method> <text> # Encrypt/decrypt text
binary <text>          # Convert to/from binary
base64 <text>          # Encode/decode Base64
pattern                # Work with number patterns
decode <method> <key> <text> # Advanced decoding
```

#### **Secret Discovery**
```bash
secrets                # Review all discovered secrets
trace <target>         # Trace digital paths
scan                   # Scan for hidden files
konami                 # Activate special sequence
navigate <path>        # Navigate to special areas
```

#### **System & Customization**
```bash
status                 # System status information
theme [name]           # Switch visual themes
sound                  # Toggle sound effects (future)
stats                  # View your game statistics
memory                 # Check system memory
network                # Network information
test [type]            # Run comprehensive testing suite
```

### 🔓 Puzzle Solutions & Hints

#### **Getting Unstuck**
1. **Read everything carefully** - Clues are hidden in plain sight
2. **Check the source code** - Right-click → View Page Source
3. **Try different cipher methods** - Caesar, binary, Base64, ROT13
4. **Combine multiple commands** - Some secrets require command sequences
5. **Look for patterns** - Numbers, colors, repeated elements
6. **Use the hint system** - Type `hint` when stuck

#### **Common Cipher Methods**
- **Caesar Cipher**: Shift letters by a fixed number (try shifts 1-25)
- **ROT13**: Special case of Caesar cipher with shift 13
- **Binary**: Convert 8-bit binary strings to ASCII text
- **Base64**: Decode Base64 encoded strings
- **Reverse**: Sometimes text is simply reversed

#### **Hidden Areas to Explore**
- Look for references to `/sector7/classified`
- Search for "404" clues that lead to revelation
- Find the "ghost protocol" activation sequence
- Discover the "matrix access code"

### 🎨 Visual Themes

Customize your experience with multiple cyberpunk themes:

```bash
theme                  # List all available themes
theme matrix           # Classic green-on-black Matrix style
theme synthwave        # Purple and cyan neon colors
theme acidburn         # Yellow and green hacker aesthetic
theme ghost            # Blue and white tech interface
theme decay            # Orange and red warning theme
```

**Quick theme switching**: Use `Ctrl + T` to cycle through themes!

### 📱 Device Compatibility

**Desktop**: Full experience with all features
- Use keyboard for optimal typing experience
- Right-click to access developer tools
- Full screen recommended for immersion

**Mobile**: Optimized touch interface
- Touch-friendly command buttons
- Swipe gestures for navigation
- Virtual keyboard integration

**Accessibility**: Screen reader and keyboard navigation support
- ARIA labels for all interactive elements
- High contrast mode compatibility
- Keyboard-only navigation possible

---

## 🛠️ Technical Information

### 🏗️ Architecture

Built with modern web technologies:
- **Frontend**: Vanilla JavaScript, CSS3, HTML5
- **Testing**: Comprehensive Phase 6 testing suite
- **Performance**: Optimized for 60fps animations
- **Security**: XSS protection, content security policy
- **Accessibility**: WCAG 2.1 Level AA compliant

### 📁 Project Structure

```
retro-cyber-web/
├── 📄 index.html              # Main game interface
├── 📁 src/
│   ├── 🎨 css/               # Stylesheets and themes
│   ├── ⚡ js/                # Game logic and terminal system
│   └── 🖼️ assets/            # Images and static files
├── 🧪 tests/                 # Comprehensive testing suite
├── 📚 docs/                  # Technical documentation
├── 🚫 404.html               # Secret revelation page
└── 📋 _redirects             # Netlify deployment config
```

### 🚀 Local Development

#### **Prerequisites**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x or Node.js (for local server)
- Text editor or IDE

#### **Setup Instructions**
```bash
# Clone the repository
git clone https://github.com/yoriichi-07/retro-cyber-web.git
cd retro-cyber-web

# Start local development server
python -m http.server 8080
# OR
npx serve -s . -l 8080

# Open in browser
open http://localhost:8080
```

#### **Development Commands**
```bash
# Run comprehensive tests
# Type 'test' in the game terminal

# Check repository status
git status

# View project structure
ls -la
```

### 🧪 Testing & Quality Assurance

The project includes a comprehensive **Phase 6 Testing Suite**:

- 🌐 **Cross-Browser Compatibility**: Chrome, Firefox, Safari, Edge testing
- ⚡ **Performance Optimization**: 60fps animation targets, memory management
- ♿ **Accessibility Compliance**: WCAG 2.1 Level AA standards
- 🔒 **Security Auditing**: XSS prevention, CSP validation, input sanitization
- 👤 **User Experience Testing**: Mobile responsiveness, usability validation

**Run tests via terminal**: Type `test` in the game terminal to run comprehensive testing!

---

## 🎭 Story & Lore

### 🌆 The Setting

You are a digital explorer in a dystopian cyberpunk world where reality and cyberspace have merged. The GRID contains hidden secrets about humanity's digital future, but accessing them requires solving complex puzzles and navigating through secure systems.

### 🎯 Your Mission

1. **Infiltrate the System**: Use your terminal skills to navigate the digital landscape
2. **Uncover Hidden Truths**: Decrypt messages and solve puzzles to reveal secrets
3. **Access Forbidden Zones**: Find the keys to locked areas of cyberspace
4. **Discover the Revelation**: Learn the truth about the digital world in Sector 7

### 🏆 Achievements

- **🎖️ Code Breaker**: Solve your first cipher
- **🕵️ Digital Detective**: Find all Stage 1 source code clues
- **🔓 System Infiltrator**: Access restricted areas
- **🎮 Nostalgic Gamer**: Activate the Konami code
- **🚀 Grid Master**: Complete all puzzle stages
- **🌟 Cyber Legend**: Discover the ultimate secret

---

## 🤝 Contributing

We welcome contributions! Here's how to get involved:

1. **🍴 Fork** the repository
2. **🌿 Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **💡 Make** your changes with clear, documented code
4. **✅ Test** your changes thoroughly
5. **📝 Commit** with descriptive messages (`git commit -m 'Add: Amazing new feature'`)
6. **🚀 Push** to your branch (`git push origin feature/AmazingFeature`)
7. **🔀 Open** a Pull Request with detailed description

### 🎯 Areas for Contribution
- 🧩 New puzzle types and challenges
- 🎨 Additional visual themes
- 🔊 Sound effects and audio (future)
- 🌍 Internationalization and translations
- 📱 Mobile experience improvements
- ♿ Accessibility enhancements

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### 🎬 Inspiration
- **The Matrix** (1999) - Visual effects and digital rain
- **Ghost in the Shell** - Cyberpunk aesthetics and themes
- **Blade Runner** - Dystopian atmosphere and color palettes
- **Neuromancer** by William Gibson - Cyberpunk concepts and terminology

### 🛠️ Technical Credits
- **Matrix Rain Effect**: HTML5 Canvas animation
- **Typography**: Inconsolata and VT323 fonts
- **Color Schemes**: Inspired by classic terminal emulators
- **Accessibility**: Following WCAG 2.1 guidelines

---

## 🔮 Future Roadmap

### 🚀 Upcoming Features
- 🔊 **Audio System**: Ambient cyberpunk soundscapes and SFX
- 💾 **Save System**: Persistent game state and progress tracking
- 🏆 **Achievement System**: Unlock rewards and special content
- 🌍 **Multiple Languages**: Internationalization support
- 👥 **Multiplayer**: Collaborative puzzle solving
- 🎮 **Extended Storyline**: Additional chapters and mysteries

### 💡 Enhancement Ideas
- 🖼️ **Visual Upgrades**: WebGL effects and advanced graphics
- 🤖 **AI Companions**: Interactive NPCs and guide characters
- 📊 **Analytics**: Player behavior insights and optimization
- 🎯 **Difficulty Levels**: Adaptive challenge systems
- 🔄 **Procedural Content**: Randomly generated puzzles

---

**🌟 Ready to enter the GRID? Your cyberpunk adventure awaits!**

**[🎮 PLAY NOW](https://retro-cyber-world.netlify.app)** | **[📖 View Docs](docs/)** | **[🐛 Report Issues](https://github.com/yoriichi-07/retro-cyber-web/issues)**

---

*"In the GRID, the only limitation is your imagination. Welcome to the future."*