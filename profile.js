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
    
    // Load initial section
    showProfileSection('info');
    
    // Initialize forms
    initializeForms();
    
    // Initialize chat
    initializeChat();
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

function showProfileSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.profile-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
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
            case 'chat':
                // Chat is already initialized
                break;
        }
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
    const orders = getOrders();
    const user = getCurrentUser();
    const userOrders = orders.filter(order => order.customerEmail === user.email);
    
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    if (userOrders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <h3>Chưa có đơn hàng nào</h3>
                <p>Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!</p>
                <a href="index.html" class="btn btn-primary">Mua sắm ngay</a>
            </div>
        `;
        return;
    }
    
    ordersList.innerHTML = userOrders.map(order => {
        const book = window.BookDatabase ? window.BookDatabase.getBookById(order.bookId) : null;
        const bookTitle = book ? book.title : 'Sách không tồn tại';
        
        return `
            <div class="order-item">
                <div class="order-header">
                    <div class="order-info">
                        <h4>Đơn hàng #${order.id}</h4>
                        <p>Ngày đặt: ${new Date(order.date).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div class="order-status">
                        <span class="status-badge status-${order.status}">${getStatusText(order.status)}</span>
                    </div>
                </div>
                <div class="order-content">
                    <div class="order-product">
                        <img src="${book ? book.images[0] : 'images/book-tlch-1.jpg'}" alt="${bookTitle}" class="order-product-image">
                        <div class="order-product-info">
                            <h5>${bookTitle}</h5>
                            <p>Số lượng: ${order.quantity}</p>
                            <p>Giá: ${formatPrice(order.total)}</p>
                        </div>
                    </div>
                    <div class="order-actions">
                        <button class="btn btn-sm btn-primary" onclick="viewOrderDetails(${order.id})">
                            <i class="fas fa-eye"></i>
                            Xem chi tiết
                        </button>
                        ${order.status === 'delivered' ? `
                            <button class="btn btn-sm btn-secondary" onclick="rateOrder(${order.id})">
                                <i class="fas fa-star"></i>
                                Đánh giá
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function loadUserWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('bookshelf-wishlist')) || [];
    const wishlistGrid = document.getElementById('wishlistGrid');
    
    if (!wishlistGrid) return;
    
    if (wishlist.length === 0) {
        wishlistGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart"></i>
                <h3>Danh sách yêu thích trống</h3>
                <p>Bạn chưa thêm sách nào vào danh sách yêu thích.</p>
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
    
    wishlistGrid.innerHTML = wishlistBooks.map(book => `
        <div class="wishlist-item">
            <div class="wishlist-image">
                <img src="${book.images[0]}" alt="${book.title}">
                <button class="remove-wishlist-btn" onclick="removeFromWishlist(${book.id})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="wishlist-info">
                <h4>${book.title}</h4>
                <p>${book.author}</p>
                <div class="wishlist-price">${formatPrice(book.price)}</div>
                <button class="btn btn-primary btn-sm" onclick="addToCart(${book.id})">
                    <i class="fas fa-shopping-cart"></i>
                    Thêm vào giỏ
                </button>
            </div>
        </div>
    `).join('');
}

function loadUserReviews() {
    // For demo purposes, show empty state
    // In a real app, this would load user's reviews from database
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
    const inputs = document.querySelectorAll('#profileForm input, #profileForm textarea');
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
    
    // Update user data
    const updatedUser = {
        ...user,
        name: formData.get('name'),
        phone: formData.get('phone'),
        birthday: formData.get('birthday'),
        address: formData.get('address')
    };
    
    // Save updated user data
    if (user.rememberMe) {
        localStorage.setItem('bookshelf-user', JSON.stringify(updatedUser));
    } else {
        sessionStorage.setItem('bookshelf-user', JSON.stringify(updatedUser));
    }
    
    showNotification('Cập nhật thông tin thành công!', 'success');
    toggleEditMode();
    loadUserProfile();
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

// ========== CHAT FUNCTIONALITY ========== //
function initializeChat() {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendMessageBtn');
    
    if (chatInput && sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    chatInput.value = '';
    
    // Simulate bot response
    setTimeout(() => {
        const botResponse = generateBotResponse(message);
        addChatMessage(botResponse, 'bot');
    }, 1000);
}

function addChatMessage(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    const avatar = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            ${avatar}
        </div>
        <div class="message-content">
            <p>${message}</p>
            <span class="message-time">${time}</span>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateBotResponse(userMessage) {
    const responses = [
        "Cảm ơn bạn đã liên hệ! Tôi sẽ hỗ trợ bạn ngay.",
        "Bạn có thể tìm sách theo danh mục hoặc sử dụng công cụ tìm kiếm.",
        "Để kiểm tra trạng thái đơn hàng, vui lòng cung cấp mã đơn hàng.",
        "Chúng tôi có chính sách đổi trả trong vòng 7 ngày.",
        "Bạn có thể thanh toán bằng thẻ tín dụng, chuyển khoản hoặc COD.",
        "Thời gian giao hàng thường là 2-3 ngày làm việc.",
        "Nếu bạn cần hỗ trợ thêm, vui lòng gọi hotline: 0866836004"
    ];
    
    // Simple keyword matching
    if (userMessage.toLowerCase().includes('đơn hàng') || userMessage.toLowerCase().includes('order')) {
        return "Để kiểm tra đơn hàng, vui lòng cung cấp mã đơn hàng hoặc email đã đăng ký.";
    }
    
    if (userMessage.toLowerCase().includes('sách') || userMessage.toLowerCase().includes('book')) {
        return "Bạn có thể tìm sách theo danh mục hoặc sử dụng công cụ tìm kiếm ở trang chủ.";
    }
    
    if (userMessage.toLowerCase().includes('giá') || userMessage.toLowerCase().includes('price')) {
        return "Giá sách được hiển thị trên trang sản phẩm. Chúng tôi thường có các chương trình khuyến mãi.";
    }
    
    if (userMessage.toLowerCase().includes('giao hàng') || userMessage.toLowerCase().includes('delivery')) {
        return "Thời gian giao hàng thường là 2-3 ngày làm việc. Phí giao hàng tùy thuộc vào địa điểm.";
    }
    
    // Default response
    return responses[Math.floor(Math.random() * responses.length)];
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
    return JSON.parse(localStorage.getItem('bookshelf-orders')) || [];
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

// Export functions for global access
if (typeof window !== 'undefined') {
    window.showProfileSection = showProfileSection;
    window.toggleEditMode = toggleEditMode;
    window.cancelEdit = cancelEdit;
    window.viewOrderDetails = viewOrderDetails;
    window.rateOrder = rateOrder;
    window.removeFromWishlist = removeFromWishlist;
    window.addToCart = addToCart;
}