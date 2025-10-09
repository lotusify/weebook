#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Scrape book data from ReadStation.vn and other sources
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import re

def clean_price(price_text):
    """Extract number from price string like '325.000₫'"""
    return int(re.sub(r'[^\d]', '', price_text))

def clean_title(title):
    """Remove price from title like 'Nexus 325k' -> 'Nexus'"""
    # Remove patterns like '325k', '699k', etc.
    title = re.sub(r'\s+\d+k\s*$', '', title)
    title = re.sub(r'\s+\d+\.\d+k\s*$', '', title)
    title = re.sub(r'\s+\d+\s*$', '', title)
    return title.strip()

def scrape_readstation_category(url, category, subcategory='literature', max_pages=5):
    """Scrape products from ReadStation category page"""
    books = []
    
    for page in range(1, max_pages + 1):
        print(f"📖 Scraping {category} - Page {page}/{max_pages}...")
        
        page_url = f"{url}?page={page}" if page > 1 else url
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            response = requests.get(page_url, headers=headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # ReadStation uses 'item_product_main' class
            products = soup.find_all('div', class_='item_product_main')
            
            print(f"  Found {len(products)} products")
            
            if not products:
                print(f"  ⚠️  No products found on page {page}")
                break
            
            for product in products[:12]:  # Max 12 per page
                try:
                    # Extract title
                    title_elem = product.find('h3', class_='product-name')
                    if not title_elem:
                        continue
                    
                    title = title_elem.get_text(strip=True)
                    title = clean_title(title)  # Remove price from title
                    
                    if not title:
                        continue
                    
                    # Extract price
                    price_elem = product.find('div', class_='price-box')
                    if not price_elem:
                        continue
                    
                    price_text = price_elem.get_text(strip=True)
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
                            image_url = 'https://readstation.vn' + image_url
                    
                    # Extract link
                    link_elem = product.find('a')
                    product_url = link_elem.get('href') if link_elem else None
                    if product_url and not product_url.startswith('http'):
                        product_url = 'https://readstation.vn' + product_url
                    
                    book_data = {
                        'title': title,
                        'price': price,
                        'originalPrice': int(price * 1.2),  # Estimate 20% discount
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
            
            # Be nice to the server
            time.sleep(1)
            
        except Exception as e:
            print(f"  ✗ Error fetching page {page}: {e}")
            break
    
    return books

def scrape_fahasa_novels(max_pages=5):
    """Scrape novels from Fahasa"""
    books = []
    
    for page in range(1, max_pages + 1):
        print(f"📖 Scraping Fahasa novels - Page {page}/{max_pages}...")
        
        url = f"https://www.fahasa.com/sach-trong-nuoc/van-hoc-trong-nuoc/tieu-thuyet.html?order=num_orders&limit=24&p={page}"
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            }
            response = requests.get(url, headers=headers, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Try multiple selectors for Fahasa
            products = (
                soup.find_all('div', class_='product-item') or
                soup.find_all('div', class_='product-block') or
                soup.find_all('div', class_='item-product') or
                soup.select('.product-list .product') or
                soup.select('.product-item') or
                soup.select('[data-product]')
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
                        product.select_one('.product-title')
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
                        product.select_one('.price')
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
                    
                    # Extract link
                    link_elem = product.find('a')
                    product_url = link_elem.get('href') if link_elem else None
                    if product_url and not product_url.startswith('http'):
                        product_url = 'https://www.fahasa.com' + product_url
                    
                    book_data = {
                        'title': title,
                        'price': price,
                        'originalPrice': int(price * 1.2),
                        'category': 'vietnamese',
                        'subcategory': 'novels',
                        'image': image_url,
                        'url': product_url
                    }
                    
                    books.append(book_data)
                    print(f"  ✓ {title[:50]}... - {price:,}đ")
                    
                except Exception as e:
                    print(f"  ✗ Error parsing product: {e}")
                    continue
            
            time.sleep(2)  # Be nice to Fahasa
            
        except Exception as e:
            print(f"  ✗ Error fetching page {page}: {e}")
            break
    
    return books

def scrape_kimdong_comics(max_pages=5):
    """Scrape comics from Kim Dong"""
    books = []
    
    for page in range(1, max_pages + 1):
        print(f"📖 Scraping Kim Dong comics - Page {page}/{max_pages}...")
        
        url = f"https://nxbkimdong.com.vn/collections/truyen-tranh?page={page}"
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8'
            }
            response = requests.get(url, headers=headers, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Try multiple selectors for Kim Dong
            products = (
                soup.find_all('div', class_='product-item') or
                soup.find_all('div', class_='product-block') or
                soup.find_all('div', class_='item-product') or
                soup.select('.product-list .product') or
                soup.select('.product-item') or
                soup.select('[data-product]') or
                soup.find_all('div', class_='grid-product__content')
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
                        product.select_one('.grid-product__title')
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
                        product.select_one('.grid-product__price')
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
                    
                    # Extract link
                    link_elem = product.find('a')
                    product_url = link_elem.get('href') if link_elem else None
                    if product_url and not product_url.startswith('http'):
                        product_url = 'https://nxbkimdong.com.vn' + product_url
                    
                    book_data = {
                        'title': title,
                        'price': price,
                        'originalPrice': int(price * 1.2),
                        'category': 'comics',
                        'subcategory': 'comic-books',
                        'image': image_url,
                        'url': product_url
                    }
                    
                    books.append(book_data)
                    print(f"  ✓ {title[:50]}... - {price:,}đ")
                    
                except Exception as e:
                    print(f"  ✗ Error parsing product: {e}")
                    continue
            
            time.sleep(2)  # Be nice to Kim Dong
            
        except Exception as e:
            print(f"  ✗ Error fetching page {page}: {e}")
            break
    
    return books

def scrape_vpphongha_stationery(max_pages=5):
    """Scrape stationery from VPP Hong Ha"""
    books = []
    
    for page in range(1, max_pages + 1):
        print(f"📖 Scraping VPP Hong Ha - Page {page}/{max_pages}...")
        
        url = f"https://vpphongha.vn?page={page}" if page > 1 else "https://vpphongha.vn"
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8'
            }
            response = requests.get(url, headers=headers, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Use correct selector for VPP Hong Ha
            products = soup.find_all('div', class_='col-item product-inner fix-height')
            
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
                    
                    # Extract price - VPP Hong Ha uses .price class
                    price_elem = (
                        product.find('span', class_='price') or
                        product.find('div', class_='price') or
                        product.select_one('.price')
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
                            image_url = 'https://vpphongha.vn' + image_url
                    
                    # Extract link
                    link_elem = product.find('a')
                    product_url = link_elem.get('href') if link_elem else None
                    if product_url and not product_url.startswith('http'):
                        product_url = 'https://vpphongha.vn' + product_url
                    
                    book_data = {
                        'title': title,
                        'price': price,
                        'originalPrice': int(price * 1.2),
                        'category': 'office-supplies',
                        'subcategory': 'pens',
                        'image': image_url,
                        'url': product_url
                    }
                    
                    books.append(book_data)
                    print(f"  ✓ {title[:50]}... - {price:,}đ")
                    
                except Exception as e:
                    print(f"  ✗ Error parsing product: {e}")
                    continue
            
            time.sleep(2)  # Be nice to VPP Hong Ha
            
        except Exception as e:
            print(f"  ✗ Error fetching page {page}: {e}")
            break
    
    return books

def main():
    print("🚀 Starting comprehensive scraper...\n")
    
    all_books = []
    
    # Scrape ReadStation Vietnamese books
    print("=" * 60)
    vn_books = scrape_readstation_category(
        'https://readstation.vn/sach-tieng-viet',
        category='vietnamese',
        subcategory='literature',
        max_pages=3
    )
    all_books.extend(vn_books)
    
    # Scrape ReadStation Foreign books
    print("\n" + "=" * 60)
    foreign_books = scrape_readstation_category(
        'https://readstation.vn/sach-ngoai-van',
        category='foreign',
        subcategory='fiction',
        max_pages=3
    )
    all_books.extend(foreign_books)
    
    # Scrape ReadStation Stationery
    print("\n" + "=" * 60)
    stationery_books = scrape_readstation_category(
        'https://readstation.vn/van-phong-pham',
        category='office-supplies',
        subcategory='pens',
        max_pages=2
    )
    all_books.extend(stationery_books)
    
    # Scrape ReadStation Toys (try different URLs)
    print("\n" + "=" * 60)
    toys_books = scrape_readstation_category(
        'https://readstation.vn/do-choi-tre-em',
        category='toys',
        subcategory='educational-toys',
        max_pages=3
    )
    all_books.extend(toys_books)
    
    # Scrape ReadStation Comics (try different URLs)
    print("\n" + "=" * 60)
    comics_books = scrape_readstation_category(
        'https://readstation.vn/truyen-tranh-manga',
        category='comics',
        subcategory='comic-books',
        max_pages=3
    )
    all_books.extend(comics_books)
    
    # Scrape Fahasa Novels
    print("\n" + "=" * 60)
    novels = scrape_fahasa_novels(max_pages=5)
    all_books.extend(novels)
    
    # Scrape Kim Dong Comics
    print("\n" + "=" * 60)
    comics = scrape_kimdong_comics(max_pages=5)
    all_books.extend(comics)
    
    # Scrape VPP Hong Ha Stationery
    print("\n" + "=" * 60)
    vpp_stationery = scrape_vpphongha_stationery(max_pages=5)
    all_books.extend(vpp_stationery)
    
    # Scrape additional Vietnamese books from other sources
    print("\n" + "=" * 60)
    additional_vn_books = scrape_readstation_category(
        'https://readstation.vn/sach-thieu-nhi',
        category='vietnamese',
        subcategory='children',
        max_pages=3
    )
    all_books.extend(additional_vn_books)
    
    # Scrape additional office supplies
    print("\n" + "=" * 60)
    additional_office = scrape_readstation_category(
        'https://readstation.vn/do-dung-hoc-tap',
        category='office-supplies',
        subcategory='students',
        max_pages=3
    )
    all_books.extend(additional_office)
    
    # Save to JSON
    print("\n" + "=" * 60)
    print(f"💾 Saving {len(all_books)} books to scraped_data.json...")
    
    with open('scraped_data.json', 'w', encoding='utf-8') as f:
        json.dump(all_books, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Done! Scraped {len(all_books)} books")
    print("\n📋 Sample data:")
    if all_books:
        print(json.dumps(all_books[0], ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main()