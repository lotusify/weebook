# 📚 BookSelf - Website bán sách trực tuyến

## 🎯 Dành cho ai?

### 👨‍💻 Developer
- File chính: `index.html`, `script.js`, `style.css`, `data.js`
- Xem git history để hiểu cấu trúc

### 🎨 Designer / Content Manager
- **Chỉ cần sửa:** `data.js` (hoặc dùng Python scraper)
- **Xem hướng dẫn:** `scrapper/SCRAPING_GUIDE.md`

---

## 📁 Cấu trúc dự án chi tiết

```
weebook/
├── 📄 HTML Pages
│   ├── index.html                 ← Trang chủ với sản phẩm nổi bật
│   ├── category.html              ← Trang danh mục sản phẩm
│   ├── product.html               ← Chi tiết sản phẩm
│   ├── checkout.html              ← Trang thanh toán
│   ├── order-success.html         ← Xác nhận đặt hàng thành công
│   ├── orders.html                ← Quản lý đơn hàng
│   ├── profile.html               ← Hồ sơ người dùng
│   ├── reviews.html               ← Đánh giá sản phẩm
│   ├── auth.html                  ← Đăng nhập/đăng ký
│   ├── admin.html                 ← Panel quản trị
│   ├── chatbot.html               ← Chatbot AI
│   ├── about.html                 ← Giới thiệu công ty
│   └── category-menu.html         ← Menu danh mục
│
├── 🔧 JavaScript Files
│   ├── script.js                  ← JavaScript chính (logic website)
│   ├── load-components.js         ← Load header/footer components
│   ├── update-pages.js            ← Cập nhật nội dung trang
│   ├── checkout.js                ← Logic thanh toán
│   ├── order-success.js           ← Logic trang thành công
│   ├── orders.js                  ← Logic quản lý đơn hàng
│   ├── profile.js                 ← Logic hồ sơ người dùng
│   ├── reviews.js                 ← Logic đánh giá
│   ├── auth.js                    ← Logic đăng nhập/đăng ký
│   └── admin.js                   ← Logic admin panel
│
├── 🎨 Styling & Components
│   ├── style.css                  ← CSS chính (responsive design)
│   ├── header.html                ← Component header
│   └── footer.html                ← Component footer
│
├── 📊 Data & Configuration
│   ├── data.js                    ← Database sản phẩm (169 sản phẩm)
│   └── README.md                  ← Tài liệu dự án
│
├── 🖼️ Assets
│   └── images/                    ← Thư mục ảnh sản phẩm và logo
│       ├── book-*.jpg             ← Ảnh sách
│       ├── hero-banner.*           ← Banner trang chủ
│       ├── logo.png               ← Logo công ty
│       └── icon-*.png             ← Icons
│
├── 📋 Info Pages
│   └── info/                      ← Thư mục chính sách và hướng dẫn
│       ├── chinh-sach-*.html      ← Các chính sách
│       ├── huong-dan-*.html       ← Hướng dẫn sử dụng
│       └── template.html          ← Template trang info
│
└── 🕷️ Scrapper Tools
    └── scrapper/                  ← Thư mục công cụ scraping (71 files)
        ├── *.py                   ← 51 scripts Python
        ├── *.json                 ← 11 files dữ liệu
        ├── *.html                  ← 7 files debug/test
        ├── requirements.txt       ← Python dependencies
        └── SCRAPING_GUIDE.md      ← Hướng dẫn scraping
```

---

## 📋 Chi tiết từng file quan trọng

### 🗂️ File chính

#### `data.js` - Database sản phẩm
- **Mục đích:** Chứa toàn bộ dữ liệu sản phẩm (169 sản phẩm)
- **Cấu trúc:** Object `BOOK_DATABASE` với các thuộc tính:
  - `id`, `title`, `author`, `publisher`
  - `price`, `originalPrice`, `discount`
  - `category`, `subcategory`
  - `images[]`, `description`, `tags[]`
  - `rating`, `reviewCount`, `stock`
- **Categories:** vietnamese, foreign, office-supplies, toys, comics
- **Cách sửa:** Thêm/sửa/xóa sản phẩm trực tiếp trong object

#### `script.js` - Logic chính
- **Mục đích:** Xử lý tất cả logic của website
- **Chức năng chính:**
  - Load sản phẩm từ `data.js`
  - Xử lý giỏ hàng, wishlist
  - Tìm kiếm và lọc sản phẩm
  - Navigation và routing
  - Dynamic content loading
- **Key functions:** `loadProductDetails()`, `initializeHomePage()`, `searchBooks()`

#### `style.css` - Giao diện
- **Mục đích:** Styling và responsive design
- **Features:**
  - CSS Grid và Flexbox layout
  - Responsive design (mobile-first)
  - Product card styling
  - Navigation styling
  - Form styling
- **Key classes:** `.product-card`, `.product-grid`, `.nav-links`

#### `index.html` - Trang chủ
- **Mục đích:** Trang chủ với sản phẩm nổi bật
- **Sections:**
  - Hero banner
  - Featured products (8 sản phẩm)
  - New releases (8 sản phẩm)
  - Categories overview
- **Dynamic loading:** Sử dụng `script.js` để load content

### 🔧 File hỗ trợ

#### `load-components.js` - Load components
- **Mục đích:** Load header và footer vào các trang
- **Function:** `loadHeader()`, `loadFooter()`
- **Usage:** Được gọi trong mỗi trang HTML

#### `update-pages.js` - Cập nhật trang
- **Mục đích:** Cập nhật nội dung động của các trang
- **Functions:** `updatePageTitle()`, `updateBreadcrumb()`

#### `checkout.js` - Thanh toán
- **Mục đích:** Xử lý logic thanh toán
- **Features:** Form validation, order processing

#### `auth.js` - Xác thực
- **Mục đích:** Đăng nhập/đăng ký
- **Features:** Form validation, user management

### 🖼️ Assets

#### `images/` - Thư mục ảnh
- **Sản phẩm:** `book-*.jpg` (ảnh sách)
- **UI:** `hero-banner.*`, `logo.png`, `icon-*.png`
- **Format:** JPG, PNG
- **Naming:** Theo pattern `book-{category}-{number}.jpg`

#### `info/` - Trang thông tin
- **Chính sách:** `chinh-sach-*.html`
- **Hướng dẫn:** `huong-dan-*.html`
- **Template:** `template.html` cho các trang info

### 🕷️ Scrapper Tools (`scrapper/`)

#### Python Scripts
- **Scraping:** `scrape_*.py` - Lấy data từ các website
- **Processing:** `convert_*.py` - Chuyển đổi format data
- **Fixing:** `fix_*.py` - Sửa lỗi trong data
- **Debugging:** `debug_*.py` - Debug HTML structure

#### Data Files
- **JSON:** `*_data.json` - Dữ liệu scraped
- **HTML:** `*_debug.html` - HTML debug files

---

## 🚀 Quick Start

### 1. Chạy website

**Không cần server!** Chỉ cần:
- Mở file `index.html` trong browser
- Hoặc kéo thả `index.html` vào browser

*Hoặc dùng local server (tùy chọn):*
```bash
python -m http.server 8000
```

### 2. Thêm sách mới

**Cách 1: Thủ công**
- Mở `data.js`
- Tìm object `BOOK_DATABASE`
- Thêm entry mới theo format có sẵn

**Cách 2: Scrape từ website** (Khuyến nghị!)

```bash
# Vào thư mục scrapper
cd scrapper

# Cài đặt dependencies
pip install -r requirements.txt

# Scrape data từ ReadStation.vn
python scrape_readstation.py

# Convert sang format data.js
python convert_to_datajs.py

# Copy nội dung data_new.js vào data.js ở thư mục gốc
```

📖 **Chi tiết:** Xem `scrapper/SCRAPING_GUIDE.md`

### 3. Thay đổi giao diện
Sửa file: `style.css`

### 4. Thêm chức năng
Sửa file: `script.js`

---

## 📝 Tính năng

### 🏠 Trang chủ
- ✅ Hero banner với call-to-action
- ✅ Sản phẩm nổi bật (8 sản phẩm)
- ✅ Sản phẩm mới (8 sản phẩm)
- ✅ Danh mục sản phẩm overview
- ✅ Responsive design

### 🛍️ Mua sắm
- ✅ Danh mục sách đa dạng (5 categories)
- ✅ Chi tiết sản phẩm với ảnh, mô tả, đánh giá
- ✅ Giỏ hàng với Local Storage
- ✅ Wishlist (yêu thích)
- ✅ Tìm kiếm sản phẩm theo tên, tác giả, tags
- ✅ Lọc theo giá, rating, category
- ✅ Quick view sản phẩm

### 💳 Thanh toán & Đơn hàng
- ✅ Trang thanh toán với form validation
- ✅ Xác nhận đặt hàng thành công
- ✅ Quản lý đơn hàng
- ✅ Lịch sử mua hàng

### 👤 Người dùng
- ✅ Đăng nhập/Đăng ký
- ✅ Hồ sơ người dùng
- ✅ Đánh giá sản phẩm
- ✅ Quản lý tài khoản

### 🔧 Quản trị
- ✅ Admin panel
- ✅ Quản lý sản phẩm
- ✅ Thống kê đơn hàng
- ✅ Chatbot AI hỗ trợ

### 🕷️ Scraping & Data
- ✅ Scrape data từ ReadStation.vn
- ✅ Scrape văn phòng phẩm từ TheGioiVanPhongPham
- ✅ Tự động xử lý và chuyển đổi data
- ✅ Debug tools và validation

---

## 🔐 Tài khoản mặc định

**Admin:**
- Email: `admin@bookself.com`
- Password: `admin@bookself.com`

**User:**
- Email: `user@bookself.com`
- Password: `user@bookself.com`

---

## 🕷️ Scraping Data

### 📚 Sách từ ReadStation.vn ⭐ ĐÃ HOÀN THÀNH

**Website hiện đang dùng 154 sản phẩm sách thật từ ReadStation.vn!**

Script Python đã lấy:
- ✅ Tiêu đề sách thật
- ✅ Giá bán thật  
- ✅ **Link ảnh thật từ website** (không dùng placeholder nữa!)
- ✅ URL sản phẩm thật
- ✅ Tác giả và nhà xuất bản thật

Sau đó tự động thêm:
- Rating, review count
- Mô tả chi tiết
- Tags phù hợp
- ISBN, số trang, kích thước

### 📝 Văn phòng phẩm từ TheGioiVanPhongPham ⭐ ĐÃ HOÀN THÀNH

**Website hiện đang dùng 15 sản phẩm văn phòng phẩm thật!**

Script Python đã lấy:
- ✅ Tên sản phẩm thật
- ✅ Giá bán thật
- ✅ **Ảnh sản phẩm thật từ product.hstatic.net**
- ✅ Mô tả sản phẩm phù hợp

### Ưu điểm

1. **Ảnh thật** - Không dùng placeholder
2. **Giá thật** - Từ website gốc
3. **Tự động** - Không cần nhập tay
4. **Nhanh** - 169 sản phẩm trong vài phút
5. **Đa dạng** - Sách + văn phòng phẩm

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling với Grid/Flexbox
- **Vanilla JavaScript** - No frameworks, pure JS
- **Local Storage** - Lưu giỏ hàng và user data
- **Responsive Design** - Mobile-first approach

### Backend/Data
- **Python 3.x** - Scraping và data processing
- **BeautifulSoup4** - Web scraping
- **Requests** - HTTP requests
- **JSON** - Data format
- **Regular Expressions** - Text processing

### Tools & Utilities
- **Git** - Version control
- **VS Code** - Code editor
- **Browser DevTools** - Debugging
- **Local Server** - Development server

---

## 📊 Thống kê dự án

### Sản phẩm
- **Tổng:** 169 sản phẩm
- **Sách tiếng Việt:** ~100 sản phẩm
- **Sách ngoại văn:** ~40 sản phẩm
- **Văn phòng phẩm:** 15 sản phẩm
- **Đồ chơi:** ~10 sản phẩm
- **Truyện tranh:** ~4 sản phẩm

### Files
- **HTML:** 13 trang
- **JavaScript:** 10 files
- **CSS:** 1 file chính
- **Python:** 51 scripts
- **Images:** 20+ ảnh
- **Total:** 96+ files

### Categories
- `vietnamese` - Sách tiếng Việt
- `foreign` - Sách ngoại văn
- `office-supplies` - Văn phòng phẩm
- `toys` - Đồ chơi
- `comics` - Truyện tranh

---

## 🚀 Deployment

### Local Development
```bash
# Clone repository
git clone <repo-url>
cd weebook

# Mở index.html trong browser
# Hoặc dùng local server
python -m http.server 8000
```

### Production
- Upload toàn bộ files lên web server
- Không cần database server
- Static website, không cần backend
- CDN cho images (tùy chọn)

---

## 📞 Support & Contributing

### Báo lỗi
- Tạo issue trên GitHub
- Mô tả chi tiết lỗi và steps to reproduce

### Đóng góp
- Fork repository
- Tạo feature branch
- Commit changes
- Tạo pull request

### Liên hệ
- Email: support@bookself.com
- GitHub: [BookSelf Team](https://github.com/bookself)

---

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

---

**Made with ❤️ by BookSelf Team**

*Website bán sách trực tuyến với 169 sản phẩm thật từ ReadStation.vn và TheGioiVanPhongPham*
