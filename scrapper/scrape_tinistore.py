#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
from bs4 import BeautifulSoup
import json
import time
import re

def clean_price(price_text):
    """Clean price text and convert to integer"""
    if not price_text:
        return 0
    
    # Remove all non-digit characters except commas
    price_clean = re.sub(r'[^\d,]', '', price_text)
    
    # Remove commas and convert to int
    try:
        return int(price_clean.replace(',', ''))
    except ValueError:
        return 0

def clean_title(title):
    """Remove price from title"""
    if not title:
        return title
    
    # Remove common price patterns
    title = re.sub(r'\d+[.,]\d+\s*[kK]', '', title)
    title = re.sub(r'\d+\s*[kK]', '', title)
    title = re.sub(r'\d+[.,]\d+\s*đ', '', title)
    title = re.sub(r'\d+\s*đ', '', title)
    
    return title.strip()

def scrape_tinistore_toys(max_pages=5):
    """Scrape toys from tiNi Store"""
    books = []
    
    for page in range(1, max_pages + 1):
        print(f"📖 Scraping tiNi Store toys - Page {page}/{max_pages}...")
        
        # Try different URL patterns for pagination
        if page == 1:
            url = "https://tinistore.com/collections/chuong-trinh-khuyen-mai"
        else:
            url = f"https://tinistore.com/collections/chuong-trinh-khuyen-mai?page={page}"
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8'
            }
            response = requests.get(url, headers=headers, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Use correct selector for tiNi Store
            products = soup.find_all('div', class_='product-block')
            
            print(f"  Found {len(products)} products")
            
            if not products:
                print(f"  ⚠️  No products found on page {page}")
                break
            
            for product in products[:24]:  # More products per page
                try:
                    # Extract title - tiNi Store specific
                    title_elem = (
                        product.select_one('.pro-name a') or
                        product.select_one('.pro-name') or
                        product.find('h3') or
                        product.find('h2') or
                        product.find('a', title=True) or
                        product.select_one('a[title]')
                    )
                    title = title_elem.get_text(strip=True) if title_elem else None
                    if not title and title_elem:
                        title = title_elem.get('title', '').strip()
                    
                    if not title:
                        continue
                    
                    title = clean_title(title)  # Remove price from title
                    
                    # Extract price - tiNi Store specific
                    price_elem = (
                        product.select_one('.main-price') or
                        product.select_one('.pro-price') or
                        product.select_one('.price') or
                        product.select_one('.money') or
                        product.find('span', class_='main-price') or
                        product.find('span', class_='pro-price')
                    )
                    price_text = price_elem.get_text(strip=True) if price_elem else "0"
                    price = clean_price(price_text) if price_text else 0
                    
                    if price == 0:
                        continue
                    
                    # Extract image - tiNi Store specific
                    img_elem = product.find('img', class_='img-loop')
                    image_url = None
                    if img_elem:
                        image_url = (
                            img_elem.get('data-src') or
                            img_elem.get('src') or
                            img_elem.get('data-lazy-src') or
                            img_elem.get('data-original')
                        )
                    
                    # Make sure image URL is absolute
                    if image_url and not image_url.startswith('http'):
                        if image_url.startswith('//'):
                            image_url = 'https:' + image_url
                        elif image_url.startswith('/'):
                            image_url = 'https://tinistore.com' + image_url
                    
                    # Extract link
                    link_elem = product.find('a')
                    product_url = link_elem.get('href') if link_elem else None
                    if product_url and not product_url.startswith('http'):
                        product_url = 'https://tinistore.com' + product_url
                    
                    book_data = {
                        'title': title,
                        'price': price,
                        'originalPrice': int(price * 1.2),
                        'category': 'toys',
                        'subcategory': 'educational-toys',
                        'image': image_url,
                        'url': product_url
                    }
                    
                    books.append(book_data)
                    print(f"  ✓ {title[:50]}... - {price:,}đ")
                    
                except Exception as e:
                    print(f"  ✗ Error parsing product: {e}")
                    continue
            
            time.sleep(2)  # Be nice to tiNi Store
            
        except Exception as e:
            print(f"  ✗ Error fetching page {page}: {e}")
            break
    
    return books

def main():
    """Scrape toys from tiNi Store"""
    print("🚀 Starting tiNi Store scraper...\n")
    
    all_books = []
    
    # Scrape tiNi Store toys
    print("=" * 60)
    toys = scrape_tinistore_toys(max_pages=5)
    all_books.extend(toys)
    
    # Save to JSON
    print("\n" + "=" * 60)
    print(f"💾 Saving {len(all_books)} toys to tinistore_data.json...")
    
    with open('tinistore_data.json', 'w', encoding='utf-8') as f:
        json.dump(all_books, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Done! Scraped {len(all_books)} toys")
    print("\n📋 Sample data:")
    if all_books:
        print(json.dumps(all_books[0], ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
