# Retro Cyber Web

An immersive retro cyberpunk terminal interface with multi-layered puzzle mechanics, designed to capture the aesthetic and mystery of classic cyberpunk fiction.

## 🚀 Features

- **Authentic Terminal Experience**: Full-featured command-line interface with real commands
- **Cyberpunk Aesthetics**: Multiple theme options including Dystopian Noir, Synthwave, and Ghost in the Shell
- **Interactive Puzzles**: Multi-layered puzzle system with hidden codes and secrets
- **Matrix Rain Effect**: Dynamic background animation using HTML5 Canvas
- **Typewriter Effects**: Character-by-character text animation for immersion
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: Screen reader support and keyboard navigation

## 🎮 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x (for local development server)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/retro-cyber-web.git
cd retro-cyber-web
```

2. Start the development server:
```bash
npm run dev
# or
python -m http.server 8080
```

3. Open your browser and navigate to `http://localhost:8080`

## 🕹️ How to Play

1. **Start the Tutorial**: Type `tutorial` to begin your journey
2. **Explore Commands**: Use `help` to see all available commands
3. **Solve Puzzles**: Look for clues in files and system logs
4. **Decode Messages**: Use the built-in cipher tools to reveal secrets
5. **Unlock Areas**: Progress through the mystery to access new areas

### Basic Commands

- `help` - Show all available commands
- `ls` - List files in current directory
- `cat <file>` - Read file contents
- `cd <directory>` - Change directory
- `cipher <method> <text>` - Encrypt/decrypt text
- `puzzle` - Show current puzzle status
- `hint` - Get a helpful hint

## 🎨 Themes

Switch between multiple cyberpunk-inspired themes:

- **Dystopian Noir**: Dark green on black (classic Matrix style)
- **Synthwave**: Purple and cyan neon colors
- **Acid Burn**: Yellow and green hacker aesthetic
- **Ghost in the Shell**: Blue and white tech interface
- **Digital Decay**: Orange and red warning theme

Use `Ctrl+T` to cycle through themes, or implement a theme selector.

## 🏗️ Project Structure

```
retro-cyber-web/
├── src/
│   ├── css/
│   │   ├── reset.css          # CSS reset and base styles
│   │   ├── variables.css      # Color themes and design tokens
│   │   ├── base.css          # Typography and layout
│   │   ├── main.css          # Terminal and component styles
│   │   └── components/       # Component-specific styles
│   ├── js/
│   │   ├── utils.js          # Utility functions
│   │   ├── terminal.js       # Terminal controller
│   │   ├── typewriter.js     # Text animation system
│   │   ├── commands.js       # Command implementations
│   │   └── main.js           # Application entry point
│   └── assets/
│       ├── images/           # Static images
│       ├── fonts/            # Custom fonts
│       └── sounds/           # Audio effects (future)
├── tests/                    # Test files
├── docs/                     # Documentation
├── dist/                     # Built files (future)
├── index.html               # Main HTML file
├── package.json             # Project configuration
└── README.md               # This file
```

## 🔧 Development

### Development Phases

The project is built in 7 phases:

1. **Phase 1**: Foundation setup ✅
2. **Phase 2**: Visual effects and CRT styling
3. **Phase 3**: Puzzle system and game logic
4. **Phase 4**: Advanced interactions and secrets
5. **Phase 5**: Audio system and sound effects
6. **Phase 6**: Performance optimization
7. **Phase 7**: Final polish and deployment

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🎯 Puzzle Hints

Getting stuck? Here are some general tips:

- Read all files carefully - codes are often hidden in plain sight
- The `cipher` command has multiple methods for decoding
- System logs often contain important clues
- Try different combinations of commands
- Some secrets are revealed only through specific command sequences

## 📱 Mobile Support

The interface is optimized for mobile devices with:

- Touch-friendly input
- Responsive terminal sizing
- Mobile-specific command shortcuts
- Optimized touch scrolling

## 🔒 Security Features

- Input sanitization to prevent XSS
- Content Security Policy headers
- Safe command execution environment
- No external dependencies (vanilla JS/CSS/HTML)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by classic cyberpunk films and literature
- Matrix rain effect inspired by "The Matrix" (1999)
- Terminal aesthetics inspired by classic Unix systems
- Color schemes inspired by retro computing and synthwave culture

## 🔮 Future Features

- Sound effects and ambient audio
- Additional puzzle layers
- Multi-user functionality
- Save/load game state
- Achievement system
- Advanced graphics effects
- WebGL enhancements

---

**Welcome to the GRID. Your journey into the digital realm begins now.**

*Type `help` to start exploring the cyberpunk terminal interface.*