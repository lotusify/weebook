// ========== ORDER SUCCESS PAGE ========== //
// Order confirmation and success page functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeOrderSuccess();
});

function initializeOrderSuccess() {
    // Get order ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');

    if (!orderId) {
        showNotification('Không tìm thấy thông tin đơn hàng!', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        return;
    }

    // Load order details
    loadOrderDetails(orderId);
}

function loadOrderDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem('bookself-orders')) || [];
    const order = orders.find(o => o.id == orderId);

    if (!order) {
        showNotification('Không tìm thấy đơn hàng!', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        return;
    }

    // Display order details
    displayOrderDetails(order);
}

function displayOrderDetails(order) {
    const orderDetailsContainer = document.getElementById('orderDetails');

    let itemsHtml = '';
    order.items.forEach(item => {
        itemsHtml += `
            <div class="order-item-detail">
                <img src="${item.image}" alt="${item.title}" class="item-image">
                <div class="item-info">
                    <h4 class="item-title">${item.title}</h4>
                    <p class="item-author">${item.author}</p>
                    <div class="item-meta">
                        <span class="item-price">${formatPrice(item.price)}</span>
                        <span class="item-quantity">x${item.quantity}</span>
                        <span class="item-total">${formatPrice(item.total)}</span>
                    </div>
                </div>
            </div>
        `;
    });

    const deliveryMethod = order.deliveryMethod === 'express' ? 'Giao hàng nhanh (1-2 ngày)' : 'Giao hàng tiêu chuẩn (3-5 ngày)';
    const paymentMethod = getPaymentMethodText(order.paymentMethod);

    orderDetailsContainer.innerHTML = `
        <div class="order-summary">
            <div class="summary-row">
                <span class="label">Mã đơn hàng:</span>
                <span class="value order-id">#${order.id.toString().padStart(6, '0')}</span>
            </div>
            <div class="summary-row">
                <span class="label">Ngày đặt:</span>
                <span class="value">${formatDate(order.createdAt)}</span>
            </div>
            <div class="summary-row">
                <span class="label">Trạng thái:</span>
                <span class="value status status-${order.status}">${getStatusText(order.status)}</span>
            </div>
            <div class="summary-row">
                <span class="label">Phương thức giao hàng:</span>
                <span class="value">${deliveryMethod}</span>
            </div>
            <div class="summary-row">
                <span class="label">Phương thức thanh toán:</span>
                <span class="value">${paymentMethod}</span>
            </div>
        </div>

        <div class="delivery-info">
            <h4>Thông tin giao hàng</h4>
            <div class="address-details">
                <p><strong>${order.customerInfo.fullName}</strong></p>
                <p>${order.customerInfo.phone}</p>
                <p>${order.customerInfo.address}</p>
                <p>${getDistrictText(order.customerInfo.district)}, ${getCityText(order.customerInfo.city)}</p>
            </div>
        </div>

        <div class="order-items-section">
            <h4>Sản phẩm đã đặt</h4>
            <div class="order-items-list">
                ${itemsHtml}
            </div>
        </div>

        <div class="order-totals">
            <div class="total-row">
                <span>Tạm tính:</span>
                <span>${formatPrice(order.subtotal)}</span>
            </div>
            <div class="total-row">
                <span>Phí vận chuyển:</span>
                <span>${order.shippingCost === 0 ? 'Miễn phí' : formatPrice(order.shippingCost)}</span>
            </div>
            <div class="total-row total-final">
                <span>Tổng cộng:</span>
                <span>${formatPrice(order.total)}</span>
            </div>
        </div>
    `;
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

function getPaymentMethodText(method) {
    const methodMap = {
        'cod': 'Thanh toán khi nhận hàng (COD)',
        'bank': 'Chuyển khoản ngân hàng',
        'momo': 'Ví MoMo'
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

function getDistrictText(districtValue) {
    const districtMap = {
        // Hà Nội
        'baidinh': 'Ba Đình',
        'hoankiem': 'Hoàn Kiếm',
        'dongda': 'Đống Đa',
        'haibatrung': 'Hai Bà Trưng',
        'hoangmai': 'Hoàng Mai',
        'thanhxuan': 'Thanh Xuân',
        // TP. Hồ Chí Minh
        'quan1': 'Quận 1',
        'quan2': 'Quận 2',
        'quan3': 'Quận 3',
        'quan4': 'Quận 4',
        'quan5': 'Quận 5',
        'quan6': 'Quận 6',
        // Đà Nẵng
        'haichau': 'Hải Châu',
        'thanhkhe': 'Thanh Khê',
        'son tra': 'Sơn Trà',
        'nguhanhson': 'Ngũ Hành Sơn',
        // Hải Phòng
        'hongbang': 'Hồng Bàng',
        'ngoquyen': 'Ngô Quyền',
        'lechan': 'Lê Chân',
        // Cần Thơ
        'ninhkieu': 'Ninh Kiều',
        'binhthuy': 'Bình Thủy',
        'catrang': 'Cái Răng'
    };
    return districtMap[districtValue] || districtValue;
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
