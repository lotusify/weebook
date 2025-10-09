// ========== BOOKSHELF DATABASE ========== //
// Comprehensive book database for dynamic content

const BOOK_DATABASE = {
    // Vietnamese Books
    1: {
        id: 1,
        title: "Tâm trí chữa lành cơ thể như thế nào",
        author: "Dr. James Gordon",
        publisher: "NXB Thế Giới",
        publishDate: "2023-09-15",
        category: "vietnamese",
        subcategory: "psychology",
        price: 239000,
        originalPrice: 299000,
        discount: 20,
        isbn: "978-604-77-9876-5",
        pages: 368,
        language: "Tiếng Việt",
        format: "Bìa mềm",
        weight: "400g",
        dimensions: "20.5 x 14.5 x 2.2 cm",
        stock: 45,
        rating: 4.5,
        reviewCount: 128,
        images: [
            "images/book-tlch-1.jpg",
            "images/book-global-class.jpg",
            "images/book-cam-go.jpg"
        ],
        description: `"Tâm trí chữa lành cơ thể như thế nào" là cuốn sách đột phá về sức mạnh của tâm lý trong việc chữa lành cơ thể. 

Dr. James Gordon, một trong những chuyên gia hàng đầu về y học tích hợp, chia sẻ những phát hiện khoa học mới nhất về mối liên hệ giữa tâm lý và sức khỏe thể chất.

Cuốn sách cung cấp:
- Những kỹ thuật thiền định và thở sâu để giảm căng thẳng
- Phương pháp tự chữa lành qua ăn uống và lối sống
- Các bài tập thực hành đơn giản nhưng hiệu quả
- Nghiên cứu khoa học chứng minh về sức mạnh của tâm lý

Đây là cuốn sách không thể bỏ qua cho những ai quan tâm đến sức khỏe toàn diện.`,
        tags: ["tâm lý", "sức khỏe", "y học", "thiền định", "bestseller"],
        featured: true,
        newRelease: true
    },

    2: {
        id: 2,
        title: "Global Class - Doanh nghiệp vươn tầm thế giới",
        author: "Trần Đình Long",
        publisher: "NXB Trẻ",
        publishDate: "2023-08-20",
        category: "vietnamese", 
        subcategory: "economics",
        price: 249000,
        originalPrice: 289000,
        discount: 14,
        isbn: "978-604-1-16543-2",
        pages: 456,
        language: "Tiếng Việt",
        format: "Bìa cứng",
        weight: "650g",
        dimensions: "23 x 15.5 x 3 cm",
        stock: 32,
        rating: 4.3,
        reviewCount: 89,
        images: [
            "images/book-global-class.jpg",
            "images/book-tlch-1.jpg",
            "images/book-cam-go.jpg"
        ],
        description: `Cuốn sách "Global Class" là cẩm nang toàn diện cho các doanh nhân Việt Nam muốn vươn ra thị trường quốc tế.

Tác giả Trần Đình Long, với 20 năm kinh nghiệm quản lý doanh nghiệp, chia sẻ:
- Chiến lược phát triển thương hiệu quốc tế
- Cách thức quản trị doanh nghiệp theo chuẩn toàn cầu
- Kinh nghiệm thực tế từ các tập đoàn hàng đầu
- Roadmap chi tiết để "Go Global"

Đây là cuốn sách bắt buộc cho mọi CEO, doanh nhân trẻ và quản lý cấp cao.`,
        tags: ["kinh doanh", "quản trị", "toàn cầu hóa", "chiến lược", "CEO"],
        featured: true,
        newRelease: false
    },

    3: {
        id: 3,
        title: "Cẩm nang Khảo cổ học Việt Nam",
        author: "PGS.TS Trần Quốc Vượng",
        publisher: "NXB Đại học Quốc gia",
        publishDate: "2023-07-10",
        category: "vietnamese",
        subcategory: "history",
        price: 199000,
        originalPrice: 229000,
        discount: 13,
        isbn: "978-604-11-8765-4",
        pages: 524,
        language: "Tiếng Việt", 
        format: "Bìa mềm",
        weight: "580g",
        dimensions: "24 x 16 x 3.2 cm",
        stock: 18,
        rating: 4.7,
        reviewCount: 156,
        images: [
            "images/book-cam-go.jpg",
            "images/book-lich-su.jpg",
            "images/book-vien-du.jpg"
        ],
        description: `Cuốn "Cẩm nang Khảo cổ học Việt Nam" là tác phẩm tổng hợp về lịch sử khảo cổ học nước ta.

Nội dung chính:
- Tổng quan về các nền văn hóa cổ đại Việt Nam
- Phương pháp nghiên cứu khảo cổ học hiện đại
- Những phát hiện mới nhất về Văn hóa Đông Sơn, Óc Eo
- Hệ thống di tích lịch sử quan trọng

Cuốn sách không chỉ dành cho chuyên gia mà còn là tài liệu quý báu cho mọi người yêu lịch sử.`,
        tags: ["lịch sử", "khảo cổ", "văn hóa", "di tích", "Việt Nam"],
        featured: false,
        newRelease: false
    },

    4: {
        id: 4,
        title: "Đừng bỏ lỡ - Nghệ thuật sống tối giản",
        author: "Marie Kondo",
        publisher: "NXB Phụ Nữ",
        publishDate: "2023-06-15",
        category: "vietnamese",
        subcategory: "lifestyle",
        price: 285000,
        originalPrice: 320000,
        discount: 11,
        isbn: "978-604-2-19876-3",
        pages: 288,
        language: "Tiếng Việt",
        format: "Bìa mềm",
        weight: "320g",
        dimensions: "20 x 13 x 1.8 cm",
        stock: 67,
        rating: 4.4,
        reviewCount: 203,
        images: [
            "images/book-my-thuat.jpg",
            "images/book-tlch-1.jpg",
            "images/book-global-class.jpg"
        ],
        description: `"Đừng bỏ lỡ" là cuốn sách về nghệ thuật sống tối giản và tìm kiếm hạnh phúc thật sự.

Marie Kondo hướng dẫn:
- Phương pháp KonMari để sắp xếp không gian sống
- Cách loại bỏ những thứ không cần thiết
- Tìm kiếm niềm vui trong cuộc sống đơn giản
- Xây dựng thói quen tích cực mỗi ngày

Cuốn sách sẽ giúp bạn tạo ra một cuộc sống gọn gàng, ý nghĩa và hạnh phúc hơn.`,
        tags: ["lối sống", "tối giản", "hạnh phúc", "KonMari", "tự phát triển"],
        featured: true,
        newRelease: false
    },

    5: {
        id: 5,
        title: "Lịch sử Việt Nam - Từ cổ đại đến hiện đại",
        author: "Viện Sử học Việt Nam",
        publisher: "NXB Chính trị Quốc gia",
        publishDate: "2023-05-20",
        category: "vietnamese",
        subcategory: "history",
        price: 285000,
        originalPrice: 320000,
        discount: 11,
        isbn: "978-604-9-87654-1",
        pages: 689,
        language: "Tiếng Việt",
        format: "Bìa cứng",
        weight: "890g",
        dimensions: "25 x 18 x 4.2 cm",
        stock: 23,
        rating: 4.8,
        reviewCount: 167,
        images: [
            "images/book-lich-su.jpg",
            "images/book-cam-go.jpg",
            "images/book-vien-du.jpg"
        ],
        description: `Cuốn "Lịch sử Việt Nam" tổng hợp toàn diện về 4000 năm lịch sử dân tộc.

Nội dung bao gồm:
- Thời kỳ Văn Lang - Âu Lạc
- Các triều đại phfeudal
- Thời kỳ kháng chiến chống thực dân - đế quốc
- Giai đoạn đổi mới và hội nhập

Được biên soạn bởi đội ngũ sử gia hàng đầu, cuốn sách là tài liệu không thể thiếu.`,
        tags: ["lịch sử", "Việt Nam", "dân tộc", "văn hóa", "tài liệu"],
        featured: false,
        newRelease: false
    },

    6: {
        id: 6,
        title: "Tiểu sử: Viễn du khắp thế gian",
        author: "Nguyễn Thành Nam",
        publisher: "NXB Văn học",
        publishDate: "2023-04-10",
        category: "vietnamese",
        subcategory: "biography",
        price: 265000,
        originalPrice: 299000,
        discount: 11,
        isbn: "978-604-7-45612-8",
        pages: 445,
        language: "Tiếng Việt",
        format: "Bìa mềm",
        weight: "450g",
        dimensions: "22 x 15 x 2.8 cm",
        stock: 34,
        rating: 4.2,
        reviewCount: 94,
        images: [
            "images/book-vien-du.jpg",
            "images/book-lich-su.jpg",
            "images/book-my-thuat.jpg"
        ],
        description: `Tiểu sử về cuộc đời phi thường của nhà thám hiểm Nguyễn Thành Nam.

Cuốn sách kể về:
- Hành trình xuyên qua 67 quốc gia
- Những trải nghiệm đáng nhớ tại mỗi vùng đất
- Bài học sống từ các nền văn hóa khác nhau
- Triết lý sống "Viễn du để hiểu đời"

Một cuốn sách truyền cảm hứng cho những ai yêu thích khám phá.`,
        tags: ["tiểu sử", "du lịch", "khám phá", "trải nghiệm", "cảm hứng"],
        featured: false,
        newRelease: false
    },

    // Foreign Books
    7: {
        id: 7,
        title: "Born in North America",
        author: "Sarah Mitchell",
        publisher: "Penguin Random House",
        publishDate: "2023-03-15",
        category: "foreign",
        subcategory: "non-fiction",
        price: 325000,
        originalPrice: 385000,
        discount: 16,
        isbn: "978-0-14-313456-7",
        pages: 342,
        language: "English",
        format: "Paperback",
        weight: "380g",
        dimensions: "20.3 x 13.3 x 2.4 cm",
        stock: 28,
        rating: 4.6,
        reviewCount: 234,
        images: [
            "images/book-foreign-1.jpg",
            "images/book-foreign-2.jpg",
            "images/book-foreign-3.jpg"
        ],
        description: `"Born in North America" explores the complex identity of first-generation immigrants in modern America.

Sarah Mitchell's compelling narrative examines:
- Cultural identity and belonging
- The immigrant experience in the 21st century
- Stories of resilience and adaptation
- The intersection of tradition and modernity

A powerful and moving account that resonates with readers worldwide.`,
        tags: ["immigration", "identity", "culture", "America", "non-fiction"],
        featured: true,
        newRelease: true
    },

    8: {
        id: 8,
        title: "Perimenopause Workbook",
        author: "Dr. Susan Johnson",
        publisher: "Harvard Health Publishing",
        publishDate: "2023-02-20",
        category: "foreign",
        subcategory: "health",
        price: 299000,
        originalPrice: 349000,
        discount: 14,
        isbn: "978-1-25-987654-3",
        pages: 256,
        language: "English",
        format: "Paperback",
        weight: "320g",
        dimensions: "21 x 14.8 x 1.9 cm",
        stock: 41,
        rating: 4.7,
        reviewCount: 187,
        images: [
            "images/book-foreign-2.jpg",
            "images/book-foreign-1.jpg",
            "images/book-foreign-4.jpg"
        ],
        description: `The complete guide to navigating perimenopause with confidence and knowledge.

Dr. Susan Johnson provides:
- Evidence-based information about hormonal changes
- Practical strategies for managing symptoms
- Nutrition and lifestyle recommendations
- Mental health support during transition

An essential resource for women and healthcare providers.`,
        tags: ["health", "women", "hormones", "wellness", "medical"],
        featured: false,
        newRelease: false
    },

    9: {
        id: 9,
        title: "Whole30: The Complete Guide",
        author: "Melissa Urban",
        publisher: "Houghton Mifflin",
        publishDate: "2023-01-10",
        category: "foreign",
        subcategory: "health",
        price: 279000,
        originalPrice: 319000,
        discount: 13,
        isbn: "978-0-54-765432-1",
        pages: 432,
        language: "English", 
        format: "Paperback",
        weight: "580g",
        dimensions: "23.5 x 19.1 x 2.7 cm",
        stock: 52,
        rating: 4.5,
        reviewCount: 312,
        images: [
            "images/book-foreign-3.jpg",
            "images/book-foreign-2.jpg",
            "images/book-foreign-5.jpg"
        ],
        description: `The ultimate guide to the Whole30 program that has transformed millions of lives.

This comprehensive guide includes:
- Complete 30-day meal plans
- Over 100 compliant recipes
- Shopping guides and meal prep tips
- Success stories and motivation

Transform your health in just 30 days with this proven program.`,
        tags: ["nutrition", "health", "diet", "wellness", "lifestyle"],
        featured: true,
        newRelease: false
    },

    10: {
        id: 10,
        title: "The Seventh Scroll",
        author: "Wilbur Smith",
        publisher: "St. Martin's Press",
        publishDate: "2022-12-05",
        category: "foreign",
        subcategory: "fiction",
        price: 310000,
        originalPrice: 365000,
        discount: 15,
        isbn: "978-1-25-012345-6",
        pages: 528,
        language: "English",
        format: "Paperback",
        weight: "495g",
        dimensions: "19.8 x 12.9 x 3.4 cm",
        stock: 37,
        rating: 4.3,
        reviewCount: 156,
        images: [
            "images/book-foreign-4.jpg",
            "images/book-foreign-1.jpg",
            "images/book-foreign-6.jpg"
        ],
        description: `The thrilling adventure continues in this epic tale of ancient Egypt and modern treasure hunting.

Wilbur Smith delivers:
- Heart-pounding archaeological adventure
- Rich historical detail and atmosphere
- Complex characters and relationships
- Ancient mysteries and modern dangers

A masterpiece of historical fiction that keeps readers captivated.`,
        tags: ["fiction", "adventure", "Egypt", "archaeology", "thriller"],
        featured: false,
        newRelease: false
    }
};

// Category mappings
const CATEGORIES = {
    vietnamese: "Sách Tiếng Việt",
    foreign: "Sách Ngoại Văn",
    signed: "Sách có chữ ký"
};

const SUBCATEGORIES = {
    // Vietnamese subcategories
    literature: "Văn Học",
    parenting: "Nuôi Dạy Con", 
    history: "Lịch Sử - Địa Lý - Tôn Giáo",
    culture: "Văn Hóa - Nghệ Thuật - Du Lịch",
    children: "Thiếu Nhi",
    biography: "Tiếu Sử - Hồi Ký",
    science: "Khoa Học Kỹ Thuật",
    art: "Âm Nhạc - Mỹ Thuật - Thời Trang",
    economics: "Kinh Tế",
    education: "Giáo Khoa - Tham Khảo",
    politics: "Chính Trị - Pháp Lý - Triết Học",
    health: "Sức Khỏe - Dinh Dưỡng",
    psychology: "Tâm Lý - Kỹ Năng Sống",
    language: "Sách Học Ngoại Ngữ",
    lifestyle: "Lối Sống",
    
    // Foreign subcategories
    "coffee-table": "Coffee Table Books",
    fiction: "Fiction",
    taschen: "Taschen",
    "non-fiction": "Non Fiction",
    bestseller: "Bestselling Series", 
    gifts: "Gifts of Others",
    "children-en": "Children's Books"
};

// Utility functions
const BookDatabase = {
    // Get all books
    getAllBooks() {
        return Object.values(BOOK_DATABASE);
    },

    // Get book by ID
    getBookById(id) {
        return BOOK_DATABASE[parseInt(id)];
    },

    // Get books by category
    getBooksByCategory(category) {
        return this.getAllBooks().filter(book => book.category === category);
    },

    // Get books by subcategory
    getBooksBySubcategory(subcategory) {
        return this.getAllBooks().filter(book => book.subcategory === subcategory);
    },

    // Search books
    searchBooks(query) {
        if (!query) return this.getAllBooks();
        
        const searchTerm = query.toLowerCase();
        return this.getAllBooks().filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            book.description.toLowerCase().includes(searchTerm)
        );
    },

    // Get featured books
    getFeaturedBooks() {
        return this.getAllBooks().filter(book => book.featured);
    },

    // Get new releases
    getNewReleases() {
        return this.getAllBooks().filter(book => book.newRelease);
    },

    // Get related books (same category, different book)
    getRelatedBooks(bookId, limit = 4) {
        const book = this.getBookById(bookId);
        if (!book) return [];
        
        return this.getAllBooks()
            .filter(b => b.category === book.category && b.id !== book.id)
            .slice(0, limit);
    },

    // Sort books
    sortBooks(books, sortBy) {
        const sorted = [...books];
        
        switch(sortBy) {
            case 'price-low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'name':
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'newest':
                return sorted.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
            case 'discount':
                return sorted.sort((a, b) => b.discount - a.discount);
            default:
                return sorted;
        }
    },

    // Filter by price range
    filterByPrice(books, range) {
        switch(range) {
            case 'under-200':
                return books.filter(book => book.price < 200000);
            case '200-300':
                return books.filter(book => book.price >= 200000 && book.price <= 300000);
            case 'over-300':
                return books.filter(book => book.price > 300000);
            default:
                return books;
        }
    },

    // Format price to VND
    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(price);
    },

    // Get category name
    getCategoryName(categoryKey) {
        return CATEGORIES[categoryKey] || categoryKey;
    },

    // Get subcategory name  
    getSubcategoryName(subcategoryKey) {
        return SUBCATEGORIES[subcategoryKey] || subcategoryKey;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BOOK_DATABASE, CATEGORIES, SUBCATEGORIES, BookDatabase };
}

// Make BookDatabase available globally for browser usage
if (typeof window !== 'undefined') {
    window.BookDatabase = BookDatabase;
    window.BOOK_DATABASE = BOOK_DATABASE;
    window.CATEGORIES = CATEGORIES;
    window.SUBCATEGORIES = SUBCATEGORIES;
    
    // Debug: Log that data is loaded
    console.log('BookDatabase loaded successfully with', Object.keys(BOOK_DATABASE).length, 'books');
}