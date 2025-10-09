#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
from bs4 import BeautifulSoup

def debug_readstation_structure():
    """Debug HTML structure of ReadStation"""
    print("Debugging ReadStation HTML structure...")
    
    url = "https://readstation.vn/sach-tieng-viet"
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        print("=== READSTATION STRUCTURE ===")
        
        # Find product containers
        products = soup.find_all('div', class_='item_product_main')
        print(f"Found {len(products)} products")
        
        if products:
            product = products[0]
            print("\nFirst product structure:")
            print(f"Product HTML: {str(product)[:500]}...")
            
            # Check for title
            title_elem = product.find('h3', class_='name_product')
            if title_elem:
                print(f"Title found: {title_elem.get_text(strip=True)}")
            else:
                print("Title not found")
            
            # Check for author
            author_elem = product.find('span', class_='author')
            if author_elem:
                print(f"Author found: {author_elem.get_text(strip=True)}")
            else:
                print("Author not found")
            
            # Check for publisher
            publisher_elem = product.find('span', class_='publisher')
            if publisher_elem:
                print(f"Publisher found: {publisher_elem.get_text(strip=True)}")
            else:
                print("Publisher not found")
            
            # Check for price
            price_elem = product.find('span', class_='price')
            if price_elem:
                print(f"Price found: {price_elem.get_text(strip=True)}")
            else:
                print("Price not found")
            
            # Check for image
            img_elem = product.find('img')
            if img_elem:
                print(f"Image found: {img_elem.get('src')}")
            else:
                print("Image not found")
            
            # Print all text elements to see what's available
            print("\nAll text elements in product:")
            for elem in product.find_all(text=True):
                text = elem.strip()
                if text and len(text) > 2:
                    print(f"  - {text}")
            
    except Exception as e:
        print(f"Error: {e}")

def debug_vpphongha_structure():
    """Debug HTML structure of VPP Hong Ha"""
    print("\nDebugging VPP Hong Ha HTML structure...")
    
    url = "https://vpphongha.vn"
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        print("=== VPP HONG HA STRUCTURE ===")
        
        # Find product containers
        products = soup.find_all('div', class_='item_product_main')
        print(f"Found {len(products)} products")
        
        if products:
            product = products[0]
            print("\nFirst product structure:")
            print(f"Product HTML: {str(product)[:500]}...")
            
            # Check for title
            title_elem = product.find('h3', class_='name_product')
            if title_elem:
                print(f"Title found: {title_elem.get_text(strip=True)}")
            else:
                print("Title not found")
            
            # Check for brand/manufacturer
            brand_elem = product.find('span', class_='brand')
            if brand_elem:
                print(f"Brand found: {brand_elem.get_text(strip=True)}")
            else:
                print("Brand not found")
            
            # Check for price
            price_elem = product.find('span', class_='price')
            if price_elem:
                print(f"Price found: {price_elem.get_text(strip=True)}")
            else:
                print("Price not found")
            
            # Print all text elements to see what's available
            print("\nAll text elements in product:")
            for elem in product.find_all(text=True):
                text = elem.strip()
                if text and len(text) > 2:
                    print(f"  - {text}")
            
    except Exception as e:
        print(f"Error: {e}")

def debug_netabooks_structure():
    """Debug HTML structure of NetaBooks"""
    print("\nDebugging NetaBooks HTML structure...")
    
    url = "https://www.netabooks.vn/truyen-tranh-manga-comic"
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        print("=== NETABOOKS STRUCTURE ===")
        
        # Find product containers
        products = soup.find_all('div', class_='box-product-category')
        print(f"Found {len(products)} products")
        
        if products:
            product = products[0]
            print("\nFirst product structure:")
            print(f"Product HTML: {str(product)[:500]}...")
            
            # Check for title
            title_elem = product.find('div', class_='name-product')
            if title_elem:
                print(f"Title found: {title_elem.get_text(strip=True)}")
            else:
                print("Title not found")
            
            # Check for author
            author_elem = product.find('span', class_='author')
            if author_elem:
                print(f"Author found: {author_elem.get_text(strip=True)}")
            else:
                print("Author not found")
            
            # Check for price
            price_elem = product.find('div', class_='price')
            if price_elem:
                print(f"Price found: {price_elem.get_text(strip=True)}")
            else:
                print("Price not found")
            
            # Print all text elements to see what's available
            print("\nAll text elements in product:")
            for elem in product.find_all(text=True):
                text = elem.strip()
                if text and len(text) > 2:
                    print(f"  - {text}")
            
    except Exception as e:
        print(f"Error: {e}")

def debug_tinistore_structure():
    """Debug HTML structure of tiNi Store"""
    print("\nDebugging tiNi Store HTML structure...")
    
    url = "https://tinistore.com/collections/chuong-trinh-khuyen-mai"
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        print("=== TINISTORE STRUCTURE ===")
        
        # Find product containers
        products = soup.find_all('div', class_='product-block')
        print(f"Found {len(products)} products")
        
        if products:
            product = products[0]
            print("\nFirst product structure:")
            print(f"Product HTML: {str(product)[:500]}...")
            
            # Check for title
            title_elem = product.find('div', class_='pro-name')
            if title_elem:
                print(f"Title found: {title_elem.get_text(strip=True)}")
            else:
                print("Title not found")
            
            # Check for brand
            brand_elem = product.find('span', class_='brand')
            if brand_elem:
                print(f"Brand found: {brand_elem.get_text(strip=True)}")
            else:
                print("Brand not found")
            
            # Check for price
            price_elem = product.find('div', class_='main-price')
            if price_elem:
                print(f"Price found: {price_elem.get_text(strip=True)}")
            else:
                print("Price not found")
            
            # Print all text elements to see what's available
            print("\nAll text elements in product:")
            for elem in product.find_all(text=True):
                text = elem.strip()
                if text and len(text) > 2:
                    print(f"  - {text}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_readstation_structure()
    debug_vpphongha_structure()
    debug_netabooks_structure()
    debug_tinistore_structure()
