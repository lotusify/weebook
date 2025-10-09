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

def scrape_thegioivanphongpham():
    """Scrape office supplies from The Gioi Van Phong Pham"""
    print("Scraping office supplies from The Gioi Van Phong Pham...")
    products = []
    
    urls = [
        "https://thegioivanphongpham.com.vn/collections/van-phong-pham",
        "https://thegioivanphongpham.com.vn/collections/van-phong-pham?page=2",
        "https://thegioivanphongpham.com.vn/collections/van-phong-pham?page=3"
    ]
    
    for url in urls:
        try:
            print(f"Scraping: {url}")
            response = requests.get(url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Try different selectors for products based on debug results
            product_selectors = [
                'div.col-item.product-inner.fix-height',
                'div.product-inner',
                'div.col-item',
                'div.product-wrapper',
                'div.product-item',
                'div.item-product', 
                'div.product-block',
                'div.product',
                'div.item'
            ]
            
            products_found = []
            for selector in product_selectors:
                products_found = soup.find_all('div', class_=selector)
                if products_found:
                    print(f"Found {len(products_found)} products with selector: {selector}")
                    break
            
            if not products_found:
                print("No products found, trying alternative approach...")
                # Try to find any links that might be products
                links = soup.find_all('a', href=True)
                product_links = [link for link in links if '/products/' in link.get('href', '')]
                print(f"Found {len(product_links)} product links")
                
                # Extract basic info from links
                for link in product_links[:15]:  # Limit to 15 per page
                    try:
                        title = link.get_text(strip=True)
                        if title and len(title) > 3:
                            img = link.find('img')
                            image_url = img.get('src') if img else '/images/placeholder.jpg'
                            if image_url and image_url.startswith('//'):
                                image_url = 'https:' + image_url
                            elif image_url and image_url.startswith('/'):
                                image_url = 'https://thegioivanphongpham.com.vn' + image_url
                            
                            products.append({
                                'title': title,
                                'price': random.randint(10000, 100000),
                                'originalPrice': random.randint(12000, 120000),
                                'category': 'office-supplies',
                                'subcategory': 'pens',
                                'image': image_url,
                                'url': link.get('href'),
                                'brand': 'The Gioi Van Phong Pham',
                                'author': ''
                            })
                    except Exception as e:
                        print(f"Error processing link: {e}")
                        continue
            else:
                # Process found products
                for product in products_found[:15]:  # Limit to 15 per page
                    try:
                        # Extract title from img alt attribute or other elements
                        img_elem = product.find('img')
                        title = ''
                        if img_elem:
                            title = img_elem.get('alt', '').strip()
                        
                        if not title:
                            # Try other title selectors
                            title_elem = product.find(['h3', 'h4', 'h5', 'a'], class_=['item-title', 'product-name', 'title', 'name'])
                            if not title_elem:
                                title_elem = product.find(['h3', 'h4', 'h5', 'a'])
                            title = title_elem.get_text(strip=True) if title_elem else ''
                        
                        if not title:
                            continue
                        
                        # Extract price
                        price_elem = product.find('span', class_='price')
                        price = 0
                        if price_elem:
                            price_text = price_elem.get_text(strip=True)
                            price = clean_price(price_text)
                        
                        if price == 0:
                            price = random.randint(10000, 100000)
                        
                        # Extract image
                        image_url = img_elem.get('src') if img_elem else '/images/placeholder.jpg'
                        if image_url and image_url.startswith('//'):
                            image_url = 'https:' + image_url
                        elif image_url and image_url.startswith('/'):
                            image_url = 'https://thegioivanphongpham.com.vn' + image_url
                        
                        # Extract link
                        link_elem = product.find('a')
                        product_url = link_elem.get('href') if link_elem else '#'
                        if product_url and product_url.startswith('/'):
                            product_url = 'https://thegioivanphongpham.com.vn' + product_url
                        
                        products.append({
                            'title': title,
                            'price': price,
                            'originalPrice': int(price * 1.2),
                            'category': 'office-supplies',
                            'subcategory': 'pens',
                            'image': image_url,
                            'url': product_url,
                            'brand': 'The Gioi Van Phong Pham',
                            'author': ''
                        })
                        
                    except Exception as e:
                        print(f"Error processing product: {e}")
                        continue
            
            time.sleep(1)
            
        except Exception as e:
            print(f"Error scraping {url}: {e}")
            continue
    
    print(f"Scraped {len(products)} office supplies")
    return products[:45]  # Limit to 45 products

def generate_office_metadata(product):
    """Generate metadata for office supplies"""
    product['publisher'] = "The Gioi Van Phong Pham"
    product['publishDate'] = f"202{random.randint(2, 5)}-{random.randint(1, 12):02d}-{random.randint(1, 28):02d}"
    product['isbn'] = f"978-{random.randint(100, 999)}-{random.randint(10000, 99999)}-{random.randint(1, 9)}"
    product['pages'] = 1  # Office supplies don't have pages
    product['language'] = "Tiếng Việt"
    product['format'] = "Sản phẩm"
    product['weight'] = f"{random.randint(5, 100)}g"
    product['dimensions'] = f"{random.randint(10, 30)} x {random.randint(5, 20)} x {random.randint(1, 5)} cm"
    product['stock'] = random.randint(10, 100)
    product['rating'] = round(random.uniform(3.5, 5.0), 1)
    product['reviewCount'] = random.randint(10, 500)
    
    # Generate appropriate description
    descriptions = [
        f"Sản phẩm văn phòng phẩm '{product['title']}' được thiết kế tiện dụng và chất lượng cao. Phù hợp cho công việc văn phòng, học tập và các hoạt động hàng ngày.",
        f"'{product['title']}' là dụng cụ văn phòng không thể thiếu, giúp bạn hoàn thành công việc một cách hiệu quả và chuyên nghiệp.",
        f"Sản phẩm '{product['title']}' được sản xuất từ chất liệu bền bỉ, đảm bảo độ bền cao trong quá trình sử dụng. Lựa chọn tin cậy cho văn phòng và gia đình.",
        f"'{product['title']}' là dụng cụ học tập và làm việc chất lượng, giúp bạn ghi chép và tổ chức công việc một cách khoa học và hiệu quả.",
        f"Văn phòng phẩm '{product['title']}' với thiết kế gọn nhẹ và tiện lợi, phù hợp cho mọi nhu cầu sử dụng từ học tập đến công việc chuyên nghiệp."
    ]
    
    product['description'] = random.choice(descriptions)
    product['tags'] = ["văn phòng phẩm", "dụng cụ học tập", "bút viết", "giáo dục", "làm việc"]
    product['featured'] = random.choice([True, False])
    product['newRelease'] = random.choice([True, False])
    
    return product

def main():
    """Main scraping function"""
    print("Starting The Gioi Van Phong Pham office supplies scraping...")
    
    # Scrape office supplies
    office_products = scrape_thegioivanphongpham()
    
    print(f"\nTotal scraped: {len(office_products)} items")
    
    # Generate metadata for all products
    print("Generating metadata...")
    for i, product in enumerate(office_products):
        product = generate_office_metadata(product)
        product['id'] = i + 1
        office_products[i] = product
    
    # Save to JSON
    with open('thegioivanphongpham_office_supplies.json', 'w', encoding='utf-8') as f:
        json.dump(office_products, f, ensure_ascii=False, indent=2)
    
    print(f"Saved {len(office_products)} items to thegioivanphongpham_office_supplies.json")
    
    # Show sample products
    print("\nSample products:")
    for product in office_products[:5]:
        print(f"  {product['title']} - {product['price']:,}₫ - {product['image']}")

if __name__ == "__main__":
    main()
