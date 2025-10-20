// ========== ADMIN DASHBOARD FUNCTIONALITY ========== //
// Complete admin management system for BookSelf

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
    
    // Initialize charts
    initializeCharts();
    
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
            case 'promotions':
                loadPromotionsData();
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
    
    // Initialize charts
    setTimeout(() => {
        initializeCharts();
    }, 100);
}

function loadDashboardStats() {
    if (!window.BookDatabase) {
        console.log('BookDatabase not available');
        return;
    }
    
    // Total books
    const totalBooks = window.BookDatabase.getAllBooks().length;
    document.getElementById('totalBooks').textContent = totalBooks;
    
    // Total orders (from localStorage)
    const orders = getOrders();
    document.getElementById('totalOrders').textContent = orders.length;
    
    // Total users (from localStorage)
    const users = getUsers();
    document.getElementById('totalUsers').textContent = users.length;
    
    // Total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
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
    
    tableBody.innerHTML = recentOrders.map(order => {
        const book = window.BookDatabase ? window.BookDatabase.getBookById(order.bookId) : null;
        const bookTitle = book ? book.title : 'Sách không tồn tại';
        
        return `
            <tr>
                <td>#${order.id}</td>
                <td>${order.customerName}</td>
                <td>${bookTitle}</td>
                <td>${formatPrice(order.total)}</td>
                <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
                <td>${new Date(order.date).toLocaleDateString('vi-VN')}</td>
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
        tableBody.innerHTML = '<tr><td colspan="9" class="text-center">Chưa có sách nào</td></tr>';
        return;
    }
    
    tableBody.innerHTML = books.map(book => `
        <tr>
            <td>${book.id}</td>
            <td><img src="${book.images[0]}" alt="${book.title}" class="table-image"></td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${window.BookDatabase.getCategoryName(book.category)}</td>
            <td>${formatPrice(book.price)}</td>
            <td>${book.stock}</td>
            <td><span class="status-badge ${book.stock > 0 ? 'status-active' : 'status-inactive'}">${book.stock > 0 ? 'Còn hàng' : 'Hết hàng'}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editBook(${book.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteBook(${book.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function filterBooks() {
    const searchTerm = document.getElementById('bookSearch').value.toLowerCase();
    const category = document.getElementById('bookCategory').value;
    
    if (!window.BookDatabase) return;
    
    let books = window.BookDatabase.getAllBooks();
    
    // Filter by search term
    if (searchTerm) {
        books = books.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filter by category
    if (category) {
        books = books.filter(book => book.category === category);
    }
    
    // Update table
    const tableBody = document.getElementById('booksTable');
    if (!tableBody) return;
    
    tableBody.innerHTML = books.map(book => `
        <tr>
            <td>${book.id}</td>
            <td><img src="${book.images[0]}" alt="${book.title}" class="table-image"></td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${window.BookDatabase.getCategoryName(book.category)}</td>
            <td>${formatPrice(book.price)}</td>
            <td>${book.stock}</td>
            <td><span class="status-badge ${book.stock > 0 ? 'status-active' : 'status-inactive'}">${book.stock > 0 ? 'Còn hàng' : 'Hết hàng'}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editBook(${book.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteBook(${book.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function showAddBookModal() {
    document.getElementById('addBookModal').style.display = 'block';
}

function addBook() {
    const form = document.getElementById('addBookForm');
    const formData = new FormData(form);
    
    // Get the next available ID
    const books = window.BookDatabase.getAllBooks();
    const nextId = Math.max(...books.map(b => b.id)) + 1;
    
    const newBook = {
        id: nextId,
        title: formData.get('title'),
        author: formData.get('author'),
        publisher: formData.get('publisher'),
        publishDate: new Date().toISOString().split('T')[0],
        category: formData.get('category'),
        subcategory: formData.get('subcategory'),
        price: parseInt(formData.get('price')),
        originalPrice: parseInt(formData.get('originalPrice')) || parseInt(formData.get('price')),
        discount: 0,
        isbn: `978-${Math.floor(Math.random() * 1000000000000)}`,
        pages: Math.floor(Math.random() * 500) + 100,
        language: "Tiếng Việt",
        format: "Bìa mềm",
        weight: "400g",
        dimensions: "20.5 x 14.5 x 2.2 cm",
        stock: parseInt(formData.get('stock')),
        rating: 4.0,
        reviewCount: 0,
        images: formData.get('images').split(',').map(img => img.trim()).filter(img => img),
        description: formData.get('description'),
        tags: [],
        featured: false,
        newRelease: true
    };
    
    // Add to database (in a real app, this would be sent to server)
    if (newBook.images.length === 0) {
        newBook.images = ['images/book-tlch-1.jpg']; // Default image
    }
    
    // For demo purposes, we'll add to localStorage
    const existingBooks = JSON.parse(localStorage.getItem('bookself-admin-books')) || [];
    existingBooks.push(newBook);
    localStorage.setItem('bookself-admin-books', JSON.stringify(existingBooks));
    
    showNotification('Thêm sách thành công!', 'success');
    closeModal('addBookModal');
    form.reset();
    loadBooksData();
}

function editBook(bookId) {
    if (!window.BookDatabase) {
        showNotification('Không thể tải dữ liệu sách!', 'error');
        return;
    }
    
    const book = window.BookDatabase.getBookById(bookId);
    if (!book) {
        showNotification('Không tìm thấy sách!', 'error');
        return;
    }
    
    // Fill form with existing data
    document.getElementById('bookTitle').value = book.title;
    document.getElementById('bookAuthor').value = book.author;
    document.getElementById('bookPublisher').value = book.publisher || '';
    document.getElementById('bookCategory').value = book.category;
    document.getElementById('bookSubcategory').value = book.subcategory || '';
    document.getElementById('bookPrice').value = book.price;
    document.getElementById('bookOriginalPrice').value = book.originalPrice || book.price;
    document.getElementById('bookStock').value = book.stock;
    document.getElementById('bookDescription').value = book.description || '';
    document.getElementById('bookImages').value = book.images.join(', ');
    
    // Change modal title and button
    document.querySelector('#addBookModal .modal-header h2').textContent = 'Chỉnh sửa sách';
    document.querySelector('#addBookModal .modal-footer .btn-primary').textContent = 'Cập nhật sách';
    document.querySelector('#addBookModal .modal-footer .btn-primary').onclick = () => updateBook(bookId);
    
    // Show modal
    document.getElementById('addBookModal').style.display = 'block';
}

function updateBook(bookId) {
    const form = document.getElementById('addBookForm');
    const formData = new FormData(form);
    
    if (!window.BookDatabase) {
        showNotification('Không thể tải dữ liệu sách!', 'error');
        return;
    }
    
    const book = window.BookDatabase.getBookById(bookId);
    if (!book) {
        showNotification('Không tìm thấy sách!', 'error');
        return;
    }
    
    // Update book data
    book.title = formData.get('title');
    book.author = formData.get('author');
    book.publisher = formData.get('publisher');
    book.category = formData.get('category');
    book.subcategory = formData.get('subcategory');
    book.price = parseInt(formData.get('price'));
    book.originalPrice = parseInt(formData.get('originalPrice')) || parseInt(formData.get('price'));
    book.stock = parseInt(formData.get('stock'));
    book.description = formData.get('description');
    book.images = formData.get('images').split(',').map(img => img.trim()).filter(img => img);
    
    if (book.images.length === 0) {
        book.images = ['images/book-tlch-1.jpg']; // Default image
    }
    
    // Update in localStorage
    const existingBooks = JSON.parse(localStorage.getItem('bookself-admin-books')) || [];
    const bookIndex = existingBooks.findIndex(b => b.id === bookId);
    if (bookIndex !== -1) {
        existingBooks[bookIndex] = book;
        localStorage.setItem('bookself-admin-books', JSON.stringify(existingBooks));
    }
    
    showNotification('Cập nhật sách thành công!', 'success');
    closeModal('addBookModal');
    form.reset();
    
    // Reset modal title and button
    document.querySelector('#addBookModal .modal-header h2').textContent = 'Thêm sách mới';
    document.querySelector('#addBookModal .modal-footer .btn-primary').textContent = 'Thêm sách';
    document.querySelector('#addBookModal .modal-footer .btn-primary').onclick = addBook;
    
    loadBooksData();
}

function deleteBook(bookId) {
    if (!confirm('Bạn có chắc chắn muốn xóa sách này? Hành động này không thể hoàn tác!')) {
        return;
    }
    
    if (!window.BookDatabase) {
        showNotification('Không thể tải dữ liệu sách!', 'error');
        return;
    }
    
    const book = window.BookDatabase.getBookById(bookId);
    if (!book) {
        showNotification('Không tìm thấy sách!', 'error');
        return;
    }
    
    // Remove from localStorage
    const existingBooks = JSON.parse(localStorage.getItem('bookself-admin-books')) || [];
    const updatedBooks = existingBooks.filter(b => b.id !== bookId);
    localStorage.setItem('bookself-admin-books', JSON.stringify(updatedBooks));
    
    showNotification(`Đã xóa sách "${book.title}" thành công!`, 'success');
    loadBooksData();
}

// ========== ORDERS MANAGEMENT ========== //
function loadOrdersData() {
    const orders = getOrders();
    const tableBody = document.getElementById('ordersTable');
    
    if (!tableBody) return;
    
    if (orders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Chưa có đơn hàng nào</td></tr>';
        return;
    }
    
    tableBody.innerHTML = orders.map(order => {
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
                    <button class="btn btn-sm btn-primary" onclick="updateOrderStatus(${order.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function filterOrders() {
    const status = document.getElementById('orderStatus').value;
    const dateFrom = document.getElementById('orderDateFrom').value;
    const dateTo = document.getElementById('orderDateTo').value;
    
    let orders = getOrders();
    
    // Filter by status
    if (status) {
        orders = orders.filter(order => order.status === status);
    }
    
    // Filter by date range
    if (dateFrom) {
        orders = orders.filter(order => new Date(order.date) >= new Date(dateFrom));
    }
    if (dateTo) {
        orders = orders.filter(order => new Date(order.date) <= new Date(dateTo));
    }
    
    // Update table
    const tableBody = document.getElementById('ordersTable');
    if (!tableBody) return;
    
    tableBody.innerHTML = orders.map(order => {
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
                    <button class="btn btn-sm btn-primary" onclick="updateOrderStatus(${order.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function updateOrderStatus(orderId) {
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        showNotification('Không tìm thấy đơn hàng!', 'error');
        return;
    }
    
    // Create status selection modal
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
                    <label for="newStatus">Trạng thái mới:</label>
                    <select id="newStatus" class="filter-select">
                        <option value="pending">Chờ xử lý</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="shipped">Đã giao</option>
                        <option value="delivered">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="statusNote">Ghi chú (tùy chọn):</label>
                    <textarea id="statusNote" rows="3" placeholder="Nhập ghi chú về việc thay đổi trạng thái..."></textarea>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Hủy</button>
                <button class="btn btn-primary" onclick="confirmStatusUpdate(${orderId})">Cập nhật</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(statusModal);
    
    // Set current status as selected
    document.getElementById('newStatus').value = order.status;
}

function confirmStatusUpdate(orderId) {
    const newStatus = document.getElementById('newStatus').value;
    const statusNote = document.getElementById('statusNote').value;
    
    if (!newStatus) {
        showNotification('Vui lòng chọn trạng thái mới!', 'error');
        return;
    }
    
    // Update order status
    const orders = getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        orders[orderIndex].statusHistory = orders[orderIndex].statusHistory || [];
        orders[orderIndex].statusHistory.push({
            status: newStatus,
            date: new Date().toISOString(),
            note: statusNote
        });
        
        localStorage.setItem('bookself-orders', JSON.stringify(orders));
        
        showNotification(`Cập nhật trạng thái đơn hàng #${orderId} thành công!`, 'success');
        
        // Close modal
        document.querySelector('.modal').remove();
        
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
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Chưa có người dùng nào</td></tr>';
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
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewUserDetails(${user.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function filterUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    let users = getUsers();
    
    if (searchTerm) {
        users = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
    }
    
    // Update table
    const tableBody = document.getElementById('usersTable');
    if (!tableBody) return;
    
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
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewUserDetails(${user.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function viewUserDetails(userId) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        showNotification('Không tìm thấy người dùng!', 'error');
        return;
    }
    
    const userOrders = getOrders().filter(order => order.customerEmail === user.email);
    const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
    
    // Create user details modal
    const userModal = document.createElement('div');
    userModal.className = 'modal';
    userModal.style.display = 'block';
    userModal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2>Chi tiết người dùng #${user.id}</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="user-details-grid">
                    <div class="user-info-section">
                        <h3>Thông tin cá nhân</h3>
                        <div class="info-item">
                            <label>Tên:</label>
                            <span>${user.name}</span>
                        </div>
                        <div class="info-item">
                            <label>Email:</label>
                            <span>${user.email}</span>
                        </div>
                        <div class="info-item">
                            <label>Số điện thoại:</label>
                            <span>${user.phone || 'Chưa cập nhật'}</span>
                        </div>
                        <div class="info-item">
                            <label>Ngày đăng ký:</label>
                            <span>${new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                    </div>
                    
                    <div class="user-stats-section">
                        <h3>Thống kê mua hàng</h3>
                        <div class="stat-item">
                            <label>Tổng đơn hàng:</label>
                            <span>${userOrders.length}</span>
                        </div>
                        <div class="stat-item">
                            <label>Tổng chi tiêu:</label>
                            <span>${formatPrice(totalSpent)}</span>
                        </div>
                        <div class="stat-item">
                            <label>Đơn hàng gần nhất:</label>
                            <span>${userOrders.length > 0 ? new Date(userOrders[userOrders.length - 1].date).toLocaleDateString('vi-VN') : 'Chưa có'}</span>
                        </div>
                    </div>
                </div>
                
                ${userOrders.length > 0 ? `
                <div class="user-orders-section">
                    <h3>Lịch sử đơn hàng</h3>
                    <div class="table-container">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th>Tổng tiền</th>
                                    <th>Trạng thái</th>
                                    <th>Ngày</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${userOrders.map(order => {
                                    const book = window.BookDatabase ? window.BookDatabase.getBookById(order.bookId) : null;
                                    const bookTitle = book ? book.title : 'Sách không tồn tại';
                                    return `
                                        <tr>
                                            <td>#${order.id}</td>
                                            <td>${bookTitle}</td>
                                            <td>${order.quantity}</td>
                                            <td>${formatPrice(order.total)}</td>
                                            <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
                                            <td>${new Date(order.date).toLocaleDateString('vi-VN')}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                ` : '<p class="text-center">Người dùng chưa có đơn hàng nào.</p>'}
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Đóng</button>
                <button class="btn btn-danger" onclick="deleteUser(${userId}); this.closest('.modal').remove();">Xóa người dùng</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(userModal);
}

function deleteUser(userId) {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác!')) {
        return;
    }
    
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        showNotification('Không tìm thấy người dùng!', 'error');
        return;
    }
    
    // Check if user has orders
    const userOrders = getOrders().filter(order => order.customerEmail === user.email);
    if (userOrders.length > 0) {
        if (!confirm(`Người dùng này có ${userOrders.length} đơn hàng. Bạn có chắc chắn muốn xóa?`)) {
            return;
        }
    }
    
    // Remove user
    const updatedUsers = users.filter(u => u.id !== userId);
    localStorage.setItem('bookself-users', JSON.stringify(updatedUsers));
    
    showNotification(`Đã xóa người dùng "${user.name}" thành công!`, 'success');
    loadUsersData();
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
    
    // Initialize detailed revenue chart
    setTimeout(() => {
        initializeDetailedRevenueChart();
    }, 100);
}

function initializeDetailedRevenueChart() {
    const ctx = document.getElementById('detailedRevenueChart');
    if (!ctx) return;
    
    const orders = getOrders();
    const monthlyRevenue = {};
    
    // Calculate monthly revenue
    orders.forEach(order => {
        const month = new Date(order.date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short' });
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.total;
    });
    
    const labels = Object.keys(monthlyRevenue).sort();
    const data = labels.map(label => monthlyRevenue[label]);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Doanh thu (₫)',
                data: data,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatPrice(value);
                        }
                    }
                }
            }
        }
    });
}

// ========== PROMOTIONS MANAGEMENT ========== //
function loadPromotionsData() {
    const promotions = getPromotions();
    const tableBody = document.getElementById('promotionsTable');
    
    if (!tableBody) return;
    
    if (promotions.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center">Chưa có ưu đãi nào</td></tr>';
        return;
    }
    
    tableBody.innerHTML = promotions.map(promotion => {
        const isActive = new Date() >= new Date(promotion.startDate) && new Date() <= new Date(promotion.endDate);
        
        return `
            <tr>
                <td>${promotion.id}</td>
                <td>${promotion.name}</td>
                <td>${promotion.type === 'percentage' ? 'Phần trăm' : 'Giá cố định'}</td>
                <td>${promotion.type === 'percentage' ? promotion.value + '%' : formatPrice(promotion.value)}</td>
                <td>${new Date(promotion.startDate).toLocaleDateString('vi-VN')}</td>
                <td>${new Date(promotion.endDate).toLocaleDateString('vi-VN')}</td>
                <td><span class="status-badge ${isActive ? 'status-active' : 'status-inactive'}">${isActive ? 'Đang hoạt động' : 'Không hoạt động'}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editPromotion(${promotion.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deletePromotion(${promotion.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function showAddPromotionModal() {
    document.getElementById('addPromotionModal').style.display = 'block';
}

function addPromotion() {
    const form = document.getElementById('addPromotionForm');
    const formData = new FormData(form);
    
    const promotions = getPromotions();
    const nextId = promotions.length > 0 ? Math.max(...promotions.map(p => p.id)) + 1 : 1;
    
    const newPromotion = {
        id: nextId,
        name: formData.get('name'),
        type: formData.get('type'),
        value: parseInt(formData.get('value')),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        createdAt: new Date().toISOString()
    };
    
    promotions.push(newPromotion);
    localStorage.setItem('bookself-promotions', JSON.stringify(promotions));
    
    showNotification('Thêm ưu đãi thành công!', 'success');
    closeModal('addPromotionModal');
    form.reset();
    loadPromotionsData();
}

function editPromotion(promotionId) {
    const promotions = getPromotions();
    const promotion = promotions.find(p => p.id === promotionId);
    
    if (!promotion) {
        showNotification('Không tìm thấy ưu đãi!', 'error');
        return;
    }
    
    // Fill form with existing data
    document.getElementById('promotionName').value = promotion.name;
    document.getElementById('promotionType').value = promotion.type;
    document.getElementById('promotionValue').value = promotion.value;
    document.getElementById('promotionStartDate').value = promotion.startDate;
    document.getElementById('promotionEndDate').value = promotion.endDate;
    
    // Change modal title and button
    document.querySelector('#addPromotionModal .modal-header h2').textContent = 'Chỉnh sửa ưu đãi';
    document.querySelector('#addPromotionModal .modal-footer .btn-primary').textContent = 'Cập nhật ưu đãi';
    document.querySelector('#addPromotionModal .modal-footer .btn-primary').onclick = () => updatePromotion(promotionId);
    
    // Show modal
    document.getElementById('addPromotionModal').style.display = 'block';
}

function updatePromotion(promotionId) {
    const form = document.getElementById('addPromotionForm');
    const formData = new FormData(form);
    
    const promotions = getPromotions();
    const promotionIndex = promotions.findIndex(p => p.id === promotionId);
    
    if (promotionIndex === -1) {
        showNotification('Không tìm thấy ưu đãi!', 'error');
        return;
    }
    
    // Update promotion data
    promotions[promotionIndex].name = formData.get('name');
    promotions[promotionIndex].type = formData.get('type');
    promotions[promotionIndex].value = parseInt(formData.get('value'));
    promotions[promotionIndex].startDate = formData.get('startDate');
    promotions[promotionIndex].endDate = formData.get('endDate');
    promotions[promotionIndex].updatedAt = new Date().toISOString();
    
    localStorage.setItem('bookself-promotions', JSON.stringify(promotions));
    
    showNotification('Cập nhật ưu đãi thành công!', 'success');
    closeModal('addPromotionModal');
    form.reset();
    
    // Reset modal title and button
    document.querySelector('#addPromotionModal .modal-header h2').textContent = 'Thêm ưu đãi mới';
    document.querySelector('#addPromotionModal .modal-footer .btn-primary').textContent = 'Thêm ưu đãi';
    document.querySelector('#addPromotionModal .modal-footer .btn-primary').onclick = addPromotion;
    
    loadPromotionsData();
}

function deletePromotion(promotionId) {
    if (confirm('Bạn có chắc chắn muốn xóa ưu đãi này?')) {
        const promotions = getPromotions();
        const updatedPromotions = promotions.filter(p => p.id !== promotionId);
        localStorage.setItem('bookself-promotions', JSON.stringify(updatedPromotions));
        
        showNotification('Xóa ưu đãi thành công!', 'success');
        loadPromotionsData();
    }
}

// ========== CHARTS INITIALIZATION ========== //
function initializeCharts() {
    initializeRevenueChart();
    initializeTopBooksChart();
}

function initializeRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    // Sample data for demo
    const monthlyData = [1200000, 1500000, 1800000, 1600000, 2000000, 2200000];
    const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'];
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Doanh thu (₫)',
                data: monthlyData,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatPrice(value);
                        }
                    }
                }
            }
        }
    });
}

function initializeTopBooksChart() {
    const ctx = document.getElementById('topBooksChart');
    if (!ctx) return;
    
    if (!window.BookDatabase) return;
    
    const books = window.BookDatabase.getAllBooks().slice(0, 5);
    const bookTitles = books.map(book => book.title.length > 20 ? book.title.substring(0, 20) + '...' : book.title);
    const salesData = books.map(() => Math.floor(Math.random() * 100) + 10); // Random sales data
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: bookTitles,
            datasets: [{
                label: 'Số lượng bán',
                data: salesData,
                backgroundColor: '#10b981',
                borderColor: '#059669',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// ========== UTILITY FUNCTIONS ========== //
function getOrders() {
    let orders = JSON.parse(localStorage.getItem('bookself-orders')) || [];
    
    // If no orders exist, create some sample orders for demo
    if (orders.length === 0) {
        orders = [
            {
                id: 1,
                customerName: 'Nguyễn Văn A',
                customerEmail: 'nguyenvana@email.com',
                bookId: 1,
                quantity: 2,
                total: 478000,
                status: 'delivered',
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 2,
                customerName: 'Trần Thị B',
                customerEmail: 'tranthib@email.com',
                bookId: 2,
                quantity: 1,
                total: 249000,
                status: 'processing',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 3,
                customerName: 'Lê Văn C',
                customerEmail: 'levanc@email.com',
                bookId: 3,
                quantity: 1,
                total: 199000,
                status: 'shipped',
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 4,
                customerName: 'Phạm Thị D',
                customerEmail: 'phamthid@email.com',
                bookId: 4,
                quantity: 3,
                total: 855000,
                status: 'pending',
                date: new Date().toISOString()
            }
        ];
        localStorage.setItem('bookself-orders', JSON.stringify(orders));
    }
    
    return orders;
}

function getUsers() {
    let users = JSON.parse(localStorage.getItem('bookself-users')) || [];
    
    // If no users exist, create some sample users for demo
    if (users.length === 0) {
        users = [
            {
                id: 1,
                name: 'Nguyễn Văn A',
                email: 'nguyenvana@email.com',
                phone: '0123456789',
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 2,
                name: 'Trần Thị B',
                email: 'tranthib@email.com',
                phone: '0987654321',
                createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 3,
                name: 'Lê Văn C',
                email: 'levanc@email.com',
                phone: '0369258147',
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 4,
                name: 'Phạm Thị D',
                email: 'phamthid@email.com',
                phone: '0741852963',
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];
        localStorage.setItem('bookself-users', JSON.stringify(users));
    }
    
    return users;
}

function getPromotions() {
    let promotions = JSON.parse(localStorage.getItem('bookself-promotions')) || [];
    
    // If no promotions exist, create some sample promotions for demo
    if (promotions.length === 0) {
        promotions = [
            {
                id: 1,
                name: 'Giảm giá 20% cho sách mới',
                type: 'percentage',
                value: 20,
                startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 2,
                name: 'Miễn phí vận chuyển',
                type: 'fixed',
                value: 30000,
                startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 3,
                name: 'Giảm giá 15% cho đơn hàng trên 500k',
                type: 'percentage',
                value: 15,
                startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];
        localStorage.setItem('bookself-promotions', JSON.stringify(promotions));
    }
    
    return promotions;
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
    window.filterBooks = filterBooks;
    window.filterOrders = filterOrders;
    window.filterUsers = filterUsers;
    window.showAddBookModal = showAddBookModal;
    window.addBook = addBook;
    window.editBook = editBook;
    window.updateBook = updateBook;
    window.deleteBook = deleteBook;
    window.updateOrderStatus = updateOrderStatus;
    window.confirmStatusUpdate = confirmStatusUpdate;
    window.viewUserDetails = viewUserDetails;
    window.deleteUser = deleteUser;
    window.showAddPromotionModal = showAddPromotionModal;
    window.addPromotion = addPromotion;
    window.editPromotion = editPromotion;
    window.updatePromotion = updatePromotion;
    window.deletePromotion = deletePromotion;
    window.closeModal = closeModal;
    window.showNotification = showNotification;
}

