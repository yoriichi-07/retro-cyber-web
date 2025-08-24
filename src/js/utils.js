/* Utility Functions for Retro Cyber World */
/* Common helper functions and utilities */

/**
 * Utility class for common operations
 */
class Utils {
    /**
     * Add delay/sleep functionality
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} Promise that resolves after delay
     */
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Generate random number between min and max
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random number
     */
    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Get random item from array
     * @param {Array} array - Array to pick from
     * @returns {*} Random array item
     */
    static randomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Escape HTML characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Format timestamp for terminal
     * @param {Date} date - Date object
     * @returns {string} Formatted timestamp
     */
    static formatTimestamp(date = new Date()) {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    }

    /**
     * Get cyberpunk-style date
     * @returns {string} Cyberpunk formatted date
     */
    static getCyberDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        return `${year}.${month}.${day} ${hours}:${minutes}:${seconds} [GRID_TIME]`;
    }

    /**
     * Generate random cyberpunk username
     * @returns {string} Random cyberpunk username
     */
    static generateCyberUser() {
        const prefixes = ['ghost', 'cyber', 'neo', 'matrix', 'shadow', 'void', 'hex', 'byte'];
        const suffixes = ['runner', 'hack', 'punk', 'rider', 'user', 'node', 'link', 'core'];
        const numbers = Math.floor(Math.random() * 999);
        
        return `${Utils.randomItem(prefixes)}${Utils.randomItem(suffixes)}${numbers}`;
    }

    /**
     * Simple encryption/decryption (Caesar cipher)
     * @param {string} text - Text to process
     * @param {number} shift - Shift amount
     * @param {boolean} decrypt - Whether to decrypt
     * @returns {string} Processed text
     */
    static caesarCipher(text, shift = 3, decrypt = false) {
        if (decrypt) shift = -shift;
        
        return text.split('').map(char => {
            if (char.match(/[a-zA-Z]/)) {
                const start = char.charCodeAt(0) <= 90 ? 65 : 97;
                return String.fromCharCode(
                    ((char.charCodeAt(0) - start + shift + 26) % 26) + start
                );
            }
            return char;
        }).join('');
    }

    /**
     * Convert text to binary
     * @param {string} text - Text to convert
     * @returns {string} Binary representation
     */
    static textToBinary(text) {
        return text.split('').map(char => {
            return char.charCodeAt(0).toString(2).padStart(8, '0');
        }).join(' ');
    }

    /**
     * Convert binary to text
     * @param {string} binary - Binary string to convert
     * @returns {string} Text representation
     */
    static binaryToText(binary) {
        return binary.split(' ').map(bin => {
            return String.fromCharCode(parseInt(bin, 2));
        }).join('');
    }

    /**
     * Base64 encode
     * @param {string} text - Text to encode
     * @returns {string} Base64 encoded text
     */
    static base64Encode(text) {
        return btoa(text);
    }

    /**
     * Base64 decode
     * @param {string} encoded - Encoded text to decode
     * @returns {string} Decoded text
     */
    static base64Decode(encoded) {
        try {
            return atob(encoded);
        } catch (e) {
            return 'Invalid base64 string';
        }
    }

    /**
     * Validate input for security
     * @param {string} input - User input to validate
     * @returns {string} Sanitized input
     */
    static sanitizeInput(input) {
        return input
            .replace(/[<>'"&]/g, '') // Remove HTML chars
            .replace(/javascript:/gi, '') // Remove JS protocols
            .replace(/on\w+=/gi, '') // Remove event handlers
            .trim()
            .substring(0, 100); // Limit length
    }

    /**
     * Check if device is mobile
     * @returns {boolean} True if mobile device
     */
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Get device info for analytics
     * @returns {Object} Device information
     */
    static getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            screen: {
                width: screen.width,
                height: screen.height
            },
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            mobile: Utils.isMobile(),
            online: navigator.onLine,
            language: navigator.language
        };
    }

    /**
     * Local storage wrapper with error handling
     * @param {string} key - Storage key
     * @param {*} value - Value to store (if provided)
     * @returns {*} Stored value or null
     */
    static storage(key, value) {
        try {
            if (value !== undefined) {
                localStorage.setItem(key, JSON.stringify(value));
                return value;
            } else {
                const stored = localStorage.getItem(key);
                return stored ? JSON.parse(stored) : null;
            }
        } catch (e) {
            console.warn('LocalStorage not available:', e);
            return null;
        }
    }

    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Limit in ms
     * @returns {Function} Throttled function
     */
    static throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Export for module systems or make globally available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
} else {
    window.Utils = Utils;
}