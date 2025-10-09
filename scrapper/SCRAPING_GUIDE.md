# 🕷️ Hướng dẫn Scrape Data từ ReadStation.vn

## 📋 Yêu cầu

- Python 3.7+
- Các thư viện trong `requirements.txt`

## 🚀 Cách sử dụng

### 1. Cài đặt thư viện

```bash
pip install -r requirements.txt
```

### 2. Chạy script scrape

```bash
python scrape_readstation.py
```

Script sẽ:
- Scrape sách từ 3 categories: Sách Tiếng Việt, Sách Ngoại Văn, Văn Phòng Phẩm
- Lấy: tiêu đề, giá, link ảnh, URL sản phẩm
- Lưu vào `scraped_data.json`

### 3. Chuyển đổi sang data.js

Sau khi có `scraped_data.json`, chạy:

```bash
python convert_to_datajs.py
```

Script này sẽ:
- Đọc `scraped_data.json`
- Thêm thông tin bổ sung (tác giả, mô tả, rating...)
- Tạo file `data_new.js` với format chuẩn

### 4. Copy vào data.js

Mở `data_new.js`, copy nội dung và paste vào `data.js`

## ⚙️ Tùy chỉnh

### Thay đổi số trang scrape

Trong `scrape_readstation.py`, sửa tham số `max_pages`:

```python
vn_books = scrape_product_list(
    'https://readstation.vn/sach-tieng-viet',
    category='vietnamese',
    max_pages=5  # ← Thay đổi ở đây
)
```

### Thêm category mới

```python
new_books = scrape_product_list(
    'https://readstation.vn/truyen-tranh',
    category='comics',
    subcategory='manga',
    max_pages=2
)
all_books.extend(new_books)
```

## 🐛 Troubleshooting

### Lỗi: No products found

- Website có thể đã thay đổi HTML structure
- Kiểm tra lại class names trong BeautifulSoup
- Thử truy cập URL trực tiếp để xem có bị block không

### Lỗi: Connection timeout

- Tăng timeout: `requests.get(url, timeout=30)`
- Kiểm tra internet connection
- Website có thể đang bảo trì

### Ảnh không load

- Một số ảnh dùng lazy loading
- Thử dùng Selenium thay vì requests để load JS

## 📝 Notes

- Script có `time.sleep(1)` để tránh spam server
- Nên chạy vào giờ ít traffic
- Tuân thủ robots.txt của website
- Chỉ dùng cho mục đích học tập/phát triển


