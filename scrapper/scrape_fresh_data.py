#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
from bs4 import BeautifulSoup
import json
import time
import random

def scrape_readstation_vietnamese():
    """Scrape Vietnamese books from ReadStation"""
    print("Scraping Vietnamese books from ReadStation...")
    books = []
    
    urls = [
        "https://readstation.vn/sach-tieng-viet",
        "https://readstation.vn/sach-tieng-viet?page=2",
        "https://readstation.vn/sach-tieng-viet?page=3"
    ]
    
    for url in urls:
        try:
            print(f"Scraping: {url}")
            response = requests.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            products = soup.find_all('div', class_='item_product_main')
            print(f"Found {len(products)} products")
            
            for product in products:
                try:
                    # Extract title from link title attribute
                    link_elem = product.find('a', class_='image_thumb')
                    if not link_elem:
                        continue
                    
                    title = link_elem.get('title', '').strip()
                    if not title:
                        continue
                    
                    # Try to get author from product info
                    author_elem = product.find('div', class_='author') or product.find('span', class_='author')
                    author = author_elem.get_text(strip=True) if author_elem else None
                    
                    # Try to get publisher from product info
                    publisher_elem = product.find('div', class_='publisher') or product.find('span', class_='publisher')
                    publisher = publisher_elem.get_text(strip=True) if publisher_elem else None
                    
                    price_elem = product.find('span', class_='price')
                    if not price_elem:
                        continue
                    
                    price_text = price_elem.get_text(strip=True)
                    price = clean_price(price_text)
                    
                    img_elem = product.find('img')
                    image_url = img_elem.get('src') if img_elem else '/images/placeholder.jpg'
                    if image_url.startswith('/'):
                        image_url = 'https://readstation.vn' + image_url
                    
                    link_elem = product.find('a')
                    product_url = link_elem.get('href') if link_elem else '#'
                    if product_url.startswith('/'):
                        product_url = 'https://readstation.vn' + product_url
                    
                    books.append({
                        'title': title,
                        'price': price,
                        'originalPrice': int(price * 1.2),
                        'category': 'vietnamese',
                        'subcategory': 'literature',
                        'image': image_url,
                        'url': product_url,
                        'brand': 'ReadStation',
                        'scraped_author': author,
                        'scraped_publisher': publisher
                    })
                    
                except Exception as e:
                    print(f"Error processing product: {e}")
                    continue
            
            time.sleep(1)
            
        except Exception as e:
            print(f"Error scraping {url}: {e}")
            continue
    
    print(f"Scraped {len(books)} Vietnamese books")
    return books

def scrape_readstation_foreign():
    """Scrape Foreign books from ReadStation"""
    print("Scraping Foreign books from ReadStation...")
    books = []
    
    urls = [
        "https://readstation.vn/sach-ngoai-van",
        "https://readstation.vn/sach-ngoai-van?page=2",
        "https://readstation.vn/sach-ngoai-van?page=3"
    ]
    
    for url in urls:
        try:
            print(f"Scraping: {url}")
            response = requests.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            products = soup.find_all('div', class_='item_product_main')
            print(f"Found {len(products)} products")
            
            for product in products:
                try:
                    title_elem = product.find('h3', class_='name_product')
                    if not title_elem:
                        continue
                    
                    title = title_elem.get_text(strip=True)
                    
                    # Try to get author from product info
                    author_elem = product.find('div', class_='author') or product.find('span', class_='author')
                    author = author_elem.get_text(strip=True) if author_elem else None
                    
                    # Try to get publisher from product info
                    publisher_elem = product.find('div', class_='publisher') or product.find('span', class_='publisher')
                    publisher = publisher_elem.get_text(strip=True) if publisher_elem else None
                    
                    price_elem = product.find('span', class_='price')
                    if not price_elem:
                        continue
                    
                    price_text = price_elem.get_text(strip=True)
                    price = clean_price(price_text)
                    
                    img_elem = product.find('img')
                    image_url = img_elem.get('src') if img_elem else '/images/placeholder.jpg'
                    if image_url.startswith('/'):
                        image_url = 'https://readstation.vn' + image_url
                    
                    link_elem = product.find('a')
                    product_url = link_elem.get('href') if link_elem else '#'
                    if product_url.startswith('/'):
                        product_url = 'https://readstation.vn' + product_url
                    
                    books.append({
                        'title': title,
                        'price': price,
                        'originalPrice': int(price * 1.2),
                        'category': 'foreign',
                        'subcategory': 'fiction',
                        'image': image_url,
                        'url': product_url,
                        'brand': 'ReadStation',
                        'scraped_author': author,
                        'scraped_publisher': publisher
                    })
                    
                except Exception as e:
                    print(f"Error processing product: {e}")
                    continue
            
            time.sleep(1)
            
        except Exception as e:
            print(f"Error scraping {url}: {e}")
            continue
    
    print(f"Scraped {len(books)} Foreign books")
    return books

def scrape_vpphongha():
    """Scrape office supplies from VPP Hong Ha"""
    print("Scraping office supplies from VPP Hong Ha...")
    books = []
    
    urls = [
        "https://vpphongha.vn",
        "https://vpphongha.vn?page=2",
    ]
    
    for url in urls:
        try:
            print(f"Scraping: {url}")
            response = requests.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            products = soup.find_all('div', class_='item_product_main')
            print(f"Found {len(products)} products")
            
            for product in products:
                try:
                    title_elem = product.find('h3', class_='name_product')
                    if not title_elem:
                        continue
                    
                    title = title_elem.get_text(strip=True)
                    
                    price_elem = product.find('span', class_='price')
                    if not price_elem:
                        continue
                    
                    price_text = price_elem.get_text(strip=True)
                    price = clean_price(price_text)
                    
                    img_elem = product.find('img')
                    image_url = img_elem.get('src') if img_elem else '/images/placeholder.jpg'
                    if image_url.startswith('/'):
                        image_url = 'https://vpphongha.vn' + image_url
                    
                    link_elem = product.find('a')
                    product_url = link_elem.get('href') if link_elem else '#'
                    if product_url.startswith('/'):
                        product_url = 'https://vpphongha.vn' + product_url
                    
                    books.append({
                        'title': title,
                        'price': price,
                        'originalPrice': int(price * 1.2),
                        'category': 'office-supplies',
                        'subcategory': 'pens',
                        'image': image_url,
                        'url': product_url,
                        'brand': 'VPP Hong Ha'
                    })
                    
                except Exception as e:
                    print(f"Error processing product: {e}")
                    continue
            
            time.sleep(1)
            
        except Exception as e:
            print(f"Error scraping {url}: {e}")
            continue
    
    print(f"Scraped {len(books)} office supplies")
    return books

def scrape_netabooks_comics():
    """Scrape comics from NetaBooks"""
    print("Scraping comics from NetaBooks...")
    books = []
    
    urls = [
        "https://www.netabooks.vn/truyen-tranh-manga-comic",
        "https://www.netabooks.vn/truyen-tranh-manga-comic?page=2",
        "https://www.netabooks.vn/truyen-tranh-manga-comic?page=3"
    ]
    
    for url in urls:
        try:
            print(f"Scraping: {url}")
            response = requests.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            products = soup.find_all('div', class_='box-product-category')
            print(f"Found {len(products)} products")
            
            for product in products:
                try:
                    title_elem = product.find('div', class_='name-product')
                    if not title_elem:
                        continue
                    
                    title = title_elem.get_text(strip=True)
                    
                    price_elem = product.find('div', class_='price')
                    if not price_elem:
                        continue
                    
                    price_text = price_elem.get_text(strip=True)
                    price = clean_price(price_text)
                    
                    img_elem = product.find('img', class_='b-lazy')
                    image_url = img_elem.get('data-src') if img_elem else '/images/placeholder.jpg'
                    if image_url and image_url.startswith('/'):
                        image_url = 'https://www.netabooks.vn' + image_url
                    
                    link_elem = product.find('a')
                    product_url = link_elem.get('href') if link_elem else '#'
                    if product_url and product_url.startswith('/'):
                        product_url = 'https://www.netabooks.vn' + product_url
                    
                    books.append({
                        'title': title,
                        'price': price,
                        'originalPrice': int(price * 1.2),
                        'category': 'comics',
                        'subcategory': 'comic-books',
                        'image': image_url,
                        'url': product_url,
                        'brand': 'NetaBooks'
                    })
                    
                except Exception as e:
                    print(f"Error processing product: {e}")
                    continue
            
            time.sleep(1)
            
        except Exception as e:
            print(f"Error scraping {url}: {e}")
            continue
    
    print(f"Scraped {len(books)} comics")
    return books

def scrape_tinistore_toys():
    """Scrape toys from tiNi Store"""
    print("Scraping toys from tiNi Store...")
    books = []
    
    urls = [
        "https://tinistore.com/collections/chuong-trinh-khuyen-mai",
        "https://tinistore.com/collections/chuong-trinh-khuyen-mai?page=2",
        "https://tinistore.com/collections/chuong-trinh-khuyen-mai?page=3"
    ]
    
    for url in urls:
        try:
            print(f"Scraping: {url}")
            response = requests.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            products = soup.find_all('div', class_='product-block')
            print(f"Found {len(products)} products")
            
            for product in products:
                try:
                    title_elem = product.find('div', class_='pro-name')
                    if not title_elem:
                        continue
                    
                    title_link = title_elem.find('a')
                    if not title_link:
                        continue
                    
                    title = title_link.get_text(strip=True)
                    
                    price_elem = product.find('div', class_='main-price')
                    if not price_elem:
                        continue
                    
                    price_text = price_elem.get_text(strip=True)
                    price = clean_price(price_text)
                    
                    img_elem = product.find('img', class_='img-loop')
                    image_url = img_elem.get('src') if img_elem else '/images/placeholder.jpg'
                    if image_url and image_url.startswith('/'):
                        image_url = 'https://tinistore.com' + image_url
                    
                    product_url = title_link.get('href') if title_link else '#'
                    if product_url and product_url.startswith('/'):
                        product_url = 'https://tinistore.com' + product_url
                    
                    books.append({
                        'title': title,
                        'price': price,
                        'originalPrice': int(price * 1.2),
                        'category': 'toys',
                        'subcategory': 'educational-toys',
                        'image': image_url,
                        'url': product_url
                    })
                    
                except Exception as e:
                    print(f"Error processing product: {e}")
                    continue
            
            time.sleep(1)
            
        except Exception as e:
            print(f"Error scraping {url}: {e}")
            continue
    
    print(f"Scraped {len(books)} toys")
    return books

def clean_price(price_text):
    """Clean and convert price text to integer"""
    if not price_text:
        return 0
    
    # Remove all non-digit characters except commas and dots
    cleaned = ''.join(c for c in price_text if c.isdigit() or c in ',.')
    
    # Remove commas and convert to int
    cleaned = cleaned.replace(',', '')
    
    try:
        return int(float(cleaned))
    except:
        return 0

def generate_metadata(book):
    """Generate random metadata for books"""
    authors = [
        "Nguyễn Văn An", "Lê Văn Bình", "Phạm Văn Cường", "Trần Văn Đức",
        "Nguyễn Văn Em", "Lê Văn Phúc", "Phạm Văn Giang", "Trần Văn Hùng",
        "Nguyễn Văn Ích", "Lê Văn Khoa", "Phạm Văn Long", "Trần Văn Minh"
    ]
    
    # Different publishers for different categories
    publishers_by_category = {
        'vietnamese': [
            "NXB Giáo Dục", "NXB Kim Đồng", "NXB Hội Nhà Văn", "NXB Văn Học",
            "NXB Thế Giới", "NXB Trẻ", "NXB Lao Động", "NXB Phụ Nữ"
        ],
        'foreign': [
            "Oxford University Press", "Cambridge University Press", "Penguin Random House",
            "HarperCollins", "Simon & Schuster", "Macmillan Publishers", "Wiley"
        ],
        'office-supplies': [
            "Thiên Long Corp.", "Bitex Stationery", "Plus Stationery", "Double A Vietnam",
            "Casio Vietnam", "Safety 1st Inc.", "Richell Vietnam", "Munchkin Inc."
        ],
        'comics': [
            "NXB Kim Đồng", "NXB Trẻ", "NXB Hội Nhà Văn", "NXB Văn Học",
            "Kodansha", "Shueisha", "Shogakukan", "Square Enix"
        ],
        'toys': [
            "LEGO Vietnam", "Mattel Vietnam", "Hasbro Vietnam", "Bandai Namco",
            "Playmobil", "Fisher-Price", "Hot Wheels", "Barbie"
        ]
    }
    
    # Only books, comics, and novels have authors
    if book['category'] in ['vietnamese', 'foreign', 'comics']:
        # Try to extract author from title or use scraped data
        if book.get('scraped_author'):
            book['author'] = book['scraped_author']
        else:
            title = book['title']
            if ' - ' in title:
                # Format: "Book Title - Author Name"
                parts = title.split(' - ')
                if len(parts) >= 2:
                    book['author'] = parts[-1].strip()
                else:
                    book['author'] = "Tác giả không rõ"
            else:
                book['author'] = "Tác giả không rõ"
    else:
        # Office supplies and toys don't have authors
        book['author'] = ""
    
    # Use scraped publisher if available, otherwise use random
    book['publisher'] = book.get('scraped_publisher') or random.choice(publishers_by_category.get(book['category'], ["Unknown Publisher"]))
    
    # Remove scraped fields as they're no longer needed
    book.pop('scraped_author', None)
    book.pop('scraped_publisher', None)
    book['publishDate'] = f"202{random.randint(2, 5)}-{random.randint(1, 12):02d}-{random.randint(1, 28):02d}"
    book['isbn'] = f"978-{random.randint(100, 999)}-{random.randint(10000, 99999)}-{random.randint(1, 9)}"
    book['pages'] = random.randint(100, 500)
    book['language'] = "Tiếng Việt" if book['category'] == 'vietnamese' else "English"
    book['format'] = "Bìa mềm"
    book['weight'] = f"{random.randint(200, 800)}g"
    book['dimensions'] = f"{random.randint(15, 25)} x {random.randint(10, 20)} x {random.randint(1, 5)} cm"
    book['stock'] = random.randint(10, 100)
    book['rating'] = round(random.uniform(3.5, 5.0), 1)
    book['reviewCount'] = random.randint(10, 500)
    book['description'] = f"Cuốn sách {book['title']} là một tác phẩm hay với nội dung sâu sắc và ý nghĩa. Phù hợp cho mọi lứa tuổi yêu thích đọc sách."
    book['tags'] = ["sách", "đọc sách", "tri thức", "giáo dục", "phát triển bản thân"]
    book['featured'] = random.choice([True, False])
    book['newRelease'] = random.choice([True, False])
    
    return book

def main():
    """Main scraping function"""
    print("Starting fresh data scraping...")
    
    all_books = []
    
    # Scrape Vietnamese books
    vietnamese_books = scrape_readstation_vietnamese()
    all_books.extend(vietnamese_books)
    
    # Scrape Foreign books
    foreign_books = scrape_readstation_foreign()
    all_books.extend(foreign_books)
    
    # Scrape Office supplies (limit to 40)
    office_books = scrape_vpphongha()
    office_books = office_books[:40]  # Limit to 40 items
    all_books.extend(office_books)
    
    # Scrape Comics
    comic_books = scrape_netabooks_comics()
    all_books.extend(comic_books)
    
    # Scrape Toys
    toy_books = scrape_tinistore_toys()
    all_books.extend(toy_books)
    
    print(f"\nTotal scraped: {len(all_books)} items")
    
    # Generate metadata for all books
    print("Generating metadata...")
    for i, book in enumerate(all_books):
        book = generate_metadata(book)
        book['id'] = i + 1
        all_books[i] = book
    
    # Save to JSON
    with open('fresh_scraped_data.json', 'w', encoding='utf-8') as f:
        json.dump(all_books, f, ensure_ascii=False, indent=2)
    
    print(f"Saved {len(all_books)} items to fresh_scraped_data.json")
    
    # Count by category
    from collections import Counter
    categories = [book['category'] for book in all_books]
    category_counts = Counter(categories)
    
    print("\nCategory counts:")
    for cat, count in category_counts.items():
        print(f"  {cat}: {count} items")

if __name__ == "__main__":
    main()
