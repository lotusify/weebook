# 📚 BookSelf - Website bán sách trực tuyến

## 🎯 Dành cho ai?

### 👨‍💻 Developer
- File chính: `index.html`, `script.js`, `style.css`, `data.js`
- Xem git history để hiểu cấu trúc

### 🎨 Designer / Content Manager
- **Chỉ cần sửa:** `data.js` (hoặc dùng Python scraper)
- **Xem hướng dẫn:** `SCRAPING_GUIDE.md`

---

## 📁 Cấu trúc quan trọng

```
weebook/
├── data.js                    ← Dữ liệu sách (tất cả data ở đây)
├── scrape_readstation.py      ← Script scrape data từ ReadStation.vn
├── convert_to_datajs.py       ← Convert JSON → data.js format
├── SCRAPING_GUIDE.md          ← Hướng dẫn scrape data
├── images/                    ← Thư mục chứa ảnh
├── index.html                 ← Trang chủ
├── category.html              ← Trang danh mục
├── product.html               ← Trang chi tiết sản phẩm
├── script.js                  ← JavaScript chính
└── style.css                  ← CSS chính
```

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

**Cách 2: Scrape từ ReadStation.vn** (Khuyến nghị!)

```bash
# Cài đặt
pip install -r requirements.txt

# Scrape data
python scrape_readstation.py

# Convert sang format data.js
python convert_to_datajs.py

# Copy nội dung data_new.js vào data.js
```

📖 **Chi tiết:** Xem `SCRAPING_GUIDE.md`

### 3. Thay đổi giao diện
Sửa file: `style.css`

### 4. Thêm chức năng
Sửa file: `script.js`

---

## 📝 Tính năng

- ✅ Trang chủ với sản phẩm nổi bật
- ✅ Danh mục sách đa dạng
- ✅ Chi tiết sản phẩm
- ✅ Giỏ hàng
- ✅ Thanh toán
- ✅ Đăng nhập/Đăng ký
- ✅ Admin panel
- ✅ Chatbot AI
- ✅ Lọc theo giá
- ✅ Tìm kiếm sản phẩm
- ✅ Scrape data từ ReadStation.vn

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

### Scrape từ ReadStation.vn ⭐ ĐÃ HOÀN THÀNH

**Website hiện đang dùng 59 sản phẩm thật từ ReadStation.vn!**

Script Python đã lấy:
- ✅ Tiêu đề sách thật
- ✅ Giá bán thật  
- ✅ **Link ảnh thật từ website** (không dùng placeholder nữa!)
- ✅ URL sản phẩm thật

Sau đó tự động thêm:
- Tác giả (ngẫu nhiên phù hợp)
- Rating, review count
- Mô tả, tags
- ISBN, số trang, ...

### Ưu điểm

1. **Ảnh thật** - Không dùng placeholder
2. **Giá thật** - Từ ReadStation.vn
3. **Tự động** - Không cần nhập tay
4. **Nhanh** - 50+ sách trong vài phút

---

## 🛠️ Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Local Storage (for demo)
- Python (for scraping)
- BeautifulSoup4 (web scraping)

---

## 📞 Support

Nếu cần hỗ trợ, liên hệ team dev.

---

**Made with ❤️ by BookSelf Team**
