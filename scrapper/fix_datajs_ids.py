#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script để sắp xếp lại ID trong data.js theo thứ tự tăng dần
"""

import re
import json

def fix_datajs_ids():
    """Sắp xếp lại ID trong data.js theo thứ tự tăng dần"""
    
    # Đọc file data.js
    with open('../data.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("📖 Đã đọc file data.js")
    
    # Tìm tất cả các entry trong BOOK_DATABASE
    pattern = r'(\s+)(\d+):\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}'
    matches = re.findall(pattern, content, re.DOTALL)
    
    print(f"🔍 Tìm thấy {len(matches)} sản phẩm")
    
    # Sắp xếp theo ID hiện tại
    matches.sort(key=lambda x: int(x[1]))
    
    # Tạo mapping từ ID cũ sang ID mới
    id_mapping = {}
    new_content_parts = []
    
    # Thêm phần đầu file (trước BOOK_DATABASE)
    start_pattern = r'const BOOK_DATABASE = \{\s*'
    start_match = re.search(start_pattern, content)
    if start_match:
        new_content_parts.append(content[:start_match.end()])
    
    # Tạo lại BOOK_DATABASE với ID mới
    for i, (indent, old_id, product_data) in enumerate(matches, 1):
        new_id = i
        id_mapping[old_id] = new_id
        
        # Cập nhật id trong product_data
        updated_product_data = re.sub(
            r'id:\s*\d+,',
            f'id: {new_id},',
            product_data
        )
        
        # Thêm entry mới
        new_content_parts.append(f'{indent}{new_id}: {{{updated_product_data}}}')
        
        if i < len(matches):
            new_content_parts.append(',')
        new_content_parts.append('\n')
    
    # Thêm phần cuối file (sau BOOK_DATABASE)
    end_pattern = r'\s*\};\s*$'
    end_match = re.search(end_pattern, content, re.MULTILINE)
    if end_match:
        new_content_parts.append(content[end_match.start():])
    
    # Ghép lại thành file mới
    new_content = ''.join(new_content_parts)
    
    # Backup file cũ
    with open('../data.js.backup', 'w', encoding='utf-8') as f:
        f.write(content)
    print("💾 Đã backup file cũ thành data.js.backup")
    
    # Ghi file mới
    with open('../data.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ Đã sắp xếp lại {len(matches)} sản phẩm với ID từ 1 đến {len(matches)}")
    
    # Hiển thị mapping
    print("\n📋 ID Mapping (cũ -> mới):")
    for old_id, new_id in sorted(id_mapping.items(), key=lambda x: int(x[0])):
        print(f"  {old_id} -> {new_id}")
    
    return len(matches)

if __name__ == "__main__":
    try:
        count = fix_datajs_ids()
        print(f"\n🎉 Hoàn thành! Đã sắp xếp {count} sản phẩm.")
        print("📁 File đã được cập nhật: data.js")
        print("💾 Backup: data.js.backup")
    except Exception as e:
        print(f"❌ Lỗi: {e}")
        import traceback
        traceback.print_exc()
