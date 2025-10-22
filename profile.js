// ========== PROFILE PAGE FUNCTIONALITY ========== //
// User profile management system

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!isLoggedIn()) {
        showNotification('Vui lòng đăng nhập để truy cập trang này!', 'error');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1500);
        return;
    }
    
    console.log('Profile page loaded');
    initializeProfilePage();
});

// ========== PROFILE PAGE INITIALIZATION ========== //
function initializeProfilePage() {
    // Load user data
    loadUserProfile();
    
    // Initialize navigation
    initializeProfileNavigation();
    
    // Initialize cart sync for cross-page updates
    initializeCartSyncForProfile();
    
    // Load initial section based on URL hash or default to info
    const hash = window.location.hash.substring(1);
    const initialSection = hash || 'info';
    showProfileSection(initialSection);
    
    // Initialize forms
    initializeForms();
    
}

// ========== PROFILE NAVIGATION ========== //
function initializeProfileNavigation() {
    const navItems = document.querySelectorAll('.profile-nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            showProfileSection(section);
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function initializeCartSyncForProfile() {
    console.log('Initializing cart sync for profile page');
    
    // Listen for cart updates from script.js
    window.addEventListener('cartUpdated', function(event) {
        console.log('Profile page received cart update:', event.detail);
        
        // Force update cart UI elements
        setTimeout(() => {
            if (typeof window.updateCartCount === 'function') {
                window.updateCartCount();
            }
            if (typeof window.updateCartDropdown === 'function') {
                window.updateCartDropdown();
            }
        }, 50);
    });
    
    // Listen for storage changes (cross-tab sync)
    window.addEventListener('storage', function(event) {
        if (event.key === 'bookself-cart') {
            console.log('Profile page detected cart change in another tab');
            setTimeout(() => {
                if (typeof window.updateCartCount === 'function') {
                    window.updateCartCount();
                }
                if (typeof window.updateCartDropdown === 'function') {
                    window.updateCartDropdown();
                }
            }, 50);
        }
    });
}

function showProfileSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.profile-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Update active nav item
    const navItems = document.querySelectorAll('.profile-nav-item');
    navItems.forEach(nav => nav.classList.remove('active'));
    const activeNav = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeNav) {
        activeNav.classList.add('active');
    }
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Update URL hash
        window.location.hash = sectionId;
        
        // Load section-specific data
        switch(sectionId) {
            case 'info':
                loadUserProfile();
                break;
            case 'orders':
                loadUserOrders();
                break;
            case 'wishlist':
                loadUserWishlist();
                break;
            case 'reviews':
                loadUserReviews();
                break;
        }
    }
}

function showWishlistSection() {
    // Only navigate if not already on profile page
    if (!window.location.pathname.includes('profile.html')) {
        window.location.href = 'profile.html#wishlist';
    } else {
        showProfileSection('wishlist');
    }
}

// ========== USER PROFILE DATA ========== //
function loadUserProfile() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Update profile info in sidebar
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    
    // Update form fields
    document.getElementById('profileNameInput').value = user.name;
    document.getElementById('profileEmailInput').value = user.email;
    document.getElementById('profilePhoneInput').value = user.phone || '';
    document.getElementById('profileBirthdayInput').value = user.birthday || '';
    document.getElementById('profileAddressInput').value = user.address || '';
}

function loadUserOrders() {
     window.location.href = "orders.html";
}

function loadUserWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('bookself-wishlist')) || [];
    const wishlistGrid = document.getElementById('wishlistGrid');
    
    if (!wishlistGrid) return;
    
    if (wishlist.length === 0) {
        wishlistGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <i class="fas fa-heart" style="font-size: 4rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--text-color); margin-bottom: 0.5rem;">Danh sách yêu thích trống</h3>
                <p style="color: var(--text-light); margin-bottom: 1.5rem;">Bạn chưa thêm sách nào vào danh sách yêu thích.</p>
                <a href="index.html" class="btn btn-primary">Mua sắm ngay</a>
            </div>
        `;
        return;
    }
    
    if (!window.BookDatabase) {
        wishlistGrid.innerHTML = '<p>Đang tải danh sách yêu thích...</p>';
        return;
    }
    
    const wishlistBooks = wishlist.map(id => window.BookDatabase.getBookById(id)).filter(book => book);
    
    // Layout đặc biệt cho wishlist - bỏ rating, bỏ hover, thêm nút ở dưới
    wishlistGrid.innerHTML = wishlistBooks.map(book => `
        <div class="product-card wishlist-card" data-product-id="${book.id}">
            <div class="product-image">
                <img src="${book.images[0]}" alt="${book.title}" loading="lazy" onclick="viewProduct(${book.id})" style="cursor: pointer;">
                <button class="remove-from-wishlist-btn" onclick="event.preventDefault(); event.stopPropagation(); removeFromWishlist(${book.id})" title="Xóa khỏi danh sách yêu thích">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-title" onclick="viewProduct(${book.id})" style="cursor: pointer;">${book.title}</h3>
                <p class="product-author">${book.author}</p>
                <div class="product-price">
                    <span class="current-price">${formatPrice(book.price)}</span>
                    ${book.originalPrice && book.originalPrice > book.price ? `<span class="original-price">${formatPrice(book.originalPrice)}</span>` : ''}
                </div>
                <button class="btn btn-primary wishlist-add-to-cart-btn" onclick="addToCartFromWishlist(${book.id})">
                    <i class="fas fa-shopping-cart"></i>
                    Thêm vào giỏ hàng
                </button>
            </div>
        </div>
    `).join('');
}

function loadUserReviews() {
   
}

// ========== FORM HANDLING ========== //
function initializeForms() {
    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    // Change password form
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', handlePasswordChange);
    }
}

function toggleEditMode() {
    const inputs = document.querySelectorAll('#profileForm input:not([disabled]), #profileForm textarea');
    const formActions = document.querySelector('.form-actions');
    const editBtn = document.querySelector('.section-header .btn');
    
    const isReadonly = inputs[0].readOnly;
    
    inputs.forEach(input => {
        input.readOnly = !isReadonly;
    });
    
    if (isReadonly) {
        formActions.style.display = 'flex';
        editBtn.innerHTML = '<i class="fas fa-times"></i> Hủy';
        editBtn.onclick = cancelEdit;
    } else {
        formActions.style.display = 'none';
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Chỉnh sửa';
        editBtn.onclick = toggleEditMode;
    }
}

function cancelEdit() {
    // Reload user data to reset form
    loadUserProfile();
    toggleEditMode();
}

function handleProfileUpdate(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const user = getCurrentUser();
    
    // Update user data (don't update email as it's login credential)
    const updatedUser = {
        ...user,
        name: formData.get('name'),
        phone: formData.get('phone'),
        birthday: formData.get('birthday'),
        address: formData.get('address')
        // Keep original email
    };
    
    // Save updated user data
    if (user.rememberMe) {
        localStorage.setItem('bookshelf-user', JSON.stringify(updatedUser));
    } else {
        sessionStorage.setItem('bookshelf-user', JSON.stringify(updatedUser));
    }
    
    // Update profile info in sidebar without reloading form
    document.getElementById('profileName').textContent = updatedUser.name;
    // Don't update email in sidebar as it shouldn't change
    
    showNotification('Cập nhật thông tin thành công!', 'success');
    toggleEditMode();
}

function handlePasswordChange(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmNewPassword');
    
    if (newPassword !== confirmPassword) {
        showNotification('Mật khẩu xác nhận không khớp!', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('Mật khẩu mới phải có ít nhất 6 ký tự!', 'error');
        return;
    }
    
    // For demo purposes, just show success message
    // In a real app, this would verify current password and update it
    showNotification('Đổi mật khẩu thành công!', 'success');
    e.target.reset();
}


// ========== ORDER ACTIONS ========== //
function viewOrderDetails(orderId) {
    showNotification('Chức năng xem chi tiết đơn hàng sẽ được phát triển trong phiên bản tiếp theo!', 'info');
}

function rateOrder(orderId) {
    showNotification('Chức năng đánh giá đơn hàng sẽ được phát triển trong phiên bản tiếp theo!', 'info');
}

// ========== UTILITY FUNCTIONS ========== //
function getOrders() {
    return JSON.parse(localStorage.getItem('bookself-orders')) || [];
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(price);
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Chờ xử lý',
        'processing': 'Đang xử lý',
        'shipped': 'Đã giao',
        'delivered': 'Hoàn thành',
        'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
}

function showNotification(message, type = 'success') {
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

// ========== WISHLIST FUNCTIONS ========== //
// Override functions to add reload functionality
function removeFromWishlist(bookId) {
    console.log('Removing from wishlist:', bookId, typeof bookId);
    
    // Use localStorage for demo (no user login required)
    let wishlist = JSON.parse(localStorage.getItem('bookself-wishlist')) || [];
    console.log('Current wishlist before removal:', wishlist);
    
    // Convert bookId to number for comparison
    const bookIdNum = parseInt(bookId);
    
    // Remove from wishlist
    wishlist = wishlist.filter(id => parseInt(id) !== bookIdNum);
    console.log('Wishlist after removal:', wishlist);
    
    localStorage.setItem('bookself-wishlist', JSON.stringify(wishlist));
    
    if (typeof window.showNotification === 'function') {
        window.showNotification('Đã xóa sản phẩm khỏi danh sách yêu thích!', 'success');
    }
    
    // Reload wishlist display
    loadUserWishlist();
    
    // Update wishlist buttons in other pages if available
    if (typeof window.updateWishlistButtons === 'function') {
        window.updateWishlistButtons();
    }
}

function addToCartFromWishlist(bookId) {
    // Đơn giản thôi - dùng hàm có sẵn trong script.js
    if (typeof window.addToCart === 'function') {
        window.addToCart(bookId);
    } else {
        console.error('addToCart function not available');
    }
}

function viewProduct(bookId) {
    // Navigate to product page
    window.location.href = `product.html?id=${bookId}`;
}

// Export functions for global access
if (typeof window !== 'undefined') {
    window.showProfileSection = showProfileSection;
    window.showWishlistSection = showWishlistSection;
    window.toggleEditMode = toggleEditMode;
    window.cancelEdit = cancelEdit;
    window.viewOrderDetails = viewOrderDetails;
    window.rateOrder = rateOrder;
    window.removeFromWishlist = removeFromWishlist;
    window.addToCart = addToCart;
    window.addToCartFromWishlist = addToCartFromWishlist;
    window.viewProduct = viewProduct;
}