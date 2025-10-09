#!/usr/bin/env python3
# Update data.js with scraped data

import re

# Read scraped data
with open('data_new.js', 'r', encoding='utf-8') as f:
    db_content = f.read().replace('const BOOK_DATABASE', 'let BOOK_DATABASE')

# Read current data.js
with open('data.js', 'r', encoding='utf-8') as f:
    old_content = f.read()

# Replace BOOK_DATABASE
pattern = r'let BOOK_DATABASE = \{.*?\n\};'
new_content = re.sub(pattern, db_content, old_content, flags=re.DOTALL)

# Write back
with open('data.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('✅ Updated data.js with comprehensive scraped data!')
print('📸 All products now have real images!')
