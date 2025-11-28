// ========== CART FUNCTIONALITY ========== //
let cart = JSON.parse(localStorage.getItem('bookself-cart')) || [];

function initializeCart() {
    updateCartCount();
    
    // Cart icon click
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', toggleCartDropdown);
    }
    
    // Close cart dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const cartDropdown = document.querySelector('.cart-dropdown');
        const cartIcon = document.querySelector('.cart-icon');
        
        if (cartDropdown && cartDropdown.classList.contains('active') && 
            !cartDropdown.contains(e.target) && !cartIcon.contains(e.target)) {
            cartDropdown.classList.remove('active');
        }
    });
}

function initializeCartSyncListener() {
    // Listen for cart updates across different pages/tabs
    window.addEventListener('cartUpdated', function(event) {
        console.log('Cart updated event received:', event.detail);
        
        // Reload cart from localStorage
        cart = JSON.parse(localStorage.getItem('bookself-cart')) || [];
        
        // Update UI
        updateCartCount();
        updateCartDropdown();
    });
    
    // Listen for storage changes (when cart is modified in another tab)
    window.addEventListener('storage', function(event) {
        if (event.key === 'bookself-cart') {
            cart = JSON.parse(event.newValue) || [];
            updateCartCount();
            updateCartDropdown();
        }
    });
}

function addToCart(productId, quantity = 1) {
    if (!window.BookDatabase) return;
    
    const book = window.BookDatabase.getBookById(productId);
    if (!book) {
        showNotification('Không tìm thấy sản phẩm!', 'error');
        return;
    }
    
    // Convert productId to consistent type for comparison
    const productIdStr = String(productId);
    const existingItem = cart.find(item => String(item.id) === productIdStr);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            quantity: quantity
        });
    }
    
    localStorage.setItem('bookself-cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDropdown();
    
    // Trigger custom event to notify all pages about cart change
    window.dispatchEvent(new CustomEvent('cartUpdated', {
        detail: { action: 'add', productId: productId, quantity: quantity, cart: cart }
    }));
    
    showNotification(`Đã thêm "${book.title}" vào giỏ hàng!`);
}

function removeFromCart(productId) {
    console.log('removeFromCart called with:', productId, typeof productId);
    console.log('Current cart before removal:', cart);
    
    if (!window.BookDatabase) return;
    
    const book = window.BookDatabase.getBookById(productId);
    console.log('Book found:', book);
    
    // Convert both to string for safe comparison (since IDs can be string or number)
    const productIdStr = String(productId);
    
    cart = cart.filter(item => {
        const itemIdStr = String(item.id);
        console.log('Comparing:', itemIdStr, '!==', productIdStr);
        return itemIdStr !== productIdStr;
    });
    
    console.log('Cart after removal:', cart);
    localStorage.setItem('bookself-cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDropdown();
    
    // Trigger custom event to notify all pages about cart change
    window.dispatchEvent(new CustomEvent('cartUpdated', {
        detail: { action: 'remove', productId: productId, cart: cart }
    }));
    
    if (book) {
        showNotification(`Đã xóa "${book.title}" khỏi giỏ hàng!`);
    }
}

function updateCartQuantity(productId, newQuantity) {
    console.log('updateCartQuantity called with:', productId, typeof productId, 'newQuantity:', newQuantity);
    console.log('Current cart:', cart);
    
    // Convert both to string for safe comparison
    const productIdStr = String(productId);
    
    const item = cart.find(item => {
        const itemIdStr = String(item.id);
        console.log('Comparing:', itemIdStr, '===', productIdStr);
        return itemIdStr === productIdStr;
    });
    
    console.log('Item found:', item);
    
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            localStorage.setItem('bookself-cart', JSON.stringify(cart));
            updateCartCount();
            updateCartDropdown();
            
            // Trigger custom event
            window.dispatchEvent(new CustomEvent('cartUpdated', {
                detail: { action: 'update', productId: productId, quantity: newQuantity, cart: cart }
            }));
        }
    } else {
        console.warn('Item not found in cart for productId:', productId);
    }
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function toggleCartDropdown() {
    let dropdown = document.querySelector('.cart-dropdown');
    
    if (!dropdown) {
        dropdown = createCartDropdown();
    }
    
    dropdown.classList.toggle('active');
    updateCartDropdown();
}

function createCartDropdown() {
    const cartIcon = document.querySelector('.cart-icon');
    if (!cartIcon) return;
    
    const dropdown = document.createElement('div');
    dropdown.className = 'cart-dropdown';
    
    cartIcon.parentElement.style.position = 'relative';
    cartIcon.parentElement.appendChild(dropdown);
    
    return dropdown;
}

function updateCartDropdown() {
    const dropdown = document.querySelector('.cart-dropdown');
    if (!dropdown || !window.BookDatabase) return;
    
    if (cart.length === 0) {
        dropdown.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>Giỏ hàng trống</p>
            </div>
        `;
        return;
    }
    
    const cartItems = cart.map(item => {
        const book = window.BookDatabase.getBookById(item.id);
        if (!book) return '';
        
        return `
            <div class="cart-item">
                <img src="${book.images[0]}" alt="${book.title}">
                <div class="cart-item-info">
                    <h4>${book.title}</h4>
                    <p class="cart-item-price">${formatPrice(book.price)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-product-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-product-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-item-btn" data-product-id="${item.id}">&times;</button>
            </div>
        `;
    }).join('');
    
    const totalPrice = cart.reduce((sum, item) => {
        const book = window.BookDatabase.getBookById(item.id);
        return sum + (book ? book.price * item.quantity : 0);
    }, 0);
    
    dropdown.innerHTML = `
        <div class="cart-header">
            <h3>Giỏ hàng (${cart.reduce((sum, item) => sum + item.quantity, 0)})</h3>
        </div>
        <div class="cart-items">
            ${cartItems}
        </div>
        <div class="cart-footer">
            <div class="cart-total">
                <strong>Tổng: ${formatPrice(totalPrice)}</strong>
            </div>
            <button class="btn btn-primary checkout-btn">Thanh toán</button>
        </div>
    `;
    
    // Add event listeners
    dropdown.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = btn.dataset.productId;
            const item = cart.find(i => String(i.id) === String(productId));
            if (item) {
                const newQuantity = btn.classList.contains('plus') 
                    ? item.quantity + 1 
                    : item.quantity - 1;
                updateCartQuantity(productId, newQuantity);
            }
        });
    });
    
    dropdown.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = btn.dataset.productId;
            removeFromCart(productId);
        });
    });
    
    const checkoutBtn = dropdown.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            // Check if user is logged in
            if (!isLoggedIn()) {
                showNotification('Vui lòng đăng nhập để thanh toán!', 'error');
                setTimeout(() => {
                    window.location.href = 'auth.html';
                }, 1500);
                return;
            }
            
            // Check if cart is empty
            if (cart.length === 0) {
                showNotification('Giỏ hàng trống!', 'error');
                return;
            }
            
            // Navigate to checkout page
            window.location.href = 'checkout.html';
        });
    }
}

// Export to global scope
if (typeof window !== 'undefined') {
    window.initializeCart = initializeCart;
    window.initializeCartSyncListener = initializeCartSyncListener;
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;
    window.updateCartQuantity = updateCartQuantity;
    window.updateCartCount = updateCartCount;
    window.updateCartDropdown = updateCartDropdown;
    window.cart = cart;
}
