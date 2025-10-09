#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
from bs4 import BeautifulSoup
import json

def debug_html_structure():
    """Debug HTML structure of The Gioi Van Phong Pham"""
    print("Debugging The Gioi Van Phong Pham HTML structure...")
    
    url = "https://thegioivanphongpham.com.vn/collections/van-phong-pham"
    
    try:
        print(f"Fetching: {url}")
        response = requests.get(url, timeout=10)
        print(f"Status code: {response.status_code}")
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Save full HTML for analysis
        with open('thegioivanphongpham_full.html', 'w', encoding='utf-8') as f:
            f.write(soup.prettify())
        print("Saved full HTML to thegioivanphongpham_full.html")
        
        # Look for common product containers
        product_containers = [
            'div.product',
            'div.item',
            'div.col-item',
            'div.product-inner',
            'div.product-wrapper',
            'div.product-item',
            'div.item-product',
            'div.product-block',
            'div.grid-item',
            'div.product-card',
            'div.product-box'
        ]
        
        print("\n=== SEARCHING FOR PRODUCT CONTAINERS ===")
        for container in product_containers:
            elements = soup.find_all('div', class_=container)
            if elements:
                print(f"Found {len(elements)} elements with class '{container}'")
                if len(elements) > 0:
                    print(f"  First element: {elements[0].get('class')}")
                    print(f"  HTML preview: {str(elements[0])[:200]}...")
        
        # Look for any div with product-related classes
        print("\n=== SEARCHING FOR DIVS WITH PRODUCT CLASSES ===")
        all_divs = soup.find_all('div')
        product_divs = []
        
        for div in all_divs:
            classes = div.get('class', [])
            if any('product' in str(cls).lower() or 'item' in str(cls).lower() for cls in classes):
                product_divs.append(div)
        
        print(f"Found {len(product_divs)} divs with product/item classes")
        
        if product_divs:
            print("Sample product divs:")
            for i, div in enumerate(product_divs[:5]):
                print(f"  {i+1}. Classes: {div.get('class')}")
                print(f"     HTML: {str(div)[:150]}...")
        
        # Look for images
        print("\n=== SEARCHING FOR IMAGES ===")
        images = soup.find_all('img')
        print(f"Found {len(images)} images")
        
        if images:
            print("Sample images:")
            for i, img in enumerate(images[:10]):
                src = img.get('src', '')
                alt = img.get('alt', '')
                print(f"  {i+1}. Src: {src}")
                print(f"     Alt: {alt}")
                print(f"     Classes: {img.get('class')}")
        
        # Look for links
        print("\n=== SEARCHING FOR PRODUCT LINKS ===")
        links = soup.find_all('a', href=True)
        product_links = [link for link in links if '/products/' in link.get('href', '')]
        print(f"Found {len(product_links)} product links")
        
        if product_links:
            print("Sample product links:")
            for i, link in enumerate(product_links[:5]):
                href = link.get('href', '')
                text = link.get_text(strip=True)
                print(f"  {i+1}. Href: {href}")
                print(f"     Text: {text}")
        
        # Look for price elements
        print("\n=== SEARCHING FOR PRICE ELEMENTS ===")
        price_selectors = [
            'span.price',
            'div.price',
            'span.money',
            'div.money',
            'span.cost',
            'div.cost',
            '.price-box',
            '.product-price'
        ]
        
        for selector in price_selectors:
            elements = soup.select(selector)
            if elements:
                print(f"Found {len(elements)} elements with selector '{selector}'")
                if len(elements) > 0:
                    print(f"  First element text: {elements[0].get_text(strip=True)}")
        
        # Look for title elements
        print("\n=== SEARCHING FOR TITLE ELEMENTS ===")
        title_selectors = [
            'h1', 'h2', 'h3', 'h4', 'h5',
            '.title', '.product-title', '.item-title',
            '.name', '.product-name', '.item-name'
        ]
        
        for selector in title_selectors:
            elements = soup.select(selector)
            if elements:
                print(f"Found {len(elements)} elements with selector '{selector}'")
                if len(elements) > 0:
                    print(f"  First element text: {elements[0].get_text(strip=True)[:100]}...")
        
        # Check if page is loaded via JavaScript
        print("\n=== CHECKING FOR JAVASCRIPT LOADING ===")
        scripts = soup.find_all('script')
        print(f"Found {len(scripts)} script tags")
        
        js_loading_indicators = [
            'loading', 'ajax', 'fetch', 'xhr', 'api',
            'product', 'collection', 'shopify', 'haravan'
        ]
        
        for script in scripts:
            script_content = script.get_text()
            for indicator in js_loading_indicators:
                if indicator in script_content.lower():
                    print(f"Found JavaScript loading indicator: {indicator}")
                    print(f"  Script preview: {script_content[:200]}...")
                    break
        
        # Look for data attributes
        print("\n=== SEARCHING FOR DATA ATTRIBUTES ===")
        data_elements = soup.find_all(attrs={'data-product': True})
        print(f"Found {len(data_elements)} elements with data-product attribute")
        
        data_elements = soup.find_all(attrs={'data-id': True})
        print(f"Found {len(data_elements)} elements with data-id attribute")
        
        # Check for JSON data
        print("\n=== CHECKING FOR JSON DATA ===")
        json_scripts = soup.find_all('script', type='application/json')
        print(f"Found {len(json_scripts)} JSON script tags")
        
        for script in json_scripts:
            try:
                data = json.loads(script.get_text())
                print(f"JSON data keys: {list(data.keys()) if isinstance(data, dict) else 'Not a dict'}")
            except:
                print("Could not parse JSON")
        
        print("\n=== DEBUG COMPLETE ===")
        print("Check thegioivanphongpham_full.html for full HTML structure")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_html_structure()
