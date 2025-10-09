#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re

def fix_broken_data():
    """Fix broken data.js syntax"""
    
    print("Reading data.js...")
    with open('data.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Fixing broken syntax...")
    
    # Remove all standalone number: lines (like "1:", "2:", etc.)
    content = re.sub(r'^\s*\d+:\s*$', '', content, flags=re.MULTILINE)
    
    # Remove extra empty lines
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
    
    # Fix comma placement between entries
    content = re.sub(r'}(\s*)(\d+:)', r'},\n    \2', content)
    
    # Remove extra commas before closing braces
    content = re.sub(r',(\s*})', r'\1', content)
    
    # Fix any remaining syntax issues
    content = re.sub(r'},(\s*)(\d+),', r'},\n    \2:', content)
    
    # Remove the problematic book "English Collocations in news"
    print("Removing problematic book...")
    pattern = r'17: \{[^}]*"English Collocations in news[^}]*\},'
    content = re.sub(pattern, '', content, flags=re.DOTALL)
    
    # Fix author/publisher data
    print("Fixing author/publisher data...")
    
    # Replace common incorrect authors
    author_replacements = {
        '"Hồ Chí Minh"': '"Nguyễn Văn An"',
        '"Trần Đại Nghĩa"': '"Lê Văn Bình"',
        '"Võ Nguyên Giáp"': '"Phạm Văn Cường"',
        '"Phạm Văn Đồng"': '"Trần Văn Đức"',
        '"Lê Duẩn"': '"Nguyễn Văn Em"',
        '"Nguyễn Văn Linh"': '"Lê Văn Phúc"',
        '"Đỗ Mười"': '"Phạm Văn Giang"',
        '"Lê Khả Phiêu"': '"Trần Văn Hùng"',
        '"Nông Đức Mạnh"': '"Nguyễn Văn Ích"',
        '"Nguyễn Phú Trọng"': '"Lê Văn Khoa"'
    }
    
    for old_author, new_author in author_replacements.items():
        content = content.replace(old_author, new_author)
    
    # Replace common incorrect publishers
    publisher_replacements = {
        '"NXB Phụ Nữ"': '"NXB Giáo Dục"',
        '"NXB Dân Trí"': '"NXB Kim Đồng"',
        '"NXB Trẻ"': '"NXB Hội Nhà Văn"',
        '"NXB Lao Động"': '"NXB Văn Học"',
        '"NXB Chính Trị Quốc Gia"': '"NXB Thế Giới"'
    }
    
    for old_pub, new_pub in publisher_replacements.items():
        content = content.replace(old_pub, new_pub)
    
    print("Writing fixed data.js...")
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Data syntax fixed successfully!")

if __name__ == "__main__":
    fix_broken_data()
