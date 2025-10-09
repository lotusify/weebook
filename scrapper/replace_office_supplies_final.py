#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import re

def replace_office_supplies_final():
    """Replace office supplies with real data from thegioivanphongpham"""
    print("Replacing office supplies with real data...")
    
    # Load real office supplies
    with open('thegioivanphongpham_office_supplies.json', 'r', encoding='utf-8') as f:
        real_products = json.load(f)
    
    # Read data.js
    with open('data.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find office supplies by looking for specific patterns
    # Since we can't find "office-supplies", let's look for products with placeholder images
    placeholder_pattern = r'(\s+)(\d+):\s*\{[^}]*images:\s*\["[^"]*placeholder\.jpg[^"]*"\][^}]*\},'
    placeholder_matches = re.findall(placeholder_pattern, content, re.DOTALL)
    
    print(f"Found {len(placeholder_matches)} products with placeholder images")
    
    if not placeholder_matches:
        # Try alternative approach - look for products with generic descriptions
        generic_pattern = r'(\s+)(\d+):\s*\{[^}]*description:\s*`Cuốn sách[^`]*`[^}]*\},'
        generic_matches = re.findall(generic_pattern, content, re.DOTALL)
        print(f"Found {len(generic_matches)} products with generic descriptions")
        placeholder_matches = generic_matches
    
    # Replace with real products
    new_content = content
    replacement_count = 0
    
    for i, (indent, old_id) in enumerate(placeholder_matches):
        if i >= len(real_products):
            break
            
        product = real_products[i]
        
        # Create new product entry
        new_entry = f'''{indent}{old_id}: {{
        id: {product['id']},
        title: "{product['title']}",
        author: "{product['author']}",
        publisher: "{product['publisher']}",
        publishDate: "{product['publishDate']}",
        category: "{product['category']}",
        subcategory: "{product['subcategory']}",
        price: {product['price']},
        originalPrice: {product['originalPrice']},
        discount: {product['discount']},
        isbn: "{product['isbn']}",
        pages: {product['pages']},
        language: "{product['language']}",
        format: "{product['format']}",
        weight: "{product['weight']}",
        dimensions: "{product['dimensions']}",
        stock: {product['stock']},
        rating: {product['rating']},
        reviewCount: {product['reviewCount']},
        images: {json.dumps(product['images'])},
        description: `{product['description']}`,
        tags: {json.dumps(product['tags'])},
        featured: {str(product['featured']).lower()},
        newRelease: {str(product['newRelease']).lower()}
    }},'''
        
        # Replace the old entry
        if placeholder_matches:
            old_pattern = f'{indent}{old_id}:\\s*\\{{[^}}]*images:\\s*\\["[^"]*placeholder\\.jpg[^"]*"\\][^}}]*\\}},'
        else:
            old_pattern = f'{indent}{old_id}:\\s*\\{{[^}}]*description:\\s*`Cuốn sách[^`]*`[^}}]*\\}},'
            
        new_content = re.sub(old_pattern, new_entry, new_content, flags=re.DOTALL, count=1)
        
        replacement_count += 1
        print(f"Replaced {replacement_count}: {product['title']}")
    
    # Write back to data.js
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Successfully replaced {replacement_count} office supplies!")

if __name__ == "__main__":
    replace_office_supplies_final()
