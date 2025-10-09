#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import random
from datetime import datetime, timedelta

# Authors and publishers for different categories
AUTHORS = {
    'toys': ['Mattel', 'Fisher-Price', 'LEGO', 'Hasbro', 'Barbie', 'Hot Wheels', 'Nerf', 'Play-Doh'],
    'comics': ['Eiichiro Oda', 'Akira Toriyama', 'Masashi Kishimoto', 'Gosho Aoyama', 'Naoko Takeuchi', 'Rumiko Takahashi', 'CLAMP', 'Osamu Tezuka']
}

PUBLISHERS = {
    'toys': ['Mattel Inc.', 'Fisher-Price', 'LEGO Group', 'Hasbro Inc.', 'Barbie Inc.', 'Hot Wheels Inc.', 'Nerf Inc.', 'Play-Doh Inc.'],
    'comics': ['NXB Kim Đồng', 'NXB Trẻ', 'NXB Văn Học', 'NXB Hội Nhà Văn', 'NXB Thế Giới', 'NXB Dân Trí', 'NXB Phụ Nữ', 'NXB Lao Động']
}

# Subcategories mapping
SUBCATEGORIES = {
    'toys': ['educational-toys', 'creative-toys', 'action-figures', 'dolls', 'building-blocks', 'vehicles', 'board-games', 'electronic-toys'],
    'comics': ['comic-books', 'manga', 'graphic-novels', 'manhwa', 'webtoons', 'superhero-comics', 'indie-comics', 'classic-comics']
}

def generate_book_data(book, book_id):
    """Generate complete book data from scraped data"""
    
    # Determine category and subcategory
    category = book['category']
    subcategory = book['subcategory']
    
    # Generate random but realistic data
    author = random.choice(AUTHORS.get(category, ['Unknown Author']))
    publisher = random.choice(PUBLISHERS.get(category, ['Unknown Publisher']))
    
    # Generate publish date (within last 3 years)
    days_ago = random.randint(30, 1095)  # 1 month to 3 years
    publish_date = (datetime.now() - timedelta(days=days_ago)).strftime('%Y-%m-%d')
    
    # Generate ISBN
    isbn = f"978-{random.randint(100, 999)}-{random.randint(10000, 99999)}-{random.randint(0, 9)}"
    
    # Generate pages (comics: 100-300, toys: 50-150)
    if category == 'comics':
        pages = random.randint(100, 300)
    else:
        pages = random.randint(50, 150)
    
    # Generate other attributes
    language = "Tiếng Việt" if category == 'comics' else "Tiếng Việt"
    format_type = "Bìa mềm" if category == 'comics' else "Hộp đựng"
    
    # Generate weight and dimensions
    if category == 'comics':
        weight = f"{random.randint(200, 500)}g"
        dimensions = f"{random.randint(15, 20)} x {random.randint(10, 15)} x {random.randint(1, 3)} cm"
    else:
        weight = f"{random.randint(100, 1000)}g"
        dimensions = f"{random.randint(20, 40)} x {random.randint(15, 30)} x {random.randint(5, 15)} cm"
    
    # Generate stock, rating, reviews
    stock = random.randint(5, 100)
    rating = round(random.uniform(4.0, 5.0), 1)
    review_count = random.randint(10, 500)
    
    # Generate description
    if category == 'comics':
        description = f"Truyện tranh {book['title']} là một tác phẩm hấp dẫn với nội dung thú vị và hình ảnh đẹp mắt. Phù hợp cho mọi lứa tuổi yêu thích truyện tranh."
    else:
        description = f"Đồ chơi {book['title']} là sản phẩm chất lượng cao, an toàn cho trẻ em. Giúp phát triển trí tuệ và kỹ năng vận động của bé."
    
    # Generate tags
    if category == 'comics':
        tags = ["truyện tranh", "manga", "comic", "hình ảnh đẹp", "nội dung hấp dẫn"]
    else:
        tags = ["đồ chơi", "trẻ em", "giáo dục", "an toàn", "phát triển trí tuệ"]
    
    # Determine if featured/new
    featured = random.choice([True, False])
    new_release = random.choice([True, False])
    
    return {
        'id': book_id,
        'title': book['title'],
        'author': author,
        'publisher': publisher,
        'publishDate': publish_date,
        'category': category,
        'subcategory': subcategory,
        'price': book['price'],
        'originalPrice': book['originalPrice'],
        'discount': round((1 - book['price'] / book['originalPrice']) * 100),
        'isbn': isbn,
        'pages': pages,
        'language': language,
        'format': format_type,
        'weight': weight,
        'dimensions': dimensions,
        'stock': stock,
        'rating': rating,
        'reviewCount': review_count,
        'images': [book['image']],
        'description': description,
        'tags': tags,
        'featured': featured,
        'newRelease': new_release
    }

def main():
    """Convert scraped data to data.js format"""
    print("🔄 Converting scraped data to data.js format...")
    
    all_books = []
    book_id = 252  # Start from 252 to avoid conflicts
    
    # Load tiNi Store toys
    try:
        with open('tinistore_data.json', 'r', encoding='utf-8') as f:
            toys = json.load(f)
        print(f"📦 Loaded {len(toys)} toys from tiNi Store")
        
        for toy in toys:
            book_data = generate_book_data(toy, book_id)
            all_books.append(book_data)
            book_id += 1
            
    except FileNotFoundError:
        print("⚠️  tinistore_data.json not found")
    
    # Load NetaBooks comics
    try:
        with open('netabooks_data.json', 'r', encoding='utf-8') as f:
            comics = json.load(f)
        print(f"📚 Loaded {len(comics)} comics from NetaBooks")
        
        for comic in comics:
            book_data = generate_book_data(comic, book_id)
            all_books.append(book_data)
            book_id += 1
            
    except FileNotFoundError:
        print("⚠️  netabooks_data.json not found")
    
    # Save to JSON
    print(f"\n💾 Saving {len(all_books)} books to new_scraped_data.json...")
    with open('new_scraped_data.json', 'w', encoding='utf-8') as f:
        json.dump(all_books, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Done! Converted {len(all_books)} books")
    print("\n📋 Sample data:")
    if all_books:
        print(json.dumps(all_books[0], ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
