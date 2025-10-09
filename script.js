// ========== BOOKSHELF INTERACTIVE FEATURES ========== //
// Main JavaScript file for dynamic functionality

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, BookDatabase available:', !!window.BookDatabase);
    
    // Initialize chatbot timestamp
    initializeChatbotTimestamp();
    
    // Initialize basic features first
    initializeNavigation();
    initializeSearch();
    initializeCart();
    initializeAuth();
    
    // Wait for data to be loaded and initialize page-specific features
    const waitForData = () => {
        if (window.BookDatabase) {
            console.log('BookDatabase loaded, initializing page...');
            
            const currentPage = getCurrentPage();
            console.log('Current page:', currentPage);
            
            // Initialize product grid for all pages
            initializeProductGrid();
            
            switch(currentPage) {
                case 'index':
                    console.log('Initializing home page...');
                    initializeHomePage();
                    break;
                case 'product':
                    console.log('Initializing product page...');
                    initializeProductPage();
                    break;
                case 'category':
                    console.log('Initializing category page...');
                    initializeCategoryPage();
                    break;
                case 'about':
                    console.log('Initializing about page...');
                    initializeAboutPage();
                    break;
            }
        } else {
            console.log('BookDatabase not ready, retrying...');
            setTimeout(waitForData, 50);
        }
    };
    
    // Start waiting for data
    setTimeout(waitForData, 10);
});

// Load data.js dynamically
// Function removed - data.js is loaded directly via HTML script tag

// ========== UTILITY FUNCTIONS ========== //
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('product.html')) return 'product';
    if (path.includes('category.html')) return 'category';
    if (path.includes('about.html')) return 'about';
    return 'index';
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(price);
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

function showLoading(container) {
    container.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Đang tải...</p>
        </div>
    `;
}

// ========== CHATBOT INITIALIZATION ========== //
function initializeChatbotTimestamp() {
    const initialMessageTime = document.getElementById('initialMessageTime');
    if (initialMessageTime) {
        initialMessageTime.textContent = new Date().toLocaleTimeString();
    }
}

// ========== NAVIGATION ========== //
function initializeNavigation() {
    // Set active navigation item
    setActiveNavigationItem();
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
    
    // Category menu hover and clicks
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        const submenu = item.querySelector('.category-submenu');
        if (submenu) {
            // Ensure submenu is properly positioned
            submenu.style.position = 'absolute';
            submenu.style.top = '0';
            submenu.style.left = '100%';
            submenu.style.zIndex = '1000';
            
            // Handle hover events
            item.addEventListener('mouseenter', () => {
                submenu.style.opacity = '1';
                submenu.style.visibility = 'visible';
                submenu.style.transform = 'translateX(0)';
                submenu.style.display = 'block';
            });
            
            item.addEventListener('mouseleave', () => {
                // Add delay before hiding
                setTimeout(() => {
                    submenu.style.opacity = '0';
                    submenu.style.visibility = 'hidden';
                    submenu.style.transform = 'translateX(-10px)';
                }, 150);
            });
            
            // Keep submenu visible when hovering over it
            submenu.addEventListener('mouseenter', () => {
                submenu.style.opacity = '1';
                submenu.style.visibility = 'visible';
                submenu.style.transform = 'translateX(0)';
            });
            
            submenu.addEventListener('mouseleave', () => {
                submenu.style.opacity = '0';
                submenu.style.visibility = 'hidden';
                submenu.style.transform = 'translateX(-10px)';
            });
        }
        
        // Category link clicks
        const categoryLink = item.querySelector('a[data-category]');
        if (categoryLink) {
            categoryLink.addEventListener('click', (e) => {
                e.preventDefault();
                const category = categoryLink.dataset.category;
                window.location.href = `category.html?category=${category}`;
            });
        }
        
        // Subcategory link clicks
        const subcategoryLinks = item.querySelectorAll('a[data-subcategory]');
        subcategoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const subcategory = link.dataset.subcategory;
                const parentCategoryLink = item.querySelector('a[data-category]');
                const category = parentCategoryLink ? parentCategoryLink.dataset.category : '';
                window.location.href = `category.html?category=${category}&subcategory=${subcategory}`;
            });
        });
    });
}

function setActiveNavigationItem() {
    const currentPage = getCurrentPage();
    console.log('Setting active nav for page:', currentPage);
    
    const navLinks = document.querySelectorAll('.nav-links a');
    console.log('Found nav links:', navLinks.length);
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        console.log('Checking link:', href, 'for page:', currentPage);
        
        if (currentPage === 'index' && href.includes('index.html')) {
            link.classList.add('active');
            console.log('Set active for index page');
        } else if (currentPage === 'category' && href.includes('category.html')) {
            link.classList.add('active');
            console.log('Set active for category page');
        } else if (currentPage === 'about' && href.includes('about.html')) {
            link.classList.add('active');
            console.log('Set active for about page');
        }
    });
}

// ========== SEARCH FUNCTIONALITY ========== //
let searchTimeout;

function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Create autocomplete dropdown
        createAutocompleteDropdown();
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
}

function createAutocompleteDropdown() {
    const searchContainer = document.querySelector('.search-container');
    if (!searchContainer) return;
    
    const dropdown = document.createElement('div');
    dropdown.className = 'autocomplete-dropdown';
    dropdown.style.display = 'none';
    searchContainer.appendChild(dropdown);
}

function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    const dropdown = document.querySelector('.autocomplete-dropdown');
    const query = searchInput.value.trim();
    
    clearTimeout(searchTimeout);
    
    if (query.length < 2) {
        if (dropdown) dropdown.style.display = 'none';
        return;
    }
    
    searchTimeout = setTimeout(() => {
        if (window.BookDatabase) {
            const results = window.BookDatabase.searchBooks(query).slice(0, 5);
            displayAutocomplete(results, dropdown);
        }
    }, 300);
}

function displayAutocomplete(results, dropdown) {
    if (!dropdown || results.length === 0) {
        if (dropdown) dropdown.style.display = 'none';
        return;
    }
    
    dropdown.innerHTML = results.map(book => `
        <div class="autocomplete-item" data-book-id="${book.id}">
            <img src="${book.images[0]}" alt="${book.title}" class="autocomplete-thumb">
            <div class="autocomplete-info">
                <div class="autocomplete-title">${book.title}</div>
                <div class="autocomplete-author">${book.author}</div>
                <div class="autocomplete-price">${formatPrice(book.price)}</div>
            </div>
        </div>
    `).join('');
    
    dropdown.style.display = 'block';
    
    // Add click handlers
    dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', () => {
            const bookId = item.dataset.bookId;
            window.location.href = `product.html?id=${bookId}`;
        });
    });
}

function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const query = searchInput.value.trim();
    
    if (query) {
        window.location.href = `category.html?search=${encodeURIComponent(query)}`;
    }
}

// ========== PRODUCT GRID ========== //
function initializeProductGrid() {
    const productCards = document.querySelectorAll('.product-card, .product-item');
    
    productCards.forEach(card => {
        card.addEventListener('click', handleProductClick);
        
        // Quick view button
        const quickViewBtn = card.querySelector('.quick-view-btn');
        if (quickViewBtn) {
            quickViewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = card.dataset.productId || '1';
                
                // Add visual feedback
                quickViewBtn.style.transform = 'scale(0.9)';
                quickViewBtn.style.backgroundColor = '#007bff';
                setTimeout(() => {
                    quickViewBtn.style.transform = 'scale(1)';
                    quickViewBtn.style.backgroundColor = '';
                }, 200);
                
                // Navigate to product page
                window.location.href = `product.html?id=${productId}`;
            });
        }
        
        // Add to cart button
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = card.dataset.productId || '1';
                
                // Add visual feedback
                addToCartBtn.style.transform = 'scale(0.9)';
                addToCartBtn.style.backgroundColor = '#28a745';
                setTimeout(() => {
                    addToCartBtn.style.transform = 'scale(1)';
                    addToCartBtn.style.backgroundColor = '';
                }, 200);
                
                addToCart(productId);
            });
        }
        
        // Wishlist button
        const wishlistBtn = card.querySelector('.wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = card.dataset.productId || '1';
                
                // Add visual feedback
                wishlistBtn.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    wishlistBtn.style.transform = 'scale(1)';
                }, 150);
                
                toggleWishlist(productId);
            });
        }
    });
}

function handleProductClick(e) {
    const productCard = e.currentTarget;
    const productId = productCard.dataset.productId || '1';
    
    // Navigate to product page
    window.location.href = `product.html?id=${productId}`;
}

function renderProductCard(book) {
    const discountBadge = book.discount > 0 ? `<span class="discount-badge">-${book.discount}%</span>` : '';
    const newBadge = book.newRelease ? `<span class="new-badge">Mới</span>` : '';
    
    return `
        <div class="product-card" data-product-id="${book.id}">
            <div class="product-image">
                <img src="${book.images[0]}" alt="${book.title}" loading="lazy">
                <button class="wishlist-btn" data-product-id="${book.id}" title="Thêm vào danh sách yêu thích">
                    <i class="fas fa-heart"></i>
                </button>
                ${discountBadge}
                ${newBadge}
                <div class="product-overlay">
                    <button class="quick-view-btn" title="Xem nhanh">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="add-to-cart-btn" title="Thêm vào giỏ">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${book.title}</h3>
                <p class="product-author">${book.author}</p>
                <div class="product-rating">
                    ${renderStars(book.rating)}
                    <span class="rating-text">(${book.reviewCount})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${formatPrice(book.price)}</span>
                    ${book.originalPrice > book.price ? `<span class="original-price">${formatPrice(book.originalPrice)}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// ========== CART FUNCTIONALITY ========== //
let cart = JSON.parse(localStorage.getItem('bookshelf-cart')) || [];

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
        
        if (cartDropdown && cartIcon && !cartIcon.contains(e.target) && !cartDropdown.contains(e.target)) {
            cartDropdown.classList.remove('active');
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
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            quantity: quantity,
            addedAt: new Date().toISOString()
        });
    }
    
    localStorage.setItem('bookshelf-cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDropdown();
    showNotification(`Đã thêm "${book.title}" vào giỏ hàng!`);
}

// ========== WISHLIST SYSTEM ========== //
function addToWishlist(productId) {
    // Allow wishlist without login for front-end demo
    // if (!isLoggedIn()) {
    //     showNotification('Vui lòng đăng nhập để thêm vào danh sách yêu thích!', 'error');
    //     setTimeout(() => {
    //         window.location.href = 'auth.html';
    //     }, 1500);
    //     return;
    // }
    
    if (!window.BookDatabase) {
        console.error('BookDatabase not available');
        showNotification('Lỗi: Không thể thêm vào danh sách yêu thích!', 'error');
        return;
    }
    
    const book = window.BookDatabase.getBookById(productId);
    if (!book) {
        console.error('Book not found:', productId);
        showNotification('Không tìm thấy sách!', 'error');
        return;
    }
    
    // Use localStorage for demo (no user login required)
    let wishlist = JSON.parse(localStorage.getItem('bookshelf-wishlist')) || [];
    
    // Check if already in wishlist
    if (wishlist.includes(productId)) {
        showNotification(`"${book.title}" đã có trong danh sách yêu thích!`, 'info');
        return;
    }
    
    // Add to wishlist
    wishlist.push(productId);
    localStorage.setItem('bookshelf-wishlist', JSON.stringify(wishlist));
    
    showNotification(`Đã thêm "${book.title}" vào danh sách yêu thích!`, 'success');
    updateWishlistButtons();
}

function removeFromWishlist(productId) {
    // Use localStorage for demo (no user login required)
    let wishlist = JSON.parse(localStorage.getItem('bookshelf-wishlist')) || [];
    
    // Remove from wishlist
    wishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem('bookshelf-wishlist', JSON.stringify(wishlist));
    
    if (window.BookDatabase) {
        const book = window.BookDatabase.getBookById(productId);
        if (book) {
            showNotification(`Đã xóa "${book.title}" khỏi danh sách yêu thích!`, 'success');
        }
    }
    
    updateWishlistButtons();
}

function isInWishlist(productId) {
    // Use localStorage for demo (no user login required)
    let wishlist = JSON.parse(localStorage.getItem('bookshelf-wishlist')) || [];
    return wishlist.includes(productId);
}

function updateWishlistButtons() {
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    
    wishlistButtons.forEach(button => {
        const productId = parseInt(button.dataset.productId);
        const isInList = isInWishlist(productId);
        
        const icon = button.querySelector('i');
        if (isInList) {
            icon.classList.remove('fa-heart');
            icon.classList.add('fa-heart-solid');
            button.classList.add('active');
            button.title = 'Xóa khỏi danh sách yêu thích';
        } else {
            icon.classList.remove('fa-heart-solid');
            icon.classList.add('fa-heart');
            button.classList.remove('active');
            button.title = 'Thêm vào danh sách yêu thích';
        }
    });
}

function toggleWishlist(productId) {
    if (isInWishlist(productId)) {
        removeFromWishlist(productId);
    } else {
        addToWishlist(productId);
    }
}

// ========== REVIEWS NAVIGATION ========== //
function goToReviews() {
    const productId = getProductIdFromUrl();
    if (productId) {
        window.location.href = `reviews.html?id=${productId}`;
    }
}

function removeFromCart(productId) {
    if (!window.BookDatabase) return;
    
    const book = window.BookDatabase.getBookById(productId);
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('bookshelf-cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDropdown();
    if (book) {
        showNotification(`Đã xóa "${book.title}" khỏi giỏ hàng!`, 'info');
    }
}

function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            localStorage.setItem('bookshelf-cart', JSON.stringify(cart));
            updateCartCount();
            updateCartDropdown();
        }
    }
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
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
    if (!cartIcon) return null;
    
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
            <div class="cart-item" data-product-id="${item.id}">
                <img src="${book.images[0]}" alt="${book.title}" class="cart-item-image">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${book.title}</h4>
                    <div class="cart-item-controls">
                        <button class="quantity-btn minus" data-action="decrease">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-action="increase">+</button>
                    </div>
                    <div class="cart-item-price">${formatPrice(book.price * item.quantity)}</div>
                </div>
                <button class="remove-item-btn" data-product-id="${item.id}">
                    <i class="fas fa-times"></i>
                </button>
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
            const productId = btn.closest('.cart-item').dataset.productId;
            const action = btn.dataset.action;
            const currentQuantity = parseInt(btn.parentElement.querySelector('.quantity').textContent);
            
            if (action === 'increase') {
                updateCartQuantity(productId, currentQuantity + 1);
            } else {
                updateCartQuantity(productId, currentQuantity - 1);
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
            const cart = JSON.parse(localStorage.getItem('bookshelf-cart')) || [];
            if (cart.length === 0) {
                showNotification('Giỏ hàng trống!', 'error');
                return;
            }
            
            // Allow checkout without login for front-end demo
            // if (!isLoggedIn()) {
            //     showNotification('Vui lòng đăng nhập để tiếp tục thanh toán!', 'error');
            //     setTimeout(() => {
            //         window.location.href = 'auth.html';
            //     }, 1500);
            //     return;
            // }
            
            // Close cart dropdown
            dropdown.classList.remove('active');
            
            // Redirect to checkout page
            window.location.href = 'checkout.html';
        });
    }
}

// ========== PAGE-SPECIFIC INITIALIZERS ========== //
function initializeHomePage() {
    console.log('Home page initialized');
    loadHomePageContent();
}

function loadHomePageContent() {
    console.log('Loading home page content...');
    console.log('BookDatabase available:', !!window.BookDatabase);
    
    // Check if BookDatabase is available
    if (!window.BookDatabase) {
        console.log('BookDatabase not available, retrying in 100ms...');
        setTimeout(loadHomePageContent, 100);
        return;
    }
    
    // Load featured products
    const featuredContainer = document.querySelector('.featured-products .product-grid');
    if (featuredContainer) {
        const featuredBooks = window.BookDatabase.getFeaturedBooks();
        console.log('Featured books found:', featuredBooks.length);
        
        if (featuredBooks.length > 0) {
            // Completely replace with dynamic products
            featuredContainer.innerHTML = featuredBooks.map(book => renderProductCard(book)).join('');
            
            // Re-initialize product grid after loading content
            setTimeout(() => {
                initializeProductGrid();
            }, 100);
        } else {
            featuredContainer.innerHTML = '<p>Không có sản phẩm nổi bật</p>';
        }
    } else {
        console.log('Featured container not found');
    }
    
    // Load new releases
    const newReleasesContainer = document.querySelector('.new-releases .product-grid');
    if (newReleasesContainer) {
        const newBooks = window.BookDatabase.getNewReleases();
        console.log('New releases found:', newBooks.length);
        
        if (newBooks.length > 0) {
            newReleasesContainer.innerHTML = newBooks.map(book => renderProductCard(book)).join('');
            
            // Re-initialize product grid after loading content
            setTimeout(() => {
                initializeProductGrid();
            }, 100);
        } else {
            newReleasesContainer.innerHTML = '<p>Không có sách mới</p>';
        }
    } else {
        console.log('New releases container not found');
    }
}

function initializeProductPage() {
    console.log('Product page initialized');
    loadProductDetails();
}

function loadProductDetails() {
    if (!window.BookDatabase) {
        console.log('BookDatabase not available, retrying in 100ms...');
        setTimeout(loadProductDetails, 100);
        return;
    }
    
    const productId = getProductIdFromUrl();
    console.log('Loading product with ID:', productId);
    const book = window.BookDatabase.getBookById(productId);
    
    console.log('Book found:', !!book);
    if (book) {
        console.log('Book title:', book.title);
    }
    
    if (!book) {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="error-message">
                    <h2>Không tìm thấy sản phẩm</h2>
                    <p>Sản phẩm bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
                    <a href="index.html" class="btn btn-primary">Về trang chủ</a>
                </div>
            `;
        }
        return;
    }
    
    // Update page title
    document.title = `${book.title} - BookShelf`;
    
    // Update breadcrumb
    updateBreadcrumb(book);
    
    // Update product images
    const mainImage = document.querySelector('.main-image img');
    const thumbnails = document.querySelector('.image-thumbnails');
    
    if (mainImage) {
        mainImage.src = book.images[0];
        mainImage.alt = book.title;
    }
    
    if (thumbnails) {
        thumbnails.innerHTML = book.images.map((img, index) => `
            <img src="${img}" alt="${book.title}" class="thumbnail ${index === 0 ? 'active' : ''}" 
                 onclick="changeMainImage('${img}', this)">
        `).join('');
    }
    
    // Update product info
    updateProductInfo(book);
    
    // Load related products
    loadRelatedProducts(book.id);
    
    // Initialize product page features
    initializeProductDetails();
}

function updateProductInfo(book) {
    // Update basic info
    const title = document.querySelector('.product-title');
    const author = document.querySelector('.product-author');
    const rating = document.querySelector('.product-rating .stars');
    const ratingText = document.querySelector('.rating-text');
    const price = document.querySelector('.current-price');
    const originalPrice = document.querySelector('.original-price');
    const discount = document.querySelector('.product-image .discount-badge');
    const newBadge = document.querySelector('.product-image .new-badge');
    const stock = document.querySelector('.stock-status');
    
    if (title) title.textContent = book.title;
    if (author) author.textContent = book.author;
    if (rating) rating.innerHTML = renderStars(book.rating);
    if (ratingText) ratingText.textContent = `(${book.reviewCount} đánh giá)`;
    if (price) price.textContent = formatPrice(book.price);
    
    if (originalPrice && book.originalPrice > book.price) {
        originalPrice.textContent = formatPrice(book.originalPrice);
        originalPrice.style.display = 'inline';
    } else if (originalPrice) {
        originalPrice.style.display = 'none';
    }
    
    if (discount && book.discount > 0) {
        discount.textContent = `-${book.discount}%`;
        discount.style.display = 'inline';
    } else if (discount) {
        discount.style.display = 'none';
    }

    if (newBadge && book.newRelease) {
        newBadge.textContent = 'Mới';
        newBadge.style.display = 'inline';
    } else if (newBadge) {
        newBadge.style.display = 'none';
    }
    
    if (stock) {
        stock.innerHTML = book.stock > 0 
            ? `<i class="fas fa-check-circle"></i> Còn ${book.stock} sản phẩm` 
            : `<i class="fas fa-times-circle"></i> Hết hàng`;
        stock.className = `stock-status ${book.stock > 0 ? 'in-stock' : 'out-of-stock'}`;
    }
    
    // Update product details
    updateProductTabs(book);
    
    // Load related products
    loadRelatedProducts(book);
}

function updateProductTabs(book) {
    // Description tab
    const descriptionTab = document.getElementById('description');
    if (descriptionTab) {
        descriptionTab.innerHTML = `
            <div class="product-description">
                ${book.description.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('')}
            </div>
            <div class="product-tags">
                ${book.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        `;
    }
    
    // Specifications tab
    const specificationsTab = document.getElementById('specifications');
    if (specificationsTab) {
        specificationsTab.innerHTML = `
            <table class="specifications-table">
                <tr><td>Tác giả</td><td>${book.author}</td></tr>
                <tr><td>Nhà xuất bản</td><td>${book.publisher}</td></tr>
                <tr><td>Ngày xuất bản</td><td>${new Date(book.publishDate).toLocaleDateString('vi-VN')}</td></tr>
                <tr><td>ISBN</td><td>${book.isbn}</td></tr>
                <tr><td>Số trang</td><td>${book.pages}</td></tr>
                <tr><td>Ngôn ngữ</td><td>${book.language}</td></tr>
                <tr><td>Định dạng</td><td>${book.format}</td></tr>
                <tr><td>Trọng lượng</td><td>${book.weight}</td></tr>
                <tr><td>Kích thước</td><td>${book.dimensions}</td></tr>
            </table>
        `;
    }
    
    // Reviews tab
    const reviewsTab = document.getElementById('reviews');
    if (reviewsTab) {
        reviewsTab.innerHTML = `
            <div class="reviews-summary">
                <div class="overall-rating">
                    <span class="rating-number">${book.rating}</span>
                    <div class="rating-stars">${renderStars(book.rating)}</div>
                    <p>${book.reviewCount} đánh giá</p>
                </div>
                <div class="rating-breakdown">
                    <div class="rating-bar">
                        <span>5 sao</span>
                        <div class="bar"><div class="fill" style="width: 60%"></div></div>
                        <span>60%</span>
                    </div>
                    <div class="rating-bar">
                        <span>4 sao</span>
                        <div class="bar"><div class="fill" style="width: 25%"></div></div>
                        <span>25%</span>
                    </div>
                    <div class="rating-bar">
                        <span>3 sao</span>
                        <div class="bar"><div class="fill" style="width: 10%"></div></div>
                        <span>10%</span>
                    </div>
                    <div class="rating-bar">
                        <span>2 sao</span>
                        <div class="bar"><div class="fill" style="width: 3%"></div></div>
                        <span>3%</span>
                    </div>
                    <div class="rating-bar">
                        <span>1 sao</span>
                        <div class="bar"><div class="fill" style="width: 2%"></div></div>
                        <span>2%</span>
                    </div>
                </div>
            </div>
            <div class="reviews-list">
                <p>Chức năng đánh giá sẽ được phát triển trong phiên bản tiếp theo.</p>
            </div>
        `;
    }
}

function changeMainImage(src, thumbnail) {
    const mainImage = document.querySelector('.main-image img');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage) {
        mainImage.src = src;
    }
    
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnail.classList.add('active');
}

function loadRelatedProducts(currentBookId) {
    const relatedContainer = document.querySelector('.related-products .products-grid');
    if (relatedContainer && window.BookDatabase) {
        const relatedBooks = window.BookDatabase.getRelatedBooks(currentBookId);
        relatedContainer.innerHTML = relatedBooks.map(book => renderProductCard(book)).join('');
        
        // Re-initialize product grid
        initializeProductGrid();
    }
}

function initializeCategoryPage() {
    console.log('Category page initialized');
    loadCategoryContent();
    initializeFilters();
}

function loadCategoryContent() {
    console.log('loadCategoryContent called');
    
    if (!window.BookDatabase) {
        console.log('BookDatabase not available');
        return;
    }
    
    console.log('BookDatabase is available:', typeof window.BookDatabase);
    console.log('getAllBooks method:', typeof window.BookDatabase.getAllBooks);
    
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const subcategory = urlParams.get('subcategory');
    const search = urlParams.get('search');
    const type = urlParams.get('type');
    
    console.log('URL params:', { category, subcategory, search, type });
    console.log('Current URL:', window.location.href);
    
    let books = [];
    let pageTitle = 'Tất cả sản phẩm';
    
    try {
        // Mặc định hiển thị tất cả sách
        books = window.BookDatabase.getAllBooks();
        console.log('Got', books.length, 'books from database');
        console.log('First book:', books[0]);
    } catch (error) {
        console.error('Error getting books:', error);
        return;
    }
    
    if (type === 'featured') {
        console.log('Loading featured books...');
        books = window.BookDatabase.getFeaturedBooks();
        pageTitle = 'Sản phẩm nổi bật';
    } else if (type === 'new') {
        console.log('Loading new books...');
        books = window.BookDatabase.getNewBooks();
        pageTitle = 'Sách mới phát hành';
    } else if (search) {
        console.log('Searching books for:', search);
        books = window.BookDatabase.searchBooks(search);
        pageTitle = `Kết quả tìm kiếm: "${search}"`;
    } else if (subcategory) {
        console.log('Loading subcategory:', category, subcategory);
        books = window.BookDatabase.getBooksBySubcategory(category, subcategory);
        pageTitle = window.BookDatabase.getSubcategoryName(category, subcategory);
    } else if (category) {
        console.log('Loading category:', category);
        books = window.BookDatabase.getBooksByCategory(category);
        pageTitle = window.BookDatabase.getCategoryName(category);
        console.log('Category books found:', books.length);
        console.log('Page title:', pageTitle);
    } else {
        console.log('Loading all books...');
        books = window.BookDatabase.getAllBooks();
    }
    
    // Update page title
    const titleElement = document.querySelector('#categoryTitle');
    if (titleElement) {
        titleElement.textContent = pageTitle;
    }
    
    document.title = `${pageTitle} - BookShelf`;
    
    // Update results count
    const resultsCount = document.querySelector('.results-count');
    if (resultsCount) {
        resultsCount.textContent = `Tìm thấy ${books.length} sản phẩm`;
    }
    
    // Render products
    renderCategoryProducts(books);
}

function renderCategoryProducts(books) {
    console.log('renderCategoryProducts called with', books.length, 'books');
    
    const productsGrid = document.querySelector('#productGrid');
    if (!productsGrid) {
        console.log('ProductGrid not found in DOM');
        return;
    }
    
    console.log('ProductGrid found:', productsGrid);
    
    if (books.length === 0) {
        console.log('No books to render');
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>Không tìm thấy sản phẩm nào</h3>
                <p>Vui lòng thử lại với từ khóa khác hoặc xem các danh mục khác.</p>
            </div>
        `;
        return;
    }
    
    console.log('Rendering', books.length, 'products');
    console.log('First book:', books[0]);
    
    try {
        // Clear loading placeholder and render products
        const productHTML = books.map(book => renderProductCard(book)).join('');
        console.log('Generated HTML length:', productHTML.length);
        
        productsGrid.innerHTML = productHTML;
        
        console.log('Products rendered successfully');
        console.log('ProductGrid children count:', productsGrid.children.length);
    } catch (error) {
        console.error('Error rendering products:', error);
        productsGrid.innerHTML = '<div class="error">Lỗi khi tải sản phẩm</div>';
    }
    
    // Store current books for filtering/sorting
    window.currentBooks = books;
    
    // Initialize product grid and update pagination
    initializeProductGrid();
    updateProductDisplay(currentPage);
}

function initializeAboutPage() {
    console.log('About page initialized');
}

// ========== PRODUCT PAGE FEATURES ========== //
function initializeProductDetails() {
    // Quantity controls
    const quantityMinus = document.querySelector('.quantity-minus');
    const quantityPlus = document.querySelector('.quantity-plus');
    const quantityInput = document.querySelector('.quantity-input');
    
    if (quantityMinus) {
        quantityMinus.addEventListener('click', () => {
            const current = parseInt(quantityInput.value);
            if (current > 1) {
                quantityInput.value = current - 1;
            }
        });
    }
    
    if (quantityPlus) {
        quantityPlus.addEventListener('click', () => {
            const current = parseInt(quantityInput.value);
            quantityInput.value = current + 1;
        });
    }
    
    // Add to cart button
    const addToCartBtn = document.querySelector('.btn-add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const productId = getProductIdFromUrl();
            const quantity = parseInt(quantityInput?.value || 1);
            addToCart(productId, quantity);
        });
    }
    
    // Add to cart button for product page (different class name)
    const addToCartBtnProduct = document.querySelector('.btn-add-cart');
    if (addToCartBtnProduct) {
        addToCartBtnProduct.addEventListener('click', () => {
            const productId = getProductIdFromUrl();
            const quantityInput = document.getElementById('quantity');
            const quantity = parseInt(quantityInput?.value || 1);
            addToCart(productId, quantity);
        });
    }
    
    // Buy now button
    const buyNowBtn = document.querySelector('.btn-buy-now');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', () => {
            const productId = getProductIdFromUrl();
            const quantityInput = document.getElementById('quantity');
            const quantity = parseInt(quantityInput?.value || 1);
            addToCart(productId, quantity);
            // Redirect to checkout
            setTimeout(() => {
                window.location.href = 'checkout.html';
            }, 500);
        });
    }
    
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            button.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log('Product ID from URL:', id);
    return id || '1';
}

function changeQuantity(delta) {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        const currentValue = parseInt(quantityInput.value) || 1;
        const newValue = Math.max(1, currentValue + delta);
        quantityInput.value = newValue;
    }
}

function updateBreadcrumb(book) {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb) {
        const categoryName = window.BookDatabase.getCategoryName(book.category);
        const subcategoryName = window.BookDatabase.getSubcategoryName(book.subcategory);
        
        breadcrumb.innerHTML = `
            <a href="index.html">Trang chủ</a>
            <span>/</span>
            <a href="category.html?category=${book.category}">${categoryName}</a>
            <span>/</span>
            <a href="category.html?subcategory=${book.subcategory}">${subcategoryName}</a>
            <span>/</span>
            <span>${book.title}</span>
        `;
    }
}

// ========== CATEGORY PAGE FEATURES ========== //


function initializeProductPage() {
    console.log('Product page initialized');
    
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        console.log('No product ID found in URL');
        return;
    }
    
    console.log('Loading product with ID:', productId);
    
    // Load product details
    loadProductDetails(productId);
}

function loadProductDetails(productId) {
    if (!window.BookDatabase) {
        console.log('BookDatabase not available');
        return;
    }
    
    const product = window.BookDatabase.getBookById(productId);
    
    if (!product) {
        console.log('Product not found with ID:', productId);
        document.getElementById('productTitle').textContent = 'Sản phẩm không tồn tại';
        return;
    }
    
    console.log('Product found:', product);
    
    // Update page title
    document.title = `${product.title} - BookSelf`;
    
    // Update breadcrumb
    document.getElementById('breadcrumb-product').textContent = product.title;
    
    // Update main image
    const mainImage = document.getElementById('mainProductImage');
    mainImage.src = product.images[0];
    mainImage.alt = product.title;
    
    // Update thumbnails
    const thumbnailsContainer = document.getElementById('imageThumbnails');
    thumbnailsContainer.innerHTML = '';
    product.images.forEach((image, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image;
        thumbnail.alt = product.title;
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.onclick = () => changeMainImage(thumbnail);
        thumbnailsContainer.appendChild(thumbnail);
    });
    
    // Update product info
    document.getElementById('productTitle').textContent = product.title;
    document.getElementById('productAuthor').textContent = product.author;
    document.getElementById('productSku').textContent = product.id;
    
    // Update brand (use publisher if available, otherwise default to BookSelf)
    const brandElement = document.getElementById('productBrand');
    if (brandElement && product.publisher) {
        brandElement.textContent = product.publisher;
    }
    
    // Update shop name to match brand
    const shopNameElement = document.getElementById('shopName');
    if (shopNameElement && product.publisher) {
        shopNameElement.textContent = product.publisher.toUpperCase();
    }
    
    // Update rating
    const ratingContainer = document.getElementById('productRating');
    ratingContainer.innerHTML = `
        <div class="stars">${renderStars(product.rating)}</div>
        <span class="rating-text">(${product.reviewCount})</span>
    `;
    
    // Update price
    document.getElementById('currentPrice').textContent = formatPrice(product.price);
    if (product.originalPrice > product.price) {
        const originalPriceEl = document.getElementById('originalPrice');
        originalPriceEl.textContent = formatPrice(product.originalPrice);
        originalPriceEl.style.display = 'inline';
    }
    
    // Update badges
    if (product.discount > 0) {
        const discountBadge = document.getElementById('discountBadge');
        discountBadge.textContent = `-${product.discount}%`;
        discountBadge.style.display = 'block';
    }
    
    if (product.newRelease) {
        document.getElementById('newBadge').style.display = 'block';
    }
    
    // Update stock status
    const stockStatus = document.getElementById('stockStatus');
    if (product.stock > 0) {
        stockStatus.innerHTML = `<span class="in-stock">Còn hàng (${product.stock} sản phẩm)</span>`;
    } else {
        stockStatus.innerHTML = `<span class="out-of-stock">Hết hàng</span>`;
    }
    
    // Update description
    document.getElementById('productDescription').innerHTML = `
        <p>${product.description}</p>
        <div class="product-tags">
            <strong>Tags:</strong>
            ${product.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
    `;
    
    // Update specifications
    document.getElementById('productSpecifications').innerHTML = `
        <table class="specs-table">
            <tr><td>ISBN:</td><td>${product.isbn}</td></tr>
            <tr><td>Số trang:</td><td>${product.pages}</td></tr>
            <tr><td>Ngôn ngữ:</td><td>${product.language}</td></tr>
            <tr><td>Định dạng:</td><td>${product.format}</td></tr>
            <tr><td>Trọng lượng:</td><td>${product.weight}</td></tr>
            <tr><td>Kích thước:</td><td>${product.dimensions}</td></tr>
            <tr><td>Nhà xuất bản:</td><td>${product.publisher}</td></tr>
            <tr><td>Ngày phát hành:</td><td>${product.publishDate}</td></tr>
        </table>
    `;
    
    // Update reviews (placeholder)
    document.getElementById('productReviews').innerHTML = `
        <div class="reviews-summary">
            <div class="rating-overview">
                <span class="rating-number">${product.rating}</span>
                <div class="stars">${renderStars(product.rating)}</div>
                <span class="review-count">${product.reviewCount} đánh giá</span>
            </div>
        </div>
        <p>Chức năng đánh giá sẽ được phát triển trong phiên bản tiếp theo.</p>
    `;
    
    // Load related products
    loadRelatedProducts(productId);
    
    // Initialize wishlist button
    initializeWishlistButton(productId);
    
    // Initialize add to cart functionality
    initializeAddToCart(productId);
}

function loadRelatedProducts(productId) {
    if (!window.BookDatabase) {
        console.log('BookDatabase not available for related products');
        return;
    }
    
    const currentProduct = window.BookDatabase.getBookById(productId);
    if (!currentProduct) {
        console.log('Current product not found for related products');
        return;
    }
    
    // Get products from the same category
    const relatedProducts = window.BookDatabase.getBooksByCategory(currentProduct.category)
        .filter(product => product.id !== currentProduct.id)
        .slice(0, 4); // Show max 4 related products
    
    console.log('Found', relatedProducts.length, 'related products');
    
    const relatedGrid = document.getElementById('relatedProductsGrid');
    if (relatedGrid && relatedProducts.length > 0) {
        relatedGrid.innerHTML = relatedProducts.map(book => renderProductCard(book)).join('');
        
        // Initialize product grid for related products
        setTimeout(() => {
            initializeProductGrid();
        }, 100);
    } else if (relatedGrid) {
        relatedGrid.innerHTML = '<p>Không có sản phẩm liên quan.</p>';
    }
}

function initializeWishlistButton(productId) {
    const wishlistBtn = document.getElementById('wishlistBtn');
    if (wishlistBtn) {
        wishlistBtn.onclick = (e) => {
            e.preventDefault();
            toggleWishlist(productId);
            
            // Visual feedback
            wishlistBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                wishlistBtn.style.transform = 'scale(1)';
            }, 150);
        };
        
        // Update button state
        updateWishlistButtons();
    }
}

function initializeAddToCart(productId) {
    const addToCartBtn = document.getElementById('addToCartBtn');
    const buyNowBtn = document.getElementById('buyNowBtn');
    
    if (addToCartBtn) {
        addToCartBtn.onclick = (e) => {
            e.preventDefault();
            const quantity = parseInt(document.getElementById('quantity').value);
            addToCart(productId, quantity);
            
            // Visual feedback
            addToCartBtn.style.transform = 'scale(0.9)';
            addToCartBtn.style.backgroundColor = '#28a745';
            setTimeout(() => {
                addToCartBtn.style.transform = 'scale(1)';
                addToCartBtn.style.backgroundColor = '';
            }, 200);
        };
    }
    
    if (buyNowBtn) {
        buyNowBtn.onclick = (e) => {
            e.preventDefault();
            const quantity = parseInt(document.getElementById('quantity').value);
            addToCart(productId, quantity);
            
            // Redirect to checkout
            setTimeout(() => {
                window.location.href = 'checkout.html';
            }, 500);
        };
    }
}

function initializeFilters() {
    // Sort dropdown
    const sortSelect = document.querySelector('#sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', sortProducts);
    }
    
    // Price filter buttons
    const priceFilters = document.querySelectorAll('.filter-tag');
    priceFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            priceFilters.forEach(otherBtn => {
                otherBtn.classList.remove('active');
            });
            
            // Add active to clicked
            btn.classList.add('active');
            
            // Get the price range from onclick attribute
            const onclick = btn.getAttribute('onclick');
            if (onclick) {
                const match = onclick.match(/filterByPrice\('([^']+)'\)/);
                if (match) {
                    filterByPrice(match[1]);
                }
            }
        });
    });
    
    // View mode toggle
    const viewModeButtons = document.querySelectorAll('.view-btn');
    viewModeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.view;
            toggleViewMode(mode);
            
            // Update button states
            viewModeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function applySorting() {
    const sortSelect = document.querySelector('.sort-select');
    const sortBy = sortSelect.value;
    
    if (window.currentBooks && window.BookDatabase) {
        const sortedBooks = window.BookDatabase.sortBooks(window.currentBooks, sortBy);
        renderCategoryProducts(sortedBooks);
    }
}

function applyFilters() {
    if (!window.currentBooks || !window.BookDatabase) return;
    
    let filteredBooks = [...window.currentBooks];
    
    // Apply price filter
    const activePriceFilter = document.querySelector('.filter-btn[data-price].active');
    if (activePriceFilter) {
        const priceRange = activePriceFilter.dataset.price;
        filteredBooks = window.BookDatabase.filterByPrice(filteredBooks, priceRange);
    }
    
    // Apply category filter
    const activeCategoryFilters = document.querySelectorAll('.filter-btn[data-category].active');
    if (activeCategoryFilters.length > 0) {
        const categories = Array.from(activeCategoryFilters).map(btn => btn.dataset.category);
        filteredBooks = filteredBooks.filter(book => categories.includes(book.category));
    }
    
    renderCategoryProducts(filteredBooks);
}

function toggleViewMode(mode) {
    const productGrid = document.querySelector('.products-grid');
    if (!productGrid) return;
    
    productGrid.classList.remove('grid-view', 'list-view');
    productGrid.classList.add(`${mode}-view`);
    
    // Save preference
    localStorage.setItem('bookshelf-view-mode', mode);
}

// ========== AUTHENTICATION INTEGRATION ========== //
function initializeAuth() {
    updateUserInterface();
    
    // User account link
    const userAccountLink = document.querySelector('.user-actions a[href="#"]');
    if (userAccountLink) {
        userAccountLink.addEventListener('click', handleUserAccountClick);
    }
}

// Get current logged in user
function getCurrentUser() {
    // Check localStorage first (remember me)
    let userSession = localStorage.getItem('bookshelf-user');
    
    // If not found, check sessionStorage
    if (!userSession) {
        userSession = sessionStorage.getItem('bookshelf-user');
    }
    
    if (userSession) {
        try {
            return JSON.parse(userSession);
        } catch (e) {
            console.error('Error parsing user session:', e);
            return null;
        }
    }
    
    return null;
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Get all users from localStorage
function getUsers() {
    const users = localStorage.getItem('bookshelf-users');
    return users ? JSON.parse(users) : [];
}

// Logout user
function logout() {
    localStorage.removeItem('bookshelf-user');
    sessionStorage.removeItem('bookshelf-user');
    updateUserInterface();
    showNotification('Đã đăng xuất thành công!', 'success');
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function updateUserInterface() {
    const user = getCurrentUser();
    const userAccountLink = document.querySelector('.user-actions a[href="auth.html"]');
    const adminLink = document.querySelector('.admin-link');
    
    if (userAccountLink) {
        if (user) {
            userAccountLink.innerHTML = `
                <i class="fa-regular fa-user"></i> 
                <span>${user.name}</span>
            `;
            userAccountLink.href = 'profile.html';
            
            // Show admin link if user is admin
            if (user.role === 'admin' && adminLink) {
                adminLink.style.display = 'inline-flex';
            }
        } else {
            userAccountLink.innerHTML = `
                <i class="fa-regular fa-user"></i> 
                <span>Tài khoản</span>
            `;
            userAccountLink.href = 'auth.html';
            
            // Hide admin link
            if (adminLink) {
                adminLink.style.display = 'none';
            }
        }
    }
}

function handleUserAccountClick(e) {
    // For front-end demo, always go to auth page
    e.preventDefault();
    window.location.href = 'auth.html';
}

function addLogoutOption() {
    // Remove existing logout option if any
    const existingLogout = document.querySelector('.logout-option');
    if (existingLogout) {
        existingLogout.remove();
    }
    
    const userActions = document.querySelector('.user-actions');
    if (userActions) {
        const logoutOption = document.createElement('a');
        logoutOption.className = 'logout-option';
        logoutOption.href = '#';
        logoutOption.innerHTML = `
            <i class="fas fa-sign-out-alt"></i> 
            <span>Đăng xuất</span>
        `;
        
        logoutOption.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
        
        userActions.appendChild(logoutOption);
    }
}

function loadRelatedProducts(currentBook) {
    const relatedProductsSection = document.querySelector('.related-products-section .product-grid');
    if (!relatedProductsSection) return;
    
    // Get related books from same category, excluding current book
    const relatedBooks = window.BookDatabase.getBooksByCategory(currentBook.category)
        .filter(book => book.id !== currentBook.id)
        .slice(0, 4); // Show 4 related products
    
    if (relatedBooks.length === 0) {
        relatedProductsSection.innerHTML = '<p>Không có sản phẩm liên quan.</p>';
        return;
    }
    
    relatedProductsSection.innerHTML = relatedBooks.map(book => `
        <div class="product-card" onclick="window.location.href='product.html?id=${book.id}'">
            <div class="product-image">
                <img src="${book.images[0]}" alt="${book.title}">
                ${book.discount > 0 ? `<div class="discount-badge">-${book.discount}%</div>` : ''}
                ${book.newRelease ? '<div class="new-badge">Mới</div>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${book.title}</h3>
                <p class="product-author">${book.author}</p>
                <div class="product-rating">
                    ${renderStars(book.rating)}
                    <span class="rating-count">(${book.reviewCount})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${formatPrice(book.price)}</span>
                    ${book.originalPrice > book.price ? `<span class="original-price">${formatPrice(book.originalPrice)}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function openChat() {
    // Check if user is logged in
    const user = getCurrentUser();
    if (!user) {
        showNotification('Vui lòng đăng nhập để sử dụng tính năng chat!', 'error');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1500);
        return;
    }
    
    // Open chat modal
    const chatModal = document.getElementById('chatModal');
    if (chatModal) {
        chatModal.style.display = 'flex';
    } else {
        createChatModal();
    }
}

function viewShop() {
    // Redirect to shop page (demo)
    showNotification('Tính năng xem shop đang được phát triển!', 'info');
}

function createChatModal() {
    const modal = document.createElement('div');
    modal.id = 'chatModal';
    modal.className = 'chat-modal';
    modal.innerHTML = `
        <div class="chat-modal-content">
            <div class="chat-header">
                <h3>Chat với OMEGA BOOKS</h3>
                <button class="close-chat" onclick="closeChat()">&times;</button>
            </div>
            <div class="chat-messages" id="chatMessages">
                <div class="message bot-message">
                    <div class="message-content">
                        <p>Xin chào! Tôi có thể giúp gì cho bạn?</p>
                        <span class="message-time">${new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
            </div>
            <div class="chat-input">
                <input type="text" id="chatInput" placeholder="Nhập tin nhắn...">
                <button onclick="sendMessage()">Gửi</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function closeChat() {
    const chatModal = document.getElementById('chatModal');
    if (chatModal) {
        chatModal.style.display = 'none';
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
            <span class="message-time">${new Date().toLocaleTimeString()}</span>
        </div>
    `;
    messages.appendChild(userMessage);
    
    // Clear input
    input.value = '';
    
    // Simulate bot response
    setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot-message';
        botMessage.innerHTML = `
            <div class="message-content">
                <p>Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
                <span class="message-time">${new Date().toLocaleTimeString()}</span>
            </div>
        `;
        messages.appendChild(botMessage);
        messages.scrollTop = messages.scrollHeight;
    }, 1000);
    
    messages.scrollTop = messages.scrollHeight;
}

function toggleChatbot() {
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    
    if (chatbotWindow.style.display === 'block') {
        chatbotWindow.style.display = 'none';
        chatbotToggle.innerHTML = '<i class="fas fa-comments"></i>';
    } else {
        chatbotWindow.style.display = 'block';
        chatbotToggle.innerHTML = '<i class="fas fa-times"></i>';
    }
}

function sendChatbotMessage() {
    const input = document.getElementById('chatbotInput');
    const messages = document.getElementById('chatbotMessages');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
            <span class="message-time">${new Date().toLocaleTimeString()}</span>
        </div>
    `;
    messages.appendChild(userMessage);
    
    // Clear input
    input.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot-message';
        
        let response = getAIResponse(message);
        
        botMessage.innerHTML = `
            <div class="message-content">
                <p>${response}</p>
                <span class="message-time">${new Date().toLocaleTimeString()}</span>
            </div>
        `;
        messages.appendChild(botMessage);
        messages.scrollTop = messages.scrollHeight;
    }, 1000);
    
    messages.scrollTop = messages.scrollHeight;
}

function getAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('sách') || lowerMessage.includes('book')) {
        return 'Tôi có thể giúp bạn tìm sách theo thể loại. Bạn muốn tìm sách gì? Ví dụ: sách kinh tế, sách văn học, sách thiếu nhi...';
    } else if (lowerMessage.includes('giá') || lowerMessage.includes('price')) {
        return 'Giá sách được hiển thị trên từng sản phẩm. Bạn có thể xem chi tiết giá và các chương trình khuyến mãi khi click vào sản phẩm.';
    } else if (lowerMessage.includes('đặt hàng') || lowerMessage.includes('mua')) {
        return 'Để đặt hàng, bạn cần đăng nhập tài khoản và thêm sản phẩm vào giỏ hàng. Sau đó tiến hành thanh toán.';
    } else if (lowerMessage.includes('giao hàng') || lowerMessage.includes('ship')) {
        return 'Chúng tôi giao hàng toàn quốc. Thời gian giao hàng từ 1-3 ngày làm việc tùy theo địa điểm.';
    } else if (lowerMessage.includes('đổi trả') || lowerMessage.includes('return')) {
        return 'Bạn có thể đổi trả sản phẩm trong vòng 30 ngày nếu sản phẩm còn nguyên vẹn và có hóa đơn mua hàng.';
    } else {
        return 'Cảm ơn bạn đã liên hệ! Tôi có thể giúp bạn tìm sách, hỗ trợ đặt hàng, hoặc trả lời các câu hỏi về sản phẩm. Bạn cần hỗ trợ gì thêm?';
    }
}

function chatWithCustomerService() {
    const messages = document.getElementById('chatbotMessages');
    
    // Add bot message
    const botMessage = document.createElement('div');
    botMessage.className = 'message bot-message';
    botMessage.innerHTML = `
        <div class="message-content">
            <p>Chuyển bạn đến chat với nhân viên CSKH. Vui lòng đợi trong giây lát...</p>
            <span class="message-time">${new Date().toLocaleTimeString()}</span>
        </div>
    `;
    messages.appendChild(botMessage);
    
    // Simulate connecting to customer service
    setTimeout(() => {
        const csMessage = document.createElement('div');
        csMessage.className = 'message bot-message';
        csMessage.innerHTML = `
            <div class="message-content">
                <p>Xin chào! Tôi là nhân viên CSKH của BookShelf. Tôi có thể hỗ trợ bạn về đơn hàng, thanh toán, giao hàng và các vấn đề khác. Bạn cần hỗ trợ gì?</p>
                <span class="message-time">${new Date().toLocaleTimeString()}</span>
            </div>
        `;
        messages.appendChild(csMessage);
        messages.scrollTop = messages.scrollHeight;
    }, 2000);
    
    messages.scrollTop = messages.scrollHeight;
}

// Export functions for global access
if (typeof window !== 'undefined') {
    window.changeQuantity = changeQuantity;
    window.openChat = openChat;
    window.viewShop = viewShop;
    window.closeChat = closeChat;
    window.sendMessage = sendMessage;
    window.toggleChatbot = toggleChatbot;
    window.sendChatbotMessage = sendChatbotMessage;
    window.chatWithCustomerService = chatWithCustomerService;
}

// ========== CATEGORY PAGE FUNCTIONS ========== //

// Filter products by price range
function filterByPrice(priceRange) {
    // Update active filter button
    document.querySelectorAll('.filter-tag').forEach(btn => {
        btn.classList.remove('active');
        // Check if this button's onclick matches the priceRange
        const onclick = btn.getAttribute('onclick');
        if (onclick && onclick.includes(`'${priceRange}'`)) {
            btn.classList.add('active');
        }
    });
    
    // Get current products
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    const products = productGrid.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const priceElement = product.querySelector('.current-price');
        if (!priceElement) return;
        
        const priceText = priceElement.textContent;
        // Remove all non-digit characters and convert to number
        const price = parseFloat(priceText.replace(/[^\d]/g, ''));
        
        let show = true;
        
        switch(priceRange) {
            case 'under-200':
                show = price < 200000;
                break;
            case '200-300':
                show = price >= 200000 && price <= 300000;
                break;
            case '300-500':
                show = price >= 300000 && price <= 500000;
                break;
            case '500-1000':
                show = price >= 500000 && price <= 1000000;
                break;
            case 'over-1000':
                show = price > 1000000;
                break;
            case 'all':
            default:
                show = true;
                break;
        }
        
        if (show) {
            product.classList.remove('hidden');
        } else {
            product.classList.add('hidden');
        }
    });
    
    // Update pagination after filtering
    setTimeout(() => {
        updateProductDisplay(currentPage);
    }, 100);
}

// Set view mode (grid or list)
function setView(viewMode) {
    console.log('Setting view mode:', viewMode);
    
    // Update active view button
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.${viewMode}-view`).classList.add('active');
    
    // Get products container
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    if (viewMode === 'list') {
        productGrid.classList.add('list-view');
        productGrid.classList.remove('grid-view');
    } else {
        productGrid.classList.add('grid-view');
        productGrid.classList.remove('list-view');
    }
}

// Sort products
function sortProducts() {
    const sortSelect = document.getElementById('sortSelect');
    const sortValue = sortSelect.value;
    
    console.log('Sorting products by:', sortValue);
    
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    const products = Array.from(productGrid.querySelectorAll('.product-card'));
    
    products.sort((a, b) => {
        switch(sortValue) {
            case 'price-low':
                const priceA = parseFloat(a.querySelector('.current-price')?.textContent.replace(/[^\d]/g, '') || '0');
                const priceB = parseFloat(b.querySelector('.current-price')?.textContent.replace(/[^\d]/g, '') || '0');
                return priceA - priceB;
            case 'price-high':
                const priceA2 = parseFloat(a.querySelector('.current-price')?.textContent.replace(/[^\d]/g, '') || '0');
                const priceB2 = parseFloat(b.querySelector('.current-price')?.textContent.replace(/[^\d]/g, '') || '0');
                return priceB2 - priceA2;
            case 'name':
                const nameA = a.querySelector('.product-title')?.textContent || '';
                const nameB = b.querySelector('.product-title')?.textContent || '';
                return nameA.localeCompare(nameB);
            case 'newest':
                return 0; // Keep original order for newest
            default:
                return 0;
        }
    });
    
    // Re-append sorted products
    products.forEach(product => productGrid.appendChild(product));
    
    // Update pagination after sorting
    setTimeout(() => {
        updateProductDisplay(currentPage);
    }, 100);
}

// Change page (pagination)
function changePage(direction) {
    console.log('Changing page:', direction);
    
    const totalPages = Math.ceil(totalProducts / currentProductsPerPage);
    let newPage = currentPage + direction;
    
    // Validate page bounds
    if (newPage < 1) newPage = 1;
    if (newPage > totalPages) newPage = totalPages;
    
    if (newPage === currentPage) return; // No change needed
    
    currentPage = newPage;
    updateProductDisplay(currentPage);
}

// Global variables for pagination
let currentProductsPerPage = 30; // Fixed at 30 items per page
let currentPage = 1;
let totalProducts = 0;

function updateProductDisplay(page) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) {
        console.log('ProductGrid not found');
        return;
    }
    
    const products = productGrid.querySelectorAll('.product-card');
    totalProducts = products.length;
    
    console.log(`Total products found: ${totalProducts}`);
    
    if (totalProducts === 0) {
        console.log('No products to display');
        return;
    }
    
    // Calculate pagination
    const totalPages = Math.ceil(totalProducts / currentProductsPerPage);
    const startIndex = (page - 1) * currentProductsPerPage;
    const endIndex = startIndex + currentProductsPerPage;
    
    // Show/hide products based on pagination
    products.forEach((product, index) => {
        if (index >= startIndex && index < endIndex) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
    
    // Update pagination controls
    updatePaginationControls();
    
    console.log(`Showing products ${startIndex + 1}-${Math.min(endIndex, totalProducts)} of ${totalProducts} (Page ${page}/${totalPages})`);
}

function updatePaginationControls() {
    const totalPages = Math.ceil(totalProducts / currentProductsPerPage);
    const paginationContainer = document.querySelector('.pagination');
    
    console.log('Updating pagination controls:', { totalProducts, currentProductsPerPage, totalPages, currentPage });
    
    if (!paginationContainer) {
        console.log('Pagination container not found');
        return;
    }
    
    // Update page numbers
    const pageNumbers = paginationContainer.querySelector('.page-numbers');
    if (pageNumbers) {
        pageNumbers.innerHTML = '';
        
        // Show max 5 pages
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-num ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.onclick = () => goToPage(i);
            pageNumbers.appendChild(pageBtn);
        }
    }
    
    // Update prev/next buttons
    const prevBtn = paginationContainer.querySelector('.page-btn:first-child');
    const nextBtn = paginationContainer.querySelector('.page-btn:last-child');
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
    }
}


function goToPage(page) {
    if (page === currentPage) return; // Already on this page
    
    currentPage = page;
    updateProductDisplay(currentPage);
}

// Function to change items per page
function changeItemsPerPage(itemsPerPage) {
    currentProductsPerPage = itemsPerPage;
    currentPage = 1; // Reset to first page
    updateProductDisplay(currentPage);
}

// Export category functions to global scope
window.filterByPrice = filterByPrice;
window.setView = setView;
window.sortProducts = sortProducts;
window.changePage = changePage;
window.goToPage = goToPage;
window.changeItemsPerPage = changeItemsPerPage;