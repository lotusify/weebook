// ========== ORDERS MANAGEMENT ========== //
// Order management and tracking system

document.addEventListener('DOMContentLoaded', function() {
    initializeOrders();
});

function initializeOrders() {
    // Check if user is logged in
    if (!isLoggedIn()) {
        showNotification('Vui lòng đăng nhập để xem đơn hàng!', 'error');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1500);
        return;
    }

    // Load orders
    loadOrders();
    
    // Initialize filters
    initializeFilters();
}

function loadOrders(statusFilter = 'all', timeFilter = 'all') {
    const currentUser = getCurrentUser();
    const orders = JSON.parse(localStorage.getItem('bookself-orders')) || [];
    const userOrders = orders.filter(order => order.userId === currentUser.id);
    
    // Apply status filter
    let filteredOrders = userOrders;
    if (statusFilter !== 'all') {
        filteredOrders = userOrders.filter(order => order.status === statusFilter);
    }
    
    // Apply time filter
    if (timeFilter !== 'all') {
        const now = new Date();
        const filterDate = new Date();
        
        switch(timeFilter) {
            case '7days':
                filterDate.setDate(now.getDate() - 7);
                break;
            case '30days':
                filterDate.setDate(now.getDate() - 30);
                break;
            case '90days':
                filterDate.setDate(now.getDate() - 90);
                break;
            case '1year':
                filterDate.setFullYear(now.getFullYear() - 1);
                break;
        }
        
        filteredOrders = filteredOrders.filter(order => new Date(order.createdAt) >= filterDate);
    }
    
    // Sort by newest first
    filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Update statistics
    updateOrderStats(userOrders);
    
    // Render orders
    renderOrders(filteredOrders);
}

function updateOrderStats(orders) {
    const stats = {
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length
    };
    
    document.getElementById('pendingCount').textContent = stats.pending;
    document.getElementById('processingCount').textContent = stats.processing;
    document.getElementById('shippedCount').textContent = stats.shipped;
    document.getElementById('deliveredCount').textContent = stats.delivered;
}

function renderOrders(orders) {
    const ordersContainer = document.getElementById('ordersList');
    
    if (orders.length === 0) {
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
    orders.forEach(order => {
        const statusClass = `status-${order.status}`;
        const statusText = getStatusText(order.status);
        const statusIcon = getStatusIcon(order.status);
        
        ordersHtml += `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-info">
                        <div class="order-id">
                            <h3>Đơn hàng #${order.id.toString().padStart(6, '0')}</h3>
                            <span class="order-date">${formatDate(order.createdAt)}</span>
                        </div>
                        <div class="order-status">
                            <div class="status-badge ${statusClass}">
                                <i class="${statusIcon}"></i>
                                <span>${statusText}</span>
                            </div>
                        </div>
                    </div>
                    <div class="order-total">
                        <span>Tổng cộng:</span>
                        <span class="total-price">${formatPrice(order.total)}</span>
                    </div>
                </div>
                
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.title}" class="item-image">
                            <div class="item-details">
                                <h4>${item.title}</h4>
                                <p>${item.author}</p>
                                <span class="item-quantity">Số lượng: ${item.quantity}</span>
                            </div>
                            <div class="item-price">${formatPrice(item.total)}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="order-footer">
                    <div class="order-details">
                        <div class="detail-item">
                            <span class="label">Phương thức thanh toán:</span>
                            <span class="value">${getPaymentMethodText(order.paymentMethod)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Phương thức giao hàng:</span>
                            <span class="value">${getDeliveryMethodText(order.deliveryMethod)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Địa chỉ giao hàng:</span>
                            <span class="value">${order.customerInfo.address}, ${getCityText(order.customerInfo.city)}</span>
                        </div>
                    </div>
                    
                    <div class="order-actions">
                        <button class="btn btn-secondary" onclick="viewOrderDetails(${order.id})">
                            <i class="fas fa-eye"></i>
                            Xem chi tiết
                        </button>
                        ${getOrderActions(order)}
                    </div>
                </div>
            </div>
        `;
    });
    
    ordersContainer.innerHTML = ordersHtml;
}

function getOrderActions(order) {
    let actions = '';
    
    switch(order.status) {
        case 'pending':
            actions += `
                <button class="btn btn-danger" onclick="cancelOrder(${order.id})">
                    <i class="fas fa-times"></i>
                    Hủy đơn
                </button>
            `;
            break;
        case 'delivered':
            actions += `
                <button class="btn btn-primary" onclick="reorder(${order.id})">
                    <i class="fas fa-redo"></i>
                    Đặt lại
                </button>
            `;
            break;
    }
    
    return actions;
}

function initializeFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const timeFilter = document.getElementById('timeFilter');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', () => {
            const status = statusFilter.value;
            const time = timeFilter.value;
            loadOrders(status, time);
        });
    }
    
    if (timeFilter) {
        timeFilter.addEventListener('change', () => {
            const status = statusFilter.value;
            const time = timeFilter.value;
            loadOrders(status, time);
        });
    }
}

function viewOrderDetails(orderId) {
    window.location.href = `order-success.html?id=${orderId}`;
}

function cancelOrder(orderId) {
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
        const orders = JSON.parse(localStorage.getItem('bookself-orders')) || [];
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = 'cancelled';
            orders[orderIndex].cancelledAt = new Date().toISOString();
            localStorage.setItem('bookself-orders', JSON.stringify(orders));
            
            showNotification('Đã hủy đơn hàng thành công!', 'success');
            loadOrders();
        }
    }
}

function reorder(orderId) {
    const orders = JSON.parse(localStorage.getItem('bookself-orders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        showNotification('Không tìm thấy đơn hàng!', 'error');
        return;
    }
    
    // Add items to cart
    let cart = JSON.parse(localStorage.getItem('bookself-cart')) || [];
    
    order.items.forEach(item => {
        const existingItem = cart.find(cartItem => cartItem.id === item.bookId);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            cart.push({
                id: item.bookId,
                quantity: item.quantity,
                addedAt: new Date().toISOString()
            });
        }
    });
    
    localStorage.setItem('bookself-cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDropdown();
    
    showNotification('Đã thêm sản phẩm vào giỏ hàng!', 'success');
    
    // Redirect to cart or checkout
    setTimeout(() => {
        if (confirm('Bạn có muốn thanh toán ngay không?')) {
            window.location.href = 'checkout.html';
        } else {
            window.location.href = 'index.html';
        }
    }, 1500);
}

// Utility functions
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

function getStatusIcon(status) {
    const iconMap = {
        'pending': 'fas fa-clock',
        'processing': 'fas fa-box',
        'shipped': 'fas fa-truck',
        'delivered': 'fas fa-check-circle',
        'cancelled': 'fas fa-times-circle'
    };
    return iconMap[status] || 'fas fa-question-circle';
}

function getPaymentMethodText(method) {
    const methodMap = {
        'cod': 'Thanh toán khi nhận hàng (COD)',
        'bank': 'Chuyển khoản ngân hàng',
        'momo': 'Ví MoMo'
    };
    return methodMap[method] || method;
}

function getDeliveryMethodText(method) {
    const methodMap = {
        'standard': 'Giao hàng tiêu chuẩn',
        'express': 'Giao hàng nhanh'
    };
    return methodMap[method] || method;
}

function getCityText(city) {
    const cityMap = {
        'hanoi': 'Hà Nội',
        'hcm': 'TP. Hồ Chí Minh',
        'danang': 'Đà Nẵng',
        'haiphong': 'Hải Phòng',
        'cantho': 'Cần Thơ'
    };
    return cityMap[city] || city;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
