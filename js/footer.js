// ========== FOOTER COMPONENT ========== //
// Load footer component dynamically

// Run immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
} else {
    loadFooter();
}

function loadFooter() {
    // Determine the correct path based on current location
    const isInInfoFolder = window.location.pathname.includes('/info/');
    const basePath = isInInfoFolder ? '../' : '';
    
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

    // Load footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerHTML;
    }
}

// Export function to window
window.loadFooter = loadFooter;
