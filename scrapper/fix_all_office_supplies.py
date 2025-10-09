#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import re

def fix_all_office_supplies():
    """Fix all office supplies with real images and descriptions"""
    print("Fixing all office supplies...")
    
    # Load real office supplies
    with open('real_office_supplies.json', 'r', encoding='utf-8') as f:
        real_products = json.load(f)
    
    # Read data.js
    with open('data.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all placeholder.jpg entries
    placeholder_pattern = r'images: \["/images/placeholder\.jpg"\],'
    placeholder_matches = re.findall(placeholder_pattern, content)
    
    print(f"Found {len(placeholder_matches)} placeholder.jpg entries")
    
    # Replace each placeholder with real product
    new_content = content
    replacement_count = 0
    
    for i, product in enumerate(real_products):
        if i >= len(placeholder_matches):
            break
            
        # Create replacement
        replacement = f'images: {json.dumps(product["images"])},'
        
        # Replace first occurrence
        new_content = new_content.replace('images: ["/images/placeholder.jpg"],', replacement, 1)
        
        # Also replace the description
        old_desc_pattern = r'description: `Cuốn sách [^`]*`'
        new_desc = f'description: `{product["description"]}`'
        new_content = re.sub(old_desc_pattern, new_desc, new_content, count=1)
        
        replacement_count += 1
        print(f"Replaced {replacement_count}: {product['title']}")
    
    # Write back to data.js
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Successfully replaced {replacement_count} office supplies!")

if __name__ == "__main__":
    fix_all_office_supplies()
