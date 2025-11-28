// ========== PRODUCT PAGE FUNCTIONS ========== //

function initializeProductPage() {
    console.log('Product page initialized');
    
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        console.error('No product ID provided');
        return;
    }
    
    console.log('Loading product with ID:', productId);
    
    // Load product details
    loadProductDetails(productId);
}

function loadProductDetails(productId) {
    if (!window.BookDatabase) return;
    
    const product = window.BookDatabase.getBookById(productId);
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    // Update basic info
    document.title = `${product.title} - BookSelf`;
    document.getElementById('breadcrumb-product').textContent = product.title;
    document.getElementById('productTitle').textContent = product.title;
    document.getElementById('productAuthor').textContent = product.author;
    document.getElementById('productSku').textContent = product.id;
    
    // Update images
    const mainImage = document.getElementById('mainProductImage');
    mainImage.src = product.images[0];
    mainImage.alt = product.title;
    
    document.getElementById('imageThumbnails').innerHTML = product.images.map((image, index) => 
        `<img src="${image}" alt="${product.title}" class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage(this)">`
    ).join('');
    
    // Update publisher info
    if (product.publisher) {
        const publisherLink = document.querySelector('.seller-details h4 a');
        if (publisherLink) {
            publisherLink.textContent = product.publisher;
            publisherLink.href = `shop.html?publisher=${encodeURIComponent(product.publisher)}`;
        }
        
        const viewShopBtn = document.getElementById('viewShopBtn');
        if (viewShopBtn) {
            viewShopBtn.onclick = () => {
                window.location.href = `shop.html?publisher=${encodeURIComponent(product.publisher)}`;
            };
        }
    }
    
    // Update rating and price
    document.getElementById('productRating').innerHTML = `
        <div class="stars">${renderStars(product.rating)}</div>
        <span class="rating-text">(${product.reviewCount})</span>
    `;
    document.getElementById('currentPrice').textContent = formatPrice(product.price);
    
    if (product.originalPrice > product.price) {
        const originalPriceEl = document.getElementById('originalPrice');
        originalPriceEl.textContent = formatPrice(product.originalPrice);
        originalPriceEl.style.display = 'inline';
    }
    
    // Update badges and stock
    if (product.discount > 0) {
        const discountBadge = document.querySelector('.product-images .discount-badge');
        if (discountBadge) discountBadge.textContent = `-${product.discount}%`;
    }
    if (product.newRelease) document.querySelector('.product-images .new-badge')?.classList.remove('hidden');
    
    const stockStatus = document.getElementById('stockStatus');
    const isInStock = product.stock > 0;
    stockStatus.className = `stock-status ${isInStock ? 'in-stock' : 'out-of-stock'}`;
    stockStatus.innerHTML = isInStock 
        ? `<i class="fas fa-check-circle"></i><span>Còn hàng (${product.stock} sản phẩm)</span>`
        : `<i class="fas fa-times-circle"></i><span>Hết hàng</span>`;
    
    // Update tabs
    document.getElementById('productDescription').innerHTML = `
        <p>${product.description}</p>
        <div class="product-tags">
            <strong>Tags:</strong>
            ${product.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
    `;
    
    const specs = [
        ['ISBN', product.isbn], ['Số trang', product.pages], ['Ngôn ngữ', product.language],
        ['Định dạng', product.format], ['Trọng lượng', product.weight], ['Kích thước', product.dimensions],
        ['Nhà xuất bản', product.publisher], ['Ngày phát hành', product.publishDate]
    ];
    document.getElementById('productSpecifications').innerHTML = `
        <table class="specs-table">
            ${specs.map(([label, value]) => `<tr><td>${label}:</td><td>${value}</td></tr>`).join('')}
        </table>
    `;
    
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
    
    // Initialize features
    [() => loadRelatedProducts(productId), () => initializeWishlistButton(productId), () => initializeAddToCart(productId)]
        .forEach(fn => fn());
}

function loadRelatedProducts(productId) {
    console.log('=== loadRelatedProducts DEBUG START ===');
    console.log('productId:', productId, 'type:', typeof productId);
    
    if (!window.BookDatabase) {
        console.error('BookDatabase not available');
        return;
    }
    
    console.log('✅ BookDatabase available');
    
    const currentProduct = window.BookDatabase.getBookById(productId);
    if (!currentProduct) {
        console.error('Current product not found');
        return;
    }
    
    console.log('✅ Current product found:', currentProduct.title);
    
    // Use the new smart algorithm
    const relatedProducts = window.BookDatabase.getRelatedBooks(productId, 4);
    
    console.log('✅ Found', relatedProducts.length, 'related products for product', productId);
    console.log('Related products:', relatedProducts);
    
    const relatedGrid = document.getElementById('relatedProductsGrid');
    console.log('Related grid element:', relatedGrid);
    
    if (relatedGrid && relatedProducts.length > 0) {
        relatedGrid.innerHTML = relatedProducts.map(book => renderRelatedProductCard(book)).join('');
        
        // Re-initialize event listeners for new cards
        initializeRelatedProducts();
    } else if (relatedGrid) {
        relatedGrid.innerHTML = `
            <div class="no-products"><p>Không có sản phẩm liên quan</p></div>
        `;
    }
    
    console.log('=== loadRelatedProducts DEBUG END ===');
}

function renderRelatedProductCard(book) {
    return `
        <div class="product-card" data-product-id="${book.id}">
            <div class="product-image">
                <img src="${book.images[0]}" alt="${book.title}" loading="lazy">
            </div>
            <div class="product-info">
                <h3 class="product-title">${book.title}</h3>
                <p class="product-author">${book.author}</p>
                <div class="product-price">
                    <span class="current-price">${formatPrice(book.price)}</span>
                    ${book.originalPrice > book.price ? `<span class="original-price">${formatPrice(book.originalPrice)}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

function initializeRelatedProducts() {
    const relatedCards = document.querySelectorAll('#relatedProductsGrid .product-card');
    
    relatedCards.forEach(card => {
        // Main card click
        card.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            const productId = card.dataset.productId;
            window.location.href = `product.html?id=${productId}`;
        });
        
        // Quick view
        const quickViewBtn = card.querySelector('.quick-view-btn');
        if (quickViewBtn) {
            quickViewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = card.dataset.productId;
                window.location.href = `product.html?id=${productId}`;
            });
        }
        
        // Add to cart
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = card.dataset.productId;
                addToCart(productId);
            });
        }
        
        // Wishlist
        const wishlistBtn = card.querySelector('.wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = card.dataset.productId;
                toggleWishlist(productId);
            });
        }
    });
}

function initializeWishlistButton(productId) {
    const wishlistBtn = document.getElementById('wishlistBtn');
    if (wishlistBtn) {
        // Check if product is in wishlist
        if (isInWishlist(productId)) {
            wishlistBtn.classList.add('active');
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> Đã yêu thích';
        } else {
            wishlistBtn.classList.remove('active');
            wishlistBtn.innerHTML = '<i class="far fa-heart"></i> Yêu thích';
        }
        
        // Add click handler
        wishlistBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (isInWishlist(productId)) {
                removeFromWishlist(productId);
                wishlistBtn.classList.remove('active');
                wishlistBtn.innerHTML = '<i class="far fa-heart"></i> Yêu thích';
            } else {
                addToWishlist(productId);
                wishlistBtn.classList.add('active');
                wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> Đã yêu thích';
            }
        };
    } else {
        console.warn('Wishlist button not found');
    }
}

function initializeAddToCart(productId) {
    const addToCartBtn = document.getElementById('addToCartBtn');
    const buyNowBtn = document.getElementById('buyNowBtn');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const quantityInput = document.getElementById('quantity');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
            
            if (quantity > 0) {
                addToCart(productId, quantity);
            } else {
                showNotification('Vui lòng chọn số lượng hợp lệ!', 'error');
            }
        });
    }
    
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const quantityInput = document.getElementById('quantity');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
            addToCart(productId, quantity);
            setTimeout(() => {
                window.location.href = 'checkout.html';
            }, 500);
        });
    }
}

function changeQuantity(delta) {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        const newValue = Math.max(1, parseInt(quantityInput.value) + delta);
        quantityInput.value = newValue;
    }
}

function viewShop() {
    const productId = getProductIdFromUrl();
    let publisher = null;
    
    if (productId && window.BookDatabase) {
        const product = window.BookDatabase.getBookById(productId);
        if (product && product.publisher) {
            publisher = product.publisher;
        }
    }
    
    if (publisher) {
        window.location.href = `shop.html?publisher=${encodeURIComponent(publisher)}`;
    } else {
        window.location.href = 'shop.html';
    }
}

function loadRelatedProductsForSection(currentBook) {
    const relatedProductsSection = document.querySelector('.related-products-section .product-grid');
    if (!relatedProductsSection) return;
    
    const relatedBooks = window.BookDatabase.getRelatedBooks(currentBook.id, 4);
    
    if (relatedBooks.length === 0) {
        relatedProductsSection.innerHTML = '<p class="no-products">Không có sản phẩm liên quan</p>';
        return;
    }
    
    relatedProductsSection.innerHTML = relatedBooks.map(book => `
        <div class="product-card" onclick="window.location.href='product.html?id=${book.id}'">
            <div class="product-image">
                <img src="${book.images[0]}" alt="${book.title}" loading="lazy">
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

function initializeProductGrid() {
    const productCards = document.querySelectorAll('.product-card, .product-item');
    
    productCards.forEach(card => {
        card.addEventListener('click', handleProductClick);
        
        const quickViewBtn = card.querySelector('.quick-view-btn');
        if (quickViewBtn) {
            quickViewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = card.dataset.productId || card.closest('[data-product-id]')?.dataset.productId;
                if (productId) {
                    window.location.href = `product.html?id=${productId}`;
                }
            });
        }
        
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = card.dataset.productId || card.closest('[data-product-id]')?.dataset.productId;
                if (productId) {
                    addToCart(productId);
                }
            });
        }
        
        const wishlistBtn = card.querySelector('.wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = wishlistBtn.dataset.productId || card.dataset.productId;
                if (productId) {
                    toggleWishlist(productId);
                }
            });
        }
    });
}

function handleProductClick(e) {
    const productCard = e.currentTarget;
    const productId = productCard.dataset.productId || '1';
    window.location.href = `product.html?id=${productId}`;
}

// Export to global scope
if (typeof window !== 'undefined') {
    window.initializeProductPage = initializeProductPage;
    window.loadProductDetails = loadProductDetails;
    window.changeQuantity = changeQuantity;
    window.viewShop = viewShop;
    window.renderProductCard = renderProductCard;
    window.initializeProductGrid = initializeProductGrid;
    window.loadRelatedProductsForSection = loadRelatedProductsForSection;
}
