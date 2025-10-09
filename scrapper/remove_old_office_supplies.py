#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re

def remove_old_office_supplies():
    """Remove old office supplies and keep only the new 15 products"""
    print("Removing old office supplies...")
    
    # Read data.js
    with open('data.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all old office supplies entries
    old_pattern = r'(\s+)(\d+):\s*\{[^}]*category:\s*"office-supplies"[^}]*\},'
    old_matches = re.findall(old_pattern, content, re.DOTALL)
    
    print(f"Found {len(old_matches)} old office supplies to remove")
    
    # Remove old entries
    new_content = content
    removal_count = 0
    
    for indent, old_id in old_matches:
        # Remove the entire entry
        old_pattern = f'{indent}{old_id}:\\s*\\{{[^}}]*category:\\s*"office-supplies"[^}}]*\\}},'
        new_content = re.sub(old_pattern, '', new_content, flags=re.DOTALL, count=1)
        removal_count += 1
        print(f"Removed old office supply {old_id}")
    
    # Clean up extra commas and formatting
    # Remove multiple consecutive commas
    new_content = re.sub(r',\s*,', ',', new_content)
    # Remove comma before closing brace
    new_content = re.sub(r',\s*}', '}', new_content)
    
    # Write back to data.js
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Successfully removed {removal_count} old office supplies!")

if __name__ == "__main__":
    remove_old_office_supplies()
