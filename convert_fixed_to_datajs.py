#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import re

def convert_to_datajs():
    """Convert fixed_scraped_data.json to data.js format"""
    
    print("Reading fixed_scraped_data.json...")
    with open('fixed_scraped_data.json', 'r', encoding='utf-8') as f:
        books = json.load(f)
    
    print(f"Loaded {len(books)} books")
    
    # Create BOOK_DATABASE object
    book_database = {}
    for book in books:
        book_database[book['id']] = book
    
    # Create CATEGORIES object
    categories = {
        "vietnamese": "Sách tiếng Việt",
        "foreign": "Sách ngoại văn",
        "office-supplies": "Văn phòng phẩm",
        "toys": "Đồ chơi",
        "comics": "Truyện tranh"
    }
    
    # Create SUBCATEGORIES object
    subcategories = {
        "vietnamese": {
            "literature": "Văn học",
            "history": "Lịch sử",
            "biography": "Tiểu sử",
            "psychology": "Tâm lý học",
            "economics": "Kinh tế",
            "lifestyle": "Lối sống",
            "health": "Sức khỏe",
            "fiction": "Tiểu thuyết",
            "non-fiction": "Phi hư cấu"
        },
        "foreign": {
            "fiction": "Tiểu thuyết",
            "non-fiction": "Phi hư cấu",
            "biography": "Tiểu sử",
            "history": "Lịch sử",
            "science": "Khoa học",
            "business": "Kinh doanh",
            "self-help": "Tự phát triển",
            "travel": "Du lịch"
        },
        "office-supplies": {
            "pens": "Bút - Viết",
            "pencils": "Bút chì",
            "notebooks": "Vở - Sổ",
            "calculators": "Máy tính",
            "rulers": "Thước kẻ",
            "erasers": "Tẩy",
            "markers": "Bút dạ",
            "folders": "Bìa hồ sơ"
        },
        "toys": {
            "educational-toys": "Đồ chơi giáo dục",
            "creative-toys": "Đồ chơi sáng tạo",
            "action-figures": "Mô hình",
            "dolls": "Búp bê",
            "building-blocks": "Lắp ráp",
            "vehicles": "Xe đồ chơi",
            "board-games": "Board game",
            "electronic-toys": "Đồ chơi điện tử"
        },
        "comics": {
            "comic-books": "Truyện tranh",
            "manga": "Manga",
            "graphic-novels": "Tiểu thuyết đồ họa",
            "manhwa": "Manhwa",
            "webtoons": "Webtoon",
            "superhero-comics": "Siêu anh hùng",
            "indie-comics": "Truyện tranh độc lập",
            "classic-comics": "Truyện tranh cổ điển"
        }
    }
    
    # Create data.js content
    datajs_content = f"""// ========== BOOKSHELF DATABASE ========== //
// Real data scraped from multiple sources with real images

const BOOK_DATABASE = {{
"""
    
    # Add each book
    for book_id, book in book_database.items():
        datajs_content += f"    {book_id}: {{\n"
        datajs_content += f"        id: {book['id']},\n"
        datajs_content += f"        title: \"{book['title']}\",\n"
        datajs_content += f"        author: \"{book['author']}\",\n"
        datajs_content += f"        publisher: \"{book['publisher']}\",\n"
        datajs_content += f"        publishDate: \"{book['publishDate']}\",\n"
        datajs_content += f"        category: \"{book['category']}\",\n"
        datajs_content += f"        subcategory: \"{book['subcategory']}\",\n"
        datajs_content += f"        price: {book['price']},\n"
        datajs_content += f"        originalPrice: {book['originalPrice']},\n"
        datajs_content += f"        discount: {book.get('discount', 0)},\n"
        datajs_content += f"        isbn: \"{book['isbn']}\",\n"
        datajs_content += f"        pages: {book['pages']},\n"
        datajs_content += f"        language: \"{book['language']}\",\n"
        datajs_content += f"        format: \"{book['format']}\",\n"
        datajs_content += f"        weight: \"{book['weight']}\",\n"
        datajs_content += f"        dimensions: \"{book['dimensions']}\",\n"
        datajs_content += f"        stock: {book['stock']},\n"
        datajs_content += f"        rating: {book['rating']},\n"
        datajs_content += f"        reviewCount: {book['reviewCount']},\n"
        datajs_content += f"        images: [\"{book['image']}\"],\n"
        datajs_content += f"        description: `{book['description']}`,\n"
        datajs_content += f"        tags: {json.dumps(book['tags'], ensure_ascii=False)},\n"
        datajs_content += f"        featured: {str(book['featured']).lower()},\n"
        datajs_content += f"        newRelease: {str(book['newRelease']).lower()}\n"
        datajs_content += f"    }},\n"
    
    datajs_content += "};\n\n"
    
    # Add CATEGORIES
    datajs_content += "// ========== CATEGORIES ========== //\n"
    datajs_content += "const CATEGORIES = {\n"
    for key, value in categories.items():
        datajs_content += f"    \"{key}\": \"{value}\",\n"
    datajs_content += "};\n\n"
    
    # Add SUBCATEGORIES
    datajs_content += "// ========== SUBCATEGORIES ========== //\n"
    datajs_content += "const SUBCATEGORIES = {\n"
    for category, subcats in subcategories.items():
        datajs_content += f"    \"{category}\": {{\n"
        for subkey, subvalue in subcats.items():
            datajs_content += f"        \"{subkey}\": \"{subvalue}\",\n"
        datajs_content += "    },\n"
    datajs_content += "};\n\n"
    
    # Add BookDatabase class
    datajs_content += """// ========== BOOK DATABASE CLASS ========== //
class BookDatabase {
    static getAllBooks() {
        return Object.values(BOOK_DATABASE);
    }
    
    static getBookById(id) {
        return BOOK_DATABASE[parseInt(id)];
    }
    
    static getBooksByCategory(category) {
        return Object.values(BOOK_DATABASE).filter(book => book.category === category);
    }
    
    static getBooksBySubcategory(category, subcategory) {
        return Object.values(BOOK_DATABASE).filter(book => 
            book.category === category && book.subcategory === subcategory
        );
    }
    
    static getFeaturedBooks() {
        return Object.values(BOOK_DATABASE).filter(book => book.featured);
    }
    
    static getNewReleases() {
        return Object.values(BOOK_DATABASE).filter(book => book.newRelease);
    }
    
    static getNewBooks() {
        return Object.values(BOOK_DATABASE).filter(book => book.newRelease);
    }
    
    static searchBooks(query) {
        const lowerQuery = query.toLowerCase();
        return Object.values(BOOK_DATABASE).filter(book => 
            book.title.toLowerCase().includes(lowerQuery) ||
            book.author.toLowerCase().includes(lowerQuery) ||
            book.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }
    
    static getCategoryName(categoryKey) {
        return CATEGORIES[categoryKey] || categoryKey;
    }
    
    static getSubcategoryName(categoryKey, subcategoryKey) {
        if (SUBCATEGORIES[categoryKey] && SUBCATEGORIES[categoryKey][subcategoryKey]) {
            return SUBCATEGORIES[categoryKey][subcategoryKey];
        }
        return subcategoryKey;
    }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BOOK_DATABASE, CATEGORIES, SUBCATEGORIES, BookDatabase };
}

// Make available globally
if (typeof window !== 'undefined') {
    window.BOOK_DATABASE = BOOK_DATABASE;
    window.CATEGORIES = CATEGORIES;
    window.SUBCATEGORIES = SUBCATEGORIES;
    window.BookDatabase = BookDatabase;
}
"""
    
    # Write to data.js
    print("Writing to data.js...")
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(datajs_content)
    
    print("✅ Successfully converted to data.js!")
    print(f"- Total products: {len(books)}")
    print(f"- Vietnamese books: {len([b for b in books if b['category'] == 'vietnamese'])}")
    print(f"- Comics: {len([b for b in books if b['category'] == 'comics'])}")
    print(f"- Toys: {len([b for b in books if b['category'] == 'toys'])}")
    print(f"- Office supplies: {len([b for b in books if b['category'] == 'office-supplies'])}")
    
    # Show sample prices
    print("\nSample prices:")
    for book in books[:5]:
        print(f"  {book['title'][:50]}... - {book['price']:,}₫")

if __name__ == "__main__":
    convert_to_datajs()
