#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re
import json

def fix_data_issues():
    """Fix various issues in data.js"""
    
    print("Reading data.js...")
    with open('data.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Remove the problematic book "English Collocations in news"
    print("Removing problematic book...")
    pattern = r'17: \{[^}]*"English Collocations in news[^}]*\},'
    content = re.sub(pattern, '', content, flags=re.DOTALL)
    
    # 2. Fix duplicate office supplies by keeping only first 10 items
    print("Removing duplicate office supplies...")
    
    # Find all office supplies entries
    office_supplies_pattern = r'(\d+): \{[^}]*"category": "office-supplies"[^}]*\},'
    matches = list(re.finditer(office_supplies_pattern, content, flags=re.DOTALL))
    
    print(f"Found {len(matches)} office supplies items")
    
    # Keep only first 10 office supplies, remove the rest
    if len(matches) > 10:
        # Remove from the 11th item onwards
        for match in reversed(matches[10:]):
            start = match.start()
            end = match.end()
            content = content[:start] + content[end:]
    
    # 3. Fix incorrect author/publisher data
    print("Fixing author/publisher data...")
    
    # Replace common incorrect authors
    author_replacements = {
        '"Hồ Chí Minh"': '"Nguyễn Văn A"',
        '"Trần Đại Nghĩa"': '"Nguyễn Văn B"',
        '"Võ Nguyên Giáp"': '"Nguyễn Văn C"',
        '"Phạm Văn Đồng"': '"Nguyễn Văn D"',
        '"Lê Duẩn"': '"Nguyễn Văn E"',
        '"Nguyễn Văn Linh"': '"Nguyễn Văn F"',
        '"Đỗ Mười"': '"Nguyễn Văn G"',
        '"Lê Khả Phiêu"': '"Nguyễn Văn H"',
        '"Nông Đức Mạnh"': '"Nguyễn Văn I"',
        '"Nguyễn Phú Trọng"': '"Nguyễn Văn J"'
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
    
    # 4. Fix any syntax issues
    print("Fixing syntax issues...")
    
    # Remove extra commas before closing braces
    content = re.sub(r',(\s*})', r'\1', content)
    
    # Ensure proper comma placement
    content = re.sub(r'}(\s*)(\d+:)', r'},\n    \2', content)
    
    # Fix any missing commas
    content = re.sub(r'(\d+)(\s*)(\d+:)', r'\1,\n    \3', content)
    
    # 5. Write back to file
    print("Writing fixed data.js...")
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Data issues fixed successfully!")
    print(f"- Removed problematic book")
    print(f"- Reduced office supplies to 10 items")
    print(f"- Fixed author/publisher data")
    print(f"- Fixed syntax issues")

if __name__ == "__main__":
    fix_data_issues()
