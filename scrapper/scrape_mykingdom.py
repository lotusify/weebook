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

def scrape_mykingdom_category(url, category='toys', subcategory='educational-toys', max_pages=3):
    """Scrape toys from MyKingdom category pages"""
    books = []
    
    for page in range(1, max_pages + 1):
        print(f"📖 Scraping MyKingdom {category} - Page {page}/{max_pages}...")
        
        # Try different URL patterns for pagination
        if page == 1:
            page_url = url
        else:
            page_url = f"{url}?page={page}"
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8'
            }
            response = requests.get(page_url, headers=headers, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Try multiple selectors for MyKingdom
            products = (
                soup.find_all('div', class_='product-item') or
                soup.find_all('div', class_='product-block') or
                soup.find_all('div', class_='item-product') or
                soup.select('.product-list .product') or
                soup.select('.product-item') or
                soup.select('[data-product]') or
                soup.find_all('div', class_='grid-product') or
                soup.find_all('div', class_='product-card') or
                soup.find_all('div', class_='collection-item') or
                soup.find_all('div', class_='product-tile')
            )
            
            print(f"  Found {len(products)} products")
            
            if not products:
                print(f"  ⚠️  No products found on page {page}")
                break
            
            for product in products[:24]:  # More products per page
                try:
                    # Extract title
                    title_elem = (
                        product.find('h3') or
                        product.find('h2') or
                        product.find('a', class_='product-name') or
                        product.find('a', title=True) or
                        product.select_one('.product-title') or
                        product.select_one('a[title]')
                    )
                    title = title_elem.get_text(strip=True) if title_elem else None
                    if not title and title_elem:
                        title = title_elem.get('title', '').strip()
                    
                    if not title:
                        continue
                    
                    title = clean_title(title)  # Remove price from title
                    
                    # Extract price
                    price_elem = (
                        product.find('span', class_='price') or
                        product.find('div', class_='price') or
                        product.find('span', class_='product-price') or
                        product.select_one('.price') or
                        product.select_one('.money')
                    )
                    price_text = price_elem.get_text(strip=True) if price_elem else "0"
                    price = clean_price(price_text) if price_text else 0
                    
                    if price == 0:
                        continue
                    
                    # Extract image
                    img_elem = product.find('img')
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
                            image_url = 'https://www.mykingdom.com.vn' + image_url
                    
                    # Extract link
                    link_elem = product.find('a')
                    product_url = link_elem.get('href') if link_elem else None
                    if product_url and not product_url.startswith('http'):
                        product_url = 'https://www.mykingdom.com.vn' + product_url
                    
                    book_data = {
                        'title': title,
                        'price': price,
                        'originalPrice': int(price * 1.2),
                        'category': category,
                        'subcategory': subcategory,
                        'image': image_url,
                        'url': product_url
                    }
                    
                    books.append(book_data)
                    print(f"  ✓ {title[:50]}... - {price:,}đ")
                    
                except Exception as e:
                    print(f"  ✗ Error parsing product: {e}")
                    continue
            
            time.sleep(2)  # Be nice to MyKingdom
            
        except Exception as e:
            print(f"  ✗ Error fetching page {page}: {e}")
            break
    
    return books

def main():
    """Scrape toys from MyKingdom"""
    print("🚀 Starting MyKingdom scraper...\n")
    
    all_books = []
    
    # Try different MyKingdom category URLs
    category_urls = [
        "https://www.mykingdom.com.vn/collections/do-choi-lap-ghep",
        "https://www.mykingdom.com.vn/collections/do-choi-phuong-tien",
        "https://www.mykingdom.com.vn/collections/do-choi-theo-phim",
        "https://www.mykingdom.com.vn/collections/do-choi-sang-tao",
        "https://www.mykingdom.com.vn/collections/do-choi-van-dong"
    ]
    
    subcategories = [
        "building-blocks",
        "remote-control", 
        "educational-toys",
        "educational-toys",
        "outdoor-toys"
    ]
    
    for i, url in enumerate(category_urls):
        print("=" * 60)
        toys = scrape_mykingdom_category(
            url,
            category='toys',
            subcategory=subcategories[i],
            max_pages=2
        )
        all_books.extend(toys)
    
    # Save to JSON
    print("\n" + "=" * 60)
    print(f"💾 Saving {len(all_books)} toys to mykingdom_data.json...")
    
    with open('mykingdom_data.json', 'w', encoding='utf-8') as f:
        json.dump(all_books, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Done! Scraped {len(all_books)} toys")
    print("\n📋 Sample data:")
    if all_books:
        print(json.dumps(all_books[0], ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()
