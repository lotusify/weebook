#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import re

def update_datajs():
    """Update data.js with new scraped data"""
    print("🔄 Updating data.js with new scraped data...")
    
    # Load new scraped data
    with open('new_scraped_data.json', 'r', encoding='utf-8') as f:
        new_books = json.load(f)
    
    print(f"📚 Loaded {len(new_books)} new books")
    
    # Read current data.js
    with open('data.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the BOOK_DATABASE object
    start_pattern = r'let BOOK_DATABASE = \{'
    end_pattern = r'\};'
    
    start_match = re.search(start_pattern, content)
    if not start_match:
        print("❌ Could not find BOOK_DATABASE start")
        return
    
    # Find the end of BOOK_DATABASE
    start_pos = start_match.start()
    
    # Find the matching closing brace
    brace_count = 0
    end_pos = start_pos
    for i, char in enumerate(content[start_pos:], start_pos):
        if char == '{':
            brace_count += 1
        elif char == '}':
            brace_count -= 1
            if brace_count == 0:
                end_pos = i
                break
    
    # Extract the part before BOOK_DATABASE
    before_db = content[:start_pos]
    
    # Extract the part after BOOK_DATABASE
    after_db = content[end_pos + 1:]
    
    # Convert new books to JavaScript object format
    js_books = []
    for book in new_books:
        js_book = f"""    {book['id']}: {{
        id: {book['id']},
        title: "{book['title']}",
        author: "{book['author']}",
        publisher: "{book['publisher']}",
        publishDate: "{book['publishDate']}",
        category: "{book['category']}",
        subcategory: "{book['subcategory']}",
        price: {book['price']},
        originalPrice: {book['originalPrice']},
        discount: {book['discount']},
        isbn: "{book['isbn']}",
        pages: {book['pages']},
        language: "{book['language']}",
        format: "{book['format']}",
        weight: "{book['weight']}",
        dimensions: "{book['dimensions']}",
        stock: {book['stock']},
        rating: {book['rating']},
        reviewCount: {book['reviewCount']},
        images: {json.dumps(book['images'])},
        description: `{book['description']}`,
        tags: {json.dumps(book['tags'])},
        featured: {str(book['featured']).lower()},
        newRelease: {str(book['newRelease']).lower()}
    }}"""
        js_books.append(js_book)
    
    # Create new BOOK_DATABASE content
    new_db_content = "let BOOK_DATABASE = {\n" + ",\n".join(js_books) + "\n};"
    
    # Combine all parts
    new_content = before_db + new_db_content + after_db
    
    # Write updated content
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ Updated data.js with {len(new_books)} new books")
    print("📋 New books added:")
    print(f"  - Toys: {len([b for b in new_books if b['category'] == 'toys'])}")
    print(f"  - Comics: {len([b for b in new_books if b['category'] == 'comics'])}")

if __name__ == '__main__':
    update_datajs()
