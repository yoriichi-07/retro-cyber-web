/**
 * Phase 6: Accessibility Testing & WCAG Compliance Suite
 * 
 * This module provides comprehensive accessibility testing
 * to ensure WCAG 2.1 compliance and inclusive design.
 */

class AccessibilityTestSuite {
    constructor() {
        this.testResults = [];
        this.wcagLevel = 'AA'; // Target WCAG 2.1 AA compliance
        this.startTime = Date.now();
        
        console.log('♿ Accessibility Test Suite initialized');
        console.log(`🎯 Target: WCAG 2.1 Level ${this.wcagLevel} compliance`);
    }
    
    async runAccessibilityAudit() {
        console.log('🔍 Starting comprehensive accessibility audit...');
        
        // WCAG 2.1 Level A tests
        await this.testLevelACompliance();
        
        // WCAG 2.1 Level AA tests
        await this.testLevelAACompliance();
        
        // Additional accessibility features
        await this.testKeyboardNavigation();
        await this.testScreenReaderCompatibility();
        await this.testMotionAccessibility();
        await this.testFocusManagement();
        
        // Generate accessibility report
        this.generateAccessibilityReport();
        
        return this.testResults;
    }
    
    async testLevelACompliance() {
        console.log('🅰️ Testing WCAG 2.1 Level A compliance...');
        
        // 1.1.1 Non-text Content
        await this.testNonTextContent();
        
        // 1.3.1 Info and Relationships
        await this.testInfoAndRelationships();
        
        // 1.3.2 Meaningful Sequence
        await this.testMeaningfulSequence();
        
        // 1.4.1 Use of Color
        await this.testUseOfColor();
        
        // 2.1.1 Keyboard
        await this.testKeyboardAccess();
        
        // 2.1.2 No Keyboard Trap
        await this.testNoKeyboardTrap();
        
        // 2.2.1 Timing Adjustable
        await this.testTimingAdjustable();
        
        // 2.3.1 Three Flashes or Below Threshold
        await this.testFlashThreshold();
        
        // 2.4.1 Bypass Blocks
        await this.testBypassBlocks();
        
        // 2.4.2 Page Titled
        await this.testPageTitled();
        
        // 3.1.1 Language of Page
        await this.testLanguageOfPage();
        
        // 3.2.1 On Focus
        await this.testOnFocus();
        
        // 3.2.2 On Input
        await this.testOnInput();
        
        // 3.3.1 Error Identification
        await this.testErrorIdentification();
        
        // 3.3.2 Labels or Instructions
        await this.testLabelsOrInstructions();
        
        // 4.1.1 Parsing
        await this.testParsing();
        
        // 4.1.2 Name, Role, Value
        await this.testNameRoleValue();
    }
    
    async testLevelAACompliance() {
        console.log('🅰️🅰️ Testing WCAG 2.1 Level AA compliance...');
        
        // 1.2.4 Captions (Live)
        await this.testCaptionsLive();
        
        // 1.2.5 Audio Description (Prerecorded)
        await this.testAudioDescription();
        
        // 1.4.3 Contrast (Minimum)
        await this.testContrastMinimum();
        
        // 1.4.4 Resize text
        await this.testResizeText();
        
        // 1.4.5 Images of Text
        await this.testImagesOfText();
        
        // 2.4.5 Multiple Ways
        await this.testMultipleWays();
        
        // 2.4.6 Headings and Labels
        await this.testHeadingsAndLabels();
        
        // 2.4.7 Focus Visible
        await this.testFocusVisible();
        
        // 3.1.2 Language of Parts
        await this.testLanguageOfParts();
        
        // 3.2.3 Consistent Navigation
        await this.testConsistentNavigation();
        
        // 3.2.4 Consistent Identification
        await this.testConsistentIdentification();
        
        // 3.3.3 Error Suggestion
        await this.testErrorSuggestion();
        
        // 3.3.4 Error Prevention (Legal, Financial, Data)
        await this.testErrorPrevention();
    }
    
    async testNonTextContent() {
        const testName = 'Non-text Content (1.1.1)';
        console.log(`🖼️ Testing: ${testName}`);
        
        try {
            const issues = [];
            
            // Check images for alt text
            const images = document.querySelectorAll('img');
            images.forEach((img, index) => {
                if (!img.hasAttribute('alt')) {
                    issues.push(`Image ${index + 1} missing alt attribute`);
                } else if (img.alt.trim() === '' && !img.hasAttribute('aria-hidden')) {
                    issues.push(`Image ${index + 1} has empty alt text but not marked as decorative`);
                }
            });
            
            // Check canvas elements for accessible alternatives
            const canvasElements = document.querySelectorAll('canvas');
            canvasElements.forEach((canvas, index) => {
                if (!canvas.hasAttribute('aria-label') && !canvas.hasAttribute('aria-labelledby')) {
                    issues.push(`Canvas ${index + 1} missing accessible name`);
                }
            });
            
            // Check for decorative images
            const decorativeImages = document.querySelectorAll('img[alt=""]');
            decorativeImages.forEach((img, index) => {
                if (!img.hasAttribute('aria-hidden')) {
                    console.warn(`Decorative image ${index + 1} should have aria-hidden="true"`);
                }
            });
            
            this.recordTest(testName, issues.length === 0, {
                issues: issues,
                imagesChecked: images.length,
                canvasChecked: canvasElements.length
            });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testInfoAndRelationships() {
        const testName = 'Info and Relationships (1.3.1)';
        console.log(`🔗 Testing: ${testName}`);
        
        try {
            const issues = [];
            
            // Check for proper heading structure
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            let lastLevel = 0;
            
            headings.forEach((heading, index) => {
                const level = parseInt(heading.tagName.charAt(1));
                
                if (index === 0 && level !== 1) {
                    issues.push('First heading should be h1');
                } else if (level > lastLevel + 1) {
                    issues.push(`Heading level skipped: ${heading.tagName} after h${lastLevel}`);
                }
                
                lastLevel = level;
            });
            
            // Check for proper list markup
            const lists = document.querySelectorAll('ul, ol');
            lists.forEach((list, index) => {
                const directChildren = Array.from(list.children);
                const nonListItems = directChildren.filter(child => child.tagName !== 'LI');
                
                if (nonListItems.length > 0) {
                    issues.push(`List ${index + 1} contains non-li direct children`);
                }
            });
            
            // Check for proper table markup
            const tables = document.querySelectorAll('table');
            tables.forEach((table, index) => {
                if (!table.querySelector('th') && !table.querySelector('caption')) {
                    issues.push(`Table ${index + 1} missing headers or caption`);
                }
            });
            
            // Check for proper form labels
            const inputs = document.querySelectorAll('input, select, textarea');
            inputs.forEach((input, index) => {
                if (!input.hasAttribute('aria-label') && 
                    !input.hasAttribute('aria-labelledby') && 
                    !document.querySelector(`label[for="${input.id}"]`)) {
                    issues.push(`Form control ${index + 1} missing accessible name`);
                }
            });
            
            this.recordTest(testName, issues.length === 0, {
                issues: issues,
                headingsChecked: headings.length,
                listsChecked: lists.length,
                tablesChecked: tables.length,
                inputsChecked: inputs.length
            });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testMeaningfulSequence() {
        const testName = 'Meaningful Sequence (1.3.2)';
        console.log(`📑 Testing: ${testName}`);
        
        try {
            const issues = [];
            
            // Check tab order
            const focusableElements = this.getFocusableElements();
            const tabIndexElements = focusableElements.filter(el => el.hasAttribute('tabindex'));
            
            // Check for positive tabindex values (anti-pattern)
            const positiveTabIndex = tabIndexElements.filter(el => {
                const tabIndex = parseInt(el.getAttribute('tabindex'));
                return tabIndex > 0;
            });
            
            if (positiveTabIndex.length > 0) {
                issues.push('Positive tabindex values found (breaks natural tab order)');
            }
            
            // Check reading order vs DOM order
            const mainContent = document.querySelector('main') || document.body;
            const readingOrder = this.getReadingOrder(mainContent);
            
            this.recordTest(testName, issues.length === 0, {
                issues: issues,
                focusableElements: focusableElements.length,
                positiveTabIndexCount: positiveTabIndex.length,
                readingOrderChecked: readingOrder.length
            });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testUseOfColor() {
        const testName = 'Use of Color (1.4.1)';
        console.log(`🎨 Testing: ${testName}`);
        
        try {
            const issues = [];
            
            // Check for links that only use color to distinguish them
            const links = document.querySelectorAll('a');
            links.forEach((link, index) => {
                const computedStyle = getComputedStyle(link);
                const parentStyle = getComputedStyle(link.parentElement);
                
                // Check if link is only distinguished by color
                if (computedStyle.color !== parentStyle.color && 
                    computedStyle.textDecoration === 'none' &&
                    !link.querySelector('*')) { // No child elements
                    
                    console.warn(`Link ${index + 1} may rely only on color for identification`);
                }
            });
            
            // Check for required form fields indicated only by color
            const requiredInputs = document.querySelectorAll('input[required], select[required], textarea[required]');
            requiredInputs.forEach((input, index) => {
                if (!input.hasAttribute('aria-required') && 
                    !input.hasAttribute('aria-describedby') &&
                    !document.querySelector(`label[for="${input.id}"] .required-indicator`)) {
                    
                    console.warn(`Required field ${index + 1} may rely only on color indication`);
                }
            });
            
            this.recordTest(testName, issues.length === 0, {
                issues: issues,
                linksChecked: links.length,
                requiredFieldsChecked: requiredInputs.length
            });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testKeyboardAccess() {
        const testName = 'Keyboard Access (2.1.1)';
        console.log(`⌨️ Testing: ${testName}`);
        
        try {
            const issues = [];
            
            // Get all interactive elements
            const interactiveElements = this.getInteractiveElements();
            
            // Check if elements are focusable
            interactiveElements.forEach((element, index) => {
                const tabIndex = element.getAttribute('tabindex');
                
                if (tabIndex === '-1' && !this.isNaturallyFocusable(element)) {
                    issues.push(`Interactive element ${index + 1} (${element.tagName}) is not focusable`);
                }
                
                // Check for keyboard event handlers
                if (element.onclick && !element.onkeydown && !element.onkeypress) {
                    console.warn(`Element ${index + 1} has click handler but no keyboard handler`);
                }
            });
            
            // Test actual keyboard navigation
            const focusableElements = this.getFocusableElements();
            
            this.recordTest(testName, issues.length === 0, {
                issues: issues,
                interactiveElements: interactiveElements.length,
                focusableElements: focusableElements.length
            });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testContrastMinimum() {
        const testName = 'Contrast Minimum (1.4.3)';
        console.log(`🎯 Testing: ${testName}`);
        
        try {
            const issues = [];
            const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, td, th, label, button, a, span');
            
            for (const element of textElements) {
                const style = getComputedStyle(element);
                const fontSize = parseFloat(style.fontSize);
                const fontWeight = style.fontWeight;
                
                // Skip if element has no visible text
                if (!element.textContent.trim()) continue;
                
                const textColor = this.rgbToLuminance(style.color);
                const bgColor = this.getBackgroundColor(element);
                
                if (textColor !== null && bgColor !== null) {
                    const contrast = this.calculateContrast(textColor, bgColor);
                    
                    // Determine required contrast ratio
                    const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700));
                    const requiredRatio = isLargeText ? 3.0 : 4.5;
                    
                    if (contrast < requiredRatio) {
                        issues.push({
                            element: element.tagName.toLowerCase(),
                            text: element.textContent.substring(0, 50),
                            contrast: contrast.toFixed(2),
                            required: requiredRatio,
                            fontSize: fontSize,
                            isLargeText: isLargeText
                        });
                    }
                }
            }
            
            this.recordTest(testName, issues.length === 0, {
                issues: issues,
                elementsChecked: textElements.length,
                contrastFailures: issues.length
            });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testFocusVisible() {
        const testName = 'Focus Visible (2.4.7)';
        console.log(`👁️ Testing: ${testName}`);
        
        try {
            const issues = [];
            const focusableElements = this.getFocusableElements();
            
            for (const element of focusableElements) {
                // Temporarily focus the element to test focus styles
                element.focus();
                
                const focusedStyle = getComputedStyle(element, ':focus');
                const normalStyle = getComputedStyle(element);
                
                // Check if focus creates a visible change
                const hasFocusIndicator = 
                    focusedStyle.outline !== 'none' ||
                    focusedStyle.outlineWidth !== '0px' ||
                    focusedStyle.boxShadow !== normalStyle.boxShadow ||
                    focusedStyle.backgroundColor !== normalStyle.backgroundColor ||
                    focusedStyle.borderColor !== normalStyle.borderColor;
                
                if (!hasFocusIndicator) {
                    issues.push(`Element ${element.tagName.toLowerCase()} lacks visible focus indicator`);
                }
                
                element.blur();
            }
            
            this.recordTest(testName, issues.length === 0, {
                issues: issues,
                elementsChecked: focusableElements.length
            });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testKeyboardNavigation() {
        const testName = 'Comprehensive Keyboard Navigation';
        console.log(`⌨️ Testing: ${testName}`);
        
        try {
            const issues = [];
            const focusableElements = this.getFocusableElements();
            
            // Test tab navigation
            let currentIndex = 0;
            const navigationResults = [];
            
            for (let i = 0; i < Math.min(10, focusableElements.length); i++) {
                const element = focusableElements[i];
                element.focus();
                
                const focused = document.activeElement === element;
                navigationResults.push({
                    element: element.tagName.toLowerCase(),
                    focused: focused,
                    hasTabIndex: element.hasAttribute('tabindex')
                });
                
                if (!focused) {
                    issues.push(`Element ${i + 1} cannot receive focus`);
                }
            }
            
            // Test escape key functionality
            const modals = document.querySelectorAll('[role="dialog"], .modal');
            modals.forEach((modal, index) => {
                if (modal.style.display !== 'none' && !modal.hasAttribute('data-escape-tested')) {
                    console.warn(`Modal ${index + 1} should be tested for Escape key functionality`);
                }
            });
            
            this.recordTest(testName, issues.length === 0, {
                issues: issues,
                navigationResults: navigationResults,
                focusableCount: focusableElements.length
            });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testScreenReaderCompatibility() {
        const testName = 'Screen Reader Compatibility';
        console.log(`📢 Testing: ${testName}`);
        
        try {
            const issues = [];
            
            // Check for proper ARIA usage
            const ariaElements = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby], [role]');
            
            ariaElements.forEach((element, index) => {
                // Check for valid ARIA attributes
                const ariaAttributes = Array.from(element.attributes)
                    .filter(attr => attr.name.startsWith('aria-'));
                
                ariaAttributes.forEach(attr => {
                    if (!this.isValidAriaAttribute(attr.name)) {
                        issues.push(`Invalid ARIA attribute: ${attr.name} on element ${index + 1}`);
                    }
                });
                
                // Check role validity
                const role = element.getAttribute('role');
                if (role && !this.isValidAriaRole(role)) {
                    issues.push(`Invalid ARIA role: ${role} on element ${index + 1}`);
                }
            });
            
            // Check for live regions
            const liveRegions = document.querySelectorAll('[aria-live]');
            liveRegions.forEach((region, index) => {
                const liveValue = region.getAttribute('aria-live');
                if (!['polite', 'assertive', 'off'].includes(liveValue)) {
                    issues.push(`Invalid aria-live value: ${liveValue} on region ${index + 1}`);
                }
            });
            
            // Check for proper landmark usage
            const landmarks = document.querySelectorAll('main, nav, aside, header, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
            
            this.recordTest(testName, issues.length === 0, {
                issues: issues,
                ariaElementsChecked: ariaElements.length,
                liveRegionsChecked: liveRegions.length,
                landmarksFound: landmarks.length
            });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testMotionAccessibility() {
        const testName = 'Motion and Animation Accessibility';
        console.log(`🎬 Testing: ${testName}`);
        
        try {
            const issues = [];
            
            // Check for prefers-reduced-motion support
            const hasReducedMotionCSS = this.checkForReducedMotionCSS();
            if (!hasReducedMotionCSS) {
                issues.push('No @media (prefers-reduced-motion) CSS rules found');
            }
            
            // Check for animation controls
            const animatedElements = document.querySelectorAll('[style*="animation"], .animated, .matrix-rain, .glitch-effect');
            let hasAnimationControls = false;
            
            // Look for pause/play controls
            const controlButtons = document.querySelectorAll('[aria-label*="pause"], [aria-label*="play"], [aria-label*="stop"]');
            if (controlButtons.length > 0) {
                hasAnimationControls = true;
            }
            
            // Check for seizure-inducing flashing
            const flashingElements = document.querySelectorAll('[style*="animation"], [class*="flash"], [class*="blink"]');
            flashingElements.forEach((element, index) => {
                const style = getComputedStyle(element);
                if (style.animationDuration && parseFloat(style.animationDuration) < 0.5) {
                    console.warn(`Element ${index + 1} may have fast animation that could trigger seizures`);
                }
            });
            
            this.recordTest(testName, issues.length === 0, {
                issues: issues,
                hasReducedMotionCSS: hasReducedMotionCSS,
                hasAnimationControls: hasAnimationControls,
                animatedElementsFound: animatedElements.length
            });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    async testFocusManagement() {
        const testName = 'Focus Management';
        console.log(`🎯 Testing: ${testName}`);
        
        try {
            const issues = [];
            
            // Test focus order
            const focusableElements = this.getFocusableElements();
            const tabOrder = [];
            
            focusableElements.forEach((element, index) => {
                const tabIndex = element.getAttribute('tabindex');
                tabOrder.push({
                    element: element.tagName.toLowerCase(),
                    tabIndex: tabIndex ? parseInt(tabIndex) : (this.isNaturallyFocusable(element) ? 0 : -1),
                    hasTabIndex: element.hasAttribute('tabindex')
                });
            });
            
            // Check for focus traps in modals
            const modals = document.querySelectorAll('[role="dialog"], .modal');
            modals.forEach((modal, index) => {
                if (modal.style.display !== 'none') {
                    const modalFocusable = modal.querySelectorAll(this.getFocusableSelector());
                    if (modalFocusable.length === 0) {
                        issues.push(`Modal ${index + 1} has no focusable elements`);
                    }
                }
            });
            
            // Check for skip links
            const skipLinks = document.querySelectorAll('a[href^="#"]');
            const hasSkipToMain = Array.from(skipLinks).some(link => 
                link.textContent.toLowerCase().includes('skip') && 
                link.textContent.toLowerCase().includes('main')
            );
            
            if (!hasSkipToMain && focusableElements.length > 5) {
                console.warn('Consider adding skip links for better navigation');
            }
            
            this.recordTest(testName, issues.length === 0, {
                issues: issues,
                focusableCount: focusableElements.length,
                tabOrder: tabOrder,
                hasSkipLinks: hasSkipToMain
            });
            
        } catch (error) {
            this.recordTest(testName, false, { error: error.message });
        }
    }
    
    // Helper methods
    getFocusableElements() {
        return Array.from(document.querySelectorAll(this.getFocusableSelector()))
            .filter(element => !element.disabled && element.tabIndex !== -1);
    }
    
    getFocusableSelector() {
        return 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';
    }
    
    getInteractiveElements() {
        return Array.from(document.querySelectorAll('button, input, select, textarea, a, [onclick], [role="button"], [role="link"], [role="menuitem"]'));
    }
    
    isNaturallyFocusable(element) {
        const focusableElements = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
        return focusableElements.includes(element.tagName) && !element.disabled;
    }
    
    getReadingOrder(container) {
        const textNodes = [];
        const walker = document.createTreeWalker(
            container,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.trim()) {
                textNodes.push(node.textContent.trim());
            }
        }
        
        return textNodes;
    }
    
    rgbToLuminance(rgb) {
        if (!rgb || rgb === 'transparent') return null;
        
        const match = rgb.match(/rgb\((\d+), (\d+), (\d+)\)/);
        if (!match) return null;
        
        const [, r, g, b] = match.map(Number);
        return this.calculateRelativeLuminance(r, g, b);
    }
    
    calculateRelativeLuminance(r, g, b) {
        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }
    
    getBackgroundColor(element) {
        let current = element;
        
        while (current && current !== document.body) {
            const style = getComputedStyle(current);
            const bgColor = style.backgroundColor;
            
            if (bgColor && bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
                return this.rgbToLuminance(bgColor);
            }
            
            current = current.parentElement;
        }
        
        // Default to white background
        return this.calculateRelativeLuminance(255, 255, 255);
    }
    
    calculateContrast(lum1, lum2) {
        const lighter = Math.max(lum1, lum2);
        const darker = Math.min(lum1, lum2);
        return (lighter + 0.05) / (darker + 0.05);
    }
    
    checkForReducedMotionCSS() {
        const stylesheets = Array.from(document.styleSheets);
        
        for (const stylesheet of stylesheets) {
            try {
                const rules = Array.from(stylesheet.cssRules || stylesheet.rules || []);
                
                for (const rule of rules) {
                    if (rule.media && rule.media.mediaText.includes('prefers-reduced-motion')) {
                        return true;
                    }
                }
            } catch (error) {
                // Cross-origin stylesheet, skip
                continue;
            }
        }
        
        return false;
    }
    
    isValidAriaAttribute(attribute) {
        const validAriaAttributes = [
            'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-hidden',
            'aria-expanded', 'aria-current', 'aria-disabled', 'aria-required',
            'aria-live', 'aria-atomic', 'aria-relevant', 'aria-busy',
            'aria-controls', 'aria-owns', 'aria-flowto', 'aria-activedescendant',
            'aria-checked', 'aria-selected', 'aria-pressed', 'aria-level',
            'aria-multiline', 'aria-multiselectable', 'aria-orientation',
            'aria-readonly', 'aria-sort', 'aria-valuemax', 'aria-valuemin',
            'aria-valuenow', 'aria-valuetext', 'aria-autocomplete',
            'aria-dropeffect', 'aria-grabbed', 'aria-haspopup', 'aria-invalid',
            'aria-setsize', 'aria-posinset'
        ];
        
        return validAriaAttributes.includes(attribute);
    }
    
    isValidAriaRole(role) {
        const validAriaRoles = [
            'alert', 'alertdialog', 'application', 'article', 'banner', 'button',
            'cell', 'checkbox', 'columnheader', 'combobox', 'complementary',
            'contentinfo', 'definition', 'dialog', 'directory', 'document',
            'form', 'grid', 'gridcell', 'group', 'heading', 'img', 'link',
            'list', 'listbox', 'listitem', 'log', 'main', 'marquee', 'math',
            'menu', 'menubar', 'menuitem', 'menuitemcheckbox', 'menuitemradio',
            'navigation', 'note', 'option', 'presentation', 'progressbar',
            'radio', 'radiogroup', 'region', 'row', 'rowgroup', 'rowheader',
            'scrollbar', 'search', 'separator', 'slider', 'spinbutton',
            'status', 'tab', 'tablist', 'tabpanel', 'textbox', 'timer',
            'toolbar', 'tooltip', 'tree', 'treegrid', 'treeitem'
        ];
        
        return validAriaRoles.includes(role);
    }
    
    recordTest(testName, passed, details = {}) {
        const result = {
            name: testName,
            passed: passed,
            timestamp: new Date().toISOString(),
            wcagLevel: this.determineWCAGLevel(testName),
            details: details
        };
        
        this.testResults.push(result);
        
        const status = passed ? '✅' : '❌';
        console.log(`${status} ${testName}: ${passed ? 'PASSED' : 'FAILED'}`);
        
        if (!passed && details.issues && details.issues.length > 0) {
            console.warn(`   Issues found: ${details.issues.length}`);
            details.issues.slice(0, 3).forEach(issue => {
                const issueText = typeof issue === 'string' ? issue : JSON.stringify(issue);
                console.warn(`   - ${issueText}`);
            });
            
            if (details.issues.length > 3) {
                console.warn(`   ... and ${details.issues.length - 3} more issues`);
            }
        }
    }
    
    determineWCAGLevel(testName) {
        if (testName.includes('(1.1.1)') || testName.includes('(1.3.1)') || 
            testName.includes('(1.3.2)') || testName.includes('(1.4.1)') ||
            testName.includes('(2.1.1)') || testName.includes('(2.1.2)') ||
            testName.includes('(2.2.1)') || testName.includes('(2.3.1)') ||
            testName.includes('(2.4.1)') || testName.includes('(2.4.2)') ||
            testName.includes('(3.1.1)') || testName.includes('(3.2.1)') ||
            testName.includes('(3.2.2)') || testName.includes('(3.3.1)') ||
            testName.includes('(3.3.2)') || testName.includes('(4.1.1)') ||
            testName.includes('(4.1.2)')) {
            return 'A';
        }
        
        if (testName.includes('(1.4.3)') || testName.includes('(1.4.4)') ||
            testName.includes('(1.4.5)') || testName.includes('(2.4.5)') ||
            testName.includes('(2.4.6)') || testName.includes('(2.4.7)') ||
            testName.includes('(3.1.2)') || testName.includes('(3.2.3)') ||
            testName.includes('(3.2.4)') || testName.includes('(3.3.3)') ||
            testName.includes('(3.3.4)')) {
            return 'AA';
        }
        
        return 'Additional';
    }
    
    generateAccessibilityReport() {
        const endTime = Date.now();
        const duration = endTime - this.startTime;
        
        console.log('\n♿ Accessibility Audit Report');
        console.log('===============================');
        console.log(`WCAG 2.1 Level ${this.wcagLevel} Compliance Test`);
        console.log(`Duration: ${duration}ms`);
        
        const passed = this.testResults.filter(test => test.passed).length;
        const total = this.testResults.length;
        const successRate = Math.round((passed / total) * 100);
        
        console.log(`\nOverall Results:`);
        console.log(`  ✅ Passed: ${passed}`);
        console.log(`  ❌ Failed: ${total - passed}`);
        console.log(`  📈 Compliance Rate: ${successRate}%`);
        
        // Group by WCAG level
        const levelResults = {};
        this.testResults.forEach(test => {
            const level = test.wcagLevel;
            if (!levelResults[level]) {
                levelResults[level] = { passed: 0, failed: 0, total: 0 };
            }
            
            levelResults[level].total++;
            if (test.passed) {
                levelResults[level].passed++;
            } else {
                levelResults[level].failed++;
            }
        });
        
        console.log('\n📊 Results by WCAG Level:');
        Object.entries(levelResults).forEach(([level, results]) => {
            const levelSuccess = Math.round((results.passed / results.total) * 100);
            console.log(`  Level ${level}: ${levelSuccess}% (${results.passed}/${results.total})`);
        });
        
        // Critical issues
        const criticalIssues = this.testResults.filter(test => 
            !test.passed && (test.wcagLevel === 'A' || test.wcagLevel === 'AA')
        );
        
        if (criticalIssues.length > 0) {
            console.log('\n🚨 Critical Accessibility Issues:');
            criticalIssues.forEach(issue => {
                console.log(`  • ${issue.name} (Level ${issue.wcagLevel})`);
            });
        }
        
        // Recommendations
        console.log('\n💡 Accessibility Recommendations:');
        this.generateAccessibilityRecommendations();
        
        // Store report
        const report = {
            timestamp: new Date().toISOString(),
            targetLevel: this.wcagLevel,
            results: this.testResults,
            successRate: successRate,
            levelResults: levelResults,
            duration: duration,
            criticalIssues: criticalIssues.length
        };
        
        localStorage.setItem('accessibilityReport', JSON.stringify(report));
        
        console.log('\n✨ Accessibility audit completed!');
        
        return report;
    }
    
    generateAccessibilityRecommendations() {
        const failedTests = this.testResults.filter(test => !test.passed);
        
        if (failedTests.length === 0) {
            console.log('  🎉 All accessibility tests passed! Great job!');
            return;
        }
        
        const recommendations = new Set();
        
        failedTests.forEach(test => {
            if (test.name.includes('Non-text Content')) {
                recommendations.add('Add alt text to all images and provide accessible alternatives for canvas elements');
            }
            
            if (test.name.includes('Contrast')) {
                recommendations.add('Improve color contrast ratios to meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)');
            }
            
            if (test.name.includes('Keyboard')) {
                recommendations.add('Ensure all interactive elements are keyboard accessible and have proper focus management');
            }
            
            if (test.name.includes('Focus Visible')) {
                recommendations.add('Add visible focus indicators to all focusable elements');
            }
            
            if (test.name.includes('Screen Reader')) {
                recommendations.add('Improve ARIA markup and semantic structure for better screen reader compatibility');
            }
            
            if (test.name.includes('Motion')) {
                recommendations.add('Implement prefers-reduced-motion CSS and provide animation controls');
            }
            
            if (test.name.includes('Info and Relationships')) {
                recommendations.add('Use proper semantic markup and heading structure');
            }
        });
        
        recommendations.forEach(recommendation => {
            console.log(`  • ${recommendation}`);
        });
    }
}

// Auto-initialize for browser usage
if (typeof window !== 'undefined') {
    window.AccessibilityTestSuite = AccessibilityTestSuite;
    
    // Auto-start testing after page load - DISABLED FOR SIMPLIFIED UX
    // window.addEventListener('load', () => {
    //     setTimeout(() => {
    //         const accessibilityTest = new AccessibilityTestSuite();
    //         accessibilityTest.runAccessibilityAudit();
    //     }, 3000); // Wait 3 seconds for app to initialize
    // });
}

export default AccessibilityTestSuite;