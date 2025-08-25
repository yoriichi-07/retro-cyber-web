/* Story System Debug Overlay */
/* Shows initialization status directly on the page */

class StoryDebugOverlay {
    constructor() {
        this.createOverlay();
        this.log('Story Debug Overlay Initialized');
    }
    
    createOverlay() {
        // Create debug overlay element
        this.overlay = document.createElement('div');
        this.overlay.id = 'story-debug-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 300px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #0f0;
            color: #0f0;
            font-family: monospace;
            font-size: 12px;
            padding: 10px;
            z-index: 10000;
            max-height: 400px;
            overflow-y: auto;
        `;
        
        // Create title
        const title = document.createElement('div');
        title.textContent = '🎮 Story System Debug';
        title.style.cssText = `
            color: #0ff;
            font-weight: bold;
            margin-bottom: 10px;
            border-bottom: 1px solid #0ff;
            padding-bottom: 5px;
        `;
        this.overlay.appendChild(title);
        
        // Create log container
        this.logContainer = document.createElement('div');
        this.overlay.appendChild(this.logContainer);
        
        // Add to page
        document.body.appendChild(this.overlay);
    }
    
    log(message, type = 'info') {
        const logEntry = document.createElement('div');
        logEntry.style.cssText = `
            margin: 2px 0;
            padding: 2px;
            border-left: 2px solid ${this.getTypeColor(type)};
            padding-left: 5px;
        `;
        
        const timestamp = new Date().toLocaleTimeString();
        logEntry.textContent = `[${timestamp}] ${message}`;
        
        this.logContainer.appendChild(logEntry);
        
        // Scroll to bottom
        this.logContainer.scrollTop = this.logContainer.scrollHeight;
        
        // Limit log entries
        const entries = this.logContainer.children;
        if (entries.length > 20) {
            this.logContainer.removeChild(entries[0]);
        }
        
        // Also log to console
        console.log(`[Story Debug] ${message}`);
    }
    
    getTypeColor(type) {
        const colors = {
            info: '#0f0',
            success: '#0f0',
            warning: '#ff0',
            error: '#f00',
            system: '#0ff'
        };
        return colors[type] || '#0f0';
    }
    
    logSuccess(message) {
        this.log(`✅ ${message}`, 'success');
    }
    
    logError(message) {
        this.log(`❌ ${message}`, 'error');
    }
    
    logWarning(message) {
        this.log(`⚠️ ${message}`, 'warning');
    }
    
    logSystem(message) {
        this.log(`🔧 ${message}`, 'system');
    }
}

// Debug overlay disabled for production
// window.storyDebug = new StoryDebugOverlay();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StoryDebugOverlay;
}