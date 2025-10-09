#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import re

def merge_real_data():
    """Merge only real data (no placeholders) into database"""
    print("🔄 Merging real data into database...")
    
    # Load new scraped data
    with open('new_scraped_data.json', 'r', encoding='utf-8') as f:
        new_books = json.load(f)
    
    print(f"📚 Loaded {len(new_books)} new books")
    
    # Read current data.js
    with open('data.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the BOOK_DATABASE object
    start_pattern = r'const BOOK_DATABASE = \{'
    start_match = re.search(start_pattern, content)
    
    if not start_match:
        print("❌ Could not find BOOK_DATABASE start")
        return
    
    # Find the last entry before the closing brace
    last_entry_pattern = r'(\d+):\s*\{'
    last_entries = re.findall(last_entry_pattern, content)
    
    if last_entries:
        last_id = max(int(id) for id in last_entries)
        print(f"📋 Last existing ID: {last_id}")
    else:
        last_id = 0
        print("📋 No existing entries found")
    
    # Find the position just before the closing brace
    brace_count = 0
    start_pos = start_match.start()
    end_pos = start_pos
    
    for i, char in enumerate(content[start_pos:], start_pos):
        if char == '{':
            brace_count += 1
        elif char == '}':
            brace_count -= 1
            if brace_count == 0:
                end_pos = i
                break
    
    # Extract the part before the closing brace
    before_close = content[:end_pos]
    
    # Extract the part after the closing brace
    after_close = content[end_pos:]
    
    # Convert new books to JavaScript object format
    js_books = []
    for book in new_books:
        # Update ID to continue from last_id
        book['id'] = last_id + 1
        last_id += 1
        
        js_book = f""",
    {book['id']}: {{
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
    
    # Combine all parts
    new_content = before_close + "".join(js_books) + after_close
    
    # Write updated content
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ Merged {len(new_books)} new books to database")
    print("📋 New books added:")
    print(f"  - Toys: {len([b for b in new_books if b['category'] == 'toys'])}")
    print(f"  - Comics: {len([b for b in new_books if b['category'] == 'comics'])}")

if __name__ == '__main__':
    merge_real_data()
