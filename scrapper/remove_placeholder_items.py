#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re

def remove_placeholder_items():
    """Remove items with local/placeholder images from data.js"""
    print("🔄 Removing placeholder items from database...")
    
    # Read current data.js
    with open('data.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find items with local images (items 1-10)
    local_image_pattern = r'\d+:\s*\{[^}]*images/[^}]*\},?\s*'
    local_items = re.findall(local_image_pattern, content)
    
    print(f"📋 Found {len(local_items)} items with local images")
    
    # Remove these items
    for item in local_items:
        content = content.replace(item, '')
    
    # Clean up any double commas or trailing commas
    content = re.sub(r',\s*,', ',', content)
    content = re.sub(r',\s*}', '}', content)
    
    # Write updated content
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Removed {len(local_items)} placeholder items")
    print("📋 Database now contains only items with real images")

if __name__ == '__main__':
    remove_placeholder_items()
