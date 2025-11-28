// ========== HOME PAGE FUNCTIONS ========== //

function initializeHomePage() {
    console.log('Home page initialized');
    loadHomePageContent();
}

function loadHomePageContent() {
    console.log('Loading home page content...');
    
    if (!window.BookDatabase) {
        console.error('BookDatabase not available yet');
        return;
    }
    
    const featuredContainer = document.querySelector('.featured-products .product-grid');
    if (featuredContainer) {
        console.log('Found featured container');
        const featuredBooks = window.BookDatabase.getFeaturedBooks();
        console.log('Featured books:', featuredBooks ? featuredBooks.length : 0);
        if (featuredBooks && featuredBooks.length > 0) {
            featuredContainer.innerHTML = featuredBooks.map(book => renderProductCard(book)).join('');
            initializeProductGrid();
        } else {
            featuredContainer.innerHTML = '<p class="no-products">Không có sản phẩm nổi bật</p>';
        }
    } else {
        console.log('Featured container not found');
    }
    
    const newReleasesContainer = document.querySelector('.new-releases .product-grid');
    if (newReleasesContainer) {
        console.log('Found new releases container');
        const newReleases = window.BookDatabase.getNewReleases();
        console.log('New releases:', newReleases ? newReleases.length : 0);
        if (newReleases && newReleases.length > 0) {
            newReleasesContainer.innerHTML = newReleases.map(book => renderProductCard(book)).join('');
            initializeProductGrid();
        } else {
            newReleasesContainer.innerHTML = '<p class="no-products">Không có sản phẩm mới</p>';
        }
    } else {
        console.log('New releases container not found');
    }
}

function initializeAboutPage() {
    console.log('About page initialized');
}

// Export to global scope
if (typeof window !== 'undefined') {
    window.initializeHomePage = initializeHomePage;
    window.initializeAboutPage = initializeAboutPage;
}
