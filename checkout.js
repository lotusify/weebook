// ========== CHECKOUT SYSTEM ========== //
// Complete checkout and payment system for BookShelf

document.addEventListener('DOMContentLoaded', function() {
    initializeCheckout();
});

function initializeCheckout() {
    // Check if user is logged in
    if (!isLoggedIn()) {
        showNotification('Vui lòng đăng nhập để tiếp tục!', 'error');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1500);
        return;
    }

    // Check if cart has items
    const cart = JSON.parse(localStorage.getItem('bookshelf-cart')) || [];
    if (cart.length === 0) {
        showNotification('Giỏ hàng trống!', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        return;
    }

    // Load user information
    loadUserInformation();
    
    // Load order items
    loadOrderItems();
    
    // Initialize form handlers
    initializeFormHandlers();
    
    // Initialize delivery options
    initializeDeliveryOptions();
    
    // Initialize payment options
    initializePaymentOptions();
}

function loadUserInformation() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        document.getElementById('fullName').value = currentUser.name || '';
        document.getElementById('phone').value = currentUser.phone || '';
        document.getElementById('email').value = currentUser.email || '';
    }
}

function loadOrderItems() {
    const cart = JSON.parse(localStorage.getItem('bookshelf-cart')) || [];
    const orderItemsContainer = document.getElementById('orderItems');
    
    if (!window.BookDatabase) {
        orderItemsContainer.innerHTML = '<p>Đang tải...</p>';
        return;
    }

    let total = 0;
    let itemsHtml = '';

    cart.forEach(item => {
        const book = window.BookDatabase.getBookById(item.id);
        if (book) {
            const itemTotal = book.price * item.quantity;
            total += itemTotal;
            
            itemsHtml += `
                <div class="order-item">
                    <img src="${book.images[0]}" alt="${book.title}" class="item-image">
                    <div class="item-details">
                        <h4 class="item-title">${book.title}</h4>
                        <p class="item-author">${book.author}</p>
                        <div class="item-quantity">Số lượng: ${item.quantity}</div>
                    </div>
                    <div class="item-price">${formatPrice(itemTotal)}</div>
                </div>
            `;
        }
    });

    orderItemsContainer.innerHTML = itemsHtml;
    updateOrderTotals(total);
}

function updateOrderTotals(subtotal) {
    const shippingCost = getShippingCost();
    const total = subtotal + shippingCost;
    
    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('shipping').textContent = shippingCost === 0 ? 'Miễn phí' : formatPrice(shippingCost);
    document.getElementById('total').textContent = formatPrice(total);
}

function getShippingCost() {
    const selectedDelivery = document.querySelector('input[name="delivery"]:checked');
    if (selectedDelivery && selectedDelivery.value === 'express') {
        return 30000;
    }
    return 0;
}

function initializeFormHandlers() {
    // City selection handler
    const citySelect = document.getElementById('city');
    const districtSelect = document.getElementById('district');
    
    if (citySelect) {
        citySelect.addEventListener('change', updateDistricts);
    }
    
    // Delivery option handler
    const deliveryOptions = document.querySelectorAll('input[name="delivery"]');
    deliveryOptions.forEach(option => {
        option.addEventListener('change', updateShippingCost);
    });
    
    // Form validation
    const form = document.querySelector('.checkout-form-section');
    if (form) {
        form.addEventListener('input', validateForm);
    }
}

function updateDistricts() {
    const citySelect = document.getElementById('city');
    const districtSelect = document.getElementById('district');
    
    if (!citySelect || !districtSelect) return;
    
    const city = citySelect.value;
    const districts = getDistrictsByCity(city);
    
    districtSelect.innerHTML = '<option value="">Chọn quận/huyện</option>';
    
    districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district.value;
        option.textContent = district.name;
        districtSelect.appendChild(option);
    });
}

function getDistrictsByCity(city) {
    const districts = {
        'hanoi': [
            { value: 'baidinh', name: 'Ba Đình' },
            { value: 'hoankiem', name: 'Hoàn Kiếm' },
            { value: 'dongda', name: 'Đống Đa' },
            { value: 'haibatrung', name: 'Hai Bà Trưng' },
            { value: 'hoangmai', name: 'Hoàng Mai' },
            { value: 'thanhxuan', name: 'Thanh Xuân' }
        ],
        'hcm': [
            { value: 'quan1', name: 'Quận 1' },
            { value: 'quan2', name: 'Quận 2' },
            { value: 'quan3', name: 'Quận 3' },
            { value: 'quan4', name: 'Quận 4' },
            { value: 'quan5', name: 'Quận 5' },
            { value: 'quan6', name: 'Quận 6' }
        ],
        'danang': [
            { value: 'haichau', name: 'Hải Châu' },
            { value: 'thanhkhe', name: 'Thanh Khê' },
            { value: 'son tra', name: 'Sơn Trà' },
            { value: 'nguhanhson', name: 'Ngũ Hành Sơn' }
        ],
        'haiphong': [
            { value: 'hongbang', name: 'Hồng Bàng' },
            { value: 'ngoquyen', name: 'Ngô Quyền' },
            { value: 'lechan', name: 'Lê Chân' }
        ],
        'cantho': [
            { value: 'ninhkieu', name: 'Ninh Kiều' },
            { value: 'binhthuy', name: 'Bình Thủy' },
            { value: 'catrang', name: 'Cái Răng' }
        ]
    };
    
    return districts[city] || [];
}

function updateShippingCost() {
    const cart = JSON.parse(localStorage.getItem('bookshelf-cart')) || [];
    let subtotal = 0;
    
    cart.forEach(item => {
        const book = window.BookDatabase.getBookById(item.id);
        if (book) {
            subtotal += book.price * item.quantity;
        }
    });
    
    updateOrderTotals(subtotal);
}

function initializeDeliveryOptions() {
    const deliveryOptions = document.querySelectorAll('.delivery-option');
    
    deliveryOptions.forEach(option => {
        option.addEventListener('click', () => {
            deliveryOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    });
}

function initializePaymentOptions() {
    const paymentOptions = document.querySelectorAll('.payment-option');
    
    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    });
}

function validateForm() {
    const requiredFields = [
        'fullName', 'phone', 'city', 'district', 'address'
    ];
    
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#e53e3e';
        } else if (field) {
            field.style.borderColor = '#38a169';
        }
    });
    
    return isValid;
}

function processCheckout() {
    // Validate form
    if (!validateForm()) {
        showNotification('Vui lòng điền đầy đủ thông tin bắt buộc!', 'error');
        return;
    }
    
    // Get form data
    const formData = {
        fullName: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        city: document.getElementById('city').value,
        district: document.getElementById('district').value,
        address: document.getElementById('address').value,
        delivery: document.querySelector('input[name="delivery"]:checked').value,
        payment: document.querySelector('input[name="payment"]:checked').value,
        notes: document.getElementById('orderNotes').value
    };
    
    // Get cart items
    const cart = JSON.parse(localStorage.getItem('bookshelf-cart')) || [];
    
    // Calculate totals
    let subtotal = 0;
    const orderItems = [];
    
    cart.forEach(item => {
        const book = window.BookDatabase.getBookById(item.id);
        if (book) {
            const itemTotal = book.price * item.quantity;
            subtotal += itemTotal;
            
            orderItems.push({
                bookId: book.id,
                title: book.title,
                author: book.author,
                price: book.price,
                quantity: item.quantity,
                total: itemTotal,
                image: book.images[0]
            });
        }
    });
    
    const shippingCost = getShippingCost();
    const total = subtotal + shippingCost;
    
    // Create order
    const order = {
        id: generateOrderId(),
        userId: getCurrentUser().id,
        items: orderItems,
        customerInfo: formData,
        subtotal: subtotal,
        shippingCost: shippingCost,
        total: total,
        status: 'pending',
        createdAt: new Date().toISOString(),
        paymentMethod: formData.payment,
        deliveryMethod: formData.delivery
    };
    
    // Save order
    saveOrder(order);
    
    // Clear cart
    localStorage.removeItem('bookshelf-cart');
    
    // Update cart count
    updateCartCount();
    
    // Show success message
    showNotification('Đặt hàng thành công!', 'success');
    
    // Redirect to order confirmation
    setTimeout(() => {
        window.location.href = `order-success.html?id=${order.id}`;
    }, 1500);
}

function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('bookshelf-orders')) || [];
    orders.push(order);
    localStorage.setItem('bookshelf-orders', JSON.stringify(orders));
    
    // Update user's orders
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === order.userId);
    if (userIndex !== -1) {
        users[userIndex].orders.push(order.id);
        localStorage.setItem('bookshelf-users', JSON.stringify(users));
    }
}

function generateOrderId() {
    const orders = JSON.parse(localStorage.getItem('bookshelf-orders')) || [];
    return orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
}

// Export functions for use in other files
if (typeof window !== 'undefined') {
    window.processCheckout = processCheckout;
}
