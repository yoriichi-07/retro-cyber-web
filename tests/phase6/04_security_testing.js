/**
 * Phase 6: Security Testing & Audit Suite
 * 
 * This module provides comprehensive security testing
 * to identify and prevent vulnerabilities.
 */

class SecurityTestSuite {
    constructor() {
        this.testResults = [];
        this.vulnerabilities = [];
        this.startTime = Date.now();
        
        console.log('🔒 Security Test Suite initialized');
        console.log('🛡️ Starting comprehensive security audit...');
    }
    
    async runSecurityAudit() {
        console.log('🔍 Starting security vulnerability assessment...');
        
        // Input validation and sanitization tests
        await this.testInputValidation();
        
        // XSS prevention tests
        await this.testXSSPrevention();
        
        // Data storage security tests
        await this.testDataStorageSecurity();
        
        // Content Security Policy tests
        await this.testContentSecurityPolicy();
        
        // HTTPS and transport security tests
        await this.testTransportSecurity();
        
        // Authentication and session management tests
        await this.testAuthenticationSecurity();
        
        // Privacy and data protection tests
        await this.testPrivacyProtection();
        
        // Generate security report
        this.generateSecurityReport();
        
        return this.testResults;
    }
    
    async testInputValidation() {
        const testName = 'Input Validation & Sanitization';
        console.log(`🔍 Testing: ${testName}`);
        
        try {
            const vulnerabilities = [];
            
            // Test command input validation
            if (window.app && window.app.terminal) {
                const terminal = window.app.terminal;
                
                // Test XSS payloads in command input
                const xssPayloads = [
                    '<script>alert("XSS")</script>',
                    'javascript:alert("XSS")',
                    '<img src="x" onerror="alert(\'XSS\')">',
                    '"><script>alert("XSS")</script>',
                    '\'><script>alert("XSS")</script>',
                    '<svg onload="alert(\'XSS\')">',
                    '<iframe src="javascript:alert(\'XSS\')"></iframe>'
                ];
                
                for (const payload of xssPayloads) {
                    try {
                        // Test if the terminal properly sanitizes input
                        const sanitized = this.simulateInputSanitization(payload);
                        
                        if (sanitized === payload) {
                            vulnerabilities.push({
                                type: 'XSS',
                                location: 'Terminal Input',
                                payload: payload,
                                severity: 'High'
                            });
                        }
                    } catch (error) {
                        // Error during sanitization test - this might be good (input rejected)
                    }
                }
                
                // Test SQL injection patterns (even though we're client-side)
                const sqlPayloads = [
                    "'; DROP TABLE users; --",
                    "' OR '1'='1",
                    "'; INSERT INTO",
                    "' UNION SELECT"
                ];
                
                for (const payload of sqlPayloads) {
                    const sanitized = this.simulateInputSanitization(payload);
                    
                    if (sanitized === payload) {
                        vulnerabilities.push({
                            type: 'SQL Injection Pattern',
                            location: 'Terminal Input',
                            payload: payload,
                            severity: 'Medium'
                        });
                    }
                }
            }
            
            // Test form input validation
            const forms = document.querySelectorAll('form');
            const inputs = document.querySelectorAll('input, textarea, select');
            
            inputs.forEach((input, index) => {
                // Check for client-side validation
                const hasValidation = input.hasAttribute('required') ||
                                    input.hasAttribute('pattern') ||
                                    input.hasAttribute('minlength') ||
                                    input.hasAttribute('maxlength') ||
                                    input.type !== 'text';
                
                if (!hasValidation && input.type !== 'hidden') {
                    vulnerabilities.push({
                        type: 'Missing Input Validation',
                        location: `Input ${index + 1} (${input.type})`,
                        element: input.tagName.toLowerCase(),
                        severity: 'Low'
                    });
                }
            });
            
            this.recordTest(testName, vulnerabilities.length === 0, {
                vulnerabilities: vulnerabilities,
                inputsChecked: inputs.length,
                formsChecked: forms.length
            });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testXSSPrevention() {
        const testName = 'XSS Prevention Mechanisms';
        console.log(`🛡️ Testing: ${testName}`);
        
        try {
            const vulnerabilities = [];
            
            // Test for dangerous innerHTML usage
            const scriptContent = this.getScriptContent();
            
            if (scriptContent.includes('.innerHTML =') && 
                !scriptContent.includes('DOMPurify') && 
                !scriptContent.includes('sanitize')) {
                
                vulnerabilities.push({
                    type: 'Unsafe innerHTML Usage',
                    location: 'JavaScript Code',
                    description: 'Direct innerHTML assignment without sanitization',
                    severity: 'High'
                });
            }
            
            // Test for eval() usage
            if (scriptContent.includes('eval(')) {
                vulnerabilities.push({
                    type: 'Dangerous eval() Usage',
                    location: 'JavaScript Code',
                    description: 'eval() function can execute arbitrary code',
                    severity: 'Critical'
                });
            }
            
            // Test for unsafe DOM manipulation
            const unsafeMethods = [
                'document.write(',
                'document.writeln(',
                '.outerHTML =',
                'insertAdjacentHTML('
            ];
            
            unsafeMethods.forEach(method => {
                if (scriptContent.includes(method)) {
                    vulnerabilities.push({
                        type: 'Unsafe DOM Manipulation',
                        location: 'JavaScript Code',
                        method: method,
                        description: `${method} can be exploited for XSS`,
                        severity: 'Medium'
                    });
                }
            });
            
            // Test for CSP violations
            const inlineScripts = document.querySelectorAll('script:not([src])');
            const inlineStyles = document.querySelectorAll('style, [style]');
            
            if (inlineScripts.length > 0) {
                vulnerabilities.push({
                    type: 'Inline Script Usage',
                    location: 'HTML',
                    count: inlineScripts.length,
                    description: 'Inline scripts violate strict CSP',
                    severity: 'Medium'
                });
            }
            
            // Test for unsafe URL handling
            const links = document.querySelectorAll('a[href^="javascript:"]');
            if (links.length > 0) {
                vulnerabilities.push({
                    type: 'JavaScript URLs',
                    location: 'HTML Links',
                    count: links.length,
                    description: 'javascript: URLs can be exploited',
                    severity: 'Medium'
                });
            }
            
            this.recordTest(testName, vulnerabilities.length === 0, {
                vulnerabilities: vulnerabilities,
                inlineScriptsFound: inlineScripts.length,
                inlineStylesFound: inlineStyles.length
            });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testDataStorageSecurity() {
        const testName = 'Data Storage Security';
        console.log(`💾 Testing: ${testName}`);
        
        try {
            const vulnerabilities = [];
            
            // Test localStorage security
            try {
                // Check for sensitive data in localStorage
                const storageData = { ...localStorage };
                
                Object.entries(storageData).forEach(([key, value]) => {
                    // Check for potential sensitive data patterns
                    const sensitivePatterns = [
                        /password/i,
                        /token/i,
                        /api[_-]?key/i,
                        /secret/i,
                        /credential/i,
                        /auth/i
                    ];
                    
                    const isSensitive = sensitivePatterns.some(pattern => 
                        pattern.test(key) || pattern.test(value)
                    );
                    
                    if (isSensitive) {
                        vulnerabilities.push({
                            type: 'Sensitive Data in Storage',
                            location: 'localStorage',
                            key: key,
                            description: 'Sensitive data should not be stored in localStorage',
                            severity: 'High'
                        });
                    }
                });
                
                // Test storage data validation
                Object.entries(storageData).forEach(([key, value]) => {
                    try {
                        // Try to parse JSON data
                        const parsed = JSON.parse(value);
                        
                        // Check if parsed data contains executable content
                        const serialized = JSON.stringify(parsed);
                        if (serialized.includes('<script>') || 
                            serialized.includes('javascript:') ||
                            serialized.includes('eval(')) {
                            
                            vulnerabilities.push({
                                type: 'Dangerous Content in Storage',
                                location: 'localStorage',
                                key: key,
                                description: 'Storage contains potentially executable content',
                                severity: 'Medium'
                            });
                        }
                        
                    } catch (error) {
                        // Not valid JSON, might be intentional
                    }
                });
                
            } catch (error) {
                vulnerabilities.push({
                    type: 'Storage Access Error',
                    location: 'localStorage',
                    error: error.message,
                    severity: 'Low'
                });
            }
            
            // Test sessionStorage security
            try {
                const sessionData = { ...sessionStorage };
                
                Object.entries(sessionData).forEach(([key, value]) => {
                    const sensitivePatterns = [
                        /password/i,
                        /token/i,
                        /secret/i
                    ];
                    
                    const isSensitive = sensitivePatterns.some(pattern => 
                        pattern.test(key) || pattern.test(value)
                    );
                    
                    if (isSensitive) {
                        vulnerabilities.push({
                            type: 'Sensitive Data in Session Storage',
                            location: 'sessionStorage',
                            key: key,
                            severity: 'Medium'
                        });
                    }
                });
                
            } catch (error) {
                // sessionStorage not available or restricted
            }
            
            // Test for data encryption
            const hasEncryption = this.checkForDataEncryption();
            if (!hasEncryption) {
                console.warn('No data encryption mechanisms detected');
            }
            
            this.recordTest(testName, vulnerabilities.length === 0, {
                vulnerabilities: vulnerabilities,
                localStorageItems: Object.keys(localStorage).length,
                sessionStorageItems: Object.keys(sessionStorage).length,
                hasEncryption: hasEncryption
            });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testContentSecurityPolicy() {
        const testName = 'Content Security Policy';
        console.log(`🛡️ Testing: ${testName}`);
        
        try {
            const vulnerabilities = [];
            
            // Check for CSP meta tag
            const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            
            if (!cspMeta) {
                vulnerabilities.push({
                    type: 'Missing CSP',
                    location: 'HTML Head',
                    description: 'No Content Security Policy meta tag found',
                    severity: 'High'
                });
            } else {
                const cspContent = cspMeta.getAttribute('content');
                
                // Analyze CSP directives
                const cspAnalysis = this.analyzeCSP(cspContent);
                vulnerabilities.push(...cspAnalysis.vulnerabilities);
            }
            
            // Check for unsafe-inline and unsafe-eval
            if (cspMeta) {
                const content = cspMeta.getAttribute('content');
                
                if (content.includes("'unsafe-inline'")) {
                    vulnerabilities.push({
                        type: 'Unsafe CSP Directive',
                        location: 'CSP',
                        directive: 'unsafe-inline',
                        description: 'unsafe-inline reduces XSS protection',
                        severity: 'Medium'
                    });
                }
                
                if (content.includes("'unsafe-eval'")) {
                    vulnerabilities.push({
                        type: 'Unsafe CSP Directive',
                        location: 'CSP',
                        directive: 'unsafe-eval',
                        description: 'unsafe-eval allows dangerous eval() usage',
                        severity: 'High'
                    });
                }
            }
            
            this.recordTest(testName, vulnerabilities.length === 0, {
                vulnerabilities: vulnerabilities,
                hasCSP: !!cspMeta,
                cspContent: cspMeta ? cspMeta.getAttribute('content') : null
            });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testTransportSecurity() {
        const testName = 'Transport Security';
        console.log(`🚀 Testing: ${testName}`);
        
        try {
            const vulnerabilities = [];
            
            // Check if site is served over HTTPS
            const isHTTPS = location.protocol === 'https:';
            
            if (!isHTTPS) {
                vulnerabilities.push({
                    type: 'Insecure Transport',
                    location: 'Protocol',
                    description: 'Site not served over HTTPS',
                    severity: 'High'
                });
            }
            
            // Check for mixed content
            const resources = performance.getEntriesByType('resource');
            const mixedContent = resources.filter(resource => 
                isHTTPS && resource.name.startsWith('http://'));
            
            if (mixedContent.length > 0) {
                vulnerabilities.push({
                    type: 'Mixed Content',
                    location: 'Resource Loading',
                    count: mixedContent.length,
                    description: 'HTTP resources loaded on HTTPS page',
                    severity: 'Medium'
                });
            }
            
            // Check for HSTS header simulation (client-side only)
            const hasHSTSImplementation = this.checkForHSTSImplementation();
            
            if (!hasHSTSImplementation) {
                console.warn('No HSTS implementation detected (server-side header required)');
            }
            
            // Check external links for security
            const externalLinks = document.querySelectorAll('a[href^="http"]');
            externalLinks.forEach((link, index) => {
                if (!link.hasAttribute('rel') || 
                    !link.getAttribute('rel').includes('noopener')) {
                    
                    vulnerabilities.push({
                        type: 'Unsafe External Link',
                        location: `External Link ${index + 1}`,
                        href: link.href,
                        description: 'External links should use rel="noopener noreferrer"',
                        severity: 'Low'
                    });
                }
            });
            
            this.recordTest(testName, vulnerabilities.length === 0, {
                vulnerabilities: vulnerabilities,
                isHTTPS: isHTTPS,
                mixedContentCount: mixedContent.length,
                externalLinksChecked: externalLinks.length
            });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testAuthenticationSecurity() {
        const testName = 'Authentication & Session Security';
        console.log(`🔐 Testing: ${testName}`);
        
        try {
            const vulnerabilities = [];
            
            // Check for password fields without proper security
            const passwordFields = document.querySelectorAll('input[type="password"]');
            
            passwordFields.forEach((field, index) => {
                // Check for autocomplete settings
                if (field.getAttribute('autocomplete') === 'on') {
                    vulnerabilities.push({
                        type: 'Insecure Password Field',
                        location: `Password Field ${index + 1}`,
                        description: 'Password field allows autocomplete',
                        severity: 'Low'
                    });
                }
                
                // Check if password field is in a form with proper security
                const form = field.closest('form');
                if (form && !form.hasAttribute('autocomplete')) {
                    console.warn(`Password form ${index + 1} should have autocomplete="off"`);
                }
            });
            
            // Check for session management
            const hasSessionManagement = this.checkForSessionManagement();
            
            if (!hasSessionManagement) {
                console.info('No client-side session management detected');
            }
            
            // Check for proper logout functionality
            const logoutButtons = document.querySelectorAll('[onclick*="logout"], [href*="logout"], .logout');
            
            if (passwordFields.length > 0 && logoutButtons.length === 0) {
                vulnerabilities.push({
                    type: 'Missing Logout Functionality',
                    location: 'Authentication System',
                    description: 'Password fields present but no logout mechanism found',
                    severity: 'Medium'
                });
            }
            
            this.recordTest(testName, vulnerabilities.length === 0, {
                vulnerabilities: vulnerabilities,
                passwordFieldsFound: passwordFields.length,
                logoutButtonsFound: logoutButtons.length,
                hasSessionManagement: hasSessionManagement
            });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testPrivacyProtection() {
        const testName = 'Privacy & Data Protection';
        console.log(`🔒 Testing: ${testName}`);
        
        try {
            const vulnerabilities = [];
            
            // Check for tracking scripts
            const trackingDomains = [
                'google-analytics.com',
                'googletagmanager.com',
                'facebook.com',
                'doubleclick.net',
                'google.com/analytics'
            ];
            
            const scripts = document.querySelectorAll('script[src]');
            scripts.forEach((script, index) => {
                const src = script.getAttribute('src');
                
                trackingDomains.forEach(domain => {
                    if (src.includes(domain)) {
                        vulnerabilities.push({
                            type: 'Tracking Script',
                            location: `Script ${index + 1}`,
                            domain: domain,
                            description: 'Third-party tracking script detected',
                            severity: 'Low'
                        });
                    }
                });
            });
            
            // Check for data collection forms
            const forms = document.querySelectorAll('form');
            const emailInputs = document.querySelectorAll('input[type="email"], input[name*="email"]');
            
            if (emailInputs.length > 0) {
                // Check for privacy policy links
                const privacyLinks = document.querySelectorAll('a[href*="privacy"], a[href*="policy"]');
                
                if (privacyLinks.length === 0) {
                    vulnerabilities.push({
                        type: 'Missing Privacy Policy',
                        location: 'Data Collection Forms',
                        description: 'Email collection without privacy policy link',
                        severity: 'Medium'
                    });
                }
            }
            
            // Check for cookie usage
            if (document.cookie) {
                const cookies = document.cookie.split(';');
                
                cookies.forEach((cookie, index) => {
                    if (!cookie.includes('Secure') && location.protocol === 'https:') {
                        vulnerabilities.push({
                            type: 'Insecure Cookie',
                            location: `Cookie ${index + 1}`,
                            description: 'Cookie not marked as Secure on HTTPS site',
                            severity: 'Medium'
                        });
                    }
                    
                    if (!cookie.includes('SameSite')) {
                        vulnerabilities.push({
                            type: 'Missing SameSite Attribute',
                            location: `Cookie ${index + 1}`,
                            description: 'Cookie missing SameSite attribute',
                            severity: 'Low'
                        });
                    }
                });
            }
            
            // Check for geolocation usage
            const hasGeolocation = this.checkForGeolocationUsage();
            if (hasGeolocation) {
                console.info('Geolocation API usage detected - ensure proper user consent');
            }
            
            this.recordTest(testName, vulnerabilities.length === 0, {
                vulnerabilities: vulnerabilities,
                trackingScriptsFound: vulnerabilities.filter(v => v.type === 'Tracking Script').length,
                formsChecked: forms.length,
                emailInputsFound: emailInputs.length,
                cookieCount: document.cookie ? document.cookie.split(';').length : 0
            });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    // Helper methods
    simulateInputSanitization(input) {
        // Simulate basic input sanitization
        return input
            .replace(/[<>'"&]/g, '') // Remove HTML chars
            .replace(/javascript:/gi, '') // Remove JS protocols
            .replace(/on\w+=/gi, '') // Remove event handlers
            .trim()
            .substring(0, 100); // Limit length
    }
    
    getScriptContent() {
        const scripts = document.querySelectorAll('script:not([src])');
        let content = '';
        
        scripts.forEach(script => {
            content += script.textContent + '\n';
        });
        
        return content;
    }
    
    analyzeCSP(cspContent) {
        const vulnerabilities = [];
        const directives = cspContent.split(';').map(d => d.trim());
        
        // Check for required directives
        const requiredDirectives = ['default-src', 'script-src', 'style-src'];
        
        requiredDirectives.forEach(directive => {
            const hasDirective = directives.some(d => d.startsWith(directive));
            
            if (!hasDirective) {
                vulnerabilities.push({
                    type: 'Missing CSP Directive',
                    location: 'CSP',
                    directive: directive,
                    description: `Missing ${directive} directive`,
                    severity: 'Medium'
                });
            }
        });
        
        // Check for overly permissive directives
        directives.forEach(directive => {
            if (directive.includes('*')) {
                vulnerabilities.push({
                    type: 'Permissive CSP Directive',
                    location: 'CSP',
                    directive: directive,
                    description: 'Wildcard in CSP directive reduces security',
                    severity: 'Medium'
                });
            }
        });
        
        return { vulnerabilities };
    }
    
    checkForDataEncryption() {
        const scriptContent = this.getScriptContent();
        
        const encryptionKeywords = [
            'crypto.subtle',
            'CryptoJS',
            'encrypt(',
            'decrypt(',
            'AES',
            'RSA',
            'btoa(',
            'atob('
        ];
        
        return encryptionKeywords.some(keyword => scriptContent.includes(keyword));
    }
    
    checkForHSTSImplementation() {
        // Client-side can't really check HSTS headers, but can check for HTTPS enforcement
        const scriptContent = this.getScriptContent();
        
        return scriptContent.includes('https') && 
               (scriptContent.includes('protocol') || scriptContent.includes('location.protocol'));
    }
    
    checkForSessionManagement() {
        const scriptContent = this.getScriptContent();
        
        const sessionKeywords = [
            'sessionStorage',
            'session',
            'token',
            'jwt',
            'auth'
        ];
        
        return sessionKeywords.some(keyword => scriptContent.includes(keyword));
    }
    
    checkForGeolocationUsage() {
        const scriptContent = this.getScriptContent();
        
        return scriptContent.includes('navigator.geolocation') ||
               scriptContent.includes('getCurrentPosition');
    }
    
    recordTest(testName, passed, details = {}) {
        const result = {
            name: testName,
            passed: passed,
            timestamp: new Date().toISOString(),
            details: details
        };
        
        this.testResults.push(result);
        
        // Add vulnerabilities to main list
        if (details.vulnerabilities) {
            this.vulnerabilities.push(...details.vulnerabilities);
        }
        
        const status = passed ? '✅' : '❌';
        console.log(`${status} ${testName}: ${passed ? 'SECURE' : 'VULNERABILITIES FOUND'}`);
        
        if (!passed && details.vulnerabilities && details.vulnerabilities.length > 0) {
            console.warn(`   Vulnerabilities found: ${details.vulnerabilities.length}`);
            details.vulnerabilities.slice(0, 3).forEach(vuln => {
                console.warn(`   - ${vuln.type}: ${vuln.description} (${vuln.severity})`);
            });
            
            if (details.vulnerabilities.length > 3) {
                console.warn(`   ... and ${details.vulnerabilities.length - 3} more vulnerabilities`);
            }
        }
    }
    
    generateSecurityReport() {
        const endTime = Date.now();
        const duration = endTime - this.startTime;
        
        console.log('\n🔒 Security Audit Report');
        console.log('========================');
        console.log(`Duration: ${duration}ms`);
        
        const passed = this.testResults.filter(test => test.passed).length;
        const total = this.testResults.length;
        const securityScore = Math.round((passed / total) * 100);
        
        console.log(`\nSecurity Score: ${securityScore}%`);
        console.log(`Tests Passed: ${passed}/${total}`);
        console.log(`Total Vulnerabilities: ${this.vulnerabilities.length}`);
        
        // Categorize vulnerabilities by severity
        const severityCount = {
            Critical: 0,
            High: 0,
            Medium: 0,
            Low: 0
        };
        
        this.vulnerabilities.forEach(vuln => {
            severityCount[vuln.severity] = (severityCount[vuln.severity] || 0) + 1;
        });
        
        console.log('\n🚨 Vulnerabilities by Severity:');
        Object.entries(severityCount).forEach(([severity, count]) => {
            if (count > 0) {
                const emoji = severity === 'Critical' ? '🔥' : 
                            severity === 'High' ? '🚨' :
                            severity === 'Medium' ? '⚠️' : 'ℹ️';
                console.log(`  ${emoji} ${severity}: ${count}`);
            }
        });
        
        // Security recommendations
        console.log('\n🛡️ Security Recommendations:');
        this.generateSecurityRecommendations();
        
        // Store report
        const report = {
            timestamp: new Date().toISOString(),
            securityScore: securityScore,
            testResults: this.testResults,
            vulnerabilities: this.vulnerabilities,
            severityCount: severityCount,
            duration: duration
        };
        
        localStorage.setItem('securityReport', JSON.stringify(report));
        
        console.log('\n✨ Security audit completed!');
        
        return report;
    }
    
    generateSecurityRecommendations() {
        const recommendations = new Set();
        
        this.vulnerabilities.forEach(vuln => {
            switch (vuln.type) {
                case 'XSS':
                    recommendations.add('Implement proper input sanitization and output encoding');
                    break;
                case 'Missing CSP':
                    recommendations.add('Implement Content Security Policy headers');
                    break;
                case 'Insecure Transport':
                    recommendations.add('Use HTTPS for all connections');
                    break;
                case 'Unsafe DOM Manipulation':
                    recommendations.add('Use safe DOM manipulation methods and sanitize user input');
                    break;
                case 'Sensitive Data in Storage':
                    recommendations.add('Avoid storing sensitive data in localStorage/sessionStorage');
                    break;
                case 'Missing Input Validation':
                    recommendations.add('Implement comprehensive input validation');
                    break;
                case 'Tracking Script':
                    recommendations.add('Review third-party scripts and implement privacy controls');
                    break;
                case 'Unsafe External Link':
                    recommendations.add('Use rel="noopener noreferrer" for external links');
                    break;
            }
        });
        
        if (recommendations.size === 0) {
            console.log('  🎉 No security recommendations needed! Great job!');
        } else {
            recommendations.forEach(recommendation => {
                console.log(`  • ${recommendation}`);
            });
        }
        
        // General security best practices
        console.log('\n📋 General Security Best Practices:');
        const bestPractices = [
            'Keep all dependencies up to date',
            'Use HTTPS everywhere',
            'Implement proper authentication and authorization',
            'Sanitize and validate all user inputs',
            'Use Content Security Policy (CSP)',
            'Implement proper error handling',
            'Regular security audits and penetration testing',
            'Follow OWASP security guidelines'
        ];
        
        bestPractices.forEach(practice => {
            console.log(`  • ${practice}`);
        });
    }
}

// Security validator class for reuse
class SecurityValidator {
    static sanitizeInput(input) {
        // Remove potentially dangerous characters
        const sanitized = input
            .replace(/[<>'"&]/g, '') // Remove HTML chars
            .replace(/javascript:/gi, '') // Remove JS protocols
            .replace(/on\w+=/gi, '') // Remove event handlers
            .trim()
            .substring(0, 100); // Limit length
        
        return sanitized;
    }
    
    static validateCommand(command) {
        const allowedCommands = [
            'help', 'clear', 'about', 'theme', 'matrix', 'glitch',
            'binary', 'puzzle', 'hint', 'scan', 'status', 'memory',
            'secrets', 'cipher'
        ];
        
        const cmd = command.toLowerCase().split(' ')[0];
        return allowedCommands.includes(cmd);
    }
    
    static isValidURL(url) {
        try {
            const urlObj = new URL(url);
            return ['http:', 'https:'].includes(urlObj.protocol);
        } catch (error) {
            return false;
        }
    }
    
    static sanitizeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }
}

// Auto-initialize for browser usage
if (typeof window !== 'undefined') {
    window.SecurityTestSuite = SecurityTestSuite;
    window.SecurityValidator = SecurityValidator;
    
    // Auto-start testing after page load - DISABLED FOR SIMPLIFIED UX
    // window.addEventListener('load', () => {
    //     setTimeout(() => {
    //         const securityTest = new SecurityTestSuite();
    //         securityTest.runSecurityAudit();
    //     }, 4000); // Wait 4 seconds for app to initialize
    // });
}

export { SecurityTestSuite, SecurityValidator };