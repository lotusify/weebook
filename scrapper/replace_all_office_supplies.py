#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import re

def replace_all_office_supplies():
    """Replace ALL office supplies with 15 new products"""
    print("Replacing ALL office supplies with 15 new products...")
    
    # Load 15 new products
    with open('top_30_office_supplies.json', 'r', encoding='utf-8') as f:
        new_products = json.load(f)
    
    # Read data.js
    with open('data.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all office supplies entries
    office_pattern = r'(\s+)(\d+):\s*\{[^}]*"category":\s*"office-supplies"[^}]*\},'
    office_matches = re.findall(office_pattern, content, re.DOTALL)
    
    print(f"Found {len(office_matches)} office supplies entries to replace")
    
    # Replace with new products
    new_content = content
    replacement_count = 0
    
    for i, (indent, old_id) in enumerate(office_matches):
        if i >= len(new_products):
            break
            
        product = new_products[i]
        
        # Calculate discount
        discount = int((1 - product['price'] / product['originalPrice']) * 100)
        
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
        discount: {discount},
        isbn: "{product['isbn']}",
        pages: {product['pages']},
        language: "{product['language']}",
        format: "{product['format']}",
        weight: "{product['weight']}",
        dimensions: "{product['dimensions']}",
        stock: {product['stock']},
        rating: {product['rating']},
        reviewCount: {product['reviewCount']},
        images: {json.dumps([product['image']])},
        description: `{product['description']}`,
        tags: {json.dumps(product['tags'])},
        featured: {str(product['featured']).lower()},
        newRelease: {str(product['newRelease']).lower()}
    }},'''
        
        # Replace the old entry
        old_pattern = f'{indent}{old_id}:\\s*\\{{[^}}]*"category":\\s*"office-supplies"[^}}]*\\}},'
        new_content = re.sub(old_pattern, new_entry, new_content, flags=re.DOTALL, count=1)
        
        replacement_count += 1
        print(f"Replaced {replacement_count}: {product['title']}")
    
    # Add remaining new products as new entries
    if len(new_products) > len(office_matches):
        print(f"\nAdding {len(new_products) - len(office_matches)} additional products...")
        
        # Find the last ID in the file
        last_id_pattern = r'(\s+)(\d+):\s*\{'
        last_matches = re.findall(last_id_pattern, new_content)
        if last_matches:
            last_id = int(last_matches[-1][1])
        else:
            last_id = 0
        
        # Add new products
        for i in range(len(office_matches), len(new_products)):
            product = new_products[i]
            last_id += 1
            
            # Calculate discount
            discount = int((1 - product['price'] / product['originalPrice']) * 100)
            
            new_entry = f'''
    {last_id}: {{
        id: {product['id']},
        title: "{product['title']}",
        author: "{product['author']}",
        publisher: "{product['publisher']}",
        publishDate: "{product['publishDate']}",
        category: "{product['category']}",
        subcategory: "{product['subcategory']}",
        price: {product['price']},
        originalPrice: {product['originalPrice']},
        discount: {discount},
        isbn: "{product['isbn']}",
        pages: {product['pages']},
        language: "{product['language']}",
        format: "{product['format']}",
        weight: "{product['weight']}",
        dimensions: "{product['dimensions']}",
        stock: {product['stock']},
        rating: {product['rating']},
        reviewCount: {product['reviewCount']},
        images: {json.dumps([product['image']])},
        description: `{product['description']}`,
        tags: {json.dumps(product['tags'])},
        featured: {str(product['featured']).lower()},
        newRelease: {str(product['newRelease']).lower()}
    }},'''
            
            # Add before the closing brace
            new_content = new_content.replace('};', new_entry + '\n};')
            replacement_count += 1
            print(f"Added {replacement_count}: {product['title']}")
    
    # Write back to data.js
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"\nSuccessfully replaced/added {replacement_count} office supplies!")

if __name__ == "__main__":
    replace_all_office_supplies()
