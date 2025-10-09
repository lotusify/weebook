#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from bs4 import BeautifulSoup
import json
import random

def extract_products_from_html():
    """Extract products from saved HTML file"""
    print("Extracting products from HTML file...")
    
    try:
        # Read the saved HTML file
        with open('thegioivanphongpham_full.html', 'r', encoding='utf-8') as f:
            content = f.read()
        
        soup = BeautifulSoup(content, 'html.parser')
        
        # Extract product links
        links = soup.find_all('a', href=True)
        product_links = [link for link in links if '/products/' in link.get('href', '')]
        
        print(f"Found {len(product_links)} product links")
        
        products = []
        seen_titles = set()
        
        for link in product_links[:45]:  # Limit to 45 products
            try:
                # Get title from link text
                title = link.get_text(strip=True)
                if not title or len(title) < 3:
                    continue
                
                # Skip duplicates
                if title in seen_titles:
                    continue
                seen_titles.add(title)
                
                # Get image from img tag inside link
                img = link.find('img')
                image_url = ''
                if img:
                    src = img.get('src', '')
                    if src:
                        if src.startswith('//'):
                            image_url = 'https:' + src
                        elif src.startswith('/'):
                            image_url = 'https://thegioivanphongpham.com.vn' + src
                        else:
                            image_url = src
                
                # Get href
                href = link.get('href', '')
                if href.startswith('/'):
                    href = 'https://thegioivanphongpham.com.vn' + href
                
                # Generate random price
                price = random.randint(10000, 500000)
                
                products.append({
                    'title': title,
                    'price': price,
                    'originalPrice': int(price * 1.2),
                    'category': 'office-supplies',
                    'subcategory': 'pens',
                    'image': image_url,
                    'url': href,
                    'brand': 'The Gioi Van Phong Pham',
                    'author': ''
                })
                
            except Exception as e:
                print(f"Error processing link: {e}")
                continue
        
        print(f"Extracted {len(products)} unique products")
        return products
        
    except Exception as e:
        print(f"Error reading HTML file: {e}")
        return []

def generate_office_metadata(product):
    """Generate metadata for office supplies"""
    product['publisher'] = "The Gioi Van Phong Pham"
    product['publishDate'] = f"202{random.randint(2, 5)}-{random.randint(1, 12):02d}-{random.randint(1, 28):02d}"
    product['isbn'] = f"978-{random.randint(100, 999)}-{random.randint(10000, 99999)}-{random.randint(1, 9)}"
    product['pages'] = 1
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
    """Main function"""
    print("Starting extraction from HTML...")
    
    # Extract products from HTML
    office_products = extract_products_from_html()
    
    if not office_products:
        print("No products extracted!")
        return
    
    print(f"\nTotal extracted: {len(office_products)} items")
    
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
