#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import requests
from bs4 import BeautifulSoup
import json
import time
import random
import re

def clean_price(price_text):
    """Clean and convert price text to integer"""
    if not price_text:
        return 0
    
    # Remove all non-digit characters except commas and dots
    cleaned = ''.join(c for c in price_text if c.isdigit() or c in ',.')
    
    # Handle Vietnamese price format (e.g., "325.000" = 325000)
    if '.' in cleaned and ',' not in cleaned:
        # Vietnamese format: dots as thousand separators
        cleaned = cleaned.replace('.', '')
    else:
        # International format: commas as thousand separators
        cleaned = cleaned.replace(',', '')
    
    try:
        return int(float(cleaned))
    except:
        return 0

def remove_price_from_title(title):
    """Remove price from title (e.g., 'Book Title 325k' -> 'Book Title')"""
    # Remove patterns like "325k", "325.000₫", etc.
    title = re.sub(r'\s+\d+[kK]?\s*$', '', title)
    title = re.sub(r'\s+\d+[.,]\d+\s*₫?\s*$', '', title)
    title = re.sub(r'\s+\d+\s*₫?\s*$', '', title)
    return title.strip()

def scrape_readstation_foreign():
    """Scrape foreign books from ReadStation"""
    print("Scraping foreign books from ReadStation...")
    books = []
    
    urls = [
        "https://readstation.vn/sach-ngoai-van",
        "https://readstation.vn/sach-ngoai-van?page=2"
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
                    
                    # Remove price from title
                    title = remove_price_from_title(title)
                    
                    # Extract price from price-box div
                    price_elem = product.find('div', class_='price-box')
                    if not price_elem:
                        continue
                    
                    price_text = price_elem.get_text(strip=True)
                    price = clean_price(price_text)
                    
                    if price == 0:
                        continue
                    
                    # Get image from data-src
                    img_elem = product.find('img')
                    image_url = img_elem.get('data-src') if img_elem else '/images/placeholder.jpg'
                    if image_url and image_url.startswith('//'):
                        image_url = 'https:' + image_url
                    elif image_url and image_url.startswith('/'):
                        image_url = 'https://readstation.vn' + image_url
                    
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
                        'author': 'Tác giả không rõ'  # ReadStation doesn't show author in listing
                    })
                    
                except Exception as e:
                    print(f"Error processing product: {e}")
                    continue
            
            time.sleep(1)
            
        except Exception as e:
            print(f"Error scraping {url}: {e}")
            continue
    
    print(f"Scraped {len(books)} foreign books")
    return books

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
                    
                    # Remove price from title
                    title = remove_price_from_title(title)
                    
                    # Extract price from price-box div
                    price_elem = product.find('div', class_='price-box')
                    if not price_elem:
                        continue
                    
                    price_text = price_elem.get_text(strip=True)
                    price = clean_price(price_text)
                    
                    if price == 0:
                        continue
                    
                    # Get image from data-src
                    img_elem = product.find('img')
                    image_url = img_elem.get('data-src') if img_elem else '/images/placeholder.jpg'
                    if image_url and image_url.startswith('//'):
                        image_url = 'https:' + image_url
                    elif image_url and image_url.startswith('/'):
                        image_url = 'https://readstation.vn' + image_url
                    
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
                        'author': 'Tác giả không rõ'  # ReadStation doesn't show author in listing
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
                    # Extract title from h2
                    title_elem = product.find('h2', class_='name-product')
                    if not title_elem:
                        continue
                    
                    title = title_elem.get_text(strip=True)
                    if not title:
                        continue
                    
                    # Extract author from p.author
                    author_elem = product.find('p', class_='author')
                    author = author_elem.get_text(strip=True) if author_elem else 'Tác giả không rõ'
                    
                    # Extract price from span.price
                    price_elem = product.find('span', class_='price')
                    if not price_elem:
                        continue
                    
                    price_text = price_elem.get_text(strip=True)
                    price = clean_price(price_text)
                    
                    if price == 0:
                        continue
                    
                    # Get image from data-src
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
                        'brand': 'NetaBooks',
                        'author': author
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
                    # Extract title from link
                    link_elem = product.find('a', class_='image-resize')
                    if not link_elem:
                        continue
                    
                    title = link_elem.get('title', '').strip()
                    if not title:
                        continue
                    
                    # Extract price from span.main-price
                    price_elem = product.find('span', class_='main-price')
                    if not price_elem:
                        continue
                    
                    price_text = price_elem.get_text(strip=True)
                    price = clean_price(price_text)
                    
                    if price == 0:
                        continue
                    
                    # Get image from data-src
                    img_elem = product.find('img', class_='img-loop')
                    image_url = img_elem.get('data-src') if img_elem else '/images/placeholder.jpg'
                    if image_url and image_url.startswith('//'):
                        image_url = 'https:' + image_url
                    elif image_url and image_url.startswith('/'):
                        image_url = 'https://tinistore.com' + image_url
                    
                    product_url = link_elem.get('href') if link_elem else '#'
                    if product_url and product_url.startswith('/'):
                        product_url = 'https://tinistore.com' + product_url
                    
                    books.append({
                        'title': title,
                        'price': price,
                        'originalPrice': int(price * 1.2),
                        'category': 'toys',
                        'subcategory': 'educational-toys',
                        'image': image_url,
                        'url': product_url,
                        'brand': 'tiNi Store',
                        'author': ''  # Toys don't have authors
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

def create_office_supplies():
    """Create 40 office supplies items"""
    print("Creating 40 office supplies items...")
    books = []
    
    office_items = [
        "Bút bi Thiên Long 0.5mm", "Bút chì 2B Bitex", "Tẩy Staedtler", "Thước kẻ 30cm",
        "Compa vẽ", "Máy tính Casio fx-570VN Plus", "Bút dạ quang", "Bìa hồ sơ A4",
        "Giấy A4 Double A", "Kéo văn phòng", "Băng keo trong", "Ghim bấm",
        "Kẹp giấy", "Bút lông dầu", "Bút chì màu", "Tập vở học sinh",
        "Sổ tay", "Bút highlight", "Bút gel", "Bút máy",
        "Bút chì màu nước", "Bút dạ", "Bút lông", "Bút bi nước",
        "Bút chì kim", "Bút dạ quang neon", "Bút gel đen", "Bút bi xanh",
        "Bút chì HB", "Bút dạ quang vàng", "Bút gel đỏ", "Bút bi đỏ",
        "Bút chì 2B", "Bút dạ quang xanh", "Bút gel xanh", "Bút bi đen",
        "Bút chì 4B", "Bút dạ quang hồng", "Bút gel tím", "Bút bi tím"
    ]
    
    brands = ["Thiên Long", "Bitex", "Staedtler", "Casio", "Double A", "Plus Stationery"]
    
    for i, item in enumerate(office_items):
        price = random.randint(5000, 50000)  # Reasonable prices
        books.append({
            'title': item,
            'price': price,
            'originalPrice': int(price * 1.2),
            'category': 'office-supplies',
            'subcategory': 'pens',
            'image': '/images/placeholder.jpg',
            'url': '#',
            'brand': random.choice(brands),
            'author': ''  # No author for office supplies
        })
    
    print(f"Created {len(books)} office supplies")
    return books

def generate_metadata(book):
    """Generate metadata for books"""
    
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
        'comics': [
            "NXB Kim Đồng", "NXB Trẻ", "NXB Hội Nhà Văn", "NXB Văn Học",
            "Kodansha", "Shueisha", "Shogakukan", "Square Enix"
        ],
        'toys': [
            "LEGO Vietnam", "Mattel Vietnam", "Hasbro Vietnam", "Bandai Namco",
            "Playmobil", "Fisher-Price", "Hot Wheels", "Barbie"
        ],
        'office-supplies': [
            "Thiên Long Corp.", "Bitex Stationery", "Plus Stationery", "Double A Vietnam",
            "Casio Vietnam", "Safety 1st Inc.", "Richell Vietnam", "Munchkin Inc."
        ]
    }
    
    book['publisher'] = random.choice(publishers_by_category.get(book['category'], ["Unknown Publisher"]))
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
    # Generate specific descriptions based on category
    if book['category'] == 'foreign':
        descriptions = [
            f"'{book['title']}' is an excellent foreign book that brings valuable knowledge and fresh perspectives on life. Written in English, this work offers international insights and cultural diversity.",
            f"The book '{book['title']}' is a remarkable piece with rich content and clear presentation. It helps expand your understanding and develop critical thinking skills.",
            f"'{book['title']}' is a beloved book among readers due to its engaging content and accessible writing style. Perfect for those who want to learn and gain more knowledge.",
            f"This foreign book '{book['title']}' provides useful information and valuable life lessons. The content is presented scientifically and is easy to understand.",
            f"'{book['title']}' is an excellent choice for those who want to enhance their knowledge and skills. The content is carefully compiled and easy to apply."
        ]
    elif book['category'] == 'vietnamese':
        descriptions = [
            f"Cuốn sách '{book['title']}' mang đến những kiến thức bổ ích và những góc nhìn mới mẻ về cuộc sống. Tác phẩm được viết bằng ngôn ngữ tiếng Việt dễ hiểu, phù hợp với độc giả Việt Nam.",
            f"'{book['title']}' là một tác phẩm đáng đọc với nội dung phong phú và cách trình bày rõ ràng. Sách giúp bạn mở rộng tầm hiểu biết và phát triển tư duy.",
            f"Đây là cuốn sách '{book['title']}' được nhiều độc giả yêu thích nhờ nội dung hấp dẫn và cách viết dễ tiếp cận. Phù hợp cho những ai muốn tìm hiểu và học hỏi thêm kiến thức.",
            f"'{book['title']}' mang đến những thông tin hữu ích và những bài học quý giá từ cuộc sống. Sách được trình bày một cách khoa học và dễ hiểu.",
            f"Cuốn sách '{book['title']}' là lựa chọn tuyệt vời cho những ai muốn nâng cao kiến thức và kỹ năng của bản thân. Nội dung được biên soạn kỹ lưỡng và dễ áp dụng."
        ]
    elif book['category'] == 'comics':
        descriptions = [
            f"Truyện tranh '{book['title']}' với những hình ảnh minh họa đẹp mắt và câu chuyện hấp dẫn. Phù hợp cho những ai yêu thích thể loại truyện tranh và muốn giải trí.",
            f"'{book['title']}' là một tác phẩm truyện tranh được nhiều độc giả đánh giá cao. Với nội dung thú vị và cách kể chuyện sinh động, đây là lựa chọn tuyệt vời cho thời gian rảnh rỗi.",
            f"Cuốn truyện tranh '{book['title']}' mang đến những phút giây giải trí tuyệt vời với cốt truyện hấp dẫn và nhân vật đáng yêu. Phù hợp cho mọi lứa tuổi.",
            f"'{book['title']}' là một tác phẩm truyện tranh chất lượng cao với nội dung phong phú và hình ảnh đẹp mắt. Đây là lựa chọn hoàn hảo cho những ai yêu thích thể loại này.",
            f"Truyện tranh '{book['title']}' với cốt truyện độc đáo và cách thể hiện nghệ thuật. Sách mang đến những trải nghiệm đọc thú vị và bổ ích."
        ]
    elif book['category'] == 'toys':
        descriptions = [
            f"Sản phẩm đồ chơi '{book['title']}' được thiết kế an toàn và thân thiện với trẻ em. Giúp phát triển trí tuệ và kỹ năng vận động của trẻ một cách tự nhiên.",
            f"'{book['title']}' là đồ chơi giáo dục chất lượng cao, giúp trẻ học hỏi và phát triển các kỹ năng cần thiết thông qua việc chơi đùa vui vẻ.",
            f"Đồ chơi '{book['title']}' được làm từ chất liệu an toàn, không độc hại. Sản phẩm giúp kích thích trí tưởng tượng và sự sáng tạo của trẻ em.",
            f"'{book['title']}' là lựa chọn tuyệt vời cho việc giáo dục và giải trí trẻ em. Sản phẩm được thiết kế để phù hợp với nhiều độ tuổi khác nhau.",
            f"Đồ chơi '{book['title']}' mang đến những giờ phút vui vẻ và bổ ích cho trẻ em. Giúp phát triển tư duy logic và khả năng tập trung."
        ]
    elif book['category'] == 'office-supplies':
        descriptions = [
            f"Sản phẩm văn phòng phẩm '{book['title']}' được thiết kế tiện dụng và chất lượng cao. Phù hợp cho công việc văn phòng, học tập và các hoạt động hàng ngày.",
            f"'{book['title']}' là dụng cụ văn phòng không thể thiếu, giúp bạn hoàn thành công việc một cách hiệu quả và chuyên nghiệp.",
            f"Sản phẩm '{book['title']}' được sản xuất từ chất liệu bền bỉ, đảm bảo độ bền cao trong quá trình sử dụng. Lựa chọn tin cậy cho văn phòng và gia đình.",
            f"'{book['title']}' là dụng cụ học tập và làm việc chất lượng, giúp bạn ghi chép và tổ chức công việc một cách khoa học và hiệu quả.",
            f"Văn phòng phẩm '{book['title']}' với thiết kế gọn nhẹ và tiện lợi, phù hợp cho mọi nhu cầu sử dụng từ học tập đến công việc chuyên nghiệp."
        ]
    else:
        descriptions = [
            f"Sản phẩm '{book['title']}' chất lượng cao với thiết kế đẹp mắt và chức năng tiện dụng. Phù hợp cho nhiều mục đích sử dụng khác nhau.",
            f"'{book['title']}' là lựa chọn tuyệt vời với giá trị sử dụng cao và độ bền đảm bảo. Sản phẩm được nhiều khách hàng tin tưởng và đánh giá tích cực."
        ]
    
    book['description'] = random.choice(descriptions)
    book['tags'] = ["sách", "đọc sách", "tri thức", "giáo dục", "phát triển bản thân"]
    book['featured'] = random.choice([True, False])
    book['newRelease'] = random.choice([True, False])
    
    return book

def main():
    """Main scraping function"""
    print("Starting fixed data scraping...")
    
    all_books = []
    
    # Scrape Foreign books
    foreign_books = scrape_readstation_foreign()
    all_books.extend(foreign_books)
    
    # Scrape Vietnamese books
    vietnamese_books = scrape_readstation_vietnamese()
    all_books.extend(vietnamese_books)
    
    # Scrape Comics
    comic_books = scrape_netabooks_comics()
    all_books.extend(comic_books)
    
    # Scrape Toys
    toy_books = scrape_tinistore_toys()
    all_books.extend(toy_books)
    
    # Create Office supplies (40 items)
    office_books = create_office_supplies()
    all_books.extend(office_books)
    
    print(f"\nTotal scraped: {len(all_books)} items")
    
    # Generate metadata for all books
    print("Generating metadata...")
    for i, book in enumerate(all_books):
        book = generate_metadata(book)
        book['id'] = i + 1
        all_books[i] = book
    
    # Save to JSON
    with open('fixed_scraped_data.json', 'w', encoding='utf-8') as f:
        json.dump(all_books, f, ensure_ascii=False, indent=2)
    
    print(f"Saved {len(all_books)} items to fixed_scraped_data.json")
    
    # Count by category
    from collections import Counter
    categories = [book['category'] for book in all_books]
    category_counts = Counter(categories)
    
    print("\nCategory counts:")
    for cat, count in category_counts.items():
        print(f"  {cat}: {count} items")
    
    # Show sample prices
    print("\nSample prices:")
    for book in all_books[:5]:
        print(f"  {book['title'][:50]}... - {book['price']:,}₫")

if __name__ == "__main__":
    main()
