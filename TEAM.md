# 📚 BookSelf - Phân công dự án

## 👥 Phân công 6 thành viên

### **1. Danh - Tìm kiếm và Lọc**
**Files làm việc:**
- `js/navigation.js` (phần search)
- `css/header.css` (search styling)

**Chức năng:**
1. ✅ Search bar với autocomplete
2. ✅ Search suggestions dropdown
3. ✅ Perform search và display results
4. ✅ Search history (optional)

**Dòng code:** ~80 dòng

---

### **2. Kiên - Chi tiết sản phẩm**
**Files làm việc:**
- `js/product.js`
- `product.html`
- `css/product.css`

**Chức năng:**
1. ✅ Load và hiển thị thông tin sản phẩm
2. ✅ Image gallery/slider
3. ✅ Rating stars display
4. ✅ Add to cart button
5. ✅ Quantity selector (+/-)
6. ✅ Related products section

**Dòng code:** ~450 dòng

---

### **3. Trung - Giỏ hàng & Thanh toán**
**Files làm việc:**
- `js/cart.js`
- `checkout.js`
- `checkout.html`
- `css/checkout.css`

**Chức năng:**
1. ✅ Add/Remove/Update cart
2. ✅ Cart dropdown preview
3. ✅ Cart sync across tabs
4. ✅ Checkout form
5. ✅ Payment methods selection
6. ✅ Order summary

**Dòng code:** ~500 dòng

---

### **4. Khánh - Tài khoản**
**Files làm việc:**
- `js/profile.js`
- `profile.html`
- `css/profile.css`

**Chức năng:**
1. ✅ Display user profile
2. ✅ Edit profile information
3. ✅ Wishlist management
4. ✅ View order history (đơn giản)
5. ✅ Change password

**Dòng code:** ~300 dòng

---

### **5. Dũng - Danh mục (Category)**
**Files làm việc:**
- `js/category.js`
- `category.html`
- `css/category.css`

**Chức năng:**
1. ✅ Load category products
2. ✅ Filter by price range
3. ✅ Sort products (price, name, date)
4. ✅ Pagination controls
5. ✅ Items per page selector
6. ✅ Grid/List view toggle

**Dòng code:** ~350 dòng

---

### **6. Tân - Đăng nhập/Đăng ký**
**Files làm việc:**
- `js/auth.js`
- `auth.html`
- `css/auth.css`

**Chức năng:**
1. ✅ Login form với validation
2. ✅ Register form với validation
3. ✅ Session management (localStorage)
4. ✅ Remember me checkbox
5. ✅ Logout functionality
6. ✅ Update UI based on login status

**Dòng code:** ~200 dòng

---

## 📁 Cấu trúc dự án

```
weebook/
├── js/
│   ├── utils.js           (Shared utilities)
│   ├── header.js          (Header component)
│   ├── footer.js          (Footer component)
│   ├── navigation.js      (Danh - Search & Nav)
│   ├── product.js         (Kiên - Product details)
│   ├── cart.js            (Trung - Cart)
│   ├── category.js        (Dũng - Category & Filter)
│   ├── auth.js            (Tân - Login/Register)
│   ├── profile.js         (Khánh - Profile)
│   ├── wishlist.js        (Shared - Wishlist)
│   └── home.js            (Homepage)
├── css/
│   ├── base.css           (Global styles)
│   ├── header.css
│   ├── footer.css
│   ├── home.css
│   ├── product.css        (Kiên)
│   ├── category.css       (Dũng)
│   ├── checkout.css       (Trung)
│   ├── auth.css           (Tân)
│   ├── profile.css        (Khánh)
│   └── reviews.css
├── index.html             (Homepage)
├── product.html           (Kiên)
├── category.html          (Dũng)
├── checkout.html          (Trung)
├── auth.html              (Tân)
├── profile.html           (Khánh)
├── about.html
├── data.js                (Database)
├── script.js              (Main loader)
└── style.css              (Import all CSS)
```

## 🎯 Files đã xóa (không cần làm)
- ❌ admin.html, admin.js, admin.css
- ❌ orders.html, orders.js, order.css
- ❌ order-success.html, order-success.js
- ❌ shop.html, shop.js, shop.css
- ❌ chatbot.js, chat.css

## 📊 Tổng kết
- **Tổng dòng code:** ~1,880 dòng
- **Trung bình mỗi người:** ~313 dòng
- **Độ khó:** ⭐⭐⭐ (Vừa phải)

## 🚀 Bắt đầu làm việc
1. Clone repo: `git clone https://github.com/lotusify/weebook.git`
2. Mở file của bạn trong folder `js/`, `css/`, hoặc HTML tương ứng
3. Test trên trình duyệt: Mở `index.html`
4. Commit và push khi xong: `git add . && git commit -m "..." && git push`
