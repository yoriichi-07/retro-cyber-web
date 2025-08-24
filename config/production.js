/**
 * Production Environment Configuration
 * @description Configuration for the production deployment on Vercel
 * @version 1.0.0
 */

const ProductionConfig = {
  // Environment settings
  environment: 'production',
  debug: false,
  verbose: false,
  
  // Performance settings
  performance: {
    enableMetrics: true,
    enableWebVitals: true,
    reportingInterval: 30000, // 30 seconds
    maxMemoryUsage: 50 * 1024 * 1024, // 50MB
  },
  
  // Feature flags for production
  features: {
    devtools: false,
    debugCommands: false,
    betaFeatures: false,
    experimentalEffects: true,
    analytics: true,
    errorReporting: true,
  },
  
  // Security settings
  security: {
    enableCSP: true,
    enableXSSProtection: true,
    enableFrameOptions: true,
    sanitizeUserInput: true,
  },
  
  // Analytics configuration (placeholder for future implementation)
  analytics: {
    enabled: true,
    provider: 'vercel', // Using Vercel Analytics
    trackingId: null, // Will be set via environment variables
    trackPuzzleProgress: true,
    trackPerformance: true,
    trackErrors: true,
  },
  
  // Cache settings
  cache: {
    enableServiceWorker: false, // Disabled for now
    cacheVersion: '1.0.0',
    maxCacheAge: 86400, // 24 hours
  },
  
  // Application metadata
  app: {
    name: 'Retro Cyber World',
    version: '1.0.0',
    description: 'Interactive cyberpunk terminal experience',
    author: 'Cyberpunk Terminal Team',
    repository: 'https://github.com/yoriichi-07/retro-cyber-web',
  }
};

// Export for use in application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProductionConfig;
} else if (typeof window !== 'undefined') {
  window.ProductionConfig = ProductionConfig;
}

// Freeze the configuration to prevent runtime modifications
Object.freeze(ProductionConfig);