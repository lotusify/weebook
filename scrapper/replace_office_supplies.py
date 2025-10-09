#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import re

def replace_office_supplies():
    """Replace office supplies in data.js with real ones"""
    print("Replacing office supplies in data.js...")
    
    # Load real office supplies
    with open('real_office_supplies.json', 'r', encoding='utf-8') as f:
        real_products = json.load(f)
    
    # Read data.js
    with open('data.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find office supplies section (IDs 96-135)
    # Pattern to match office supplies entries
    office_pattern = r'(\s+)(\d+):\s*\{[^}]*"category":\s*"office-supplies"[^}]*\},'
    
    # Extract office supplies entries
    office_matches = re.findall(office_pattern, content, re.DOTALL)
    print(f"Found {len(office_matches)} office supplies entries")
    
    # Replace with real products
    new_content = content
    
    for i, (indent, old_id) in enumerate(office_matches):
        if i < len(real_products):
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
            old_pattern = f'{indent}{old_id}:\\s*\\{{[^}}]*"category":\\s*"office-supplies"[^}}]*\\}},'
            new_content = re.sub(old_pattern, new_entry, new_content, flags=re.DOTALL)
    
    # Write back to data.js
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("Successfully replaced office supplies in data.js")

if __name__ == "__main__":
    replace_office_supplies()
