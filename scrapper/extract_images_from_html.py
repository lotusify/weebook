#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from bs4 import BeautifulSoup
import json
import random

def extract_images_from_html():
    """Extract product images from HTML file"""
    print("Extracting product images from HTML...")
    
    try:
        # Read the saved HTML file
        with open('thegioivanphongpham_full.html', 'r', encoding='utf-8') as f:
            content = f.read()
        
        soup = BeautifulSoup(content, 'html.parser')
        
        # Find all product images
        images = soup.find_all('img')
        product_images = []
        
        for img in images:
            src = img.get('src', '')
            alt = img.get('alt', '')
            
            # Filter for product images
            if src and ('product' in src.lower() or 'cdn' in src.lower() or 'hstatic' in src.lower()):
                if src.startswith('//'):
                    src = 'https:' + src
                elif src.startswith('/'):
                    src = 'https://thegioivanphongpham.com.vn' + src
                
                product_images.append({
                    'src': src,
                    'alt': alt
                })
        
        print(f"Found {len(product_images)} product images")
        
        # Show sample images
        print("\nSample images:")
        for i, img in enumerate(product_images[:10]):
            print(f"  {i+1}. {img['alt']}")
            print(f"     {img['src']}")
        
        return product_images
        
    except Exception as e:
        print(f"Error: {e}")
        return []

def update_json_with_images():
    """Update JSON file with real images"""
    print("Updating JSON with real images...")
    
    # Get product images
    product_images = extract_images_from_html()
    
    if not product_images:
        print("No images found!")
        return
    
    # Load existing JSON
    with open('thegioivanphongpham_office_supplies.json', 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    # Update products with images
    for i, product in enumerate(products):
        if i < len(product_images):
            product['image'] = product_images[i]['src']
            print(f"Updated {i+1}: {product['title']}")
            print(f"  Image: {product['image']}")
    
    # Save updated JSON
    with open('thegioivanphongpham_office_supplies.json', 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    
    print(f"Updated {len(products)} products with images")

if __name__ == "__main__":
    update_json_with_images()
