/* Advanced Visual Effects & Cyberpunk Enhancement System */
/* Cinematic effects, screen distortions, atmosphere enhancement */

/**
 * Cinematic Effects System
 * Provides movie-like visual effects for enhanced cyberpunk atmosphere
 */
class CinematicEffects {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.effects = new Map();
        this.activeEffects = new Set();
        
        // Effect registry
        this.registerEffects();
    }
    
    registerEffects() {
        this.effects.set('scanlines', {
            duration: Infinity,
            intensity: 0.3,
            render: this.renderScanlines.bind(this)
        });
        
        this.effects.set('vignette', {
            duration: Infinity,
            intensity: 0.4,
            render: this.renderVignette.bind(this)
        });
        
        this.effects.set('filmGrain', {
            duration: Infinity,
            intensity: 0.2,
            render: this.renderFilmGrain.bind(this)
        });
        
        this.effects.set('dataCorruption', {
            duration: 2000,
            intensity: 1.0,
            render: this.renderDataCorruption.bind(this)
        });
        
        this.effects.set('matrixOverlay', {
            duration: 3000,
            intensity: 0.8,
            render: this.renderMatrixOverlay.bind(this)
        });
        
        this.effects.set('systemBoot', {
            duration: 5000,
            intensity: 1.0,
            render: this.renderSystemBoot.bind(this)
        });
        
        this.effects.set('memoryLeak', {
            duration: 4000,
            intensity: 0.9,
            render: this.renderMemoryLeak.bind(this)
        });
        
        this.effects.set('networkTrace', {
            duration: 6000,
            intensity: 0.7,
            render: this.renderNetworkTrace.bind(this)
        });
    }
    
    activateEffect(name, options = {}) {
        const effect = this.effects.get(name);
        if (!effect) return;
        
        const effectInstance = {
            name,
            startTime: Date.now(),
            duration: options.duration || effect.duration,
            intensity: options.intensity || effect.intensity,
            render: effect.render,
            data: options.data || {}
        };
        
        this.activeEffects.add(effectInstance);
        
        // Auto-remove timed effects
        if (effectInstance.duration !== Infinity) {
            setTimeout(() => {
                this.deactivateEffect(name);
            }, effectInstance.duration);
        }
        
        console.log(`🎬 Activated cinematic effect: ${name}`);
    }
    
    deactivateEffect(name) {
        for (const effect of this.activeEffects) {
            if (effect.name === name) {
                this.activeEffects.delete(effect);
                console.log(`🎬 Deactivated cinematic effect: ${name}`);
                break;
            }
        }
    }
    
    render(timestamp) {
        // Render all active effects
        for (const effect of this.activeEffects) {
            const elapsed = Date.now() - effect.startTime;
            const progress = Math.min(elapsed / effect.duration, 1);
            
            effect.render(timestamp, progress, effect.intensity, effect.data);
        }
    }
    
    renderScanlines(timestamp, progress, intensity, data) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        this.ctx.save();
        this.ctx.globalAlpha = intensity * 0.3;
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 1;
        
        const lineSpacing = 4;
        const offset = (timestamp * 0.1) % lineSpacing;
        
        for (let y = -offset; y < height; y += lineSpacing) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    renderVignette(timestamp, progress, intensity, data) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
        
        const gradient = this.ctx.createRadialGradient(
            centerX, centerY, maxRadius * 0.3,
            centerX, centerY, maxRadius
        );
        
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity * 0.6})`);
        
        this.ctx.save();
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, height);
        this.ctx.restore();
    }
    
    renderFilmGrain(timestamp, progress, intensity, data) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Create noise pattern
        const imageData = this.ctx.createImageData(width, height);
        const pixels = imageData.data;
        
        for (let i = 0; i < pixels.length; i += 4) {
            const noise = Math.random() * intensity * 50;
            pixels[i] = noise;     // R
            pixels[i + 1] = noise; // G
            pixels[i + 2] = noise; // B
            pixels[i + 3] = noise; // A
        }
        
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'overlay';
        this.ctx.globalAlpha = intensity * 0.1;
        this.ctx.putImageData(imageData, 0, 0);
        this.ctx.restore();
    }
    
    renderDataCorruption(timestamp, progress, intensity, data) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Random corruption blocks
        this.ctx.save();
        this.ctx.globalAlpha = intensity * (1 - progress);
        
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const w = Math.random() * 100 + 10;
            const h = Math.random() * 20 + 5;
            
            // Random corruption colors
            const colors = ['#ff0040', '#00ff80', '#4080ff', '#ff8000'];
            this.ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            this.ctx.fillRect(x, y, w, h);
        }
        
        this.ctx.restore();
    }
    
    renderMatrixOverlay(timestamp, progress, intensity, data) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        this.ctx.save();
        this.ctx.globalAlpha = intensity * Math.sin(progress * Math.PI);
        this.ctx.fillStyle = '#004000';
        
        // Draw matrix-like overlay pattern
        const cellSize = 20;
        for (let x = 0; x < width; x += cellSize) {
            for (let y = 0; y < height; y += cellSize) {
                if (Math.random() < 0.1) {
                    this.ctx.fillRect(x, y, cellSize, cellSize);
                }
            }
        }
        
        this.ctx.restore();
    }
    
    renderSystemBoot(timestamp, progress, intensity, data) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Boot sequence lines
        this.ctx.save();
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '12px "Courier New", monospace';
        this.ctx.globalAlpha = intensity;
        
        const lines = [
            'SYSTEM INITIALIZING...',
            'LOADING NEURAL INTERFACES...',
            'CONNECTING TO MAINFRAME...',
            'AUTHENTICATION SUCCESSFUL',
            'WELCOME TO THE MATRIX'
        ];
        
        const lineHeight = 20;
        const startY = 50;
        const maxLines = Math.floor(progress * lines.length * 2);
        
        for (let i = 0; i < Math.min(maxLines, lines.length); i++) {
            const alpha = Math.max(0, 1 - (maxLines - i) * 0.2);
            this.ctx.globalAlpha = alpha * intensity;
            this.ctx.fillText(lines[i], 20, startY + i * lineHeight);
        }
        
        this.ctx.restore();
    }
    
    renderMemoryLeak(timestamp, progress, intensity, data) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Simulate memory visualization
        this.ctx.save();
        this.ctx.globalAlpha = intensity * (1 - progress * 0.5);
        
        // Memory blocks
        const blockSize = 10;
        const blocksX = width / blockSize;
        const blocksY = height / blockSize;
        const leakProgress = progress * blocksX * blocksY;
        
        for (let i = 0; i < leakProgress; i++) {
            const x = (i % blocksX) * blockSize;
            const y = Math.floor(i / blocksX) * blockSize;
            
            const leakIntensity = Math.random();
            if (leakIntensity > 0.7) {
                this.ctx.fillStyle = '#ff4040';
                this.ctx.fillRect(x, y, blockSize, blockSize);
            } else if (leakIntensity > 0.4) {
                this.ctx.fillStyle = '#ffff40';
                this.ctx.fillRect(x, y, blockSize, blockSize);
            }
        }
        
        this.ctx.restore();
    }
    
    renderNetworkTrace(timestamp, progress, intensity, data) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        this.ctx.save();
        this.ctx.strokeStyle = '#00ffff';
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = intensity;
        
        // Network connection lines
        const nodes = 8;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.3;
        
        for (let i = 0; i < nodes; i++) {
            const angle = (i / nodes) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            // Draw connection to center
            if (progress * nodes > i) {
                this.ctx.beginPath();
                this.ctx.moveTo(centerX, centerY);
                this.ctx.lineTo(x, y);
                this.ctx.stroke();
                
                // Draw node
                this.ctx.beginPath();
                this.ctx.arc(x, y, 5, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        
        this.ctx.restore();
    }
    
    clear() {
        this.activeEffects.clear();
    }
}

/**
 * Screen Distortion Effects
 * Handles screen warping, stretching, and distortion effects
 */
class ScreenDistortion {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.distortionData = null;
        this.activeDistortions = new Map();
    }
    
    applyDistortion(type, intensity = 1, duration = 1000) {
        const distortion = {
            type,
            intensity,
            startTime: Date.now(),
            duration
        };
        
        this.activeDistortions.set(type, distortion);
        
        setTimeout(() => {
            this.removeDistortion(type);
        }, duration);
    }
    
    removeDistortion(type) {
        this.activeDistortions.delete(type);
    }
    
    render(sourceCanvas) {
        if (this.activeDistortions.size === 0) return;
        
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Get source image data
        const sourceCtx = sourceCanvas.getContext('2d');
        const sourceData = sourceCtx.getImageData(0, 0, width, height);
        const targetData = this.ctx.createImageData(width, height);
        
        // Apply distortions
        for (const [type, distortion] of this.activeDistortions) {
            const elapsed = Date.now() - distortion.startTime;
            const progress = Math.min(elapsed / distortion.duration, 1);
            const currentIntensity = distortion.intensity * (1 - progress);
            
            this.applyDistortionType(sourceData, targetData, type, currentIntensity, progress);
        }
        
        // Put distorted image
        this.ctx.putImageData(targetData, 0, 0);
    }
    
    applyDistortionType(sourceData, targetData, type, intensity, progress) {
        const width = sourceData.width;
        const height = sourceData.height;
        
        switch (type) {
            case 'wave':
                this.applyWaveDistortion(sourceData, targetData, intensity, progress);
                break;
            case 'ripple':
                this.applyRippleDistortion(sourceData, targetData, intensity, progress);
                break;
            case 'glitch':
                this.applyGlitchDistortion(sourceData, targetData, intensity, progress);
                break;
            case 'pixelate':
                this.applyPixelateDistortion(sourceData, targetData, intensity, progress);
                break;
        }
    }
    
    applyWaveDistortion(sourceData, targetData, intensity, progress) {
        const width = sourceData.width;
        const height = sourceData.height;
        const waveHeight = intensity * 20;
        const frequency = 0.02;
        
        for (let y = 0; y < height; y++) {
            const offset = Math.sin(y * frequency + progress * 10) * waveHeight;
            
            for (let x = 0; x < width; x++) {
                const sourceX = Math.round(x + offset);
                
                if (sourceX >= 0 && sourceX < width) {
                    const sourceIndex = (y * width + sourceX) * 4;
                    const targetIndex = (y * width + x) * 4;
                    
                    targetData.data[targetIndex] = sourceData.data[sourceIndex];
                    targetData.data[targetIndex + 1] = sourceData.data[sourceIndex + 1];
                    targetData.data[targetIndex + 2] = sourceData.data[sourceIndex + 2];
                    targetData.data[targetIndex + 3] = sourceData.data[sourceIndex + 3];
                }
            }
        }
    }
    
    applyRippleDistortion(sourceData, targetData, intensity, progress) {
        const width = sourceData.width;
        const height = sourceData.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
        const waveSpeed = progress * 100;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const dx = x - centerX;
                const dy = y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                const ripple = Math.sin((distance - waveSpeed) * 0.1) * intensity * 10;
                const sourceX = Math.round(x + (dx / distance) * ripple);
                const sourceY = Math.round(y + (dy / distance) * ripple);
                
                if (sourceX >= 0 && sourceX < width && sourceY >= 0 && sourceY < height) {
                    const sourceIndex = (sourceY * width + sourceX) * 4;
                    const targetIndex = (y * width + x) * 4;
                    
                    targetData.data[targetIndex] = sourceData.data[sourceIndex];
                    targetData.data[targetIndex + 1] = sourceData.data[sourceIndex + 1];
                    targetData.data[targetIndex + 2] = sourceData.data[sourceIndex + 2];
                    targetData.data[targetIndex + 3] = sourceData.data[sourceIndex + 3];
                }
            }
        }
    }
    
    applyGlitchDistortion(sourceData, targetData, intensity, progress) {
        const width = sourceData.width;
        const height = sourceData.height;
        
        // Copy original data first
        for (let i = 0; i < sourceData.data.length; i++) {
            targetData.data[i] = sourceData.data[i];
        }
        
        // Apply glitch blocks
        const glitchBlocks = Math.floor(intensity * 10);
        
        for (let i = 0; i < glitchBlocks; i++) {
            const startY = Math.floor(Math.random() * height);
            const blockHeight = Math.floor(Math.random() * 20 + 5);
            const offset = (Math.random() - 0.5) * intensity * 50;
            
            for (let y = startY; y < Math.min(startY + blockHeight, height); y++) {
                for (let x = 0; x < width; x++) {
                    const sourceX = Math.round(x + offset);
                    
                    if (sourceX >= 0 && sourceX < width) {
                        const sourceIndex = (y * width + sourceX) * 4;
                        const targetIndex = (y * width + x) * 4;
                        
                        targetData.data[targetIndex] = sourceData.data[sourceIndex];
                        targetData.data[targetIndex + 1] = sourceData.data[sourceIndex + 1];
                        targetData.data[targetIndex + 2] = sourceData.data[sourceIndex + 2];
                        targetData.data[targetIndex + 3] = sourceData.data[sourceIndex + 3];
                    }
                }
            }
        }
    }
    
    applyPixelateDistortion(sourceData, targetData, intensity, progress) {
        const width = sourceData.width;
        const height = sourceData.height;
        const pixelSize = Math.max(1, Math.floor(intensity * 10));
        
        for (let y = 0; y < height; y += pixelSize) {
            for (let x = 0; x < width; x += pixelSize) {
                // Get color from top-left pixel of block
                const sourceIndex = (y * width + x) * 4;
                const r = sourceData.data[sourceIndex];
                const g = sourceData.data[sourceIndex + 1];
                const b = sourceData.data[sourceIndex + 2];
                const a = sourceData.data[sourceIndex + 3];
                
                // Fill entire block with this color
                for (let py = y; py < Math.min(y + pixelSize, height); py++) {
                    for (let px = x; px < Math.min(x + pixelSize, width); px++) {
                        const targetIndex = (py * width + px) * 4;
                        targetData.data[targetIndex] = r;
                        targetData.data[targetIndex + 1] = g;
                        targetData.data[targetIndex + 2] = b;
                        targetData.data[targetIndex + 3] = a;
                    }
                }
            }
        }
    }
}

/**
 * Atmosphere Enhancement System
 * Creates ambient environmental effects
 */
class AtmosphereEnhancement {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ambientLevel = 0.5;
        this.colorTint = '#004020';
        this.pulseIntensity = 0.3;
        
        this.lightSources = [];
        this.environmentalEffects = new Set();
    }
    
    setAmbientLevel(level) {
        this.ambientLevel = Math.max(0, Math.min(1, level));
    }
    
    setColorTint(color) {
        this.colorTint = color;
    }
    
    addLightSource(x, y, radius, color, intensity = 1) {
        const light = {
            x, y, radius, color, intensity,
            id: Date.now() + Math.random()
        };
        
        this.lightSources.push(light);
        return light.id;
    }
    
    removeLightSource(id) {
        this.lightSources = this.lightSources.filter(light => light.id !== id);
    }
    
    render(timestamp) {
        this.renderAmbientLighting(timestamp);
        this.renderLightSources(timestamp);
        this.renderEnvironmentalEffects(timestamp);
    }
    
    renderAmbientLighting(timestamp) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Create ambient overlay
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'multiply';
        
        // Pulsing ambient effect
        const pulse = Math.sin(timestamp * 0.002) * 0.1 + 0.9;
        const ambientAlpha = this.ambientLevel * pulse;
        
        this.ctx.fillStyle = this.colorTint;
        this.ctx.globalAlpha = ambientAlpha;
        this.ctx.fillRect(0, 0, width, height);
        
        this.ctx.restore();
    }
    
    renderLightSources(timestamp) {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'screen';
        
        for (const light of this.lightSources) {
            const flicker = Math.sin(timestamp * 0.01 + light.id) * 0.1 + 0.9;
            const currentRadius = light.radius * flicker;
            
            const gradient = this.ctx.createRadialGradient(
                light.x, light.y, 0,
                light.x, light.y, currentRadius
            );
            
            gradient.addColorStop(0, `${light.color}${Math.floor(light.intensity * 255).toString(16).padStart(2, '0')}`);
            gradient.addColorStop(0.5, `${light.color}40`);
            gradient.addColorStop(1, `${light.color}00`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(
                light.x - currentRadius,
                light.y - currentRadius,
                currentRadius * 2,
                currentRadius * 2
            );
        }
        
        this.ctx.restore();
    }
    
    renderEnvironmentalEffects(timestamp) {
        // Floating particles
        this.renderFloatingParticles(timestamp);
        
        // Energy streams
        this.renderEnergyStreams(timestamp);
    }
    
    renderFloatingParticles(timestamp) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        this.ctx.save();
        this.ctx.globalAlpha = 0.4;
        
        // Generate floating particles
        for (let i = 0; i < 30; i++) {
            const x = (Math.sin(timestamp * 0.001 + i) * 0.5 + 0.5) * width;
            const y = (Math.cos(timestamp * 0.0007 + i * 1.3) * 0.5 + 0.5) * height;
            const size = Math.sin(timestamp * 0.003 + i * 0.7) * 2 + 3;
            
            this.ctx.fillStyle = '#00ff40';
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
    
    renderEnergyStreams(timestamp) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        this.ctx.save();
        this.ctx.strokeStyle = '#00ffff';
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.3;
        
        // Vertical energy streams
        for (let i = 0; i < 5; i++) {
            const x = (i / 4) * width;
            const offset = Math.sin(timestamp * 0.005 + i) * 20;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x + offset, 0);
            this.ctx.lineTo(x - offset, height);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    triggerEnvironmentalEvent(type, options = {}) {
        switch (type) {
            case 'lightning':
                this.triggerLightning(options);
                break;
            case 'energyPulse':
                this.triggerEnergyPulse(options);
                break;
            case 'dataStorm':
                this.triggerDataStorm(options);
                break;
        }
    }
    
    triggerLightning(options = {}) {
        const duration = options.duration || 200;
        const intensity = options.intensity || 1;
        
        // Flash effect
        const originalTint = this.colorTint;
        this.colorTint = '#ffffff';
        this.ambientLevel = 0.8 * intensity;
        
        setTimeout(() => {
            this.colorTint = originalTint;
            this.ambientLevel = 0.5;
        }, duration);
    }
    
    triggerEnergyPulse(options = {}) {
        const centerX = options.x || this.canvas.width / 2;
        const centerY = options.y || this.canvas.height / 2;
        const color = options.color || '#00ffff';
        
        const lightId = this.addLightSource(centerX, centerY, 50, color, 2);
        
        // Expand and fade
        let radius = 50;
        const interval = setInterval(() => {
            radius += 20;
            const light = this.lightSources.find(l => l.id === lightId);
            if (light) {
                light.radius = radius;
                light.intensity *= 0.9;
                
                if (light.intensity < 0.1) {
                    this.removeLightSource(lightId);
                    clearInterval(interval);
                }
            }
        }, 50);
    }
    
    triggerDataStorm(options = {}) {
        // Intense color shifting and particle activity
        const duration = options.duration || 3000;
        const colors = ['#ff0040', '#00ff80', '#4080ff', '#ff8000'];
        
        const stormInterval = setInterval(() => {
            this.colorTint = colors[Math.floor(Math.random() * colors.length)];
            this.ambientLevel = Math.random() * 0.5 + 0.3;
        }, 100);
        
        setTimeout(() => {
            clearInterval(stormInterval);
            this.colorTint = '#004020';
            this.ambientLevel = 0.5;
        }, duration);
    }
}

// Export classes for use in main application
window.CinematicEffects = CinematicEffects;
window.ScreenDistortion = ScreenDistortion;
window.AtmosphereEnhancement = AtmosphereEnhancement;