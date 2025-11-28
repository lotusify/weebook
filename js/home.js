// ========== HOME PAGE FUNCTIONS ========== //

function initializeHomePage() {
    loadHomePageContent();
}

function loadHomePageContent() {
    if (!window.BookDatabase) return;
    
    const featuredContainer = document.querySelector('.featured-products .product-grid');
    if (featuredContainer) {
        const featuredBooks = window.BookDatabase.getFeaturedBooks();
        if (featuredBooks && featuredBooks.length > 0) {
            featuredContainer.innerHTML = featuredBooks.map(book => renderProductCard(book)).join('');
            initializeProductGrid();
        } else {
            featuredContainer.innerHTML = '<p class="no-products">Không có sản phẩm nổi bật</p>';
        }
    }
    
    const newReleasesContainer = document.querySelector('.new-releases .product-grid');
    if (newReleasesContainer) {
        const newReleases = window.BookDatabase.getNewReleases();
        if (newReleases && newReleases.length > 0) {
            newReleasesContainer.innerHTML = newReleases.map(book => renderProductCard(book)).join('');
            initializeProductGrid();
        } else {
            newReleasesContainer.innerHTML = '<p class="no-products">Không có sản phẩm mới</p>';
        }
    }
}

function initializeAboutPage() {
    // About page initialization
}

// Export to global scope
if (typeof window !== 'undefined') {
    window.initializeHomePage = initializeHomePage;
    window.initializeAboutPage = initializeAboutPage;
}
