#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from bs4 import BeautifulSoup
import re

def check_mykingdom_html():
    """Check MyKingdom HTML for product patterns"""
    with open('mykingdom_debug.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'html.parser')
    
    print("🔍 Looking for product containers...")
    
    # Look for any divs with product-related classes
    containers = soup.find_all(['div', 'section'], class_=lambda x: x and 'product' in str(x).lower())
    print(f"Found {len(containers)} product containers")
    
    for i, c in enumerate(containers[:5]):
        print(f"  {i+1}. {c.name}.{c.get('class', [])}")
        if c.get_text(strip=True):
            print(f"     Text: {c.get_text(strip=True)[:100]}...")
    
    # Look for JSON data that might contain products
    print("\n🔍 Looking for JSON data...")
    scripts = soup.find_all('script')
    for script in scripts:
        if script.string and ('product' in script.string.lower() or 'collection' in script.string.lower()):
            print(f"Found script with product data: {len(script.string)} chars")
            # Look for JSON patterns
            json_matches = re.findall(r'\{[^{}]*"product"[^{}]*\}', script.string)
            if json_matches:
                print(f"  Found {len(json_matches)} JSON product matches")
                for match in json_matches[:2]:
                    print(f"    {match[:100]}...")
    
    # Look for data attributes
    print("\n🔍 Looking for data attributes...")
    data_elements = soup.find_all(attrs={'data-product': True})
    print(f"Found {len(data_elements)} elements with data-product")
    
    data_elements = soup.find_all(attrs={'data-product-id': True})
    print(f"Found {len(data_elements)} elements with data-product-id")
    
    # Look for Shopify specific patterns
    print("\n🔍 Looking for Shopify patterns...")
    shopify_elements = soup.find_all(class_=re.compile(r'shopify'))
    print(f"Found {len(shopify_elements)} Shopify elements")
    
    # Check for lazy loading images
    print("\n🔍 Looking for product images...")
    lazy_images = soup.find_all('img', {'data-src': True})
    print(f"Found {len(lazy_images)} lazy-loaded images")
    
    # Look for product links
    print("\n🔍 Looking for product links...")
    product_links = soup.find_all('a', href=re.compile(r'/products/'))
    print(f"Found {len(product_links)} product links")
    
    if product_links:
        for link in product_links[:3]:
            print(f"  {link.get('href')} - {link.get_text(strip=True)[:50]}")

if __name__ == '__main__':
    check_mykingdom_html()
