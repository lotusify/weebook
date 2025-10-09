#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import re

def replace_with_15_products():
    """Replace office supplies with 15 real products"""
    print("Replacing office supplies with 15 real products...")
    
    # Load top 15 products
    with open('top_30_office_supplies.json', 'r', encoding='utf-8') as f:
        real_products = json.load(f)
    
    # Read data.js
    with open('data.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find products with placeholder images
    placeholder_pattern = r'(\s+)(\d+):\s*\{[^}]*images:\s*\["[^"]*placeholder\.jpg[^"]*"\][^}]*\},'
    placeholder_matches = re.findall(placeholder_pattern, content, re.DOTALL)
    
    print(f"Found {len(placeholder_matches)} products with placeholder images")
    
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
        old_pattern = f'{indent}{old_id}:\\s*\\{{[^}}]*images:\\s*\\["[^"]*placeholder\\.jpg[^"]*"\\][^}}]*\\}},'
        new_content = re.sub(old_pattern, new_entry, new_content, flags=re.DOTALL, count=1)
        
        replacement_count += 1
        print(f"Replaced {replacement_count}: {product['title']}")
    
    # Write back to data.js
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Successfully replaced {replacement_count} office supplies with real products!")

if __name__ == "__main__":
    replace_with_15_products()
