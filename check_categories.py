#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re
from collections import Counter

def check_categories():
    """Check categories in data.js"""
    with open('data.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all categories
    categories = re.findall(r'category: "([^"]+)"', content)
    
    print("Categories in database:")
    category_counts = Counter(categories)
    for category, count in category_counts.items():
        print(f"  {category}: {count} items")
    
    print(f"\nTotal items: {len(categories)}")

if __name__ == '__main__':
    check_categories()