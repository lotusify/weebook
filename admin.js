// ========== SIMPLIFIED ADMIN DASHBOARD ========== //
// Basic admin information display for BookSelf

document.addEventListener('DOMContentLoaded', function() {
    // Check admin authentication
    if (!requireAdmin()) {
        return;
    }
    
    console.log('Admin dashboard loaded');
    initializeAdminDashboard();
});

// ========== ADMIN DASHBOARD INITIALIZATION ========== //
function initializeAdminDashboard() {
    // Initialize navigation
    initializeAdminNavigation();
    
    // Load dashboard data
    loadDashboardData();
    
    // Load initial section
    showSection('dashboard');
}

// ========== ADMIN NAVIGATION ========== //
function initializeAdminNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.dataset.section;
            showSection(section);
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Load section-specific data
        switch(sectionId) {
            case 'dashboard':
                loadDashboardData();
                break;
            case 'books':
                loadBooksData();
                break;
            case 'orders':
                loadOrdersData();
                break;
            case 'users':
                loadUsersData();
                break;
            case 'revenue':
                loadRevenueData();
                break;
        }
    }
}

// ========== DASHBOARD DATA ========== //
function loadDashboardData() {
    console.log('Loading dashboard data...');
    
    // Load stats
    loadDashboardStats();
    
    // Load recent orders
    loadRecentOrders();
}

function loadDashboardStats() {
    const orders = getOrders();
    const books = window.BookDatabase ? window.BookDatabase.getAllBooks() : [];
    
    // Update stats from real orders only
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('totalBooks').textContent = books.length;
    
    // Count unique users from orders (real users who actually placed orders)
    const uniqueUserIds = new Set(orders.map(order => order.userId).filter(Boolean));
    document.getElementById('totalUsers').textContent = uniqueUserIds.size;
    
    // Total revenue from real orders
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    document.getElementById('totalRevenue').textContent = formatPrice(totalRevenue);
}

function loadRecentOrders() {
    const orders = getOrders();
    const recentOrders = orders.slice(-5).reverse(); // Last 5 orders
    
    const tableBody = document.getElementById('recentOrdersTable');
    if (!tableBody) return;
    
    if (recentOrders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Chưa có đơn hàng nào</td></tr>';
        return;
    }
    
    // Helper to safely format dates
    const safeDate = (d) => {
        const dt = new Date(d || undefined);
        return isNaN(dt) ? '—' : dt.toLocaleDateString('vi-VN');
    };

    tableBody.innerHTML = recentOrders.map(order => {
        // Get customer info from real order structure
        const customerName = order.customerInfo?.name || 'Khách hàng';

        // Display first item or summary
        let itemsDisplay = 'Không có sản phẩm';
        if (Array.isArray(order.items) && order.items.length > 0) {
            if (order.items.length === 1) {
                const item = order.items[0];
                itemsDisplay = item.title || `Sách ID: ${item.bookId}`;
            } else {
                const totalQty = order.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
                itemsDisplay = `${order.items.length} loại sách (${totalQty} cuốn)`;
            }
        }

        // Format properly
        const totalText = formatPrice(order.total || 0);
        const statusText = getStatusText(order.status);
        const dateText = safeDate(order.createdAt || order.date);

        return `
            <tr>
                <td>#${String(order.id).padStart(6, '0')}</td>
                <td>${customerName}</td>
                <td>${itemsDisplay}</td>
                <td>${totalText}</td>
                <td><span class="status-badge status-${order.status}">${statusText}</span></td>
                <td>${dateText}</td>
            </tr>
        `;
    }).join('');
}

// ========== BOOKS MANAGEMENT ========== //
function loadBooksData() {
    if (!window.BookDatabase) {
        console.log('BookDatabase not available');
        return;
    }
    
    const books = window.BookDatabase.getAllBooks();
    const tableBody = document.getElementById('booksTable');
    
    if (!tableBody) return;
    
    if (books.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Chưa có sách nào</td></tr>';
        return;
    }
    
    tableBody.innerHTML = books.map(book => `
        <tr>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${window.BookDatabase.getCategoryName(book.category)}</td>
            <td>${formatPrice(book.price)}</td>
            <td>${book.stock}</td>
        </tr>
    `).join('');
}

// ========== ORDERS MANAGEMENT ========== //
let currentOrders = [];
let currentOrderId = null;

function loadOrdersData() {
    console.log('Loading orders data...');
    currentOrders = getOrders();
    const tableBody = document.getElementById('ordersTable');
    
    if (!tableBody) return;
    
    // Update order statistics
    updateOrderStats();
    
    if (currentOrders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Chưa có đơn hàng nào</td></tr>';
        return;
    }
    
    // Sort orders by date (newest first)
    const sortedOrders = [...currentOrders].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date);
        const dateB = new Date(b.createdAt || b.date);
        return dateB - dateA;
    });
    
    tableBody.innerHTML = sortedOrders.map(order => {
        // Get customer info from real order structure
        const customerName = order.customerInfo?.name || 'Khách hàng';
        const customerEmail = order.customerInfo?.email || '';
        const customerPhone = order.customerInfo?.phone || '';

        // Display items summary (show how many items types)
        let itemsDisplay = 'Không có sản phẩm';
        let totalQuantity = 0;
        if (Array.isArray(order.items) && order.items.length > 0) {
            totalQuantity = order.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
            if (order.items.length === 1) {
                const item = order.items[0];
                itemsDisplay = item.title || `Sách ID: ${item.bookId}`;
            } else {
                itemsDisplay = `${order.items.length} loại sách (${totalQuantity} cuốn)`;
            }
        }

        // Format date
        const dt = new Date(order.createdAt || order.date);
        const dateText = isNaN(dt) ? '—' : dt.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Format total price
        const totalText = formatPrice(order.total || 0);

        return `
            <tr>
                <td>#${String(order.id).padStart(6, '0')}</td>
                <td>
                    <div><strong>${customerName}</strong></div>
                    <div style="font-size: 0.85em; color: #666;">
                        ${customerEmail}<br/>
                        ${customerPhone}
                    </div>
                </td>
                <td>${itemsDisplay}</td>
                <td>${totalQuantity}</td>
                <td>${totalText}</td>
                <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
                <td>${dateText}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewOrderDetails(${order.id})" title="Xem chi tiết">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-success" onclick="quickUpdateStatus(${order.id})" title="Cập nhật trạng thái">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function updateOrderStats() {
    const totalOrders = currentOrders.length;
    const pendingOrders = currentOrders.filter(order => order.status === 'pending').length;
    const processingOrders = currentOrders.filter(order => order.status === 'processing').length;
    
    document.getElementById('totalOrdersCount').textContent = totalOrders;
    document.getElementById('pendingOrdersCount').textContent = pendingOrders;
    document.getElementById('processingOrdersCount').textContent = processingOrders;
}

function filterOrders() {
    const searchTerm = document.getElementById('orderSearch').value.toLowerCase();
    const statusFilter = document.getElementById('orderStatus').value;
    const dateFrom = document.getElementById('orderDateFrom').value;
    const dateTo = document.getElementById('orderDateTo').value;
    
    let filteredOrders = [...currentOrders];
    
    // Filter by search term
    if (searchTerm) {
        filteredOrders = filteredOrders.filter(order => 
            order.customerName.toLowerCase().includes(searchTerm) ||
            order.customerEmail.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filter by status
    if (statusFilter) {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }
    
    // Filter by date range
    if (dateFrom) {
        filteredOrders = filteredOrders.filter(order => new Date(order.date) >= new Date(dateFrom));
    }
    if (dateTo) {
        filteredOrders = filteredOrders.filter(order => new Date(order.date) <= new Date(dateTo));
    }
    
    // Update table
    const tableBody = document.getElementById('ordersTable');
    if (!tableBody) return;
    
    if (filteredOrders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Không tìm thấy đơn hàng nào</td></tr>';
        return;
    }
    
    // Sort filtered orders by date (newest first)
    const sortedOrders = filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    tableBody.innerHTML = sortedOrders.map(order => {
        const book = window.BookDatabase ? window.BookDatabase.getBookById(order.bookId) : null;
        const bookTitle = book ? book.title : 'Sách không tồn tại';
        
        return `
            <tr>
                <td>#${order.id}</td>
                <td>${order.customerName}</td>
                <td>${bookTitle}</td>
                <td>${order.quantity}</td>
                <td>${formatPrice(order.total)}</td>
                <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
                <td>${new Date(order.date).toLocaleDateString('vi-VN')}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewOrderDetails(${order.id})" title="Xem chi tiết">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-success" onclick="quickUpdateStatus(${order.id})" title="Cập nhật trạng thái">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function refreshOrders() {
    // Clear filters
    document.getElementById('orderSearch').value = '';
    document.getElementById('orderStatus').value = '';
    document.getElementById('orderDateFrom').value = '';
    document.getElementById('orderDateTo').value = '';
    
    // Reload orders
    loadOrdersData();
    showNotification('Đã làm mới danh sách đơn hàng!', 'success');
}

function viewOrderDetails(orderId) {
    const order = currentOrders.find(o => o.id === orderId);
    if (!order) {
        showNotification('Không tìm thấy đơn hàng!', 'error');
        return;
    }
    
    currentOrderId = orderId;
    
    // Fill modal with order details
    document.getElementById('orderDetailsId').textContent = order.id;
    document.getElementById('orderId').textContent = order.id;
    document.getElementById('orderDate').textContent = new Date(order.date).toLocaleDateString('vi-VN');
    document.getElementById('orderTotal').textContent = formatPrice(order.total);
    document.getElementById('customerName').textContent = order.customerName;
    document.getElementById('customerEmail').textContent = order.customerEmail;
    document.getElementById('customerPhone').textContent = order.customerPhone || 'Chưa cập nhật';
    
    // Update status badge
    const statusElement = document.getElementById('orderStatus');
    statusElement.textContent = getStatusText(order.status);
    statusElement.className = `status-badge status-${order.status}`;
    
    // Set current status in select
    document.getElementById('newOrderStatus').value = order.status;
    
    // Load order items (support items[] or legacy bookId)
    const orderItems = document.getElementById('orderItems');
    if (!orderItems) return;

    if (Array.isArray(order.items) && order.items.length > 0) {
        orderItems.innerHTML = order.items.map(item => {
            const id = item.bookId || item.id || item.productId;
            const book = window.BookDatabase ? window.BookDatabase.getBookById(id) : null;
            const img = (book && book.images && book.images[0]) || item.image || 'images/logo.png.bak';
            const title = (book && book.title) || item.title || 'Sách không tồn tại';
            const author = (book && book.author) || item.author || '';
            const qty = item.quantity || item.qty || 1;
            const price = formatPrice(item.total || (book && book.price) || item.price || 0);

            return `
                <div class="order-item">
                    <div class="item-image">
                        <img src="${img}" alt="${title}">
                    </div>
                    <div class="item-details">
                        <h4>${title}</h4>
                        <p>Tác giả: ${author}</p>
                        <p>Số lượng: ${qty}</p>
                        <p>Giá: ${price}</p>
                    </div>
                    <div class="item-total">
                        <strong>${price}</strong>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        // Legacy single-book order shape
        const book = window.BookDatabase ? window.BookDatabase.getBookById(order.bookId) : null;
        if (book) {
            orderItems.innerHTML = `
                <div class="order-item">
                    <div class="item-image">
                        <img src="${book.images[0]}" alt="${book.title}">
                    </div>
                    <div class="item-details">
                        <h4>${book.title}</h4>
                        <p>Tác giả: ${book.author}</p>
                        <p>Số lượng: ${order.quantity || 1}</p>
                        <p>Giá: ${formatPrice(book.price)}</p>
                    </div>
                    <div class="item-total">
                        <strong>${formatPrice(order.total)}</strong>
                    </div>
                </div>
            `;
        } else {
            orderItems.innerHTML = '<p>Sản phẩm không tồn tại</p>';
        }
    }
    
    // Show modal
    document.getElementById('orderDetailsModal').style.display = 'block';
}

function quickUpdateStatus(orderId) {
    const order = currentOrders.find(o => o.id === orderId);
    if (!order) {
        showNotification('Không tìm thấy đơn hàng!', 'error');
        return;
    }
    
    // Create quick status update modal
    const statusModal = document.createElement('div');
    statusModal.className = 'modal';
    statusModal.style.display = 'block';
    statusModal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h2>Cập nhật trạng thái đơn hàng #${orderId}</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Trạng thái hiện tại: <strong>${getStatusText(order.status)}</strong></label>
                </div>
                <div class="form-group">
                    <label for="quickNewStatus">Trạng thái mới:</label>
                    <select id="quickNewStatus" class="filter-select">
                        <option value="pending">Chờ xử lý</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="shipped">Đã giao</option>
                        <option value="delivered">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Hủy</button>
                <button class="btn btn-primary" onclick="confirmQuickStatusUpdate(${orderId})">Cập nhật</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(statusModal);
    
    // Set current status as selected
    document.getElementById('quickNewStatus').value = order.status;
}

function confirmQuickStatusUpdate(orderId) {
    const newStatus = document.getElementById('quickNewStatus').value;
    
    if (!newStatus) {
        showNotification('Vui lòng chọn trạng thái mới!', 'error');
        return;
    }
    
    updateOrderStatusInDatabase(orderId, newStatus, 'Cập nhật trạng thái nhanh');
    
    // Close modal
    document.querySelector('.modal').remove();
}

function updateOrderStatus() {
    const newStatus = document.getElementById('newOrderStatus').value;
    const statusNote = document.getElementById('statusNote').value;
    
    if (!newStatus) {
        showNotification('Vui lòng chọn trạng thái mới!', 'error');
        return;
    }
    
    updateOrderStatusInDatabase(currentOrderId, newStatus, statusNote);
    
    // Close modal
    closeModal('orderDetailsModal');
}

function updateOrderStatusInDatabase(orderId, newStatus, note) {
    const orders = getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        orders[orderIndex].statusHistory = orders[orderIndex].statusHistory || [];
        orders[orderIndex].statusHistory.push({
            status: newStatus,
            date: new Date().toISOString(),
            note: note || '',
            updatedBy: 'admin'
        });
        
        localStorage.setItem('bookself-orders', JSON.stringify(orders));
        
        // Dispatch storage event for cross-tab synchronization
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'bookself-orders',
            oldValue: null,
            newValue: JSON.stringify(orders),
            storageArea: localStorage
        }));
        
        showNotification(`Cập nhật trạng thái đơn hàng #${orderId} thành công!`, 'success');
        
        // Reload data
        loadOrdersData();
    } else {
        showNotification('Không tìm thấy đơn hàng!', 'error');
    }
}

// ========== USERS MANAGEMENT ========== //
function loadUsersData() {
    const users = getUsers();
    const tableBody = document.getElementById('usersTable');
    
    if (!tableBody) return;
    
    if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Chưa có người dùng nào</td></tr>';
        return;
    }
    
    tableBody.innerHTML = users.map(user => {
        const userOrders = getOrders().filter(order => order.customerEmail === user.email);
        
        return `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                <td>${userOrders.length}</td>
            </tr>
        `;
    }).join('');
}

// ========== REVENUE MANAGEMENT ========== //
function loadRevenueData() {
    const orders = getOrders();
    
    // Calculate revenue stats
    const today = new Date().toDateString();
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    const todayRevenue = orders
        .filter(order => new Date(order.date).toDateString() === today)
        .reduce((sum, order) => sum + order.total, 0);
    
    const monthRevenue = orders
        .filter(order => new Date(order.date).getMonth() === thisMonth && new Date(order.date).getFullYear() === thisYear)
        .reduce((sum, order) => sum + order.total, 0);
    
    const yearRevenue = orders
        .filter(order => new Date(order.date).getFullYear() === thisYear)
        .reduce((sum, order) => sum + order.total, 0);
    
    // Update revenue displays
    document.getElementById('todayRevenue').textContent = formatPrice(todayRevenue);
    document.getElementById('monthRevenue').textContent = formatPrice(monthRevenue);
    document.getElementById('yearRevenue').textContent = formatPrice(yearRevenue);
}

// ========== UTILITY FUNCTIONS ========== //
function getOrders() {
    // Get real orders from localStorage (no more sample data)
    const orders = JSON.parse(localStorage.getItem('bookself-orders')) || [];
    return orders;
}

function getUsers() {
    // Get real users from localStorage only (no sample data)
    const users = JSON.parse(localStorage.getItem('bookself-users')) || [];
    return users;
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

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const iconMap = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="fas ${iconMap[type] || iconMap['info']}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    });
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Export functions for global access
if (typeof window !== 'undefined') {
    window.showSection = showSection;
    window.filterOrders = filterOrders;
    window.refreshOrders = refreshOrders;
    window.viewOrderDetails = viewOrderDetails;
    window.quickUpdateStatus = quickUpdateStatus;
    window.confirmQuickStatusUpdate = confirmQuickStatusUpdate;
    window.updateOrderStatus = updateOrderStatus;
    window.closeModal = closeModal;
    window.showNotification = showNotification;
}