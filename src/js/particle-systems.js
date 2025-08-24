/* Advanced Particle Systems & Visual Effects */
/* Cyberpunk particle effects, interactive systems, performance optimized */

/**
 * High-Performance Particle Engine
 * Object pooling, efficient rendering, physics simulation
 */
class Particle {
    constructor() {
        this.reset();
    }
    
    reset(x = 0, y = 0, options = {}) {
        this.x = x;
        this.y = y;
        this.vx = options.vx || 0;
        this.vy = options.vy || 0;
        this.ax = options.ax || 0;
        this.ay = options.ay || 0;
        this.life = options.life || 1.0;
        this.maxLife = this.life;
        this.decay = options.decay || 0.01;
        this.size = options.size || 2;
        this.color = options.color || '#00ff00';
        this.alpha = options.alpha || 1.0;
        this.rotation = options.rotation || 0;
        this.rotationSpeed = options.rotationSpeed || 0;
        this.gravity = options.gravity || 0;
        this.bounce = options.bounce || 0;
        this.friction = options.friction || 1;
        this.type = options.type || 'square';
        this.text = options.text || '';
        this.trail = options.trail || false;
        this.trailLength = options.trailLength || 10;
        this.trailPositions = [];
        
        return this;
    }
    
    update(deltaTime = 16) {
        // Physics update
        this.vx += this.ax * deltaTime * 0.001;
        this.vy += this.ay * deltaTime * 0.001;
        
        // Apply gravity
        this.vy += this.gravity * deltaTime * 0.001;
        
        // Apply friction
        this.vx *= this.friction;
        this.vy *= this.friction;
        
        // Update position
        this.x += this.vx * deltaTime * 0.1;
        this.y += this.vy * deltaTime * 0.1;
        
        // Update rotation
        this.rotation += this.rotationSpeed * deltaTime * 0.001;
        
        // Update life
        this.life -= this.decay * deltaTime * 0.001;
        this.alpha = this.life / this.maxLife;
        
        // Trail update
        if (this.trail) {
            this.trailPositions.unshift({ x: this.x, y: this.y });
            if (this.trailPositions.length > this.trailLength) {
                this.trailPositions.pop();
            }
        }
        
        // Boundary bouncing
        if (this.bounce > 0) {
            const canvas = document.getElementById('matrix-canvas');
            if (canvas) {
                if (this.x <= 0 || this.x >= canvas.width) {
                    this.vx *= -this.bounce;
                    this.x = Math.max(0, Math.min(canvas.width, this.x));
                }
                if (this.y <= 0 || this.y >= canvas.height) {
                    this.vy *= -this.bounce;
                    this.y = Math.max(0, Math.min(canvas.height, this.y));
                }
            }
        }
        
        return this.life > 0;
    }
    
    render(ctx) {
        if (this.life <= 0) return;
        
        ctx.save();
        
        // Set alpha based on life
        ctx.globalAlpha = this.alpha;
        
        // Translate to particle position
        ctx.translate(this.x, this.y);
        
        // Apply rotation
        if (this.rotation !== 0) {
            ctx.rotate(this.rotation);
        }
        
        // Render trail first
        if (this.trail && this.trailPositions.length > 1) {
            this.renderTrail(ctx);
        }
        
        // Set color
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        
        // Render based on type
        switch (this.type) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'square':
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                break;
                
            case 'line':
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(-this.size, 0);
                ctx.lineTo(this.size, 0);
                ctx.stroke();
                break;
                
            case 'text':
                ctx.font = `${this.size}px "Courier New", monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.text, 0, 0);
                break;
                
            case 'spark':
                this.renderSpark(ctx);
                break;
                
            case 'energy':
                this.renderEnergyBall(ctx);
                break;
                
            default:
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        }
        
        ctx.restore();
    }
    
    renderTrail(ctx) {
        if (this.trailPositions.length < 2) return;
        
        ctx.save();
        ctx.translate(-this.x, -this.y); // Reset translation for trail
        
        for (let i = 0; i < this.trailPositions.length - 1; i++) {
            const pos = this.trailPositions[i];
            const alpha = (this.trailPositions.length - i) / this.trailPositions.length * this.alpha;
            
            ctx.globalAlpha = alpha * 0.5;
            ctx.fillStyle = this.color;
            
            const size = this.size * alpha;
            ctx.fillRect(pos.x - size / 2, pos.y - size / 2, size, size);
        }
        
        ctx.restore();
    }
    
    renderSpark(ctx) {
        // Electric spark effect
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        
        const spikes = 6;
        const innerRadius = this.size * 0.3;
        const outerRadius = this.size;
        
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const angle = (i * Math.PI) / spikes;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.stroke();
    }
    
    renderEnergyBall(ctx) {
        // Pulsing energy effect
        const pulseScale = 1 + Math.sin(Date.now() * 0.01) * 0.2;
        const radius = this.size * pulseScale;
        
        // Outer glow
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 2);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(0.5, this.color.replace(')', ', 0.5)').replace('rgb', 'rgba'));
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }
}

/**
 * Particle System Manager
 * Object pooling, batch rendering, performance optimization
 */
class ParticleSystem {
    constructor(canvas, maxParticles = 1000) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.maxParticles = maxParticles;
        
        // Object pool for performance
        this.particles = [];
        this.activeParticles = [];
        this.inactiveParticles = [];
        
        // Initialize particle pool
        for (let i = 0; i < maxParticles; i++) {
            const particle = new Particle();
            this.particles.push(particle);
            this.inactiveParticles.push(particle);
        }
        
        // Performance tracking
        this.lastTime = 0;
        this.particleCount = 0;
        
        // Emitter presets
        this.presets = this.createPresets();
    }
    
    createPresets() {
        return {
            explosion: {
                count: 30,
                life: 2.0,
                decay: 0.5,
                speed: { min: 50, max: 200 },
                size: { min: 2, max: 8 },
                colors: ['#ff6600', '#ff3300', '#ffff00', '#ffffff'],
                type: 'circle',
                gravity: 50
            },
            
            dataStream: {
                count: 15,
                life: 3.0,
                decay: 0.3,
                speed: { min: 20, max: 100 },
                size: { min: 8, max: 16 },
                colors: ['#00ff00', '#00ff41', '#ffffff'],
                type: 'text',
                texts: ['0', '1', 'アニメ', 'データ', '01', 'FF'],
                gravity: 0
            },
            
            energyDischarge: {
                count: 20,
                life: 1.5,
                decay: 0.8,
                speed: { min: 100, max: 300 },
                size: { min: 4, max: 12 },
                colors: ['#00ffff', '#0080ff', '#ffffff'],
                type: 'spark',
                gravity: 0,
                bounce: 0.7
            },
            
            matrixWake: {
                count: 10,
                life: 4.0,
                decay: 0.2,
                speed: { min: 10, max: 50 },
                size: { min: 3, max: 6 },
                colors: ['#00ff00', '#008800'],
                type: 'square',
                trail: true,
                trailLength: 15
            },
            
            systemOverload: {
                count: 50,
                life: 3.0,
                decay: 0.4,
                speed: { min: 150, max: 400 },
                size: { min: 2, max: 10 },
                colors: ['#ff0000', '#ff3300', '#ff6600', '#ffff00'],
                type: 'energy',
                gravity: 30,
                bounce: 0.5
            }
        };
    }
    
    getParticle() {
        if (this.inactiveParticles.length > 0) {
            const particle = this.inactiveParticles.pop();
            this.activeParticles.push(particle);
            return particle;
        }
        return null;
    }
    
    returnParticle(particle) {
        const index = this.activeParticles.indexOf(particle);
        if (index > -1) {
            this.activeParticles.splice(index, 1);
            this.inactiveParticles.push(particle);
        }
    }
    
    emit(x, y, count = 10, options = {}) {
        for (let i = 0; i < count && this.inactiveParticles.length > 0; i++) {
            const particle = this.getParticle();
            if (!particle) break;
            
            // Random velocity if not specified
            const speed = options.speed || { min: 50, max: 150 };
            const angle = options.angle !== undefined ? options.angle : Math.random() * Math.PI * 2;
            const velocity = typeof speed === 'object' 
                ? speed.min + Math.random() * (speed.max - speed.min)
                : speed;
            
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            // Random size if range specified
            const size = options.size || 3;
            const particleSize = typeof size === 'object'
                ? size.min + Math.random() * (size.max - size.min)
                : size;
            
            // Random color from array
            const colors = options.colors || ['#00ff00'];
            const color = Array.isArray(colors) 
                ? colors[Math.floor(Math.random() * colors.length)]
                : colors;
            
            // Random text for text particles
            let text = '';
            if (options.type === 'text' && options.texts) {
                text = options.texts[Math.floor(Math.random() * options.texts.length)];
            }
            
            particle.reset(x, y, {
                vx,
                vy,
                life: options.life || 2.0,
                decay: options.decay || 0.5,
                size: particleSize,
                color,
                type: options.type || 'square',
                text,
                gravity: options.gravity || 0,
                bounce: options.bounce || 0,
                trail: options.trail || false,
                trailLength: options.trailLength || 10,
                ...options
            });
        }
    }
    
    emitPreset(x, y, presetName, options = {}) {
        const preset = this.presets[presetName];
        if (!preset) {
            console.warn(`Particle preset '${presetName}' not found`);
            return;
        }
        
        const mergedOptions = { ...preset, ...options };
        this.emit(x, y, mergedOptions.count, mergedOptions);
    }
    
    update(timestamp = 0) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // Update all active particles
        for (let i = this.activeParticles.length - 1; i >= 0; i--) {
            const particle = this.activeParticles[i];
            
            if (!particle.update(deltaTime)) {
                this.returnParticle(particle);
            }
        }
        
        this.particleCount = this.activeParticles.length;
    }
    
    render() {
        // Batch render all particles
        this.ctx.save();
        
        // Group particles by type for efficient rendering
        const particleGroups = {};
        
        for (const particle of this.activeParticles) {
            if (!particleGroups[particle.type]) {
                particleGroups[particle.type] = [];
            }
            particleGroups[particle.type].push(particle);
        }
        
        // Render each group
        for (const [type, particles] of Object.entries(particleGroups)) {
            this.renderParticleGroup(particles, type);
        }
        
        this.ctx.restore();
    }
    
    renderParticleGroup(particles, type) {
        // Optimized rendering for particle groups
        switch (type) {
            case 'square':
                this.renderSquareParticles(particles);
                break;
            case 'circle':
                this.renderCircleParticles(particles);
                break;
            default:
                // Individual rendering for complex types
                particles.forEach(particle => particle.render(this.ctx));
        }
    }
    
    renderSquareParticles(particles) {
        // Batch render squares for better performance
        for (const particle of particles) {
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(
                particle.x - particle.size / 2,
                particle.y - particle.size / 2,
                particle.size,
                particle.size
            );
            this.ctx.restore();
        }
    }
    
    renderCircleParticles(particles) {
        // Batch render circles for better performance
        for (const particle of particles) {
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }
    
    clear() {
        // Return all active particles to the pool
        while (this.activeParticles.length > 0) {
            this.returnParticle(this.activeParticles[0]);
        }
    }
    
    getStats() {
        return {
            active: this.activeParticles.length,
            inactive: this.inactiveParticles.length,
            total: this.particles.length
        };
    }
}

/**
 * Interactive Particle Effects Manager
 * Mouse trails, click bursts, keyboard effects
 */
class InteractiveParticles {
    constructor(particleSystem) {
        this.particleSystem = particleSystem;
        this.canvas = particleSystem.canvas;
        
        // Mouse tracking
        this.mouseX = 0;
        this.mouseY = 0;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.mouseTrail = [];
        this.maxTrailLength = 20;
        
        // Trail settings
        this.trailActive = false;
        this.trailIntensity = 1;
        this.lastTrailEmit = 0;
        this.trailEmitDelay = 50; // ms
        
        // Click effects
        this.clickEffects = true;
        this.keyboardEffects = true;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Mouse movement tracking
        this.canvas.addEventListener('mousemove', (e) => {
            this.lastMouseX = this.mouseX;
            this.lastMouseY = this.mouseY;
            
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
            
            this.updateMouseTrail();
            this.emitTrailParticles();
        });
        
        // Mouse enter/leave for trail activation
        this.canvas.addEventListener('mouseenter', () => {
            this.trailActive = true;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.trailActive = false;
            this.mouseTrail = [];
        });
        
        // Click effects
        this.canvas.addEventListener('click', (e) => {
            if (this.clickEffects) {
                this.emitClickBurst(e.clientX - this.canvas.getBoundingClientRect().left, 
                                  e.clientY - this.canvas.getBoundingClientRect().top);
            }
        });
        
        // Keyboard effects
        if (this.keyboardEffects) {
            document.addEventListener('keydown', (e) => {
                this.emitKeyboardEffect(e.key);
            });
        }
        
        // Touch support for mobile
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            
            this.lastMouseX = this.mouseX;
            this.lastMouseY = this.mouseY;
            this.mouseX = touch.clientX - rect.left;
            this.mouseY = touch.clientY - rect.top;
            
            this.updateMouseTrail();
            this.emitTrailParticles();
        });
    }
    
    updateMouseTrail() {
        // Add current position to trail
        this.mouseTrail.unshift({ x: this.mouseX, y: this.mouseY, time: Date.now() });
        
        // Remove old trail points
        while (this.mouseTrail.length > this.maxTrailLength) {
            this.mouseTrail.pop();
        }
        
        // Remove points older than 500ms
        const now = Date.now();
        this.mouseTrail = this.mouseTrail.filter(point => now - point.time < 500);
    }
    
    emitTrailParticles() {
        if (!this.trailActive) return;
        
        const now = Date.now();
        if (now - this.lastTrailEmit < this.trailEmitDelay) return;
        this.lastTrailEmit = now;
        
        // Calculate mouse velocity
        const dx = this.mouseX - this.lastMouseX;
        const dy = this.mouseY - this.lastMouseY;
        const velocity = Math.sqrt(dx * dx + dy * dy);
        
        // Emit particles based on velocity
        if (velocity > 2) {
            const count = Math.min(5, Math.floor(velocity / 10));
            
            this.particleSystem.emit(this.mouseX, this.mouseY, count, {
                life: 1.0 + velocity * 0.01,
                decay: 0.8,
                speed: { min: 10, max: velocity },
                size: { min: 2, max: 6 },
                colors: ['#00ff00', '#00ff41', '#008800'],
                type: 'square',
                trail: true,
                trailLength: 8,
                gravity: 20
            });
        }
    }
    
    emitClickBurst(x, y) {
        // Create explosion effect at click location
        this.particleSystem.emitPreset(x, y, 'energyDischarge', {
            count: 25,
            colors: ['#00ffff', '#ffffff', '#0080ff']
        });
        
        // Add secondary ring effect
        setTimeout(() => {
            this.particleSystem.emit(x, y, 15, {
                life: 2.0,
                decay: 0.5,
                speed: { min: 80, max: 150 },
                size: { min: 3, max: 8 },
                colors: ['#00ff00', '#00ff41'],
                type: 'circle',
                gravity: 0
            });
        }, 100);
    }
    
    emitKeyboardEffect(key) {
        // Different effects for different key types
        const terminalInput = document.getElementById('terminal-input');
        if (!terminalInput) return;
        
        const rect = terminalInput.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top;
        
        // Convert screen coordinates to canvas coordinates
        const canvasRect = this.canvas.getBoundingClientRect();
        const canvasX = x - canvasRect.left;
        const canvasY = y - canvasRect.top;
        
        if (key === 'Enter') {
            // Command execution effect
            this.particleSystem.emitPreset(canvasX, canvasY, 'energyDischarge', {
                count: 15,
                colors: ['#00ff00', '#ffffff']
            });
        } else if (key === 'Backspace') {
            // Deletion effect
            this.particleSystem.emit(canvasX, canvasY, 8, {
                life: 1.0,
                decay: 1.0,
                speed: { min: 30, max: 80 },
                size: { min: 2, max: 4 },
                colors: ['#ff3300', '#ff6600'],
                type: 'square',
                gravity: 50
            });
        } else if (key.length === 1) {
            // Regular character typing
            this.particleSystem.emit(canvasX, canvasY, 3, {
                life: 0.8,
                decay: 1.2,
                speed: { min: 20, max: 60 },
                size: { min: 4, max: 8 },
                colors: ['#00ff00', '#00ff41'],
                type: 'text',
                texts: [key.toUpperCase()],
                gravity: 30
            });
        }
    }
    
    setTrailIntensity(intensity) {
        this.trailIntensity = Math.max(0, Math.min(2, intensity));
        this.trailEmitDelay = Math.floor(100 / this.trailIntensity);
    }
    
    enableClickEffects(enabled = true) {
        this.clickEffects = enabled;
    }
    
    enableKeyboardEffects(enabled = true) {
        this.keyboardEffects = enabled;
    }
    
    triggerCommandEffect(success = true) {
        const terminalOutput = document.getElementById('terminal-output');
        if (!terminalOutput) return;
        
        const rect = terminalOutput.getBoundingClientRect();
        const canvasRect = this.canvas.getBoundingClientRect();
        
        const x = rect.left + rect.width / 2 - canvasRect.left;
        const y = rect.bottom - canvasRect.top;
        
        if (success) {
            this.particleSystem.emitPreset(x, y, 'dataStream', {
                count: 20,
                colors: ['#00ff00', '#00ff41', '#ffffff']
            });
        } else {
            this.particleSystem.emitPreset(x, y, 'systemOverload', {
                count: 15,
                colors: ['#ff0000', '#ff3300', '#ffff00']
            });
        }
    }
    
    triggerPuzzleEffect(type = 'discovery') {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        switch (type) {
            case 'discovery':
                this.particleSystem.emitPreset(centerX, centerY, 'explosion', {
                    count: 40,
                    colors: ['#00ff00', '#00ffff', '#ffffff']
                });
                break;
                
            case 'completion':
                // Epic completion effect
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        this.particleSystem.emitPreset(centerX, centerY, 'systemOverload', {
                            count: 30,
                            colors: ['#gold', '#ffff00', '#ffffff', '#00ff00']
                        });
                    }, i * 200);
                }
                break;
                
            case 'glitch':
                this.particleSystem.emit(centerX, centerY, 25, {
                    life: 2.0,
                    decay: 0.6,
                    speed: { min: 100, max: 200 },
                    size: { min: 3, max: 10 },
                    colors: ['#ff00ff', '#00ffff', '#ffff00'],
                    type: 'spark',
                    gravity: 0,
                    bounce: 0.8
                });
                break;
        }
    }
}