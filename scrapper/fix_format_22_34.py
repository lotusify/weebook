#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re

def fix_format_22_34():
    """Fix format from book 22 to 34"""
    
    # Read the file
    with open('data.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix indentation issues for books 22-34
    lines = content.split('\n')
    fixed_lines = []
    in_book_22_34 = False
    current_book_num = 0
    
    for line in lines:
        # Check if we're entering a book 22-34
        book_match = re.match(r'(\s*)(\d+): \{', line)
        if book_match:
            current_book_num = int(book_match.group(2))
            in_book_22_34 = 22 <= current_book_num <= 34
            if in_book_22_34:
                # Fix the opening line
                fixed_lines.append(f'    {current_book_num}: {{')
            else:
                fixed_lines.append(line)
            continue
        
        # Check if we're exiting a book object
        if line.strip() == '},' or line.strip() == '}':
            if in_book_22_34:
                # Fix the closing line
                if line.strip() == '},':
                    fixed_lines.append('    },')
                else:
                    fixed_lines.append('    }')
            else:
                fixed_lines.append(line)
            in_book_22_34 = False
            current_book_num = 0
            continue
        
        # Fix indentation for content within books 22-34
        if in_book_22_34:
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
    
    # Fix description quotes to backticks for books 22-34
    # Pattern to match description with quotes
    pattern = r'(\s+description: )"([^"]*)"'
    
    def replace_description(match):
        indent = match.group(1)
        desc_content = match.group(2)
        return f'{indent}`{desc_content}`'
    
    # Apply description fix
    content = re.sub(pattern, replace_description, content)
    
    # Write back to file
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Fixed format for books 22-34")
    print("📁 Backup saved as data.js.bak")

if __name__ == "__main__":
    fix_format_22_34()
