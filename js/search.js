// ========== SEARCH FUNCTIONALITY ========== //
let searchTimeout;

function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const filterBtn = document.querySelector('.filter-btn');
    
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        createAutocompleteDropdown();
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (filterBtn) {
        filterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showFilterModal();
        });
    }
}

function createAutocompleteDropdown() {
    const searchContainer = document.querySelector('.search-container');
    if (!searchContainer) return;
    
    let dropdown = searchContainer.querySelector('.autocomplete-dropdown');
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.className = 'autocomplete-dropdown';
        dropdown.style.display = 'none';
        searchContainer.appendChild(dropdown);
    }
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

function showFilterModal() {
    const existingModal = document.getElementById('filterModal');
    if (existingModal) {
        existingModal.style.display = 'flex';
        return;
    }
    
    const modal = document.createElement('div');
    modal.id = 'filterModal';
    modal.className = 'filter-modal';
    modal.innerHTML = `
        <div class="filter-modal-content">
            <div class="filter-modal-header">
                <h3><i class="fa-solid fa-filter"></i> Bộ lọc sản phẩm</h3>
                <button class="close-modal" onclick="closeFilterModal()">&times;</button>
            </div>
            <div class="filter-modal-body">
                <div class="filter-section">
                    <h4>Khoảng giá</h4>
                    <div class="filter-options">
                        <button class="filter-option" onclick="applyQuickFilter('price', 'under-200')">Dưới 200.000đ</button>
                        <button class="filter-option" onclick="applyQuickFilter('price', '200-300')">200.000đ - 300.000đ</button>
                        <button class="filter-option" onclick="applyQuickFilter('price', '300-500')">300.000đ - 500.000đ</button>
                        <button class="filter-option" onclick="applyQuickFilter('price', '500-1000')">500.000đ - 1.000.000đ</button>
                        <button class="filter-option" onclick="applyQuickFilter('price', 'over-1000')">Trên 1.000.000đ</button>
                    </div>
                </div>
                <div class="filter-section">
                    <h4>Danh mục</h4>
                    <div class="filter-options">
                        <button class="filter-option" onclick="applyQuickFilter('category', 'vietnamese')">Sách Tiếng Việt</button>
                        <button class="filter-option" onclick="applyQuickFilter('category', 'foreign')">Sách Ngoại Văn</button>
                        <button class="filter-option" onclick="applyQuickFilter('category', 'comics')">Truyện Tranh</button>
                        <button class="filter-option" onclick="applyQuickFilter('category', 'office-supplies')">Văn Phòng Phẩm</button>
                        <button class="filter-option" onclick="applyQuickFilter('category', 'toys')">Đồ Chơi</button>
                    </div>
                </div>
                <div class="filter-section">
                    <h4>Sắp xếp</h4>
                    <div class="filter-options">
                        <button class="filter-option" onclick="applyQuickFilter('sort', 'newest')">Mới nhất</button>
                        <button class="filter-option" onclick="applyQuickFilter('sort', 'price-low')">Giá thấp đến cao</button>
                        <button class="filter-option" onclick="applyQuickFilter('sort', 'price-high')">Giá cao đến thấp</button>
                        <button class="filter-option" onclick="applyQuickFilter('sort', 'name')">Tên A-Z</button>
                    </div>
                </div>
            </div>
            <div class="filter-modal-footer">
                <button class="btn btn-secondary" onclick="closeFilterModal()">Đóng</button>
                <button class="btn btn-primary" onclick="viewAllProducts()">Xem tất cả sản phẩm</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeFilterModal();
        }
    });
}

function closeFilterModal() {
    const modal = document.getElementById('filterModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function applyQuickFilter(type, value) {
    const params = new URLSearchParams();
    params.append(type, value);
    window.location.href = `category.html?${params.toString()}`;
}

function viewAllProducts() {
    window.location.href = 'category.html';
}

// Export to window
if (typeof window !== 'undefined') {
    window.initializeSearch = initializeSearch;
    window.closeFilterModal = closeFilterModal;
    window.applyQuickFilter = applyQuickFilter;
    window.viewAllProducts = viewAllProducts;
}
