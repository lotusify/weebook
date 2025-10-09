#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Convert scraped JSON data to data.js format
"""

import json
import random

# Sample authors by category
AUTHORS = {
    'vietnamese': [
        'Nguyễn Nhật Ánh', 'Tô Hoài', 'Nguyễn Du', 'Vũ Trọng Phụng',
        'Nam Cao', 'Ngô Tất Tố', 'Nguyễn Tuân', 'Hồ Chí Minh',
        'Xuân Diệu', 'Hàn Mặc Tử', 'Nguyễn Bính', 'Tố Hữu',
        'Yuval Noah Harari', 'Stephen Hawking', 'Rhonda Byrne'
    ],
    'foreign': [
        'Paulo Coelho', 'Haruki Murakami', 'J.K. Rowling', 'George Orwell',
        'Ernest Hemingway', 'Gabriel García Márquez', 'Leo Tolstoy',
        'Fyodor Dostoevsky', 'Jane Austen', 'Charles Dickens',
        'Dan Brown', 'Agatha Christie', 'Mark Twain'
    ],
    'office-supplies': ['ThienLong', 'Bizzi', 'Columbus', 'Pentel', 'Pilot'],
    'comics': ['Akira Toriyama', 'Eiichiro Oda', 'Masashi Kishimoto', 'Tite Kubo'],
    'toys': ['LEGO', 'Mattel', 'Hasbro', 'Fisher-Price', 'Barbie'],
    'novels': ['Nguyễn Nhật Ánh', 'Nguyễn Ngọc Tư', 'Nguyễn Quang Thiều', 'Bảo Ninh']
}

PUBLISHERS = {
    'vietnamese': ['NXB Trẻ', 'NXB Kim Đồng', 'NXB Văn Học', 'NXB Tổng Hợp', 'NXB Phụ Nữ'],
    'foreign': ['NXB Trẻ', 'NXB Hội Nhà Văn', 'NXB Văn Học', 'NXB Thế Giới'],
    'office-supplies': ['ThienLong', 'Columbus', 'Pentel', 'Pilot', 'Uni-ball'],
    'comics': ['NXB Kim Đồng', 'NXB Trẻ', 'NXB Văn Học'],
    'toys': ['LEGO', 'Mattel', 'Hasbro', 'Fisher-Price', 'Barbie'],
    'novels': ['NXB Văn Học', 'NXB Trẻ', 'NXB Kim Đồng']
}

SUBCATEGORIES = {
    'vietnamese': ['literature', 'economics', 'psychology', 'children', 'history', 'science'],
    'foreign': ['fiction', 'coffee_table', 'children', 'bestseller'],
    'office-supplies': ['pens', 'students', 'paper', 'office', 'art', 'electronics'],
    'comics': ['comic-books', 'manga', 'manhwa', 'comic-strips'],
    'toys': ['educational-toys', 'building-blocks', 'remote-control', 'outdoor-toys'],
    'novels': ['fiction', 'romance', 'mystery', 'thriller']
}

def generate_book_object(book_data, book_id):
    """Convert scraped data to full book object"""
    
    category = book_data.get('category', 'vietnamese')
    
    # Random but realistic data
    author = random.choice(AUTHORS.get(category, AUTHORS['vietnamese']))
    publisher = random.choice(PUBLISHERS.get(category, PUBLISHERS['vietnamese']))
    subcategory = book_data.get('subcategory') or random.choice(SUBCATEGORIES.get(category, ['literature']))
    
    rating = round(random.uniform(4.0, 5.0), 1)
    review_count = random.randint(50, 500)
    stock = random.randint(20, 150)
    
    # Format image URL
    images = []
    if book_data.get('image'):
        images.append(book_data['image'])
    else:
        images.append('images/placeholder.jpg')
    
    book_obj = {
        'id': book_id,
        'title': book_data['title'],
        'author': author,
        'publisher': publisher,
        'publishDate': '2023-10-01',
        'category': category,
        'subcategory': subcategory,
        'price': book_data['price'],
        'originalPrice': book_data.get('originalPrice', int(book_data['price'] * 1.2)),
        'discount': int((1 - book_data['price'] / book_data.get('originalPrice', book_data['price'] * 1.2)) * 100),
        'isbn': f"978-604-{random.randint(1,9)}-{random.randint(10000,99999)}-{random.randint(0,9)}",
        'pages': random.randint(200, 600),
        'language': 'Tiếng Việt' if category == 'vietnamese' else 'English',
        'format': random.choice(['Bìa mềm', 'Bìa cứng']),
        'weight': f"{random.randint(300, 800)}g",
        'dimensions': '20 x 14 x 2 cm',
        'stock': stock,
        'rating': rating,
        'reviewCount': review_count,
        'images': images,
        'description': f"Cuốn sách hay về {book_data['title'][:30]}...",
        'tags': ['bestseller', 'mới'],
        'featured': random.choice([True, False]),
        'newRelease': random.choice([True, False])
    }
    
    return book_obj

def convert_to_js_format(books):
    """Convert list of books to JavaScript object format"""
    
    js_lines = ["const BOOK_DATABASE = {"]
    
    for idx, book in enumerate(books, start=1):
        book_obj = generate_book_object(book, idx)
        
        # Convert to JS object string
        js_lines.append(f"    {idx}: {{")
        for key, value in book_obj.items():
            if isinstance(value, str):
                # Escape quotes in strings
                value_escaped = value.replace('"', '\\"').replace("'", "\\'")
                js_lines.append(f'        {key}: "{value_escaped}",')
            elif isinstance(value, list):
                if all(isinstance(x, str) for x in value):
                    formatted_list = '["' + '", "'.join(value) + '"]'
                    js_lines.append(f'        {key}: {formatted_list},')
                else:
                    js_lines.append(f'        {key}: {json.dumps(value)},')
            elif isinstance(value, bool):
                js_lines.append(f'        {key}: {str(value).lower()},')
            else:
                js_lines.append(f'        {key}: {value},')
        
        # Remove trailing comma from last property
        js_lines[-1] = js_lines[-1].rstrip(',')
        
        if idx < len(books):
            js_lines.append("    },\n")
        else:
            js_lines.append("    }")
    
    js_lines.append("};")
    
    return "\n".join(js_lines)

def main():
    print("🔄 Converting scraped data to data.js format...\n")
    
    # Read scraped data
    try:
        with open('scraped_data.json', 'r', encoding='utf-8') as f:
            books = json.load(f)
    except FileNotFoundError:
        print("❌ Error: scraped_data.json not found!")
        print("   Run 'python scrape_readstation.py' first")
        return
    
    print(f"📚 Found {len(books)} books in scraped_data.json")
    
    # Convert to JS format
    js_content = convert_to_js_format(books)
    
    # Save to file
    with open('data_new.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"✅ Saved to data_new.js")
    print(f"\n📋 Next steps:")
    print(f"   1. Open data_new.js")
    print(f"   2. Copy the BOOK_DATABASE object")
    print(f"   3. Paste into data.js (replace existing BOOK_DATABASE)")

if __name__ == '__main__':
    main()