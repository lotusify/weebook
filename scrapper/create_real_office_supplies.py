#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import random

def create_real_office_supplies():
    """Create 40 real office supplies with proper images and descriptions"""
    print("Creating 40 real office supplies...")
    
    office_items = [
        {
            "title": "Bút bi Thiên Long 0.5mm",
            "image": "https://product.hstatic.net/1000202622/product/but_bi_thien_long_0_5mm_large.jpg",
            "price": 15000,
            "brand": "Thiên Long"
        },
        {
            "title": "Bút chì 2B Bitex",
            "image": "https://product.hstatic.net/1000202622/product/but_chi_2b_bitex_large.jpg", 
            "price": 8000,
            "brand": "Bitex"
        },
        {
            "title": "Tẩy Staedtler",
            "image": "https://product.hstatic.net/1000202622/product/tay_staedtler_large.jpg",
            "price": 12000,
            "brand": "Staedtler"
        },
        {
            "title": "Thước kẻ 30cm",
            "image": "https://product.hstatic.net/1000202622/product/thuoc_ke_30cm_large.jpg",
            "price": 10000,
            "brand": "Plus"
        },
        {
            "title": "Compa vẽ",
            "image": "https://product.hstatic.net/1000202622/product/compa_ve_large.jpg",
            "price": 25000,
            "brand": "Staedtler"
        },
        {
            "title": "Máy tính Casio fx-570VN Plus",
            "image": "https://product.hstatic.net/1000202622/product/may_tinh_casio_fx570vn_large.jpg",
            "price": 350000,
            "brand": "Casio"
        },
        {
            "title": "Bút dạ quang",
            "image": "https://product.hstatic.net/1000202622/product/but_da_quang_large.jpg",
            "price": 18000,
            "brand": "Staedtler"
        },
        {
            "title": "Bìa hồ sơ A4",
            "image": "https://product.hstatic.net/1000202622/product/bia_ho_so_a4_large.jpg",
            "price": 22000,
            "brand": "Double A"
        },
        {
            "title": "Giấy A4 Double A",
            "image": "https://product.hstatic.net/1000202622/product/giay_a4_double_a_large.jpg",
            "price": 45000,
            "brand": "Double A"
        },
        {
            "title": "Kéo văn phòng",
            "image": "https://product.hstatic.net/1000202622/product/keo_van_phong_large.jpg",
            "price": 28000,
            "brand": "Plus"
        },
        {
            "title": "Băng keo trong",
            "image": "https://product.hstatic.net/1000202622/product/bang_keo_trong_large.jpg",
            "price": 15000,
            "brand": "3M"
        },
        {
            "title": "Ghim bấm",
            "image": "https://product.hstatic.net/1000202622/product/ghim_bam_large.jpg",
            "price": 12000,
            "brand": "Plus"
        },
        {
            "title": "Kẹp giấy",
            "image": "https://product.hstatic.net/1000202622/product/kep_giay_large.jpg",
            "price": 8000,
            "brand": "Double A"
        },
        {
            "title": "Bút lông dầu",
            "image": "https://product.hstatic.net/1000202622/product/but_long_dau_large.jpg",
            "price": 20000,
            "brand": "Pentel"
        },
        {
            "title": "Bút chì màu",
            "image": "https://product.hstatic.net/1000202622/product/but_chi_mau_large.jpg",
            "price": 35000,
            "brand": "Staedtler"
        },
        {
            "title": "Tập vở học sinh",
            "image": "https://product.hstatic.net/1000202622/product/tap_vo_hoc_sinh_large.jpg",
            "price": 12000,
            "brand": "Hải Tiến"
        },
        {
            "title": "Sổ tay",
            "image": "https://product.hstatic.net/1000202622/product/so_tay_large.jpg",
            "price": 25000,
            "brand": "Double A"
        },
        {
            "title": "Bút highlight",
            "image": "https://product.hstatic.net/1000202622/product/but_highlight_large.jpg",
            "price": 18000,
            "brand": "Staedtler"
        },
        {
            "title": "Bút gel",
            "image": "https://product.hstatic.net/1000202622/product/but_gel_large.jpg",
            "price": 16000,
            "brand": "Thiên Long"
        },
        {
            "title": "Bút máy",
            "image": "https://product.hstatic.net/1000202622/product/but_may_large.jpg",
            "price": 45000,
            "brand": "Thiên Long"
        },
        {
            "title": "Bút chì màu nước",
            "image": "https://product.hstatic.net/1000202622/product/but_chi_mau_nuoc_large.jpg",
            "price": 40000,
            "brand": "Staedtler"
        },
        {
            "title": "Bút dạ",
            "image": "https://product.hstatic.net/1000202622/product/but_da_large.jpg",
            "price": 22000,
            "brand": "Pentel"
        },
        {
            "title": "Bút lông",
            "image": "https://product.hstatic.net/1000202622/product/but_long_large.jpg",
            "price": 19000,
            "brand": "Thiên Long"
        },
        {
            "title": "Bút bi nước",
            "image": "https://product.hstatic.net/1000202622/product/but_bi_nuoc_large.jpg",
            "price": 14000,
            "brand": "Thiên Long"
        },
        {
            "title": "Bút chì kim",
            "image": "https://product.hstatic.net/1000202622/product/but_chi_kim_large.jpg",
            "price": 30000,
            "brand": "Pentel"
        },
        {
            "title": "Bút dạ quang neon",
            "image": "https://product.hstatic.net/1000202622/product/but_da_quang_neon_large.jpg",
            "price": 20000,
            "brand": "Staedtler"
        },
        {
            "title": "Bút gel đen",
            "image": "https://product.hstatic.net/1000202622/product/but_gel_den_large.jpg",
            "price": 16000,
            "brand": "Thiên Long"
        },
        {
            "title": "Bút bi xanh",
            "image": "https://product.hstatic.net/1000202622/product/but_bi_xanh_large.jpg",
            "price": 15000,
            "brand": "Thiên Long"
        },
        {
            "title": "Bút chì HB",
            "image": "https://product.hstatic.net/1000202622/product/but_chi_hb_large.jpg",
            "price": 8000,
            "brand": "Staedtler"
        },
        {
            "title": "Bút dạ quang vàng",
            "image": "https://product.hstatic.net/1000202622/product/but_da_quang_vang_large.jpg",
            "price": 18000,
            "brand": "Staedtler"
        },
        {
            "title": "Bút gel xanh",
            "image": "https://product.hstatic.net/1000202622/product/but_gel_xanh_large.jpg",
            "price": 16000,
            "brand": "Thiên Long"
        },
        {
            "title": "Bút bi đỏ",
            "image": "https://product.hstatic.net/1000202622/product/but_bi_do_large.jpg",
            "price": 15000,
            "brand": "Thiên Long"
        },
        {
            "title": "Bút chì 2B",
            "image": "https://product.hstatic.net/1000202622/product/but_chi_2b_large.jpg",
            "price": 8000,
            "brand": "Staedtler"
        },
        {
            "title": "Bút dạ quang xanh",
            "image": "https://product.hstatic.net/1000202622/product/but_da_quang_xanh_large.jpg",
            "price": 18000,
            "brand": "Staedtler"
        },
        {
            "title": "Bút gel tím",
            "image": "https://product.hstatic.net/1000202622/product/but_gel_tim_large.jpg",
            "price": 16000,
            "brand": "Thiên Long"
        },
        {
            "title": "Bút bi đen",
            "image": "https://product.hstatic.net/1000202622/product/but_bi_den_large.jpg",
            "price": 15000,
            "brand": "Thiên Long"
        },
        {
            "title": "Bút chì 4B",
            "image": "https://product.hstatic.net/1000202622/product/but_chi_4b_large.jpg",
            "price": 8000,
            "brand": "Staedtler"
        },
        {
            "title": "Bút dạ quang hồng",
            "image": "https://product.hstatic.net/1000202622/product/but_da_quang_hong_large.jpg",
            "price": 18000,
            "brand": "Staedtler"
        },
        {
            "title": "Bút gel cam",
            "image": "https://product.hstatic.net/1000202622/product/but_gel_cam_large.jpg",
            "price": 16000,
            "brand": "Thiên Long"
        },
        {
            "title": "Bút bi tím",
            "image": "https://product.hstatic.net/1000202622/product/but_bi_tim_large.jpg",
            "price": 15000,
            "brand": "Thiên Long"
        }
    ]
    
    products = []
    for i, item in enumerate(office_items):
        product = {
            'id': i + 96,  # Start from 96 to avoid conflicts
            'title': item['title'],
            'author': '',  # No author for office supplies
            'publisher': item['brand'],
            'publishDate': f"202{random.randint(2, 5)}-{random.randint(1, 12):02d}-{random.randint(1, 28):02d}",
            'category': 'office-supplies',
            'subcategory': 'pens',
            'price': item['price'],
            'originalPrice': int(item['price'] * 1.2),
            'discount': 16,
            'isbn': f"978-{random.randint(100, 999)}-{random.randint(10000, 99999)}-{random.randint(1, 9)}",
            'pages': 1,
            'language': "Tiếng Việt",
            'format': "Sản phẩm",
            'weight': f"{random.randint(5, 100)}g",
            'dimensions': f"{random.randint(10, 30)} x {random.randint(5, 20)} x {random.randint(1, 5)} cm",
            'stock': random.randint(10, 100),
            'rating': round(random.uniform(3.5, 5.0), 1),
            'reviewCount': random.randint(10, 500),
            'images': [item['image']],
            'description': f"Sản phẩm văn phòng phẩm '{item['title']}' được thiết kế tiện dụng và chất lượng cao. Phù hợp cho công việc văn phòng, học tập và các hoạt động hàng ngày.",
            'tags': ["văn phòng phẩm", "dụng cụ học tập", "bút viết", "giáo dục", "làm việc"],
            'featured': random.choice([True, False]),
            'newRelease': random.choice([True, False])
        }
        products.append(product)
    
    print(f"Created {len(products)} office supplies")
    return products

def main():
    """Main function"""
    print("Creating real office supplies...")
    
    office_products = create_real_office_supplies()
    
    # Save to JSON
    with open('real_office_supplies.json', 'w', encoding='utf-8') as f:
        json.dump(office_products, f, ensure_ascii=False, indent=2)
    
    print(f"Saved {len(office_products)} items to real_office_supplies.json")
    
    # Show sample products
    print("\nSample products:")
    for product in office_products[:5]:
        print(f"  {product['title']} - {product['price']:,}₫ - {product['images'][0]}")

if __name__ == "__main__":
    main()
