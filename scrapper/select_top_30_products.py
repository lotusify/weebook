#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import random

def select_top_30_products():
    """Select top 30 best office supplies products"""
    print("Selecting top 30 office supplies products...")
    
    # Load all products
    with open('thegioivanphongpham_office_supplies.json', 'r', encoding='utf-8') as f:
        all_products = json.load(f)
    
    print(f"Total products available: {len(all_products)}")
    
    # Select top 30 products (prioritize those with real images and good titles)
    top_30 = []
    
    # First, prioritize products with real images and meaningful titles
    for product in all_products:
        if product['image'] and 'product.hstatic.net' in product['image']:
            title = product['title']
            # Skip products with generic or unclear titles
            if len(title) > 10 and not any(skip in title.lower() for skip in ['giá 1k', 'tặng', 'thanh lý']):
                top_30.append(product)
                if len(top_30) >= 30:
                    break
    
    # If we don't have enough, add more products
    if len(top_30) < 30:
        for product in all_products:
            if product not in top_30:
                top_30.append(product)
                if len(top_30) >= 30:
                    break
    
    # Update IDs to be sequential
    for i, product in enumerate(top_30):
        product['id'] = i + 1
    
    print(f"Selected {len(top_30)} products")
    
    # Save top 30 products
    with open('top_30_office_supplies.json', 'w', encoding='utf-8') as f:
        json.dump(top_30, f, ensure_ascii=False, indent=2)
    
    print("Saved top 30 products to top_30_office_supplies.json")
    
    # Show sample products
    print("\nTop 30 products:")
    for i, product in enumerate(top_30[:10]):  # Show first 10
        print(f"  {i+1}. {product['title']}")
        print(f"     Price: {product['price']:,}₫")
        print(f"     Image: {product['image'][:80]}...")
    
    if len(top_30) > 10:
        print(f"  ... and {len(top_30) - 10} more products")

if __name__ == "__main__":
    select_top_30_products()
