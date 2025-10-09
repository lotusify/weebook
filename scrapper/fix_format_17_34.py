#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re

def fix_format_17_34():
    """Fix format from book 17 to 34 to match the rest of the database"""
    
    # Read the file
    with open('data.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to match books 17-34 with wrong indentation
    # Look for lines like "        17: {" and fix them to "    17: {"
    pattern = r'(\s*)(\d+): \{\s*\n(\s+)id: (\d+),'
    
    def replace_format(match):
        indent = match.group(1)
        book_num = int(match.group(2))
        id_num = match.group(4)
        
        if 17 <= book_num <= 34:
            # Fix the format for books 17-34 to match the standard format
            return f'    {book_num}: {{\n        id: {id_num},'
        else:
            # Keep original format for other books
            return match.group(0)
    
    # Apply the replacement
    content = re.sub(pattern, replace_format, content)
    
    # Fix the remaining indentation issues within each book object (17-34)
    # Pattern to match lines with extra indentation in books 17-34
    lines = content.split('\n')
    fixed_lines = []
    in_book_17_34 = False
    current_book_num = 0
    
    for line in lines:
        # Check if we're entering a book 17-34
        book_match = re.match(r'(\s*)(\d+): \{', line)
        if book_match:
            current_book_num = int(book_match.group(2))
            in_book_17_34 = 17 <= current_book_num <= 34
            if in_book_17_34:
                # Fix the opening line
                fixed_lines.append(f'    {current_book_num}: {{')
            else:
                fixed_lines.append(line)
            continue
        
        # Check if we're exiting a book object
        if line.strip() == '},' or line.strip() == '}':
            if in_book_17_34:
                # Fix the closing line
                if line.strip() == '},':
                    fixed_lines.append('    },')
                else:
                    fixed_lines.append('    }')
            else:
                fixed_lines.append(line)
            in_book_17_34 = False
            current_book_num = 0
            continue
        
        # Fix indentation for content within books 17-34
        if in_book_17_34:
            # Remove extra indentation and apply standard 8-space indentation
            stripped = line.strip()
            if stripped and not stripped.startswith('//'):
                # Apply standard indentation
                fixed_lines.append('        ' + stripped)
            else:
                fixed_lines.append(line)
        else:
            fixed_lines.append(line)
    
    content = '\n'.join(fixed_lines)
    
    # Write back to file
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Fixed format for books 17-34 to match the rest of the database")
    print("📁 Backup saved as data.js.bak")

if __name__ == "__main__":
    fix_format_17_34()