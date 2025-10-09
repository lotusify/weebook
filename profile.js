// ========== PROFILE PAGE ========== //
// User profile management system

document.addEventListener('DOMContentLoaded', function() {
    initializeProfile();
});

function initializeProfile() {
    // Check if user is logged in
    if (!isLoggedIn()) {
        showNotification('Vui lòng đăng nhập để xem hồ sơ!', 'error');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1500);
        return;
    }

    // Load user profile
    loadUserProfile();
    
    // Initialize navigation
    initializeProfileNavigation();
    
    // Load initial section
    loadSection('personal-info');
}

function loadUserProfile() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    // Update profile card
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profilePhone').textContent = currentUser.phone;

    // Update form fields
    document.getElementById('editName').value = currentUser.name || '';
    document.getElementById('editPhone').value = currentUser.phone || '';
    document.getElementById('editEmail').value = currentUser.email || '';
    document.getElementById('editAddress').value = currentUser.address || '';
}

function initializeProfileNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Load section
            const section = item.dataset.section;
            loadSection(section);
        });
    });
}

function loadSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.profile-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Load section-specific content
        switch(sectionId) {
            case 'orders':
                loadOrders();
                break;
            case 'wishlist':
                loadWishlist();
                break;
            case 'reviews':
                loadReviews();
                break;
        }
    }
}

function loadOrders() {
    const ordersContainer = document.getElementById('ordersList');
    const currentUser = getCurrentUser();
    
    if (!currentUser) return;

    const orders = JSON.parse(localStorage.getItem('bookshelf-orders')) || [];
    const userOrders = orders.filter(order => order.userId === currentUser.id);
    
    if (userOrders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <h3>Chưa có đơn hàng nào</h3>
                <p>Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!</p>
                <a href="index.html" class="btn btn-primary">Mua sắm ngay</a>
            </div>
        `;
        return;
    }

    let ordersHtml = '';
    userOrders.forEach(order => {
        const statusClass = `status-${order.status}`;
        const statusText = getStatusText(order.status);
        
        ordersHtml += `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-info">
                        <h4>Đơn hàng #${order.id.toString().padStart(6, '0')}</h4>
                        <p class="order-date">${formatDate(order.createdAt)}</p>
                    </div>
                    <div class="order-status">
                        <span class="status ${statusClass}">${statusText}</span>
                    </div>
                </div>
                
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.title}" class="item-image">
                            <div class="item-details">
                                <h5>${item.title}</h5>
                                <p>${item.author}</p>
                                <span class="item-quantity">Số lượng: ${item.quantity}</span>
                            </div>
                            <div class="item-price">${formatPrice(item.total)}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="order-footer">
                    <div class="order-total">
                        <span>Tổng cộng:</span>
                        <span class="total-price">${formatPrice(order.total)}</span>
                    </div>
                    <div class="order-actions">
                        <button class="btn btn-secondary" onclick="viewOrderDetails(${order.id})">
                            <i class="fas fa-eye"></i>
                            Xem chi tiết
                        </button>
                        ${order.status === 'pending' ? `
                            <button class="btn btn-danger" onclick="cancelOrder(${order.id})">
                                <i class="fas fa-times"></i>
                                Hủy đơn
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    });

    ordersContainer.innerHTML = ordersHtml;
}

function loadWishlist() {
    const wishlistContainer = document.getElementById('wishlistGrid');
    const currentUser = getCurrentUser();
    
    if (!currentUser) return;

    const users = getUsers();
    const user = users.find(u => u.id === currentUser.id);
    const wishlist = user ? user.wishlist : [];
    
    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart"></i>
                <h3>Danh sách yêu thích trống</h3>
                <p>Bạn chưa thêm sách nào vào danh sách yêu thích.</p>
                <a href="index.html" class="btn btn-primary">Khám phá sách</a>
            </div>
        `;
        return;
    }

    let wishlistHtml = '';
    wishlist.forEach(bookId => {
        const book = window.BookDatabase.getBookById(bookId);
        if (book) {
            wishlistHtml += `
                <div class="product-card">
                    <div class="product-image">
                        <img src="${book.images[0]}" alt="${book.title}" loading="lazy">
                        <div class="product-overlay">
                            <button class="btn-icon" onclick="removeFromWishlist(${book.id})" title="Xóa khỏi yêu thích">
                                <i class="fas fa-heart-broken"></i>
                            </button>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${book.title}</h3>
                        <p class="product-author">${book.author}</p>
                        <div class="product-rating">
                            <div class="stars">
                                ${generateStars(book.rating)}
                            </div>
                            <span class="rating-text">(${book.reviews})</span>
                        </div>
                        <div class="product-price">
                            <span class="current-price">${formatPrice(book.price)}</span>
                            ${book.originalPrice ? `<span class="original-price">${formatPrice(book.originalPrice)}</span>` : ''}
                        </div>
                        <button class="btn btn-primary" onclick="addToCart(${book.id})">
                            <i class="fas fa-shopping-cart"></i>
                            Thêm vào giỏ
                        </button>
                    </div>
                </div>
            `;
        }
    });

    wishlistContainer.innerHTML = wishlistHtml;
}

function loadReviews() {
    const reviewsContainer = document.getElementById('reviewsList');
    const currentUser = getCurrentUser();
    
    if (!currentUser) return;

    const users = getUsers();
    const user = users.find(u => u.id === currentUser.id);
    const reviews = user ? user.reviews : [];
    
    if (reviews.length === 0) {
        reviewsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-star"></i>
                <h3>Chưa có đánh giá nào</h3>
                <p>Bạn chưa đánh giá sách nào. Hãy mua sách và đánh giá!</p>
                <a href="index.html" class="btn btn-primary">Mua sách ngay</a>
            </div>
        `;
        return;
    }

    let reviewsHtml = '';
    reviews.forEach(review => {
        const book = window.BookDatabase.getBookById(review.bookId);
        if (book) {
            reviewsHtml += `
                <div class="review-card">
                    <div class="review-header">
                        <img src="${book.images[0]}" alt="${book.title}" class="review-book-image">
                        <div class="review-book-info">
                            <h4>${book.title}</h4>
                            <p>${book.author}</p>
                        </div>
                        <div class="review-rating">
                            ${generateStars(review.rating)}
                        </div>
                    </div>
                    <div class="review-content">
                        <p>${review.comment}</p>
                        <div class="review-meta">
                            <span class="review-date">${formatDate(review.date)}</span>
                            <div class="review-actions">
                                <button class="btn-icon" onclick="editReview(${review.id})" title="Chỉnh sửa">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-icon" onclick="deleteReview(${review.id})" title="Xóa">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    });

    reviewsContainer.innerHTML = reviewsHtml;
}

function toggleEditMode(section) {
    const form = document.querySelector(`#${section} .profile-form`);
    const inputs = form.querySelectorAll('input, textarea');
    const editBtn = form.querySelector('.edit-btn');
    const saveBtn = form.querySelector('.btn-primary');
    const cancelBtn = form.querySelector('.btn-secondary');
    
    const isEditing = !inputs[0].readOnly;
    
    if (isEditing) {
        // Save changes
        saveProfile();
    } else {
        // Enter edit mode
        inputs.forEach(input => {
            input.readOnly = false;
            input.style.backgroundColor = 'var(--background-primary)';
        });
        
        editBtn.style.display = 'none';
        saveBtn.style.display = 'inline-flex';
        cancelBtn.style.display = 'inline-flex';
    }
}

function saveProfile() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const name = document.getElementById('editName').value;
    const phone = document.getElementById('editPhone').value;
    const email = document.getElementById('editEmail').value;
    const address = document.getElementById('editAddress').value;

    // Update user data
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        users[userIndex].name = name;
        users[userIndex].phone = phone;
        users[userIndex].email = email;
        users[userIndex].address = address;
        
        localStorage.setItem('bookshelf-users', JSON.stringify(users));
        
        // Update session
        const updatedUser = {
            ...currentUser,
            name: name,
            phone: phone,
            email: email,
            address: address
        };
        
        if (localStorage.getItem('bookshelf-user')) {
            localStorage.setItem('bookshelf-user', JSON.stringify(updatedUser));
        } else {
            sessionStorage.setItem('bookshelf-user', JSON.stringify(updatedUser));
        }
        
        // Update UI
        loadUserProfile();
        cancelEdit();
        
        showNotification('Cập nhật thông tin thành công!', 'success');
    }
}

function cancelEdit() {
    const form = document.querySelector('#personal-info .profile-form');
    const inputs = form.querySelectorAll('input, textarea');
    const editBtn = form.querySelector('.edit-btn');
    const saveBtn = form.querySelector('.btn-primary');
    const cancelBtn = form.querySelector('.btn-secondary');
    
    // Reset form
    loadUserProfile();
    
    inputs.forEach(input => {
        input.readOnly = true;
        input.style.backgroundColor = 'var(--background-light)';
    });
    
    editBtn.style.display = 'inline-flex';
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
}

function editAvatar() {
    showNotification('Chức năng đổi avatar sẽ được phát triển!', 'info');
}

function viewOrderDetails(orderId) {
    window.location.href = `order-success.html?id=${orderId}`;
}

function cancelOrder(orderId) {
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
        const orders = JSON.parse(localStorage.getItem('bookshelf-orders')) || [];
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = 'cancelled';
            localStorage.setItem('bookshelf-orders', JSON.stringify(orders));
            
            showNotification('Đã hủy đơn hàng thành công!', 'success');
            loadOrders();
        }
    }
}

function removeFromWishlist(bookId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        users[userIndex].wishlist = users[userIndex].wishlist.filter(id => id !== bookId);
        localStorage.setItem('bookshelf-users', JSON.stringify(users));
        
        showNotification('Đã xóa khỏi danh sách yêu thích!', 'success');
        loadWishlist();
    }
}

function editReview(reviewId) {
    showNotification('Chức năng chỉnh sửa đánh giá sẽ được phát triển!', 'info');
}

function deleteReview(reviewId) {
    if (confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
        const currentUser = getCurrentUser();
        if (!currentUser) return;

        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex].reviews = users[userIndex].reviews.filter(r => r.id !== reviewId);
            localStorage.setItem('bookshelf-users', JSON.stringify(users));
            
            showNotification('Đã xóa đánh giá thành công!', 'success');
            loadReviews();
        }
    }
}

function changePassword() {
    showNotification('Chức năng đổi mật khẩu sẽ được phát triển!', 'info');
}

function deleteAccount() {
    if (confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!')) {
        const currentUser = getCurrentUser();
        if (!currentUser) return;

        // Remove user from users list
        const users = getUsers();
        const updatedUsers = users.filter(u => u.id !== currentUser.id);
        localStorage.setItem('bookshelf-users', JSON.stringify(updatedUsers));
        
        // Clear user session
        localStorage.removeItem('bookshelf-user');
        sessionStorage.removeItem('bookshelf-user');
        
        showNotification('Đã xóa tài khoản thành công!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Chờ xử lý',
        'processing': 'Đang xử lý',
        'shipped': 'Đã giao hàng',
        'delivered': 'Đã nhận hàng',
        'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
