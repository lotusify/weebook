// Load header, footer, and chatbot components
document.addEventListener('DOMContentLoaded', function() {
    // Determine the correct path based on current location
    const isInInfoFolder = window.location.pathname.includes('/info/');
    const basePath = isInInfoFolder ? '../' : '';
    
    // Header HTML content
    const headerHTML = `
        <header>
            <div class="header-main">
                <div class="container">
                    <div class="brand-section">
                        <a href="${basePath}index.html" class="logo">
                            <img src="${basePath}images/logo.png" alt="BookSelf Logo">
                            <span class="brand-name">BookSelf</span>
                        </a>
                    </div>

                    <nav class="main-nav">
                        <ul class="nav-links">
                            <li><a href="${basePath}index.html"><span>Trang Chủ</span></a></li>
                            <li><a href="${basePath}category.html"><span>Sản phẩm</span></a></li>
                            <li><a href="${basePath}about.html"><span>Về Chúng Tôi</span></a></li>
                        </ul>
                    </nav>

                    <div class="search-container">
                        <div class="search-bar">
                            <input type="text" class="search-input" placeholder="Tìm kiếm sản phẩm...">
                            <button class="search-btn"><i class="fa-solid fa-magnifying-glass"></i></button>
                        </div>
                        <div class="autocomplete-dropdown" style="display: none;"></div>
                    </div>

                    <div class="header-right">
                        <div class="opening-hours">
                            <i class="fa-regular fa-clock"></i>
                            <span>
                                <strong>THỜI GIAN MỞ CỬA</strong><br>
                                8H - 22H T2 - CN
                            </span>
                        </div>
                        <div class="user-actions">
                            <div class="account-menu">
                                <a href="#" class="account-link"><i class="fa-regular fa-user"></i> <span>Tài khoản</span> <i class="fa-solid fa-chevron-down"></i></a>
                                <div class="account-dropdown">
                                    <a href="${basePath}profile.html"><i class="fa-solid fa-user"></i> <span>Tài khoản của tôi</span></a>
                                    <a href="${basePath}profile.html#wishlist" onclick="handleWishlistLink()"><i class="fa-solid fa-heart"></i> <span>Sản phẩm yêu thích</span></a>
                                    <a href="${basePath}orders.html"><i class="fa-solid fa-rectangle-list"></i> <span>Đơn hàng của tôi</span></a>
                                    <a href="${basePath}auth.html" class="login-link"><i class="fa-solid fa-sign-in-alt"></i> <span>Đăng nhập</span></a>
                                    <a href="#" class="logout-link" style="display: none;" onclick="logout()"><i class="fa-solid fa-sign-out-alt"></i> <span>Đăng xuất</span></a>
                                    
                                 

                                </div>
                            </div>
                            <a href="#" class="cart-icon"><i class="fa-solid fa-cart-shopping"></i> <span>Giỏ hàng</span> <span class="cart-count">0</span></a>
                            <a href="${basePath}admin.html" class="admin-link" style="display: none;"><i class="fa-solid fa-cog"></i> <span>Admin</span></a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    `;

    // Footer HTML content
    const footerHTML = `
        <footer>
            <div class="footer-main container">
                <div class="footer-col about-us">
                    <img src="${basePath}images/logo.png" alt="Read Station Logo" class="footer-logo">
                    <p>Công ty cổ phần sách BookSelf</p>
                    <p><strong>Bạn cần hỗ trợ? Gọi chúng tôi 24/7</strong></p>
                    <p class="phone-number">0912 913 914</p>
                    <p class="address-title">Thông tin địa chỉ</p>
                    <p class="address-detail">Số 125 Đường Trần Hưng Đạo, Phường Cầu Kho, Quận 1, TP. Hồ Chí Minh</p>
                </div>
                <div class="footer-col">
                    <h3>Hỗ trợ</h3>
                    <ul>
                        <li><a href="${basePath}info/huong-dan-mua-hang.html">Hướng dẫn mua hàng</a></li>
                        <li><a href="${basePath}info/huong-dan-thanh-toan.html">Hướng dẫn thanh toán</a></li>
                        <li><a href="${basePath}info/huong-dan-giao-nhan.html">Hướng dẫn giao nhận</a></li>
                        <li><a href="${basePath}info/dieu-khoan-dich-vu.html">Điều khoản dịch vụ</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h3>Chính sách</h3>
                    <ul>
                        <li><a href="${basePath}info/chinh-sach-bao-mat.html">Chính sách bảo mật</a></li>
                        <li><a href="${basePath}info/chinh-sach-van-chuyen.html">Chính sách vận chuyển</a></li>
                        <li><a href="${basePath}info/chinh-sach-doi-tra.html">Chính sách đổi trả</a></li>
                        <li><a href="${basePath}info/quy-dinh-su-dung.html">Quy định sử dụng</a></li>
                    </ul>
                </div>
                <div class="footer-col newsletter">
                    <h3>Nhận tin khuyến mãi</h3>
                    <p>Hỗ trợ khách hàng 24/7</p>
                    <form class="newsletter-form">
                        <input type="email" placeholder="Nhập email của bạn">
                        <button type="submit">Đăng ký</button>
                    </form>
                    <p class="social-title">Theo dõi chúng tôi</p>
                    <div class="social-icons">
                        <a href="#"><i class="fab fa-facebook-f"></i></a>
                        <a href="#"><i class="fab fa-youtube"></i></a>
                        <a href="#"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>
        </footer>
    `;

    // Chatbot HTML content
    const chatbotHTML = `
        <div class="floating-chatbot" id="floatingChatbot">
            <div class="chatbot-toggle" onclick="toggleChatbot()">
                <i class="fas fa-comments"></i>
            </div>
            <div class="chatbot-window" id="chatbotWindow">
                <div class="chatbot-header">
                    <h4>AI Assistant</h4>
                    <button class="chatbot-close" onclick="toggleChatbot()">&times;</button>
                </div>
                <div class="chatbot-messages" id="chatbotMessages">
                    <div class="message bot-message">
                        <div class="message-content">
                            <p>Xin chào! Tôi là AI Assistant của BookSelf. Tôi có thể giúp bạn tìm sách, trả lời câu hỏi về sản phẩm, hoặc hỗ trợ đặt hàng. Bạn cần gì?</p>
                            <span class="message-time" id="initialMessageTime"></span>
                        </div>
                    </div>
                </div>
                <div class="chatbot-input">
                    <input type="text" id="chatbotInput" placeholder="Nhập câu hỏi...">
                    <button onclick="sendChatbotMessage()">Gửi</button>
                </div>
                <div class="chatbot-actions">
                    <button class="btn-customer-service" onclick="chatWithCustomerService()">
                        <i class="fas fa-headset"></i>
                        Tôi muốn chat với CSKH
                    </button>
                </div>
            </div>
        </div>
    `;

    // Load header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = headerHTML;
        
        // Set active navigation after header is loaded
        setTimeout(() => {
            if (typeof setActiveNavigationItem === 'function') {
                setActiveNavigationItem();
            }
            // Update account menu after header is loaded
            updateAccountMenu();
        }, 100);
    }

    // Load footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerHTML;
    }

    // Category menu HTML content
    const categoryMenuHTML = `
        <aside class="sidebar">
            <div class="category-menu">
                <h3 class="category-title">DANH MỤC SẢN PHẨM</h3>
                <ul class="category-list">
                    <li class="has-submenu category-item">
                        <a href="#" data-category="vietnamese"><i class="fa-solid fa-book"></i> Sách Tiếng Việt <i class="fa-solid fa-angle-right"></i></a>
                        <ul class="submenu category-submenu">
                            <li><a href="#" data-subcategory="literature">Văn Học</a></li>
                            <li><a href="#" data-subcategory="parenting">Nuôi Dạy Con</a></li>
                            <li><a href="#" data-subcategory="history">Lịch Sử - Địa Lý - Tôn Giáo</a></li>
                            <li><a href="#" data-subcategory="culture">Văn Hóa - Nghệ Thuật - Du Lịch</a></li>
                            <li><a href="#" data-subcategory="children">Thiếu Nhi</a></li>
                            <li><a href="#" data-subcategory="biography">Tiếu Sử - Hồi Ký</a></li>
                            <li><a href="#" data-subcategory="science">Khoa Học Kỹ Thuật</a></li>
                            <li><a href="#" data-subcategory="art">Âm Nhạc - Mỹ Thuật - Thời Trang</a></li>
                            <li><a href="#" data-subcategory="economics">Kinh Tế</a></li>
                            <li><a href="#" data-subcategory="education">Giáo Khoa - Tham Khảo</a></li>
                            <li><a href="#" data-subcategory="politics">Chính Trị - Pháp Lý - Triết Học</a></li>
                            <li><a href="#" data-subcategory="health">Sức Khỏe - Dinh Dưỡng</a></li>
                            <li><a href="#" data-subcategory="psychology">Tâm Lý - Kỹ Năng Sống</a></li>
                            <li><a href="#" data-subcategory="language">Sách Học Ngoại Ngữ</a></li>
                            <li><a href="#" data-subcategory="lifestyle">Lối Sống</a></li>
                        </ul>
                    </li>
                    <li class="has-submenu category-item">
                        <a href="#" data-category="foreign"><i class="fa-solid fa-book-open"></i> Sách Ngoại Văn <i class="fa-solid fa-angle-right"></i></a>
                        <ul class="submenu category-submenu">
                            <li><a href="#" data-subcategory="coffee-table">Coffee Table Books</a></li>
                            <li><a href="#" data-subcategory="fiction">Fiction</a></li>
                            <li><a href="#" data-subcategory="taschen">Taschen</a></li>
                            <li><a href="#" data-subcategory="non-fiction">Non Fiction</a></li>
                            <li><a href="#" data-subcategory="bestseller">Bestselling Series</a></li>
                            <li><a href="#" data-subcategory="gifts">Gifts of Others</a></li>
                            <li><a href="#" data-subcategory="children-en">Children's Books</a></li>
                        </ul>
                    </li>
                    <li class="has-submenu category-item">
                        <a href="#" data-category="office-supplies"><i class="fa-solid fa-pen"></i> Văn Phòng Phẩm <i class="fa-solid fa-angle-right"></i></a>
                        <ul class="submenu category-submenu">
                            <li><a href="#" data-subcategory="pens">Bút - Viết</a></li>
                            <li><a href="#" data-subcategory="student-tools">Dụng Cụ Học Sinh</a></li>
                            <li><a href="#" data-subcategory="paper-products">Sản Phẩm Về Giấy</a></li>
                            <li><a href="#" data-subcategory="office-tools">Dụng Cụ Văn Phòng</a></li>
                            <li><a href="#" data-subcategory="drawing-tools">Dụng Cụ Vẽ</a></li>
                            <li><a href="#" data-subcategory="electronic-products">Sản Phẩm Điện Tử</a></li>
                            <li><a href="#" data-subcategory="other-office">Văn Phòng Phẩm Khác</a></li>
                        </ul>
                    </li>
                    <li class="has-submenu category-item">
                        <a href="#" data-category="comics"><i class="fa-solid fa-images"></i> Truyện Tranh - Tiểu Thuyết <i class="fa-solid fa-angle-right"></i></a>
                        <ul class="submenu category-submenu">
                            <li><a href="#" data-subcategory="manga">Manga</a></li>
                            <li><a href="#" data-subcategory="comic-books">Truyện Tranh</a></li>
                            <li><a href="#" data-subcategory="light-novels">Tiểu Thuyết Nhẹ</a></li>
                            <li><a href="#" data-subcategory="graphic-novels">Tiểu Thuyết Đồ Họa</a></li>
                            <li><a href="#" data-subcategory="webtoons">Webtoon</a></li>
                            <li><a href="#" data-subcategory="manhwa">Manhwa</a></li>
                            <li><a href="#" data-subcategory="comic-strips">Truyện Tranh Ngắn</a></li>
                            <li><a href="#" data-subcategory="comic-collections">Tuyển Tập Truyện Tranh</a></li>
                            <li><a href="#" data-subcategory="comic-merchandise">Đồ Chơi Truyện Tranh</a></li>
                        </ul>
                    </li>
                    <li class="has-submenu category-item">
                        <a href="#" data-category="toys"><i class="fa-solid fa-gamepad"></i> Đồ Chơi <i class="fa-solid fa-angle-right"></i></a>
                        <ul class="submenu category-submenu">
                            <li><a href="#" data-subcategory="educational-toys">Đồ Chơi Giáo Dục</a></li>
                            <li><a href="#" data-subcategory="action-figures">Mô Hình Nhân Vật</a></li>
                            <li><a href="#" data-subcategory="board-games">Trò Chơi Bàn</a></li>
                            <li><a href="#" data-subcategory="puzzles">Trò Chơi Ghép Hình</a></li>
                            <li><a href="#" data-subcategory="building-blocks">Đồ Chơi Xếp Hình</a></li>
                            <li><a href="#" data-subcategory="dolls">Búp Bê</a></li>
                            <li><a href="#" data-subcategory="remote-control">Đồ Chơi Điều Khiển</a></li>
                            <li><a href="#" data-subcategory="outdoor-toys">Đồ Chơi Ngoài Trời</a></li>
                            <li><a href="#" data-subcategory="collectibles">Đồ Sưu Tập</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </aside>
    `;

    // Load category menu (for pages that need it)
    const categoryPlaceholder = document.getElementById('category-placeholder');
    if (categoryPlaceholder) {
        categoryPlaceholder.innerHTML = categoryMenuHTML;
    }

    // Load chatbot (only if not on excluded pages)
    const excludedPages = ['auth.html', 'admin.html', 'checkout.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!excludedPages.includes(currentPage)) {
        const chatbotPlaceholder = document.getElementById('chatbot-placeholder');
        if (chatbotPlaceholder) {
            chatbotPlaceholder.innerHTML = chatbotHTML;
            // Initialize chatbot timestamp after loading
            setTimeout(() => {
                if (typeof initializeChatbotTimestamp === 'function') {
                    initializeChatbotTimestamp();
                }
            }, 100);
        }
    }
});

// Function to update account menu based on login status
function updateAccountMenu() {
    // Use the isLoggedIn function from auth.js if available, otherwise check localStorage
    const isLoggedIn = (typeof window.isLoggedIn === 'function') ? window.isLoggedIn() : (localStorage.getItem('isLoggedIn') === 'true');
    const loginLink = document.querySelector('.login-link');
    const logoutLink = document.querySelector('.logout-link');
    
    console.log('Login status:', isLoggedIn); // Debug log
    
    if (isLoggedIn) {
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'flex';
    } else {
        if (loginLink) loginLink.style.display = 'flex';
        if (logoutLink) logoutLink.style.display = 'none';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    updateAccountMenu();
    // Redirect to home page
    window.location.href = 'index.html';
}

function handleWishlistLink() {
    // Check if we're already on profile page
    if (window.location.pathname.includes('profile.html')) {
        // If already on profile page, just change section
        if (typeof showProfileSection === 'function') {
            showProfileSection('wishlist');
        }
        return false; // Prevent navigation
    }
    // If not on profile page, let normal navigation happen
    return true;
}
