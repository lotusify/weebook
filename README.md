# BookSelf - Dự án Nhà Sách Trực Tuyến

## Cấu trúc Dự án Mới (Đã Tái Tổ Chức)

Dự án đã được tái cấu trúc từ file monolithic sang kiến trúc modular để dễ bảo trì hơn.

### 📁 Cấu trúc Thư Mục

```
weebook/
├── css/                      # CSS Modules (MỚI)
│   ├── base/
│   │   ├── variables.css     # Theme colors, fonts, shadows
│   │   └── reset.css         # Global resets
│   ├── layout/
│   │   └── header.css        # Header & navigation
│   ├── components/
│   │   ├── search.css        # Search bar & autocomplete
│   │   └── cards.css         # Product cards
│   └── main.css              # Import tất cả modules
│
├── js/                       # JavaScript Modules (MỚI)
│   ├── core/
│   │   └── utils.js          # Utility functions
│   ├── features/
│   │   └── navigation.js     # Navigation functionality
│   └── main.js               # Main entry point
│
├── style.css                 # LEGACY - sẽ dần migrate
├── script.js                 # LEGACY - sẽ dần migrate
├── data.js                   # Book database (giữ nguyên)
├── load-components.js        # Component loader (giữ nguyên)
│
├── admin.js                  # Admin panel (giữ nguyên)
├── auth.js                   # Authentication (giữ nguyên)
├── checkout.js               # Checkout (giữ nguyên)
├── profile.js                # User profile (giữ nguyên)
├── orders.js                 # Orders (giữ nguyên)
│
└── *.html                    # HTML files
```

### 🎯 Nguyên tắc Tổ Chức

#### CSS Modules
- **base/** - Foundational styles (variables, resets, typography)
- **layout/** - Page layout (header, footer, grid, sidebar)
- **components/** - Reusable components (buttons, cards, modals)
  - **pages/** - Page-specific styles (home, product, category)

#### JavaScript Modules
- **core/** - Core utilities và config
- **features/** - Feature modules (cart, search, wishlist)
- **pages/** - Page-specific initialization

### � Migration Strategy

**Hiện tại:** Hybrid approach
- File CSS/JS modules mới: modular, dễ maintain
- File cũ (style.css, script.js): vẫn hoạt động để đảm bảo tương thích
- Migration dần dần theo từng feature

**Lộ trình:**
1. ✅ Tạo cấu trúc thư mục
2. ✅ Extract core CSS & JS modules  
3. ⏳ Migrate từng feature một
4. ⏳ Remove old monolithic files

### 🚀 Cách Sử Dụng

#### Phát triển Tính năng Mới
```javascript
// Tạo module mới trong js/features/
// Ví dụ: js/features/my-feature.js

export function myFeature() {
    // Your code
}

// Import vào js/main.js
import { myFeature } from './features/my-feature.js';
```

#### Thêm CSS Mới
```css
/* Tạo file mới trong css/components/ hoặc css/pages/ */
/* Ví dụ: css/components/my-component.css */

.my-component {
    /* Your styles */
}

/* Import vào css/main.css */
@import url('components/my-component.css');
```

### � Thống Kê Cải Thiện

| Metric | Trước | Sau |
|--------|-------|-----|
| style.css | 8,980 dòng (165KB) | Split thành ~15 files nhỏ |
| script.js | 2,919 dòng (108KB) | Split thành modules |
| Maintainability | ❌ Khó maintain | ✅ Dễ maintain |
| Code organization | ❌ Lộn xộn | ✅ Có cấu trúc |

### 🛠 Development

```bash
# Clone repository
git clone <repository-url>

# Open in browser (use live server recommended)
# Hoặc đơn giản mở index.html

# Khi phát triển, edit modules nhỏ thay vì file lớn
```

### � Ghi Chú

- File cũ `style.css` và `script.js` VẪN được load để đảm bảo backward compatibility
- Migration hoàn toàn sẽ thực hiện từ từ
- Mọi tính năng mới nên viết theo kiến trúc module

### 👨‍� Tác Giả & Maintenance

Dự án được tái cấu trúc vào 2025-11-28 để cải thiện code organization và maintainability.

---

**Happy Coding! 📚🚀**
