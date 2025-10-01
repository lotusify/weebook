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

});