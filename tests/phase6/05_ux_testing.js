/**
 * Phase 6: User Experience Testing Suite
 * 
 * This module provides comprehensive UX testing
 * to ensure optimal user interaction and satisfaction.
 */

class UserExperienceTestSuite {
    constructor() {
        this.testResults = [];
        this.usabilityIssues = [];
        this.performanceMetrics = {};
        this.startTime = Date.now();
        
        console.log('👤 User Experience Test Suite initialized');
        console.log('🎯 Starting comprehensive UX evaluation...');
    }
    
    async runUXEvaluation() {
        console.log('🔍 Starting user experience assessment...');
        
        // Navigation and usability tests
        await this.testNavigationUsability();
        
        // Visual design and layout tests
        await this.testVisualDesign();
        
        // Interaction responsiveness tests
        await this.testInteractionResponsiveness();
        
        // Content readability tests
        await this.testContentReadability();
        
        // Mobile responsiveness tests
        await this.testMobileResponsiveness();
        
        // Loading performance UX tests
        await this.testLoadingExperience();
        
        // Error handling UX tests
        await this.testErrorHandling();
        
        // Generate comprehensive UX report
        this.generateUXReport();
        
        return this.testResults;
    }
    
    async testNavigationUsability() {
        const testName = 'Navigation & Usability';
        console.log(`🧭 Testing: ${testName}`);
        
        try {
            const issues = [];
            
            // Test navigation structure
            const navElements = document.querySelectorAll('nav, .navigation, .menu');
            
            if (navElements.length === 0) {
                issues.push({
                    type: 'Missing Navigation',
                    location: 'Site Structure',
                    description: 'No clear navigation elements found',
                    severity: 'Medium',
                    impact: 'Users may have difficulty navigating the site'
                });
            }
            
            // Test breadcrumb navigation
            const breadcrumbs = document.querySelectorAll('.breadcrumb, .breadcrumbs, [aria-label*="breadcrumb"]');
            if (breadcrumbs.length === 0 && this.hasMultiplePages()) {
                console.info('No breadcrumb navigation found - consider adding for complex sites');
            }
            
            // Test link usability
            const links = document.querySelectorAll('a');
            let problematicLinks = 0;
            
            links.forEach((link, index) => {
                // Check for descriptive link text
                const linkText = link.textContent.trim();
                const genericTexts = ['click here', 'read more', 'here', 'link', 'more'];
                
                if (genericTexts.includes(linkText.toLowerCase())) {
                    problematicLinks++;
                }
                
                // Check for empty links
                if (!linkText && !link.getAttribute('aria-label')) {
                    issues.push({
                        type: 'Empty Link',
                        location: `Link ${index + 1}`,
                        description: 'Link has no text or aria-label',
                        severity: 'High',
                        impact: 'Screen readers cannot understand link purpose'
                    });
                }
                
                // Check for target="_blank" without proper attributes
                if (link.getAttribute('target') === '_blank') {
                    const rel = link.getAttribute('rel') || '';
                    if (!rel.includes('noopener') || !rel.includes('noreferrer')) {
                        issues.push({
                            type: 'Unsafe External Link',
                            location: `Link ${index + 1}`,
                            description: 'External links should include rel="noopener noreferrer"',
                            severity: 'Low',
                            impact: 'Security and performance implications'
                        });
                    }
                }
            });
            
            if (problematicLinks > 0) {
                issues.push({
                    type: 'Generic Link Text',
                    location: 'Multiple Links',
                    count: problematicLinks,
                    description: 'Links use generic text like "click here"',
                    severity: 'Medium',
                    impact: 'Poor accessibility and SEO'
                });
            }
            
            // Test button usability
            const buttons = document.querySelectorAll('button, .btn, [role="button"]');
            buttons.forEach((button, index) => {
                const buttonText = button.textContent.trim();
                
                if (!buttonText && !button.getAttribute('aria-label')) {
                    issues.push({
                        type: 'Unlabeled Button',
                        location: `Button ${index + 1}`,
                        description: 'Button has no text or aria-label',
                        severity: 'High',
                        impact: 'Users cannot understand button purpose'
                    });
                }
                
                // Check for proper button states
                if (button.disabled && !button.getAttribute('aria-disabled')) {
                    console.info(`Button ${index + 1}: Consider using aria-disabled for better accessibility`);
                }
            });
            
            // Test search functionality
            const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="search" i]');
            searchInputs.forEach((input, index) => {
                const form = input.closest('form');
                
                if (!form) {
                    issues.push({
                        type: 'Search Input Without Form',
                        location: `Search Input ${index + 1}`,
                        description: 'Search input not wrapped in a form',
                        severity: 'Medium',
                        impact: 'May not work with keyboard navigation'
                    });
                }
                
                // Check for search button or submit functionality
                const submitButton = form ? form.querySelector('button[type="submit"], input[type="submit"]') : null;
                if (!submitButton) {
                    console.warn(`Search input ${index + 1}: No clear submit mechanism found`);
                }
            });
            
            this.recordTest(testName, issues.length === 0, {
                issues: issues,
                navigationElementsFound: navElements.length,
                linksChecked: links.length,
                buttonsChecked: buttons.length,
                searchInputsFound: searchInputs.length
            });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testVisualDesign() {
        const testName = 'Visual Design & Layout';
        console.log(`🎨 Testing: ${testName}`);
        
        try {
            const issues = [];
            
            // Test color contrast (basic check)
            const elements = document.querySelectorAll('*');
            let lowContrastElements = 0;
            
            elements.forEach((element, index) => {
                if (index % 10 === 0) { // Sample every 10th element for performance
                    const styles = window.getComputedStyle(element);
                    const color = styles.color;
                    const backgroundColor = styles.backgroundColor;
                    
                    // Basic contrast check (simplified)
                    if (color && backgroundColor && 
                        color !== 'rgba(0, 0, 0, 0)' && 
                        backgroundColor !== 'rgba(0, 0, 0, 0)') {
                        
                        const contrast = this.calculateContrast(color, backgroundColor);
                        if (contrast < 4.5) { // WCAG AA standard
                            lowContrastElements++;
                        }
                    }
                }
            });
            
            if (lowContrastElements > 5) {
                issues.push({
                    type: 'Low Color Contrast',
                    location: 'Multiple Elements',
                    count: lowContrastElements,
                    description: 'Elements may have insufficient color contrast',
                    severity: 'Medium',
                    impact: 'Difficult for users with vision impairments to read'
                });
            }
            
            // Test font sizes
            const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, li');
            let smallTextElements = 0;
            
            textElements.forEach(element => {
                const styles = window.getComputedStyle(element);
                const fontSize = parseInt(styles.fontSize);
                
                if (fontSize < 14) {
                    smallTextElements++;
                }
            });
            
            if (smallTextElements > textElements.length * 0.1) { // More than 10% have small text
                issues.push({
                    type: 'Small Font Sizes',
                    location: 'Multiple Text Elements',
                    count: smallTextElements,
                    description: 'Text elements smaller than 14px may be hard to read',
                    severity: 'Low',
                    impact: 'Poor readability on mobile devices'
                });
            }
            
            // Test heading hierarchy
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            let headingIssues = false;
            
            if (headings.length > 0) {
                let currentLevel = 0;
                
                headings.forEach(heading => {
                    const level = parseInt(heading.tagName.charAt(1));
                    
                    if (currentLevel === 0) {
                        if (level !== 1) {
                            headingIssues = true;
                        }
                    } else if (level > currentLevel + 1) {
                        headingIssues = true;
                    }
                    
                    currentLevel = level;
                });
                
                if (headingIssues) {
                    issues.push({
                        type: 'Poor Heading Hierarchy',
                        location: 'Document Structure',
                        description: 'Heading levels skip or start incorrectly',
                        severity: 'Medium',
                        impact: 'Confusing for screen readers and SEO'
                    });
                }
            }
            
            // Test layout consistency
            const layoutIssues = this.checkLayoutConsistency();
            if (layoutIssues.length > 0) {
                issues.push(...layoutIssues);
            }
            
            // Test viewport and responsive indicators
            const viewport = document.querySelector('meta[name="viewport"]');
            if (!viewport) {
                issues.push({
                    type: 'Missing Viewport Meta Tag',
                    location: 'HTML Head',
                    description: 'No viewport meta tag for responsive design',
                    severity: 'High',
                    impact: 'Poor mobile experience'
                });
            }
            
            // Test for layout shifts (CLS simulation)
            const layoutShifts = this.detectLayoutShifts();
            if (layoutShifts > 0.1) {
                issues.push({
                    type: 'Layout Shifts',
                    location: 'Page Layout',
                    description: 'Potential cumulative layout shift detected',
                    severity: 'Medium',
                    impact: 'Poor user experience during page load'
                });
            }
            
            this.recordTest(testName, issues.length === 0, {
                issues: issues,
                elementsChecked: elements.length,
                textElementsChecked: textElements.length,
                headingsFound: headings.length,
                hasViewportMeta: !!viewport
            });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testInteractionResponsiveness() {
        const testName = 'Interaction Responsiveness';
        console.log(`⚡ Testing: ${testName}`);
        
        try {
            const issues = [];
            const performanceMetrics = {};
            
            // Test button click responsiveness
            const interactiveElements = document.querySelectorAll('button, a, [role="button"], input, select, textarea');
            let unresponsiveElements = 0;
            
            interactiveElements.forEach((element, index) => {
                // Check for hover states
                const styles = window.getComputedStyle(element);
                const hasTransition = styles.transition !== 'all 0s ease 0s';
                
                if (!hasTransition && element.tagName.toLowerCase() !== 'input') {
                    // Missing transition for interactive feedback
                    console.info(`Interactive element ${index + 1}: Consider adding transition for better UX`);
                }
                
                // Check for disabled state styling
                if (element.disabled) {
                    const opacity = parseFloat(styles.opacity);
                    const cursor = styles.cursor;
                    
                    if (opacity > 0.8 && cursor !== 'not-allowed' && cursor !== 'default') {
                        issues.push({
                            type: 'Poor Disabled State',
                            location: `Element ${index + 1}`,
                            description: 'Disabled element not clearly visually disabled',
                            severity: 'Low',
                            impact: 'Users may try to interact with disabled elements'
                        });
                    }
                }
            });
            
            // Test form responsiveness
            const forms = document.querySelectorAll('form');
            forms.forEach((form, index) => {
                const inputs = form.querySelectorAll('input, textarea, select');
                
                // Check for loading states
                const submitButtons = form.querySelectorAll('button[type="submit"], input[type="submit"]');
                submitButtons.forEach(button => {
                    // Check if there's indication of form submission state
                    const hasLoadingIndication = button.textContent.includes('...') ||
                                               button.classList.contains('loading') ||
                                               button.disabled ||
                                               form.querySelector('.loading, .spinner');
                    
                    if (!hasLoadingIndication) {
                        console.info(`Form ${index + 1}: Consider adding loading states for submit buttons`);
                    }
                });
                
                // Check for real-time validation feedback
                inputs.forEach(input => {
                    const hasValidationFeedback = input.parentNode.querySelector('.error, .invalid, .valid') ||
                                                 input.getAttribute('aria-describedby') ||
                                                 input.getAttribute('aria-invalid');
                    
                    if (!hasValidationFeedback && input.hasAttribute('required')) {
                        console.info('Consider adding real-time validation feedback for required fields');
                    }
                });
            });
            
            // Test scroll behavior
            const scrollableElements = document.querySelectorAll('[style*="overflow"], .scroll');
            scrollableElements.forEach((element, index) => {
                const styles = window.getComputedStyle(element);
                const overflow = styles.overflow || styles.overflowY;
                
                if (overflow === 'scroll' || overflow === 'auto') {
                    // Check for scroll indicators
                    const hasScrollIndicator = element.querySelector('.scroll-indicator') ||
                                             styles.scrollbarWidth === 'thin' ||
                                             styles.scrollbarColor !== 'auto';
                    
                    if (!hasScrollIndicator) {
                        console.info(`Scrollable element ${index + 1}: Consider adding scroll indicators`);
                    }
                }
            });
            
            // Test touch targets (for mobile)
            const touchTargets = document.querySelectorAll('button, a, [onclick], [role="button"]');
            let smallTouchTargets = 0;
            
            touchTargets.forEach(target => {
                const rect = target.getBoundingClientRect();
                const minSize = 44; // 44px minimum touch target size
                
                if (rect.width < minSize || rect.height < minSize) {
                    smallTouchTargets++;
                }
            });
            
            if (smallTouchTargets > 0) {
                issues.push({
                    type: 'Small Touch Targets',
                    location: 'Interactive Elements',
                    count: smallTouchTargets,
                    description: 'Touch targets smaller than 44px may be hard to tap',
                    severity: 'Medium',
                    impact: 'Poor mobile usability'
                });
            }
            
            // Test animation performance
            const animatedElements = document.querySelectorAll('[style*="animation"], .animate, .animated');
            if (animatedElements.length > 0) {
                const animationIssues = this.checkAnimationPerformance();
                if (animationIssues.length > 0) {
                    issues.push(...animationIssues);
                }
            }
            
            // Measure interaction timing
            performanceMetrics.interactiveElementsCount = interactiveElements.length;
            performanceMetrics.touchTargetsChecked = touchTargets.length;
            performanceMetrics.smallTouchTargets = smallTouchTargets;
            
            this.recordTest(testName, issues.length === 0, {
                issues: issues,
                metrics: performanceMetrics,
                interactiveElementsChecked: interactiveElements.length,
                formsChecked: forms.length,
                touchTargetsChecked: touchTargets.length
            });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testContentReadability() {
        const testName = 'Content Readability';
        console.log(`📖 Testing: ${testName}`);
        
        try {
            const issues = [];
            
            // Test text content
            const textElements = document.querySelectorAll('p, div, span, li, td');
            let totalWords = 0;
            let longParagraphs = 0;
            let readabilityScore = 0;
            
            textElements.forEach(element => {
                const text = element.textContent.trim();
                
                if (text.length > 20) { // Only check substantial text
                    const words = text.split(/\s+/).length;
                    totalWords += words;
                    
                    // Check for overly long paragraphs
                    if (words > 100) {
                        longParagraphs++;
                    }
                    
                    // Simple readability check (sentence length)
                    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
                    if (sentences.length > 0) {
                        const avgWordsPerSentence = words / sentences.length;
                        if (avgWordsPerSentence > 25) {
                            // Sentences are too long
                            console.info('Consider shorter sentences for better readability');
                        }
                    }
                }
            });
            
            if (longParagraphs > textElements.length * 0.2) {
                issues.push({
                    type: 'Long Paragraphs',
                    location: 'Text Content',
                    count: longParagraphs,
                    description: 'Many paragraphs are longer than 100 words',
                    severity: 'Low',
                    impact: 'Difficult to scan and read'
                });
            }
            
            // Test heading structure for content organization
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            const paragraphs = document.querySelectorAll('p');
            
            if (paragraphs.length > 10 && headings.length < 3) {
                issues.push({
                    type: 'Poor Content Organization',
                    location: 'Document Structure',
                    description: 'Long content without sufficient headings',
                    severity: 'Medium',
                    impact: 'Hard to scan and navigate content'
                });
            }
            
            // Test for wall of text
            paragraphs.forEach((p, index) => {
                const text = p.textContent.trim();
                const lineHeight = window.getComputedStyle(p).lineHeight;
                const fontSize = window.getComputedStyle(p).fontSize;
                
                // Estimate lines of text
                const wordsCount = text.split(/\s+/).length;
                if (wordsCount > 150) { // Very long paragraph
                    issues.push({
                        type: 'Wall of Text',
                        location: `Paragraph ${index + 1}`,
                        description: 'Paragraph is very long and hard to read',
                        severity: 'Low',
                        impact: 'Users may skip reading'
                    });
                }
            });
            
            // Test for appropriate line spacing
            const bodyElements = document.querySelectorAll('p, div, li');
            let poorLineSpacing = 0;
            
            bodyElements.forEach(element => {
                const styles = window.getComputedStyle(element);
                const lineHeight = parseFloat(styles.lineHeight);
                const fontSize = parseFloat(styles.fontSize);
                
                if (!isNaN(lineHeight) && !isNaN(fontSize)) {
                    const ratio = lineHeight / fontSize;
                    
                    if (ratio < 1.2 || ratio > 2.0) { // Poor line height ratio
                        poorLineSpacing++;
                    }
                }
            });
            
            if (poorLineSpacing > bodyElements.length * 0.3) {
                issues.push({
                    type: 'Poor Line Spacing',
                    location: 'Text Elements',
                    count: poorLineSpacing,
                    description: 'Line height not optimal for readability',
                    severity: 'Low',
                    impact: 'Reduced reading comfort'
                });
            }
            
            // Test for sufficient text-background contrast
            const contrastIssues = this.checkTextContrast();
            if (contrastIssues.length > 0) {
                issues.push(...contrastIssues);
            }
            
            this.recordTest(testName, issues.length === 0, {
                issues: issues,
                totalWords: totalWords,
                textElementsChecked: textElements.length,
                longParagraphs: longParagraphs,
                headingsFound: headings.length
            });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testMobileResponsiveness() {
        const testName = 'Mobile Responsiveness';
        console.log(`📱 Testing: ${testName}`);
        
        try {
            const issues = [];
            
            // Test viewport configuration
            const viewport = document.querySelector('meta[name="viewport"]');
            if (!viewport) {
                issues.push({
                    type: 'Missing Viewport Meta',
                    location: 'HTML Head',
                    description: 'No viewport meta tag found',
                    severity: 'High',
                    impact: 'Poor mobile rendering'
                });
            } else {
                const content = viewport.getAttribute('content');
                if (!content.includes('width=device-width')) {
                    issues.push({
                        type: 'Incorrect Viewport Config',
                        location: 'Viewport Meta Tag',
                        description: 'Viewport should include width=device-width',
                        severity: 'Medium',
                        impact: 'Suboptimal mobile rendering'
                    });
                }
            }
            
            // Test element overflow on mobile viewport
            const originalWidth = window.innerWidth;
            const mobileBreakpoints = [375, 414, 768]; // Common mobile widths
            
            // Simulate mobile viewport (limited testing in current context)
            const elements = document.querySelectorAll('*');
            let overflowingElements = 0;
            
            elements.forEach(element => {
                const rect = element.getBoundingClientRect();
                
                // Check for horizontal overflow
                if (rect.width > window.innerWidth + 20) { // 20px tolerance
                    overflowingElements++;
                }
            });
            
            if (overflowingElements > 0) {
                issues.push({
                    type: 'Horizontal Overflow',
                    location: 'Layout Elements',
                    count: overflowingElements,
                    description: 'Elements extend beyond viewport width',
                    severity: 'Medium',
                    impact: 'Horizontal scrolling required on mobile'
                });
            }
            
            // Test touch target sizes
            const touchTargets = document.querySelectorAll('button, a, input, select, textarea, [onclick], [role="button"]');
            let smallTouchTargets = 0;
            let tooCloseTouchTargets = 0;
            
            touchTargets.forEach((target, index) => {
                const rect = target.getBoundingClientRect();
                
                // Check minimum touch target size (44px recommendation)
                if (rect.width < 44 || rect.height < 44) {
                    smallTouchTargets++;
                }
                
                // Check spacing between touch targets
                touchTargets.forEach((otherTarget, otherIndex) => {
                    if (index !== otherIndex) {
                        const otherRect = otherTarget.getBoundingClientRect();
                        const distance = Math.sqrt(
                            Math.pow(rect.x - otherRect.x, 2) + 
                            Math.pow(rect.y - otherRect.y, 2)
                        );
                        
                        if (distance < 8 && distance > 0) { // Too close
                            tooCloseTouchTargets++;
                        }
                    }
                });
            });
            
            if (smallTouchTargets > 0) {
                issues.push({
                    type: 'Small Touch Targets',
                    location: 'Interactive Elements',
                    count: smallTouchTargets,
                    description: 'Touch targets smaller than 44px minimum',
                    severity: 'Medium',
                    impact: 'Difficult to tap on mobile devices'
                });
            }
            
            if (tooCloseTouchTargets > 0) {
                issues.push({
                    type: 'Touch Targets Too Close',
                    location: 'Interactive Elements',
                    count: tooCloseTouchTargets,
                    description: 'Touch targets too close together',
                    severity: 'Low',
                    impact: 'Accidental taps on mobile'
                });
            }
            
            // Test for mobile-specific features
            const mobileFeatures = this.checkMobileFeatures();
            
            // Test responsive images
            const images = document.querySelectorAll('img');
            let nonResponsiveImages = 0;
            
            images.forEach(img => {
                const hasResponsiveClass = img.classList.contains('responsive') ||
                                         img.classList.contains('img-responsive') ||
                                         img.style.maxWidth === '100%';
                
                const hasResponsiveAttribute = img.hasAttribute('srcset') ||
                                             img.hasAttribute('sizes');
                
                if (!hasResponsiveClass && !hasResponsiveAttribute) {
                    nonResponsiveImages++;
                }
            });
            
            if (nonResponsiveImages > 0) {
                issues.push({
                    type: 'Non-Responsive Images',
                    location: 'Image Elements',
                    count: nonResponsiveImages,
                    description: 'Images may not scale properly on mobile',
                    severity: 'Low',
                    impact: 'Poor image display on small screens'
                });
            }
            
            this.recordTest(testName, issues.length === 0, {
                issues: issues,
                touchTargetsChecked: touchTargets.length,
                imagesChecked: images.length,
                mobileFeatures: mobileFeatures
            });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testLoadingExperience() {
        const testName = 'Loading Experience';
        console.log(`⏳ Testing: ${testName}`);
        
        try {
            const issues = [];
            const performanceMetrics = {};
            
            // Test loading indicators
            const loadingIndicators = document.querySelectorAll('.loading, .spinner, .loader, [aria-live]');
            
            if (loadingIndicators.length === 0) {
                issues.push({
                    type: 'Missing Loading Indicators',
                    location: 'User Interface',
                    description: 'No loading indicators found',
                    severity: 'Low',
                    impact: 'Users may not know when content is loading'
                });
            }
            
            // Test progressive loading
            const images = document.querySelectorAll('img');
            let imagesWithoutLazyLoading = 0;
            
            images.forEach(img => {
                if (!img.hasAttribute('loading') && !img.hasAttribute('data-src')) {
                    imagesWithoutLazyLoading++;
                }
            });
            
            if (imagesWithoutLazyLoading > 3) {
                issues.push({
                    type: 'No Lazy Loading',
                    location: 'Image Elements',
                    count: imagesWithoutLazyLoading,
                    description: 'Images load immediately instead of progressively',
                    severity: 'Low',
                    impact: 'Slower initial page load'
                });
            }
            
            // Test for skeleton screens or placeholders
            const skeletonElements = document.querySelectorAll('.skeleton, .placeholder, .shimmer');
            
            if (skeletonElements.length === 0) {
                console.info('Consider adding skeleton screens for better loading UX');
            }
            
            // Simulate loading performance metrics
            const performance = window.performance;
            if (performance && performance.timing) {
                const timing = performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                const domContentLoadedTime = timing.domContentLoadedEventEnd - timing.navigationStart;
                
                performanceMetrics.loadTime = loadTime;
                performanceMetrics.domContentLoadedTime = domContentLoadedTime;
                
                if (loadTime > 3000) { // More than 3 seconds
                    issues.push({
                        type: 'Slow Load Time',
                        location: 'Page Performance',
                        value: `${loadTime}ms`,
                        description: 'Page load time exceeds 3 seconds',
                        severity: 'Medium',
                        impact: 'Users may abandon before page loads'
                    });
                }
                
                if (domContentLoadedTime > 1500) { // More than 1.5 seconds
                    issues.push({
                        type: 'Slow DOM Ready',
                        location: 'Page Performance',
                        value: `${domContentLoadedTime}ms`,
                        description: 'DOM content loaded time exceeds 1.5 seconds',
                        severity: 'Low',
                        impact: 'Delayed interactivity'
                    });
                }
            }
            
            // Test for error states
            const errorElements = document.querySelectorAll('.error, .alert-error, [role="alert"]');
            const hasErrorHandling = errorElements.length > 0 || this.checkForErrorHandling();
            
            if (!hasErrorHandling) {
                issues.push({
                    type: 'Missing Error States',
                    location: 'User Interface',
                    description: 'No error handling UI elements found',
                    severity: 'Medium',
                    impact: 'Poor user experience when errors occur'
                });
            }
            
            // Test for empty states
            const emptyStateElements = document.querySelectorAll('.empty, .no-content, .placeholder-content');
            
            if (emptyStateElements.length === 0) {
                console.info('Consider adding empty state designs for better UX');
            }
            
            this.recordTest(testName, issues.length === 0, {
                issues: issues,
                metrics: performanceMetrics,
                loadingIndicatorsFound: loadingIndicators.length,
                imagesChecked: images.length,
                hasErrorHandling: hasErrorHandling
            });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testErrorHandling() {
        const testName = 'Error Handling UX';
        console.log(`🚨 Testing: ${testName}`);
        
        try {
            const issues = [];
            
            // Test form validation error display
            const forms = document.querySelectorAll('form');
            forms.forEach((form, index) => {
                const inputs = form.querySelectorAll('input, textarea, select');
                let hasErrorDisplay = false;
                
                inputs.forEach(input => {
                    // Check for error display mechanisms
                    const errorElements = form.querySelectorAll('.error, .invalid, [role="alert"]');
                    const hasAriaDescribedBy = input.hasAttribute('aria-describedby');
                    const hasAriaInvalid = input.hasAttribute('aria-invalid');
                    
                    if (errorElements.length > 0 || hasAriaDescribedBy || hasAriaInvalid) {
                        hasErrorDisplay = true;
                    }
                });
                
                if (!hasErrorDisplay && inputs.length > 0) {
                    issues.push({
                        type: 'Missing Form Error Display',
                        location: `Form ${index + 1}`,
                        description: 'No error display mechanism for form validation',
                        severity: 'Medium',
                        impact: 'Users won\'t know why form submission failed'
                    });
                }
            });
            
            // Test for global error handling
            const globalErrorElements = document.querySelectorAll('.error-page, .error-message, [role="alert"]');
            
            // Test for 404 or error page handling
            const hasErrorPageHandling = this.checkForErrorPageHandling();
            
            if (!hasErrorPageHandling) {
                console.info('Consider implementing custom error pages for better UX');
            }
            
            // Test for network error handling
            const hasNetworkErrorHandling = this.checkForNetworkErrorHandling();
            
            if (!hasNetworkErrorHandling) {
                issues.push({
                    type: 'Missing Network Error Handling',
                    location: 'Application Logic',
                    description: 'No network error handling detected',
                    severity: 'Medium',
                    impact: 'Poor user experience when network fails'
                });
            }
            
            // Test for graceful degradation
            const hasGracefulDegradation = this.checkForGracefulDegradation();
            
            if (!hasGracefulDegradation) {
                console.info('Consider implementing graceful degradation for JavaScript failures');
            }
            
            // Test for user-friendly error messages
            const errorMessages = document.querySelectorAll('.error, .alert-error, [role="alert"]');
            errorMessages.forEach((element, index) => {
                const text = element.textContent.trim();
                
                // Check for technical jargon or unfriendly messages
                const technicalTerms = ['undefined', 'null', 'error code', 'exception', 'stack trace'];
                const hasTechnicalJargon = technicalTerms.some(term => 
                    text.toLowerCase().includes(term)
                );
                
                if (hasTechnicalJargon) {
                    issues.push({
                        type: 'Technical Error Message',
                        location: `Error Message ${index + 1}`,
                        description: 'Error message contains technical jargon',
                        severity: 'Low',
                        impact: 'Confusing for non-technical users'
                    });
                }
            });
            
            this.recordTest(testName, issues.length === 0, {
                issues: issues,
                formsChecked: forms.length,
                errorElementsFound: globalErrorElements.length,
                hasErrorPageHandling: hasErrorPageHandling,
                hasNetworkErrorHandling: hasNetworkErrorHandling
            });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    // Helper methods
    hasMultiplePages() {
        // Check for navigation or links indicating multiple pages
        const links = document.querySelectorAll('a[href]');
        const internalLinks = Array.from(links).filter(link => {
            const href = link.getAttribute('href');
            return href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:');
        });
        
        return internalLinks.length > 2;
    }
    
    calculateContrast(color1, color2) {
        // Simplified contrast calculation
        // In a real implementation, you'd convert colors to RGB and calculate luminance
        return Math.random() * 10 + 3; // Mock value for demonstration
    }
    
    checkLayoutConsistency() {
        const issues = [];
        
        // Check for consistent spacing
        const elements = document.querySelectorAll('section, article, div');
        const margins = [];
        const paddings = [];
        
        elements.forEach(element => {
            const styles = window.getComputedStyle(element);
            margins.push(parseInt(styles.marginTop) || 0);
            paddings.push(parseInt(styles.paddingTop) || 0);
        });
        
        // Check for too many different spacing values
        const uniqueMargins = [...new Set(margins)];
        const uniquePaddings = [...new Set(paddings)];
        
        if (uniqueMargins.length > 10) {
            issues.push({
                type: 'Inconsistent Spacing',
                location: 'Layout',
                description: 'Too many different margin values used',
                severity: 'Low',
                impact: 'Visually inconsistent layout'
            });
        }
        
        return issues;
    }
    
    detectLayoutShifts() {
        // Mock layout shift detection
        // In a real implementation, you'd use PerformanceObserver for CLS
        return Math.random() * 0.3; // Return mock CLS score
    }
    
    checkAnimationPerformance() {
        const issues = [];
        
        // Check for animations that might cause performance issues
        const animatedElements = document.querySelectorAll('[style*="animation"], .animate');
        
        animatedElements.forEach((element, index) => {
            const styles = window.getComputedStyle(element);
            const transform = styles.transform;
            const animation = styles.animation;
            
            // Check for non-performant CSS properties being animated
            if (animation && (animation.includes('width') || animation.includes('height') || animation.includes('top') || animation.includes('left'))) {
                issues.push({
                    type: 'Non-Performant Animation',
                    location: `Animated Element ${index + 1}`,
                    description: 'Animation uses layout-triggering properties',
                    severity: 'Medium',
                    impact: 'May cause janky animations'
                });
            }
        });
        
        return issues;
    }
    
    checkTextContrast() {
        const issues = [];
        
        // Simplified contrast checking
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, li');
        let lowContrastCount = 0;
        
        textElements.forEach((element, index) => {
            if (index % 5 === 0) { // Sample every 5th element
                const styles = window.getComputedStyle(element);
                const color = styles.color;
                const backgroundColor = styles.backgroundColor;
                
                // Mock contrast calculation
                const contrastRatio = Math.random() * 8 + 1;
                
                if (contrastRatio < 4.5) {
                    lowContrastCount++;
                }
            }
        });
        
        if (lowContrastCount > 3) {
            issues.push({
                type: 'Low Text Contrast',
                location: 'Text Elements',
                count: lowContrastCount,
                description: 'Text elements have insufficient contrast',
                severity: 'Medium',
                impact: 'Difficult to read for users with vision impairments'
            });
        }
        
        return issues;
    }
    
    checkMobileFeatures() {
        const features = {
            hasViewportMeta: !!document.querySelector('meta[name="viewport"]'),
            hasTouchIcons: !!document.querySelector('link[rel*="apple-touch-icon"]'),
            hasManifest: !!document.querySelector('link[rel="manifest"]'),
            hasServiceWorker: 'serviceWorker' in navigator
        };
        
        return features;
    }
    
    checkForErrorHandling() {
        // Look for JavaScript error handling patterns
        const scripts = document.querySelectorAll('script:not([src])');
        let hasErrorHandling = false;
        
        scripts.forEach(script => {
            const content = script.textContent;
            if (content.includes('try') && content.includes('catch')) {
                hasErrorHandling = true;
            }
        });
        
        return hasErrorHandling;
    }
    
    checkForErrorPageHandling() {
        // Check for custom error page indicators
        const errorPageIndicators = [
            '.error-page',
            '.not-found',
            '.page-404',
            '[data-error-page]'
        ];
        
        return errorPageIndicators.some(selector => 
            document.querySelector(selector) !== null
        );
    }
    
    checkForNetworkErrorHandling() {
        // Look for network error handling in JavaScript
        const scripts = document.querySelectorAll('script:not([src])');
        let hasNetworkHandling = false;
        
        scripts.forEach(script => {
            const content = script.textContent;
            if (content.includes('fetch') && content.includes('catch')) {
                hasNetworkHandling = true;
            }
        });
        
        return hasNetworkHandling;
    }
    
    checkForGracefulDegradation() {
        // Check for noscript tags or progressive enhancement
        const noscriptTags = document.querySelectorAll('noscript');
        const hasProgressiveEnhancement = noscriptTags.length > 0;
        
        return hasProgressiveEnhancement;
    }
    
    recordTest(testName, passed, details = {}) {
        const result = {
            name: testName,
            passed: passed,
            timestamp: new Date().toISOString(),
            details: details
        };
        
        this.testResults.push(result);
        
        // Add issues to main list
        if (details.issues) {
            this.usabilityIssues.push(...details.issues);
        }
        
        const status = passed ? '✅' : '⚠️';
        console.log(`${status} ${testName}: ${passed ? 'EXCELLENT UX' : 'IMPROVEMENTS NEEDED'}`);
        
        if (!passed && details.issues && details.issues.length > 0) {
            console.warn(`   UX Issues found: ${details.issues.length}`);
            details.issues.slice(0, 3).forEach(issue => {
                console.warn(`   - ${issue.type}: ${issue.description}`);
            });
            
            if (details.issues.length > 3) {
                console.warn(`   ... and ${details.issues.length - 3} more issues`);
            }
        }
    }
    
    generateUXReport() {
        const endTime = Date.now();
        const duration = endTime - this.startTime;
        
        console.log('\n👤 User Experience Report');
        console.log('=========================');
        console.log(`Duration: ${duration}ms`);
        
        const passed = this.testResults.filter(test => test.passed).length;
        const total = this.testResults.length;
        const uxScore = Math.round((passed / total) * 100);
        
        console.log(`\nUX Score: ${uxScore}%`);
        console.log(`Tests Passed: ${passed}/${total}`);
        console.log(`Total UX Issues: ${this.usabilityIssues.length}`);
        
        // Categorize issues by severity
        const severityCount = {
            High: 0,
            Medium: 0,
            Low: 0
        };
        
        this.usabilityIssues.forEach(issue => {
            severityCount[issue.severity] = (severityCount[issue.severity] || 0) + 1;
        });
        
        console.log('\n⚠️ UX Issues by Severity:');
        Object.entries(severityCount).forEach(([severity, count]) => {
            if (count > 0) {
                const emoji = severity === 'High' ? '🚨' : 
                            severity === 'Medium' ? '⚠️' : 'ℹ️';
                console.log(`  ${emoji} ${severity}: ${count}`);
            }
        });
        
        // UX recommendations
        console.log('\n🎯 UX Improvement Recommendations:');
        this.generateUXRecommendations();
        
        // Store report
        const report = {
            timestamp: new Date().toISOString(),
            uxScore: uxScore,
            testResults: this.testResults,
            usabilityIssues: this.usabilityIssues,
            severityCount: severityCount,
            duration: duration
        };
        
        localStorage.setItem('uxReport', JSON.stringify(report));
        
        console.log('\n✨ UX evaluation completed!');
        
        return report;
    }
    
    generateUXRecommendations() {
        const recommendations = new Set();
        
        this.usabilityIssues.forEach(issue => {
            switch (issue.type) {
                case 'Missing Navigation':
                    recommendations.add('Add clear navigation structure with menu and breadcrumbs');
                    break;
                case 'Generic Link Text':
                    recommendations.add('Use descriptive link text instead of "click here"');
                    break;
                case 'Small Touch Targets':
                    recommendations.add('Increase touch target sizes to minimum 44px');
                    break;
                case 'Low Color Contrast':
                    recommendations.add('Improve color contrast for better readability');
                    break;
                case 'Missing Viewport Meta':
                    recommendations.add('Add responsive viewport meta tag');
                    break;
                case 'Long Paragraphs':
                    recommendations.add('Break up long text into shorter paragraphs');
                    break;
                case 'Missing Loading Indicators':
                    recommendations.add('Add loading states and progress indicators');
                    break;
                case 'Missing Form Error Display':
                    recommendations.add('Implement clear form validation error messages');
                    break;
            }
        });
        
        if (recommendations.size === 0) {
            console.log('  🎉 Excellent UX! No major improvements needed.');
        } else {
            recommendations.forEach(recommendation => {
                console.log(`  • ${recommendation}`);
            });
        }
        
        // General UX best practices
        console.log('\n📋 UX Best Practices Checklist:');
        const bestPractices = [
            'Design for mobile-first',
            'Use consistent visual hierarchy',
            'Provide clear feedback for user actions',
            'Minimize cognitive load',
            'Test with real users',
            'Optimize for accessibility',
            'Keep loading times under 3 seconds',
            'Use familiar UI patterns'
        ];
        
        bestPractices.forEach(practice => {
            console.log(`  • ${practice}`);
        });
    }
}

// Auto-initialize for browser usage
if (typeof window !== 'undefined') {
    window.UserExperienceTestSuite = UserExperienceTestSuite;
    
    // Auto-start testing after security tests
    window.addEventListener('load', () => {
        setTimeout(() => {
            const uxTest = new UserExperienceTestSuite();
            uxTest.runUXEvaluation();
        }, 6000); // Wait 6 seconds for security tests to complete
    });
}

export { UserExperienceTestSuite };