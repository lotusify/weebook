#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
from bs4 import BeautifulSoup
import json

def debug_tinistore():
    """Debug tiNi Store HTML structure"""
    print("🔍 Debugging tiNi Store HTML structure...")
    
    url = "https://tinistore.com/collections/chuong-trinh-khuyen-mai"
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8'
        }
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Save HTML for inspection
        with open('tinistore_debug.html', 'w', encoding='utf-8') as f:
            f.write(soup.prettify())
        
        print("✅ HTML saved to tinistore_debug.html")
        
        # Look for common product patterns
        print("\n🔍 Looking for product patterns...")
        
        # Check for Shopify patterns
        shopify_products = soup.find_all('div', {'data-product-id': True})
        print(f"Shopify products with data-product-id: {len(shopify_products)}")
        
        # Check for common class patterns
        patterns = [
            'product-item',
            'product-block', 
            'item-product',
            'product-card',
            'grid-product',
            'collection-item',
            'product-tile',
            'product-info',
            'product-grid-item',
            'book-item',
            'comic-item'
        ]
        
        for pattern in patterns:
            elements = soup.find_all('div', class_=pattern)
            if elements:
                print(f"Found {len(elements)} elements with class '{pattern}'")
                if len(elements) > 0:
                    print(f"  First element: {elements[0].get('class')}")
        
        # Look for images
        images = soup.find_all('img')
        print(f"\nFound {len(images)} images")
        
        # Look for links
        links = soup.find_all('a')
        print(f"Found {len(links)} links")
        
        # Look for price patterns
        price_patterns = [
            soup.find_all(text=lambda text: text and '₫' in text),
            soup.find_all(text=lambda text: text and 'đ' in text),
            soup.find_all(text=lambda text: text and 'k' in text.lower())
        ]
        
        for i, pattern in enumerate(price_patterns):
            if pattern:
                print(f"Price pattern {i+1}: {len(pattern)} matches")
                if len(pattern) > 0:
                    print(f"  Sample: {pattern[0][:50]}...")
        
        # Look for JSON data in script tags
        scripts = soup.find_all('script')
        json_data_found = False
        for script in scripts:
            if script.string and ('product' in script.string.lower() or 'collection' in script.string.lower()):
                print(f"Found script with product/collection data: {len(script.string)} chars")
                json_data_found = True
                break
        
        if not json_data_found:
            print("No JSON product data found in script tags")
        
        print("\n✅ Debug complete! Check tinistore_debug.html for full HTML structure")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == '__main__':
    debug_tinistore()
