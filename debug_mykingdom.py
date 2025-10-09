#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
from bs4 import BeautifulSoup
import json

def debug_mykingdom():
    """Debug MyKingdom website structure"""
    url = "https://www.mykingdom.com.vn/collections/all"
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8'
        }
        
        print(f"🔍 Debugging MyKingdom: {url}")
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Save HTML for inspection
        with open('mykingdom_debug.html', 'w', encoding='utf-8') as f:
            f.write(soup.prettify())
        
        print("✅ Saved HTML to mykingdom_debug.html")
        
        # Try different selectors
        selectors_to_try = [
            'div.product-item',
            'div.product-block', 
            'div.item-product',
            '.product-list .product',
            '.product-item',
            '[data-product]',
            'div.product',
            'div.item',
            'article',
            '.card',
            '.product-card',
            'div[class*="product"]',
            'div[class*="item"]',
            'div[class*="card"]',
            '.grid-product',
            '.product-grid-item',
            '.collection-item'
        ]
        
        print("\n🔍 Testing selectors:")
        for selector in selectors_to_try:
            products = soup.select(selector)
            print(f"  {selector}: {len(products)} items")
            
            if products:
                # Show first few items
                for i, product in enumerate(products[:3]):
                    print(f"    Item {i+1}: {str(product)[:100]}...")
                print()
        
        # Look for common product indicators
        print("\n🔍 Looking for product indicators:")
        
        # Check for price elements
        price_selectors = [
            '.price', '.product-price', '[class*="price"]', 
            '.cost', '.amount', '[class*="cost"]',
            '.money', '.currency'
        ]
        
        for selector in price_selectors:
            prices = soup.select(selector)
            if prices:
                print(f"  Price elements ({selector}): {len(prices)}")
                for price in prices[:3]:
                    print(f"    {price.get_text(strip=True)}")
        
        # Check for image elements
        images = soup.find_all('img')
        print(f"\n📸 Found {len(images)} images")
        
        # Check for links that might be products
        links = soup.find_all('a', href=True)
        product_links = [link for link in links if any(keyword in link.get('href', '').lower() 
                          for keyword in ['product', 'san-pham', 'item', 'detail', 'collections'])]
        print(f"🔗 Found {len(product_links)} potential product links")
        
        # Check page structure
        print("\n📋 Page structure analysis:")
        print(f"  Title: {soup.title.string if soup.title else 'No title'}")
        
        # Look for main content areas
        main_content = soup.find('main') or soup.find('div', class_='main') or soup.find('div', id='main')
        if main_content:
            print(f"  Main content found: {main_content.name}")
        
        # Check for product grid/list containers
        containers = soup.find_all(['div', 'section'], class_=lambda x: x and any(
            keyword in x.lower() for keyword in ['product', 'grid', 'list', 'catalog', 'shop', 'collection']
        ))
        print(f"  Potential product containers: {len(containers)}")
        
        for container in containers[:3]:
            print(f"    {container.name}.{container.get('class', [])}")
        
        # Look for specific MyKingdom patterns
        print("\n🔍 MyKingdom specific patterns:")
        
        # Check for Shopify patterns (MyKingdom uses Shopify)
        shopify_patterns = [
            '.product-item',
            '.grid-product',
            '.product-card',
            '[data-product-id]',
            '.product-tile',
            '.collection-item'
        ]
        
        for pattern in shopify_patterns:
            elements = soup.select(pattern)
            if elements:
                print(f"  {pattern}: {len(elements)} elements")
                for elem in elements[:2]:
                    print(f"    {str(elem)[:150]}...")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == '__main__':
    debug_mykingdom()
