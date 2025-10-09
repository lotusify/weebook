#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re

def remove_office_supplies():
    """Remove excess office supplies starting from ID 72"""
    
    print("Reading data.js...")
    with open('data.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Remove the problematic book "English Collocations in news"
    print("Removing problematic book...")
    pattern = r'17: \{[^}]*"English Collocations in news[^}]*\},'
    content = re.sub(pattern, '', content, flags=re.DOTALL)
    
    # 2. Find all entries with ID >= 72 (office supplies)
    print("Finding office supplies entries (ID >= 72)...")
    
    # Pattern to match entries with ID >= 72
    office_pattern = r'(\d+): \{[^}]*"id": (7[2-9]|[8-9]\d|\d{3,})[^}]*\},'
    matches = list(re.finditer(office_pattern, content, flags=re.DOTALL))
    
    print(f"Found {len(matches)} entries with ID >= 72")
    
    # 3. Keep only first 40 office supplies (IDs 72-111)
    if len(matches) > 40:
        print(f"Reducing to 40 items (removing {len(matches) - 40} items)...")
        
        # Sort matches by position to remove from the end
        matches.sort(key=lambda x: x.start())
        
        # Remove from the 41st item onwards
        for match in reversed(matches[40:]):
            start = match.start()
            end = match.end()
            content = content[:start] + content[end:]
    
    # 4. Fix author/publisher data
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
    
    # 5. Fix syntax issues
    print("Fixing syntax issues...")
    
    # Remove extra commas before closing braces
    content = re.sub(r',(\s*})', r'\1', content)
    
    # Fix the specific syntax error we saw
    content = re.sub(r'},(\s*)(\d+),', r'},\n    \2:', content)
    
    # Ensure proper comma placement between entries
    content = re.sub(r'}(\s*)(\d+:)', r'},\n    \2', content)
    
    # 6. Write back to file
    print("Writing fixed data.js...")
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Data issues fixed successfully!")
    print(f"- Removed problematic book")
    print(f"- Reduced office supplies to 40 items")
    print(f"- Fixed author/publisher data")
    print(f"- Fixed syntax issues")

if __name__ == "__main__":
    remove_office_supplies()
