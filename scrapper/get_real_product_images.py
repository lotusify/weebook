#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from bs4 import BeautifulSoup
import json
import re

def get_real_product_images():
    """Get real product images from HTML"""
    print("Getting real product images...")
    
    try:
        # Read the saved HTML file
        with open('thegioivanphongpham_full.html', 'r', encoding='utf-8') as f:
            content = f.read()
        
        soup = BeautifulSoup(content, 'html.parser')
        
        # Find all images with product URLs
        images = soup.find_all('img')
        product_images = []
        
        for img in images:
            src = img.get('src', '')
            alt = img.get('alt', '')
            
            # Look for real product images (not icons/logos)
            if src and ('product.hstatic.net' in src or 'cdn.hstatic.net' in src):
                # Skip icons, logos, loading gifs
                if not any(skip in src.lower() for skip in ['icon', 'logo', 'loading', 'cart', 'contact', 'retweet']):
                    if src.startswith('//'):
                        src = 'https:' + src
                    elif src.startswith('/'):
                        src = 'https://thegioivanphongpham.com.vn' + src
                    
                    product_images.append({
                        'src': src,
                        'alt': alt
                    })
        
        print(f"Found {len(product_images)} real product images")
        
        # Show sample images
        print("\nSample real product images:")
        for i, img in enumerate(product_images[:10]):
            print(f"  {i+1}. {img['alt']}")
            print(f"     {img['src']}")
        
        return product_images
        
    except Exception as e:
        print(f"Error: {e}")
        return []

def update_json_with_real_images():
    """Update JSON with real product images"""
    print("Updating JSON with real product images...")
    
    # Get real product images
    product_images = get_real_product_images()
    
    if not product_images:
        print("No real product images found!")
        return
    
    # Load existing JSON
    with open('thegioivanphongpham_office_supplies.json', 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    # Update products with real images
    for i, product in enumerate(products):
        if i < len(product_images):
            product['image'] = product_images[i]['src']
            print(f"Updated {i+1}: {product['title']}")
            print(f"  Real image: {product['image']}")
    
    # Save updated JSON
    with open('thegioivanphongpham_office_supplies.json', 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    
    print(f"Updated {len(products)} products with real images")

if __name__ == "__main__":
    update_json_with_real_images()
