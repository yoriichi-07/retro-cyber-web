# 🤝 Contributing to Retro Cyber World

Thank you for your interest in contributing to the Retro Cyber World project! This cyberpunk terminal interface is a community-driven project, and we welcome contributions from developers of all skill levels.

## 🎯 Ways to Contribute

### 🐛 Bug Reports
- Report bugs through [GitHub Issues](https://github.com/yoriichi-07/retro-cyber-web/issues)
- Include detailed reproduction steps
- Provide browser and device information
- Screenshots or screen recordings are helpful

### 💡 Feature Requests
- Suggest new terminal commands
- Propose visual effects or themes
- Request accessibility improvements
- Share ideas for puzzle enhancements

### 🔧 Code Contributions
- Fix bugs and issues
- Implement new features
- Improve performance
- Enhance accessibility
- Add test coverage

### 📚 Documentation
- Improve README and guides
- Add code comments and JSDoc
- Create tutorials and examples
- Translate content to other languages

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Git
- Modern web browser
- Text editor or IDE

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/retro-cyber-web.git
   cd retro-cyber-web
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   # Opens at http://localhost:3000
   ```

5. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

## 📝 Development Guidelines

### Code Style

**JavaScript**:
- Use ES6+ features and modern syntax
- Prefer `const` and `let` over `var`
- Use descriptive variable and function names
- Add JSDoc comments for public methods
- Keep functions small and focused

```javascript
/**
 * Executes a terminal command and returns the result
 * @param {string} command - The command to execute
 * @returns {Promise<Object>} Command execution result
 */
async function executeCommand(command) {
  // Implementation here
}
```

**CSS**:
- Use CSS custom properties for colors and spacing
- Follow BEM naming convention for classes
- Mobile-first responsive design
- Prefer CSS Grid and Flexbox for layouts

```css
/* Good */
.terminal__output--success {
  color: var(--color-success);
  font-family: var(--font-mono);
}
```

**HTML**:
- Use semantic HTML elements
- Include ARIA labels for accessibility
- Optimize for screen readers
- Validate markup

### File Organization

```
src/
├── css/
│   ├── reset.css          # CSS reset
│   ├── variables.css      # Custom properties
│   ├── base.css          # Base styles
│   └── main.css          # Component styles
├── js/
│   ├── utils.js          # Utility functions
│   ├── terminal.js       # Terminal logic
│   ├── commands.js       # Command implementations
│   └── main.js           # Application entry
└── assets/
    ├── images/           # Static images
    └── fonts/            # Custom fonts
```

### Naming Conventions

- **Files**: `kebab-case.js`, `kebab-case.css`
- **Variables**: `camelCase`
- **Functions**: `camelCase`
- **Classes**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **CSS Classes**: `kebab-case` or BEM

### Commit Messages

Use conventional commit format:

```bash
# Types: feat, fix, docs, style, refactor, test, chore
feat: add new cipher command for puzzle solving
fix: resolve typewriter animation timing issue
docs: update installation instructions
style: improve cyberpunk color scheme
refactor: optimize matrix rain performance
test: add command parser unit tests
chore: update dependencies
```

## 🧪 Testing

### Manual Testing
```bash
# Start development server
npm run dev

# Test in multiple browsers:
# - Chrome (latest)
# - Firefox (latest)
# - Safari (if on macOS)
# - Edge (latest)

# Test responsive design:
# - Desktop (1920x1080)
# - Tablet (768x1024)
# - Mobile (375x667)
```

### Test Coverage Areas
- ✅ All terminal commands work correctly
- ✅ Visual effects render smoothly
- ✅ Responsive design on all devices
- ✅ Accessibility with screen readers
- ✅ Cross-browser compatibility
- ✅ Performance (60fps animations)

### Performance Testing
```bash
# Use browser dev tools to check:
# - FPS during animations
# - Memory usage over time
# - Network requests
# - Core Web Vitals
```

## 🎨 Design Guidelines

### Cyberpunk Aesthetic
- **Colors**: Use neon greens, electric blues, hot pinks
- **Typography**: Monospace fonts (Inconsolata, VT323)
- **Effects**: Glitch animations, CRT scanlines, matrix rain
- **Atmosphere**: Dark backgrounds with bright accents

### Accessibility
- **Contrast**: Maintain WCAG AA standards (4.5:1 minimum)
- **Navigation**: Support keyboard-only navigation
- **Screen Readers**: Provide ARIA labels and descriptions
- **Animations**: Respect `prefers-reduced-motion`

### Responsive Design
- **Mobile First**: Start with mobile layout
- **Breakpoints**: 
  - Mobile: 320px - 767px
  - Tablet: 768px - 1023px
  - Desktop: 1024px+
- **Touch**: Ensure touch targets are 44px minimum

## 🔄 Pull Request Process

### Before Submitting

1. **Test thoroughly**
   - Manual testing on multiple devices
   - Check for console errors
   - Verify accessibility features

2. **Code quality**
   - Follow style guidelines
   - Add necessary documentation
   - Clean up debug code

3. **Git hygiene**
   - Rebase on latest main branch
   - Use meaningful commit messages
   - Squash related commits

### PR Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix or feature that breaks existing functionality)
- [ ] Documentation update

## Testing
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested on mobile devices
- [ ] Checked accessibility features
- [ ] No console errors

## Screenshots
Include screenshots or GIFs for visual changes.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No merge conflicts
```

### Review Process

1. **Automated checks** must pass (when implemented)
2. **Manual review** by maintainers
3. **Testing** on multiple browsers/devices
4. **Approval** and merge by maintainers

## 🏷️ Issue Labels

| Label | Description |
|-------|-------------|
| `bug` | Something isn't working |
| `enhancement` | New feature or request |
| `documentation` | Improvements to docs |
| `good first issue` | Good for newcomers |
| `help wanted` | Extra attention needed |
| `accessibility` | Related to a11y |
| `performance` | Speed/optimization related |
| `visual` | UI/UX improvements |

## 🎯 Priority Areas

We especially welcome contributions in these areas:

### High Priority
- 🐛 **Bug fixes** and stability improvements
- ♿ **Accessibility** enhancements
- 📱 **Mobile experience** optimization
- 🚀 **Performance** improvements

### Medium Priority
- 🎨 **New visual themes** and effects
- 🧩 **Additional puzzle types** and commands
- 🌍 **Internationalization** (i18n)
- 📖 **Documentation** improvements

### Future Features
- 🔊 **Audio system** integration
- 💾 **Save/load game state**
- 🏆 **Achievement system**
- 👥 **Multiplayer features**

## 🎪 Community

### Communication
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: General questions and ideas
- **Pull Requests**: Code contributions

### Code of Conduct
We are committed to providing a welcoming and inclusive environment. Please be:
- **Respectful** of differing viewpoints and experiences
- **Constructive** in feedback and criticism
- **Collaborative** and helpful to other contributors
- **Professional** in all interactions

## 🏆 Recognition

Contributors will be:
- ✅ Listed in the project README
- ✅ Mentioned in release notes
- ✅ Credited in the application's about section

## 📚 Resources

### Learning Resources
- [MDN Web Docs](https://developer.mozilla.org/) - Web development reference
- [Web.dev](https://web.dev/) - Modern web development practices
- [A11y Project](https://www.a11yproject.com/) - Accessibility guidelines
- [CSS-Tricks](https://css-tricks.com/) - CSS tutorials and tricks

### Development Tools
- [VS Code](https://code.visualstudio.com/) - Recommended editor
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)
- [Firefox Developer Tools](https://developer.mozilla.org/en-US/docs/Tools)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance auditing

---

## 🚀 Ready to Contribute?

1. **Choose an issue** or create a new one
2. **Fork the repository** and create a feature branch
3. **Make your changes** following our guidelines
4. **Test thoroughly** and document your work
5. **Submit a pull request** with a clear description

**Welcome to the cyberpunk revolution! Let's build something amazing together. 🌟**

---

*For questions, feel free to open an issue or start a discussion. Happy coding!*