# BookShelf - Website Bán Sách Trực Tuyến

BookShelf là một website bán sách trực tuyến hoàn chỉnh với đầy đủ các tính năng của một cửa hàng sách online hiện đại.

## 🚀 Tính năng chính

### 🔐 Hệ thống xác thực
- **Đăng ký/Đăng nhập**: Tạo tài khoản mới hoặc đăng nhập vào hệ thống
- **Quản lý phiên**: Lưu trữ thông tin đăng nhập với localStorage/sessionStorage
- **Bảo mật**: Kiểm tra tính hợp lệ của thông tin đăng nhập

### 🛒 Giỏ hàng & Thanh toán
- **Giỏ hàng**: Thêm/xóa sản phẩm, cập nhật số lượng
- **Checkout**: Quy trình thanh toán hoàn chỉnh với thông tin giao hàng
- **Phương thức thanh toán**: COD, chuyển khoản ngân hàng, ví MoMo
- **Phương thức giao hàng**: Tiêu chuẩn và nhanh

### 👤 Quản lý người dùng
- **Hồ sơ cá nhân**: Xem và chỉnh sửa thông tin cá nhân
- **Đơn hàng**: Theo dõi trạng thái đơn hàng, hủy đơn, đặt lại
- **Danh sách yêu thích**: Lưu sách yêu thích để mua sau
- **Đánh giá**: Viết và quản lý đánh giá sản phẩm

### 📚 Quản lý sản phẩm
- **Danh mục sách**: Phân loại theo thể loại và danh mục
- **Tìm kiếm**: Tìm kiếm sách với autocomplete
- **Lọc & Sắp xếp**: Lọc theo giá, đánh giá, thể loại
- **Chi tiết sản phẩm**: Thông tin đầy đủ về sách

### ⭐ Hệ thống đánh giá
- **Đánh giá sản phẩm**: Viết đánh giá với sao và bình luận
- **Hiển thị đánh giá**: Xem tất cả đánh giá với bộ lọc
- **Thống kê**: Điểm trung bình và phân tích đánh giá

## 📁 Cấu trúc dự án

```
weebook/
├── index.html          # Trang chủ
├── category.html       # Trang danh mục
├── product.html        # Trang chi tiết sản phẩm
├── auth.html          # Trang đăng nhập/đăng ký
├── checkout.html      # Trang thanh toán
├── order-success.html # Trang xác nhận đơn hàng
├── profile.html       # Trang hồ sơ người dùng
├── orders.html        # Trang quản lý đơn hàng
├── reviews.html       # Trang đánh giá sản phẩm
├── about.html         # Trang giới thiệu
├── style.css          # CSS chính
├── script.js          # JavaScript chính
├── auth.js            # Hệ thống xác thực
├── checkout.js        # Hệ thống thanh toán
├── profile.js         # Quản lý hồ sơ
├── orders.js          # Quản lý đơn hàng
├── reviews.js         # Hệ thống đánh giá
├── data.js            # Dữ liệu sách
└── images/            # Thư mục hình ảnh
```

## 🛠️ Công nghệ sử dụng

- **HTML5**: Cấu trúc trang web
- **CSS3**: Styling với Flexbox, Grid, animations
- **JavaScript ES6+**: Logic xử lý và tương tác
- **LocalStorage**: Lưu trữ dữ liệu cục bộ
- **Font Awesome**: Icon library
- **Responsive Design**: Tương thích mobile và desktop

## 🚀 Cách sử dụng

### 1. Mở website
- Mở file `index.html` trong trình duyệt web
- Website sẽ tự động tải dữ liệu sách

### 2. Đăng ký tài khoản
- Click vào "Tài khoản" ở header
- Chọn tab "Đăng ký"
- Điền thông tin và tạo tài khoản

### 3. Mua sách
- Duyệt sách trên trang chủ hoặc danh mục
- Click vào sách để xem chi tiết
- Thêm vào giỏ hàng và thanh toán

### 4. Quản lý đơn hàng
- Vào "Tài khoản" > "Đơn hàng"
- Xem trạng thái, hủy đơn, đặt lại

### 5. Đánh giá sản phẩm
- Vào trang chi tiết sản phẩm
- Click "Đánh giá" để viết đánh giá
- Xem đánh giá của người khác

## 📱 Responsive Design

Website được thiết kế responsive, tương thích với:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

## 🎨 Tính năng UI/UX

- **Modern Design**: Giao diện hiện đại, dễ sử dụng
- **Smooth Animations**: Hiệu ứng mượt mà
- **Loading States**: Trạng thái tải với spinner
- **Notifications**: Thông báo cho người dùng
- **Form Validation**: Kiểm tra dữ liệu đầu vào
- **Accessibility**: Hỗ trợ accessibility cơ bản

## 💾 Lưu trữ dữ liệu

Tất cả dữ liệu được lưu trữ trong localStorage:
- `bookshelf-users`: Thông tin người dùng
- `bookshelf-cart`: Giỏ hàng
- `bookshelf-orders`: Đơn hàng
- `bookshelf-reviews`: Đánh giá sản phẩm

## 🔧 Tùy chỉnh

### Thêm sách mới
Chỉnh sửa file `data.js` để thêm sách mới vào database.

### Thay đổi giao diện
Chỉnh sửa file `style.css` để thay đổi màu sắc, font chữ, layout.

### Thêm tính năng
Thêm JavaScript mới vào các file tương ứng hoặc tạo file mới.

## 📞 Hỗ trợ

Nếu có vấn đề hoặc câu hỏi, vui lòng liên hệ qua:
- Email: support@bookshelf.com
- Hotline: 1900-xxxx

## 📄 License

Dự án này được phát hành dưới giấy phép MIT.

---

**BookShelf** - Nơi tìm kiếm tri thức và niềm vui đọc sách! 📚✨
