// ========== WISHLIST SYSTEM ========== //

function addToWishlist(productId) {
    if (!window.BookDatabase) {
        showNotification('Dữ liệu chưa sẵn sàng!', 'error');
        return;
    }
    
    const book = window.BookDatabase.getBookById(productId);
    if (!book) {
        showNotification('Không tìm thấy sản phẩm!', 'error');
        return;
    }
    
    // Use localStorage for demo (no user login required)
    let wishlist = JSON.parse(localStorage.getItem('bookself-wishlist')) || [];
    
    // Check if already in wishlist
    if (wishlist.includes(productId)) {
        showNotification(`"${book.title}" đã có trong danh sách yêu thích!`, 'error');
        return;
    }
    
    // Add to wishlist
    wishlist.push(productId);
    localStorage.setItem('bookself-wishlist', JSON.stringify(wishlist));
    
    showNotification(`Đã thêm "${book.title}" vào danh sách yêu thích!`, 'success');
    updateWishlistButtons();
}

function removeFromWishlist(productId) {
    // Use localStorage for demo (no user login required)
    let wishlist = JSON.parse(localStorage.getItem('bookself-wishlist')) || [];
    
    // Remove from wishlist
    wishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem('bookself-wishlist', JSON.stringify(wishlist));
    
    if (window.BookDatabase) {
        const book = window.BookDatabase.getBookById(productId);
        if (book) {
            showNotification(`Đã xóa "${book.title}" khỏi danh sách yêu thích!`);
        }
    }
    
    updateWishlistButtons();
}

function isInWishlist(productId) {
    // Use localStorage for demo (no user login required)
    let wishlist = JSON.parse(localStorage.getItem('bookself-wishlist')) || [];
    return wishlist.includes(productId);
}

function updateWishlistButtons() {
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    
    wishlistButtons.forEach(button => {
        const productId = button.dataset.productId;
        
        if (isInWishlist(productId)) {
            button.classList.add('active');
            button.innerHTML = '<i class="fas fa-heart"></i>';
            button.title = 'Xóa khỏi danh sách yêu thích';
        } else {
            button.classList.remove('active');
            button.innerHTML = '<i class="far fa-heart"></i>';
            button.title = 'Thêm vào danh sách yêu thích';
        }
        
        // Remove old event listener by cloning
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Add new event listener
        newButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(productId);
        });
    });
}

function toggleWishlist(productId) {
    if (isInWishlist(productId)) {
        removeFromWishlist(productId);
    } else {
        addToWishlist(productId);
    }
}

// Export to global scope
if (typeof window !== 'undefined') {
    window.addToWishlist = addToWishlist;
    window.removeFromWishlist = removeFromWishlist;
    window.isInWishlist = isInWishlist;
    window.updateWishlistButtons = updateWishlistButtons;
    window.toggleWishlist = toggleWishlist;
}
