// ========== MAIN JAVASCRIPT - ENTRY POINT ========== //
// This is the temporary main entry point that will gradually replace script.js

// Import core utilities
import { getCurrentPage, formatPrice, showNotification, showLoading } from './core/utils.js';
import { initializeNavigation } from './features/navigation.js';

// Make utilities available globally for backward compatibility
window.formatPrice = formatPrice;
window.showNotification = showNotification;
window.showLoading = showLoading;

/**
 * Main initialization function
 */
function initializeApp() {
    console.log('Modular JS initialized!');
    console.log('Current page:', getCurrentPage());

    // Initialize navigation
    if (typeof initializeNavigation === 'function') {
        initializeNavigation();
    }

    console.log('NOTE: script.js still provides remaining functionality until full migration');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
