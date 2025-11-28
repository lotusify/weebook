// ========== CATEGORY PAGE FUNCTIONS ========== //

// Global variables for pagination
let currentProductsPerPage = 30;
let currentPage = 1;
let totalProducts = 0;

function initializeCategoryPage() {
    console.log('Category page initialized');
    
    const paginationState = loadPaginationState();
    currentPage = paginationState.page;
    
    loadCategoryContent();
    initializeFilters();
}

function loadCategoryContent() {
    console.log('loadCategoryContent called');
    
    if (!window.BookDatabase) {
        console.error('BookDatabase not available');
        return;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const subcategory = urlParams.get('subcategory');
    const search = urlParams.get('search');
    const type = urlParams.get('type');
    
    const savedCategory = sessionStorage.getItem('categoryCurrentCategory');
    const savedSubcategory = sessionStorage.getItem('categoryCurrentSubcategory');
    
    if (category !== savedCategory || subcategory !== savedSubcategory) {
        currentPage = 1;
        clearPaginationState();
    }
    
    if (category) sessionStorage.setItem('categoryCurrentCategory', category);
    if (subcategory) sessionStorage.setItem('categoryCurrentSubcategory', subcategory);
    
    let books = [];
    let pageTitle = 'Tất cả sản phẩm';
    
    try {
        books = window.BookDatabase.getAllBooks();
    } catch (error) {
        console.error('Error getting books:', error);
        return;
    }
    
    if (type === 'featured') {
        books = books.filter(book => book.featured);
        pageTitle = 'Sản phẩm nổi bật';
    } else if (search) {
        books = window.BookDatabase.searchBooks(search);
        pageTitle = `Kết quả tìm kiếm: "${search}"`;
    } else if (category && subcategory) {
        books = window.BookDatabase.getBooksBySubcategory(category, subcategory);
        pageTitle = subcategory;
    } else if (category) {
        books = window.BookDatabase.getBooksByCategory(category);
        pageTitle = category;
    }
    
    const titleElement = document.querySelector('#categoryTitle');
    if (titleElement) {
        titleElement.textContent = pageTitle;
    }
    
    document.title = `${pageTitle} - BookSelf`;
    
    const resultsCount = document.querySelector('.results-count');
    if (resultsCount) {
        resultsCount.textContent = `Hiển thị ${books.length} sản phẩm`;
    }
    
    renderCategoryProducts(books);
}

function renderCategoryProducts(books) {
    const productsGrid = document.querySelector('#productGrid');
    if (!productsGrid) {
        console.error('ProductGrid not found');
        return;
    }
    
    if (books.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-inbox"></i>
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Vui lòng thử tìm kiếm với từ khóa khác</p>
            </div>
        `;
        return;
    }
    
    try {
        productsGrid.innerHTML = books.map(book => renderProductCard(book)).join('');
    } catch (error) {
        console.error('Error rendering products:', error);
        return;
    }
    
    window.currentBooks = books;
    
    initializeProductGrid();
    updateProductDisplay(currentPage);
}

function initializeFilters() {
    const sortSelect = document.querySelector('#sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', applySorting);
    }
    
    const priceFilters = document.querySelectorAll('.filter-tag');
    priceFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            const priceRange = btn.dataset.price;
            if (priceRange) {
                document.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterByPrice(priceRange);
            }
        });
    });
    
    const viewModeButtons = document.querySelectorAll('.view-btn');
    viewModeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const viewMode = btn.classList.contains('grid-view') ? 'grid' : 'list';
            setView(viewMode);
        });
    });
}

function applySorting() {
    const sortSelect = document.querySelector('.sort-select');
    const sortBy = sortSelect.value;
    
    if (window.currentBooks && window.BookDatabase) {
        sortProducts();
    }
}

function filterByPrice(priceRange) {
    document.querySelectorAll('.filter-tag').forEach(btn => {
        if (btn.dataset.price === priceRange) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    const products = productGrid.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const priceText = product.querySelector('.current-price')?.textContent;
        if (!priceText) return;
        
        const price = parseInt(priceText.replace(/[^\d]/g, ''));
        let show = false;
        
        switch(priceRange) {
            case 'all':
                show = true;
                break;
            case 'under-200':
                show = price < 200000;
                break;
            case '200-300':
                show = price >= 200000 && price < 300000;
                break;
            case '300-500':
                show = price >= 300000 && price < 500000;
                break;
            case 'over-500':
                show = price >= 500000;
                break;
        }
        
        if (show) {
            product.classList.remove('hidden');
            product.style.display = '';
        } else {
            product.classList.add('hidden');
            product.style.display = 'none';
        }
    });
    
    currentPage = 1;
    updateProductDisplay(currentPage);
}

function setView(viewMode) {
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.${viewMode}-view`).classList.add('active');
    
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    if (viewMode === 'list') {
        productGrid.classList.add('list-mode');
        productGrid.classList.remove('grid-mode');
    } else {
        productGrid.classList.add('grid-mode');
        productGrid.classList.remove('list-mode');
    }
}

function sortProducts() {
    const sortSelect = document.getElementById('sortSelect');
    const sortValue = sortSelect.value;
    
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    const products = Array.from(productGrid.querySelectorAll('.product-card'));
    
    products.sort((a, b) => {
        const priceA = parseInt(a.querySelector('.current-price')?.textContent.replace(/[^\d]/g, '') || 0);
        const priceB = parseInt(b.querySelector('.current-price')?.textContent.replace(/[^\d]/g, '') || 0);
        const nameA = a.querySelector('.product-title')?.textContent || '';
        const nameB = b.querySelector('.product-title')?.textContent || '';
        
        switch(sortValue) {
            case 'price-low': return priceA - priceB;
            case 'price-high': return priceB - priceA;
            case 'name': return nameA.localeCompare(nameB);
            default: return 0;
        }
    });
    
    products.forEach(product => productGrid.appendChild(product));
    
    setTimeout(() => updateProductDisplay(currentPage), 100);
}

function changePage(direction) {
    const totalPages = Math.ceil(totalProducts / currentProductsPerPage);
    let newPage = currentPage + direction;
    
    if (newPage < 1) return;
    if (newPage > totalPages) return;
    if (newPage === currentPage) return;
    
    currentPage = newPage;
    savePaginationState();
    updateProductDisplay(currentPage);
}

function goToPage(page) {
    if (page === currentPage) return;
    
    currentPage = page;
    savePaginationState();
    updateProductDisplay(currentPage);
}

function updateProductDisplay(page) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) {
        console.error('Product grid not found');
        return;
    }
    
    const allProducts = productGrid.querySelectorAll('.product-card');
    const visibleProducts = Array.from(allProducts).filter(p => !p.classList.contains('hidden'));
    totalProducts = visibleProducts.length;
    
    if (totalProducts === 0) {
        console.warn('No visible products');
        return;
    }
    
    const totalPages = Math.ceil(totalProducts / currentProductsPerPage);
    const startIndex = (page - 1) * currentProductsPerPage;
    const endIndex = startIndex + currentProductsPerPage;
    
    let visibleIndex = 0;
    allProducts.forEach((product) => {
        if (product.classList.contains('hidden')) {
            product.style.display = 'none';
            return;
        }
        
        if (visibleIndex >= startIndex && visibleIndex < endIndex) {
            product.style.display = '';
        } else {
            product.style.display = 'none';
        }
        visibleIndex++;
    });
    
    updatePaginationControls();
    savePaginationState();
}

function updatePaginationControls() {
    const totalPages = Math.ceil(totalProducts / currentProductsPerPage);
    const paginationContainer = document.querySelector('.pagination');
    
    if (!paginationContainer) {
        console.warn('Pagination container not found');
        return;
    }
    
    const pageNumbers = paginationContainer.querySelector('.page-numbers');
    if (pageNumbers) {
        let pagesHTML = '';
        
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pagesHTML += `<button class="page-number ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
            }
        } else {
            pagesHTML = `<button class="page-number ${1 === currentPage ? 'active' : ''}" onclick="goToPage(1)">1</button>`;
            if (currentPage > 3) pagesHTML += '<span>...</span>';
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                pagesHTML += `<button class="page-number ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
            }
            if (currentPage < totalPages - 2) pagesHTML += '<span>...</span>';
            pagesHTML += `<button class="page-number ${totalPages === currentPage ? 'active' : ''}" onclick="goToPage(${totalPages})">${totalPages}</button>`;
        }
        
        pageNumbers.innerHTML = pagesHTML;
    }
    
    const prevBtn = paginationContainer.querySelector('.page-btn:first-child');
    const nextBtn = paginationContainer.querySelector('.page-btn:last-child');
    
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
}

function loadPaginationState() {
    const savedPage = sessionStorage.getItem('categoryCurrentPage');
    const savedCategory = sessionStorage.getItem('categoryCurrentCategory');
    const savedSubcategory = sessionStorage.getItem('categoryCurrentSubcategory');
    
    if (savedPage) {
        currentPage = parseInt(savedPage);
    }
    
    return {
        page: savedPage ? parseInt(savedPage) : 1,
        category: savedCategory,
        subcategory: savedSubcategory
    };
}

function savePaginationState() {
    sessionStorage.setItem('categoryCurrentPage', currentPage.toString());
}

function clearPaginationState() {
    sessionStorage.removeItem('categoryCurrentPage');
    sessionStorage.removeItem('categoryCurrentCategory');
    sessionStorage.removeItem('categoryCurrentSubcategory');
    currentPage = 1;
}

// Export to global scope
if (typeof window !== 'undefined') {
    window.initializeCategoryPage = initializeCategoryPage;
    window.filterByPrice = filterByPrice;
    window.setView = setView;
    window.sortProducts = sortProducts;
    window.changePage = changePage;
    window.goToPage = goToPage;
    window.loadPaginationState = loadPaginationState;
    window.savePaginationState = savePaginationState;
    window.clearPaginationState = clearPaginationState;
}
