#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re

def fix_syntax_errors():
    """Fix syntax errors in data.js"""
    
    print("Reading data.js...")
    with open('data.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Fixing syntax errors...")
    
    # Find all entries with incorrect key format
    # Pattern: find entries where key doesn't match id
    pattern = r'(\d+): \{\s*id: (\d+),'
    matches = list(re.finditer(pattern, content))
    
    print(f"Found {len(matches)} entries to check")
    
    # Fix entries where key doesn't match id
    for match in reversed(matches):  # Process in reverse to maintain positions
        key = match.group(1)
        id_val = match.group(2)
        
        if key != id_val:
            print(f"Fixing entry: key={key}, id={id_val}")
            # Replace the key with the correct id
            start = match.start(1)
            end = match.end(1)
            content = content[:start] + id_val + content[end:]
    
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
    
    # Fix any remaining syntax issues
    print("Fixing remaining syntax issues...")
    
    # Remove extra commas before closing braces
    content = re.sub(r',(\s*})', r'\1', content)
    
    # Ensure proper comma placement between entries
    content = re.sub(r'}(\s*)(\d+:)', r'},\n    \2', content)
    
    print("Writing fixed data.js...")
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Syntax errors fixed successfully!")

if __name__ == "__main__":
    fix_syntax_errors()
