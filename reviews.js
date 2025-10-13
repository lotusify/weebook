// ========== REVIEWS SYSTEM ========== //
// Product reviews and rating system

document.addEventListener('DOMContentLoaded', function() {
    initializeReviews();
});

function initializeReviews() {
    // Check if user is logged in for writing reviews
    const writeReviewSection = document.getElementById('writeReviewSection');
    if (!isLoggedIn()) {
        writeReviewSection.innerHTML = `
            <div class="login-prompt">
                <h3>Đăng nhập để viết đánh giá</h3>
                <p>Bạn cần đăng nhập để có thể viết đánh giá sản phẩm.</p>
                <a href="auth.html" class="btn btn-primary">Đăng nhập ngay</a>
            </div>
        `;
    }

    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        showNotification('Không tìm thấy sản phẩm!', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        return;
    }
    
    // Load product and reviews
    loadProductInfo(productId);
    loadReviews(productId);
    
    // Initialize form handlers
    initializeReviewForm(productId);
    initializeFilters(productId);
}

function loadProductInfo(productId) {
    if (!window.BookDatabase) {
        showNotification('Lỗi: Không thể tải thông tin sản phẩm!', 'error');
        return;
    }
    
    const book = window.BookDatabase.getBookById(productId);
    if (!book) {
        showNotification('Không tìm thấy sản phẩm!', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        return;
    }
    
    // Update product info
    document.getElementById('productImage').src = book.images[0];
    document.getElementById('productImage').alt = book.title;
    document.getElementById('productTitle').textContent = book.title;
    document.getElementById('productAuthor').textContent = book.author;
    
    // Load rating overview
    loadRatingOverview(productId);
}

function loadRatingOverview(productId) {
    const reviews = getAllReviews();
    const productReviews = reviews.filter(review => review.bookId == productId);
    
    if (productReviews.length === 0) {
        document.getElementById('averageRating').textContent = '0.0';
        document.getElementById('ratingCount').textContent = '(0 đánh giá)';
        document.getElementById('ratingStars').innerHTML = generateStars(0);
        document.getElementById('ratingBreakdown').innerHTML = '<p>Chưa có đánh giá nào.</p>';
        return;
    }
    
    // Calculate average rating
    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / productReviews.length;
    
    document.getElementById('averageRating').textContent = averageRating.toFixed(1);
    document.getElementById('ratingCount').textContent = `(${productReviews.length} đánh giá)`;
    document.getElementById('ratingStars').innerHTML = generateStars(Math.round(averageRating));
    
    // Rating breakdown
    const ratingBreakdown = [5, 4, 3, 2, 1].map(rating => {
        const count = productReviews.filter(review => review.rating === rating).length;
        const percentage = (count / productReviews.length) * 100;
        
        return `
            <div class="rating-bar">
                <span class="rating-label">${rating} sao</span>
                <div class="rating-progress">
                    <div class="rating-fill" style="width: ${percentage}%"></div>
                </div>
                <span class="rating-count">${count}</span>
            </div>
        `;
    }).join('');
    
    document.getElementById('ratingBreakdown').innerHTML = ratingBreakdown;
}

function loadReviews(productId, filter = 'all', sort = 'newest') {
    const reviewsContainer = document.getElementById('reviewsList');
    const reviews = getAllReviews();
    let productReviews = reviews.filter(review => review.bookId == productId);
    
    // Apply rating filter
    if (filter !== 'all') {
        productReviews = productReviews.filter(review => review.rating == filter);
    }
    
    // Apply sorting
    switch(sort) {
        case 'newest':
            productReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            productReviews.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'highest':
            productReviews.sort((a, b) => b.rating - a.rating);
            break;
        case 'lowest':
            productReviews.sort((a, b) => a.rating - b.rating);
            break;
    }
    
    if (productReviews.length === 0) {
        reviewsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-comments"></i>
                <h3>Chưa có đánh giá nào</h3>
                <p>Hãy là người đầu tiên đánh giá sản phẩm này!</p>
            </div>
        `;
        return;
    }
    
    let reviewsHtml = '';
    productReviews.forEach(review => {
        const user = getUserById(review.userId);
        const userName = review.anonymous ? 'Người dùng ẩn danh' : (user ? user.name : 'Người dùng');
        
        reviewsHtml += `
            <div class="review-item">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="reviewer-details">
                            <h4>${userName}</h4>
                            <span class="review-date">${formatDate(review.date)}</span>
                        </div>
                    </div>
                    <div class="review-rating">
                        ${generateStars(review.rating)}
                    </div>
                </div>
                
                <div class="review-content">
                    <h5 class="review-title">${review.title}</h5>
                    <p class="review-text">${review.comment}</p>
                </div>
                
                <div class="review-actions">
                    <button class="btn-icon" onclick="likeReview(${review.id})" title="Thích">
                        <i class="fas fa-thumbs-up"></i>
                        <span>${review.likes || 0}</span>
                    </button>
                    <button class="btn-icon" onclick="reportReview(${review.id})" title="Báo cáo">
                        <i class="fas fa-flag"></i>
                    </button>
                    ${isCurrentUserReview(review.userId) ? `
                        <button class="btn-icon" onclick="editReview(${review.id})" title="Chỉnh sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="deleteReview(${review.id})" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    reviewsContainer.innerHTML = reviewsHtml;
}

function initializeReviewForm(productId) {
    const reviewForm = document.getElementById('reviewForm');
    if (!reviewForm) return;
    
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitReview(productId);
    });
    
    // Star rating interaction
    const starInputs = document.querySelectorAll('.rating-input input[type="radio"]');
    const starLabels = document.querySelectorAll('.rating-input label');
    
    starInputs.forEach((input, index) => {
        input.addEventListener('change', () => {
            // Update star display
            starLabels.forEach((label, labelIndex) => {
                const icon = label.querySelector('i');
                if (labelIndex < index + 1) {
                    icon.classList.add('active');
                } else {
                    icon.classList.remove('active');
                }
            });
        });
    });
}

function submitReview(productId) {
    if (!isLoggedIn()) {
        showNotification('Vui lòng đăng nhập để viết đánh giá!', 'error');
        return;
    }
    
    const formData = new FormData(document.getElementById('reviewForm'));
    const rating = formData.get('rating');
    const title = formData.get('title');
    const comment = formData.get('comment');
    const anonymous = document.getElementById('anonymousReview').checked;
    
    if (!rating || !title || !comment) {
        showNotification('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }
    
    const currentUser = getCurrentUser();
    const review = {
        id: generateReviewId(),
        bookId: productId,
        userId: currentUser.id,
        rating: parseInt(rating),
        title: title,
        comment: comment,
        anonymous: anonymous,
        date: new Date().toISOString(),
        likes: 0
    };
    
    // Save review
    saveReview(review);
    
    // Update user's reviews
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        if (!users[userIndex].reviews) {
            users[userIndex].reviews = [];
        }
        users[userIndex].reviews.push(review.id);
        localStorage.setItem('bookself-users', JSON.stringify(users));
    }
    
    // Reset form
    document.getElementById('reviewForm').reset();
    
    // Reload reviews and rating overview
    loadRatingOverview(productId);
    loadReviews(productId);
    
    showNotification('Đánh giá đã được gửi thành công!', 'success');
}

function initializeFilters(productId) {
    const ratingFilter = document.getElementById('ratingFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (ratingFilter) {
        ratingFilter.addEventListener('change', () => {
            const filter = ratingFilter.value;
            const sort = sortFilter.value;
            loadReviews(productId, filter, sort);
        });
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', () => {
            const filter = ratingFilter.value;
            const sort = sortFilter.value;
            loadReviews(productId, filter, sort);
        });
    }
}

function likeReview(reviewId) {
    if (!isLoggedIn()) {
        showNotification('Vui lòng đăng nhập để thích đánh giá!', 'error');
        return;
    }
    
    const reviews = getAllReviews();
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex !== -1) {
        reviews[reviewIndex].likes = (reviews[reviewIndex].likes || 0) + 1;
        localStorage.setItem('bookself-reviews', JSON.stringify(reviews));
        
        // Reload reviews
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        loadReviews(productId);
        
        showNotification('Đã thích đánh giá!', 'success');
    }
}

function reportReview(reviewId) {
    showNotification('Cảm ơn bạn đã báo cáo. Chúng tôi sẽ xem xét đánh giá này.', 'info');
}

function editReview(reviewId) {
    showNotification('Chức năng chỉnh sửa đánh giá sẽ được phát triển!', 'info');
}

function deleteReview(reviewId) {
    if (confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
        const reviews = getAllReviews();
        const updatedReviews = reviews.filter(r => r.id !== reviewId);
        localStorage.setItem('bookself-reviews', JSON.stringify(updatedReviews));
        
        // Update user's reviews
        const currentUser = getCurrentUser();
        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].reviews = users[userIndex].reviews.filter(id => id !== reviewId);
            localStorage.setItem('bookself-users', JSON.stringify(users));
        }
        
        // Reload reviews
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        loadRatingOverview(productId);
        loadReviews(productId);
        
        showNotification('Đã xóa đánh giá thành công!', 'success');
    }
}

// Utility functions
function getAllReviews() {
    return JSON.parse(localStorage.getItem('bookself-reviews')) || [];
}

function saveReview(review) {
    const reviews = getAllReviews();
    reviews.push(review);
    localStorage.setItem('bookself-reviews', JSON.stringify(reviews));
}

function generateReviewId() {
    const reviews = getAllReviews();
    return reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1;
}

function getUserById(userId) {
    const users = getUsers();
    return users.find(u => u.id === userId);
}

function isCurrentUserReview(userId) {
    const currentUser = getCurrentUser();
    return currentUser && currentUser.id === userId;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
