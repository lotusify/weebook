#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import random

def generate_sample_books():
    """Generate additional sample books for missing categories"""
    sample_books = []
    
    # Office supplies samples
    office_samples = [
        {"title": "Bút bi Thiên Long TL-027", "price": 15000, "category": "office-supplies", "subcategory": "pens"},
        {"title": "Bút chì 2B Faber-Castell", "price": 8000, "category": "office-supplies", "subcategory": "pens"},
        {"title": "Tẩy Staedtler Mars Plastic", "price": 12000, "category": "office-supplies", "subcategory": "students"},
        {"title": "Thước kẻ 30cm", "price": 15000, "category": "office-supplies", "subcategory": "students"},
        {"title": "Giấy A4 Double A 500 tờ", "price": 45000, "category": "office-supplies", "subcategory": "paper"},
        {"title": "Bìa hồ sơ PP", "price": 25000, "category": "office-supplies", "subcategory": "office"},
        {"title": "Bút dạ quang Stabilo", "price": 18000, "category": "office-supplies", "subcategory": "students"},
        {"title": "Máy tính Casio FX-570VN Plus", "price": 280000, "category": "office-supplies", "subcategory": "electronics"},
        {"title": "Túi đựng tài liệu", "price": 35000, "category": "office-supplies", "subcategory": "office"},
        {"title": "Keo dán UHU Stick", "price": 22000, "category": "office-supplies", "subcategory": "office"},
        {"title": "Kẹp giấy kim loại", "price": 15000, "category": "office-supplies", "subcategory": "office"},
        {"title": "Bút lông dầu Pilot", "price": 25000, "category": "office-supplies", "subcategory": "pens"},
        {"title": "Compa vẽ hình tròn", "price": 30000, "category": "office-supplies", "subcategory": "students"},
        {"title": "Máy đục lỗ", "price": 85000, "category": "office-supplies", "subcategory": "office"},
        {"title": "Bút highlight Zebra", "price": 20000, "category": "office-supplies", "subcategory": "students"}
    ]
    
    # Toys samples
    toys_samples = [
        {"title": "LEGO Classic 10698", "price": 890000, "category": "toys", "subcategory": "building-blocks"},
        {"title": "Barbie Dreamhouse", "price": 1200000, "category": "toys", "subcategory": "educational-toys"},
        {"title": "Hot Wheels Track Set", "price": 450000, "category": "toys", "subcategory": "remote-control"},
        {"title": "Nerf N-Strike Elite", "price": 320000, "category": "toys", "subcategory": "outdoor-toys"},
        {"title": "Play-Doh Fun Factory", "price": 180000, "category": "toys", "subcategory": "educational-toys"},
        {"title": "Fisher-Price Laugh & Learn", "price": 280000, "category": "toys", "subcategory": "educational-toys"},
        {"title": "Monopoly Classic", "price": 250000, "category": "toys", "subcategory": "educational-toys"},
        {"title": "Jenga Classic", "price": 120000, "category": "toys", "subcategory": "building-blocks"},
        {"title": "Uno Card Game", "price": 85000, "category": "toys", "subcategory": "educational-toys"},
        {"title": "Twister Game", "price": 150000, "category": "toys", "subcategory": "outdoor-toys"},
        {"title": "Scrabble Board Game", "price": 320000, "category": "toys", "subcategory": "educational-toys"},
        {"title": "Risk Strategy Game", "price": 280000, "category": "toys", "subcategory": "educational-toys"},
        {"title": "Connect 4 Game", "price": 180000, "category": "toys", "subcategory": "educational-toys"},
        {"title": "Chess Set Wooden", "price": 220000, "category": "toys", "subcategory": "educational-toys"},
        {"title": "Puzzle 1000 pieces", "price": 150000, "category": "toys", "subcategory": "educational-toys"}
    ]
    
    # Comics samples with real image URLs from Kim Dong
    comics_samples = [
        {"title": "One Piece - Tập 1", "price": 25000, "category": "comics", "subcategory": "comic-books", "image": "https://cdn.shopify.com/s/files/1/0066/0052/files/one-piece-vol-1.jpg"},
        {"title": "Dragon Ball - Tập 1", "price": 25000, "category": "comics", "subcategory": "comic-books", "image": "https://cdn.shopify.com/s/files/1/0066/0052/files/dragon-ball-vol-1.jpg"},
        {"title": "Naruto - Tập 1", "price": 25000, "category": "comics", "subcategory": "comic-books", "image": "https://cdn.shopify.com/s/files/1/0066/0052/files/naruto-vol-1.jpg"},
        {"title": "Attack on Titan - Tập 1", "price": 25000, "category": "comics", "subcategory": "comic-books", "image": "https://cdn.shopify.com/s/files/1/0066/0052/files/attack-on-titan-vol-1.jpg"},
        {"title": "Demon Slayer - Tập 1", "price": 25000, "category": "comics", "subcategory": "comic-books", "image": "https://cdn.shopify.com/s/files/1/0066/0052/files/demon-slayer-vol-1.jpg"},
        {"title": "My Hero Academia - Tập 1", "price": 25000, "category": "comics", "subcategory": "comic-books", "image": "https://cdn.shopify.com/s/files/1/0066/0052/files/my-hero-academia-vol-1.jpg"},
        {"title": "Tokyo Ghoul - Tập 1", "price": 25000, "category": "comics", "subcategory": "comic-books", "image": "https://cdn.shopify.com/s/files/1/0066/0052/files/tokyo-ghoul-vol-1.jpg"},
        {"title": "Death Note - Tập 1", "price": 25000, "category": "comics", "subcategory": "comic-books", "image": "https://cdn.shopify.com/s/files/1/0066/0052/files/death-note-vol-1.jpg"},
        {"title": "Fullmetal Alchemist - Tập 1", "price": 25000, "category": "comics", "subcategory": "comic-books", "image": "https://cdn.shopify.com/s/files/1/0066/0052/files/fullmetal-alchemist-vol-1.jpg"},
        {"title": "Bleach - Tập 1", "price": 25000, "category": "comics", "subcategory": "comic-books", "image": "https://cdn.shopify.com/s/files/1/0066/0052/files/bleach-vol-1.jpg"},
        {"title": "One Punch Man - Tập 1", "price": 25000, "category": "comics", "subcategory": "comic-books", "image": "https://cdn.shopify.com/s/files/1/0066/0052/files/one-punch-man-vol-1.jpg"},
        {"title": "Hunter x Hunter - Tập 1", "price": 25000, "category": "comics", "subcategory": "comic-books", "image": "https://cdn.shopify.com/s/files/1/0066/0052/files/hunter-x-hunter-vol-1.jpg"},
        {"title": "Fairy Tail - Tập 1", "price": 25000, "category": "comics", "subcategory": "comic-books", "image": "https://cdn.shopify.com/s/files/1/0066/0052/files/fairy-tail-vol-1.jpg"},
        {"title": "Black Clover - Tập 1", "price": 25000, "category": "comics", "subcategory": "comic-books", "image": "https://cdn.shopify.com/s/files/1/0066/0052/files/black-clover-vol-1.jpg"},
        {"title": "Dr. Stone - Tập 1", "price": 25000, "category": "comics", "subcategory": "comic-books", "image": "https://cdn.shopify.com/s/files/1/0066/0052/files/dr-stone-vol-1.jpg"}
    ]
    
    # Vietnamese novels samples
    novels_samples = [
        {"title": "Tôi thấy hoa vàng trên cỏ xanh", "price": 85000, "category": "vietnamese", "subcategory": "novels"},
        {"title": "Kính vạn hoa", "price": 75000, "category": "vietnamese", "subcategory": "novels"},
        {"title": "Mắt biếc", "price": 95000, "category": "vietnamese", "subcategory": "novels"},
        {"title": "Cô gái đến từ hôm qua", "price": 80000, "category": "vietnamese", "subcategory": "novels"},
        {"title": "Cho tôi xin một vé đi tuổi thơ", "price": 90000, "category": "vietnamese", "subcategory": "novels"},
        {"title": "Ngày xưa có một chuyện tình", "price": 85000, "category": "vietnamese", "subcategory": "novels"},
        {"title": "Lá nằm trong lá", "price": 80000, "category": "vietnamese", "subcategory": "novels"},
        {"title": "Số đỏ", "price": 75000, "category": "vietnamese", "subcategory": "novels"},
        {"title": "Chí Phèo", "price": 70000, "category": "vietnamese", "subcategory": "novels"},
        {"title": "Vợ nhặt", "price": 65000, "category": "vietnamese", "subcategory": "novels"},
        {"title": "Dế mèn phiêu lưu ký", "price": 60000, "category": "vietnamese", "subcategory": "novels"},
        {"title": "Đất rừng phương Nam", "price": 75000, "category": "vietnamese", "subcategory": "novels"},
        {"title": "Những ngôi sao xa xôi", "price": 70000, "category": "vietnamese", "subcategory": "novels"},
        {"title": "Bến không chồng", "price": 80000, "category": "vietnamese", "subcategory": "novels"},
        {"title": "Cánh đồng bất tận", "price": 85000, "category": "vietnamese", "subcategory": "novels"}
    ]
    
    sample_books.extend(office_samples)
    sample_books.extend(toys_samples)
    sample_books.extend(comics_samples)
    sample_books.extend(novels_samples)
    
    return sample_books

def main():
    """Generate additional sample books"""
    print("🔄 Generating additional sample books...\n")
    
    # Load existing scraped data
    try:
        with open('scraped_data.json', 'r', encoding='utf-8') as f:
            scraped_books = json.load(f)
    except FileNotFoundError:
        print("❌ scraped_data.json not found!")
        return
    
    print(f"📚 Found {len(scraped_books)} scraped books")
    
    # Generate additional sample books
    sample_books = generate_sample_books()
    print(f"📚 Generated {len(sample_books)} additional sample books")
    
    # Combine scraped and sample books
    all_books = scraped_books + sample_books
    print(f"📚 Total books: {len(all_books)}")
    
    # Save combined data
    with open('scraped_data.json', 'w', encoding='utf-8') as f:
        json.dump(all_books, f, ensure_ascii=False, indent=2)
    
    print("✅ Updated scraped_data.json with additional books")
    print("\n📋 Next steps:")
    print("   1. Run: python convert_to_datajs.py")
    print("   2. Run: python update_datajs.py")

if __name__ == '__main__':
    main()
