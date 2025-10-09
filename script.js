// ========== BOOKSHELF INTERACTIVE FEATURES ========== //
// Main JavaScript file for dynamic functionality

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, BookDatabase available:', !!window.BookDatabase);
    
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
                window.location.href = `category.html?subcategory=${subcategory}`;
            });
        });
    });
}

function setActiveNavigationItem() {
    const currentPage = getCurrentPage();
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (currentPage === 'index' && href === 'index.html') {
            link.classList.add('active');
        } else if (currentPage === 'category' && href.includes('category.html')) {
            link.classList.add('active');
        } else if (currentPage === 'about' && href === 'about.html') {
            link.classList.add('active');
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
        
        // Add to cart button
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = card.dataset.productId || '1';
                addToCart(productId);
            });
        }
        
        // Wishlist button
        const wishlistBtn = card.querySelector('.wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = card.dataset.productId || '1';
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
            initializeProductGrid();
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
            initializeProductGrid();
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
    if (!window.BookDatabase) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const subcategory = urlParams.get('subcategory');
    const search = urlParams.get('search');
    
    let books = [];
    let pageTitle = 'Tất cả sách';
    
    if (search) {
        books = window.BookDatabase.searchBooks(search);
        pageTitle = `Kết quả tìm kiếm: "${search}"`;
    } else if (subcategory) {
        books = window.BookDatabase.getBooksBySubcategory(subcategory);
        pageTitle = window.BookDatabase.getSubcategoryName(subcategory);
    } else if (category) {
        books = window.BookDatabase.getBooksByCategory(category);
        pageTitle = window.BookDatabase.getCategoryName(category);
    } else {
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
    const productsGrid = document.querySelector('#productGrid');
    if (!productsGrid) return;
    
    if (books.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>Không tìm thấy sản phẩm nào</h3>
                <p>Vui lòng thử lại với từ khóa khác hoặc xem các danh mục khác.</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = books.map(book => renderProductCard(book)).join('');
    
    // Re-initialize product grid
    initializeProductGrid();
    
    // Store current books for filtering/sorting
    window.currentBooks = books;
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
function initializeFilters() {
    // Sort dropdown
    const sortSelect = document.querySelector('#sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', applySorting);
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
            
            applyFilters();
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
    // For front-end demo, always show "Tài khoản" link
    const userAccountLink = document.querySelector('.user-actions a[href="#"]');
    
    if (userAccountLink) {
        userAccountLink.innerHTML = `
            <i class="fa-regular fa-user"></i> 
            <span>Tài khoản</span>
        `;
        userAccountLink.href = 'auth.html';
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