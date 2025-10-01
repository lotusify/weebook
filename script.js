// Đảm bảo mã JavaScript chỉ chạy sau khi toàn bộ trang đã tải xong
document.addEventListener('DOMContentLoaded', function() {

    // --- 1. ĐỒNG HỒ ĐẾM NGƯỢC CHO SIÊU SALE ---
    function startCountdown() {
        // Thiết lập thời gian kết thúc sale (5 ngày kể từ bây giờ)
        const saleEndDate = new Date().getTime() + 5 * 24 * 60 * 60 * 1000;

        const countdownInterval = setInterval(function() {
            const now = new Date().getTime();
            const distance = saleEndDate - now;

            // Tính toán ngày, giờ, phút, giây
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Hàm để thêm số 0 đằng trước nếu số nhỏ hơn 10
            const formatTime = (time) => String(time).padStart(2, '0');

            // Cập nhật đồng hồ lớn
            const mainCountdown = document.querySelector('.main-banner .countdown');
            if (mainCountdown) {
                 mainCountdown.innerHTML = `
                    <span>Kết thúc sau:</span>
                    <span class="timer">${formatTime(days)}</span><span>:</span>
                    <span class="timer">${formatTime(hours)}</span><span>:</span>
                    <span class="timer">${formatTime(minutes)}</span><span>:</span>
                    <span class="timer">${formatTime(seconds)}</span>
                `;
            }

            // Cập nhật các đồng hồ nhỏ
            const smallCountdowns = document.querySelectorAll('.countdown-small');
            smallCountdowns.forEach(el => {
                el.textContent = `Còn: ${formatTime(days)} : ${formatTime(hours)} : ${formatTime(minutes)} : ${formatTime(seconds)}`;
            });

            // Nếu hết thời gian
            if (distance < 0) {
                clearInterval(countdownInterval);
                if (mainCountdown) mainCountdown.innerHTML = "<span>Đã kết thúc</span>";
                smallCountdowns.forEach(el => el.textContent = "Đã kết thúc");
            }
        }, 1000);
    }
    
    startCountdown();

    // --- 2. THANH CUỘN LOGO NHÀ XUẤT BẢN ---
    const scrollContainer = document.querySelector('.product-brand-logos');
    const scrollRightBtn = document.querySelector('.scroll-btn.right');
    
    if (scrollContainer && scrollRightBtn) {
        scrollRightBtn.addEventListener('click', () => {
            // Cuộn sang phải 250px một cách mượt mà
            scrollContainer.scrollBy({
                left: 250,
                behavior: 'smooth'
            });
        });
    }

    // --- 3. XỬ LÝ FORM ĐĂNG KÝ NHẬN TIN ---
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(event) {
            // Ngăn chặn hành vi mặc định của form (tải lại trang)
            event.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (email) {
                alert(`Cảm ơn bạn đã đăng ký nhận tin với email: ${email}`);
                emailInput.value = ''; // Xóa email trong ô input sau khi đăng ký
            } else {
                alert('Vui lòng nhập địa chỉ email của bạn.');
            }
        });
    }

    // --- 4. CHỨC NĂNG CLICK VÀO SẢN PHẨM ---
    function goToProduct(productId) {
        window.location.href = `product.html?id=${productId}`;
    }

    // Thêm event listener cho tất cả sản phẩm
    function addProductClickEvents() {
        const productItems = document.querySelectorAll('.product-item');
        productItems.forEach((item, index) => {
            if (!item.onclick) {
                item.style.cursor = 'pointer';
                item.addEventListener('click', () => {
                    goToProduct(index + 1);
                });
            }
        });
    }

    // Gọi hàm sau khi DOM load xong
    addProductClickEvents();

    // --- 5. SEARCH FUNCTIONALITY ---
    function searchProducts() {
        const searchInput = document.querySelector('.search-bar input');
        const searchTerm = searchInput.value.trim();
        
        if (searchTerm) {
            // Redirect to category page with search parameter
            window.location.href = `category.html?search=${encodeURIComponent(searchTerm)}`;
        }
    }

    // Thêm search khi nhấn Enter
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }

    // Thêm search khi click button
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchProducts);
    }

    // --- 6. SIDEBAR CATEGORY LINKS ---
    const categoryLinks = document.querySelectorAll('.category-list a');
    categoryLinks.forEach(link => {
        if (link.getAttribute('href') === '#') {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                // Extract category from text content
                const categoryText = this.textContent.trim();
                if (categoryText.includes('Sách Tiếng Việt')) {
                    window.location.href = 'category.html?type=vietnamese';
                } else if (categoryText.includes('Sách Ngoại Văn')) {
                    window.location.href = 'category.html?type=foreign';
                } else if (categoryText.includes('chữ ký')) {
                    window.location.href = 'category.html?type=signed';
                }
            });
        }
    });

    // --- 7. BRAND LOGO LINKS ---
    function addBrandLogoLinks() {
        const brandLogos = document.querySelectorAll('.product-brand-logos img');
        brandLogos.forEach(logo => {
            logo.style.cursor = 'pointer';
            logo.addEventListener('click', function() {
                // Redirect to a specific category or publisher page
                window.location.href = 'category.html?type=vietnamese';
            });
        });
    }

    addBrandLogoLinks();

});