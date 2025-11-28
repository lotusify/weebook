// ========== CORE UTILITIES ========== //
// Common utility functions used across the application

/**
 * Get current page name from URL
 * @returns {string} Page name ('index', 'product', 'category', etc.)
 */
export function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('product.html')) return 'product';
    if (path.includes('category.html')) return 'category';
    if (path.includes('about.html')) return 'about';
    if (path.includes('shop.html')) return 'shop';
    return 'index';
}

/**
 * Format price in Vietnamese currency
 * @param {number} price - Price to format
 * @returns {string} Formatted price string
 */
export function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(price);
}

/**
 * Show notification to user
 * @param {string} message - Notification message
 * @param {string} type - Type of notification ('success', 'error', 'info')
 */
export function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);

    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    });
}

/**
 * Show loading spinner in container
 * @param {HTMLElement} container - Container element to show loading in
 */
export function showLoading(container) {
    container.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Đang tải...</p>
        </div>
    `;
}
