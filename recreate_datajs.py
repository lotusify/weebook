import re
import json

def recreate_datajs():
    """Recreate data.js with proper syntax"""
    
    print("Recreating data.js with proper syntax...")
    
    # Read the current file
    with open('data.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract BOOK_DATABASE content
    start_marker = 'let BOOK_DATABASE = {'
    end_marker = '};'
    
    start_idx = content.find(start_marker)
    if start_idx == -1:
        print("Error: Could not find BOOK_DATABASE start marker")
        return False
    
    # Find the end of BOOK_DATABASE object by counting braces
    brace_count = 0
    end_idx = start_idx + len(start_marker)
    in_string = False
    escape_next = False
    
    for i, char in enumerate(content[start_idx + len(start_marker):], start_idx + len(start_marker)):
        if escape_next:
            escape_next = False
            continue
        
        if char == '\\':
            escape_next = True
            continue
        
        if char == '"' and not escape_next:
            in_string = not in_string
            continue
        
        if not in_string:
            if char == '{':
                brace_count += 1
            elif char == '}':
                brace_count -= 1
                if brace_count == -1:
                    end_idx = i + 1
                    break
    
    # Extract the BOOK_DATABASE content
    db_content = content[start_idx:end_idx]
    
    # Extract individual book entries
    book_pattern = r'(\d+):\s*\{([^}]*)\}'
    books = re.findall(book_pattern, db_content, re.DOTALL)
    
    print(f"Found {len(books)} book entries")
    
    # Rebuild BOOK_DATABASE with proper syntax
    new_db_lines = ['let BOOK_DATABASE = {']
    
    for i, (book_id, book_content) in enumerate(books):
        # Clean up the book content
        book_content = book_content.strip()
        
        # Add proper indentation
        lines = book_content.split('\n')
        indented_lines = []
        for line in lines:
            if line.strip():
                indented_lines.append('        ' + line.strip())
        
        # Join the lines
        formatted_content = '\n'.join(indented_lines)
        
        # Add the book entry
        new_db_lines.append(f'    {book_id}: {{')
        new_db_lines.append(formatted_content)
        new_db_lines.append('    }' + (',' if i < len(books) - 1 else ''))
    
    new_db_lines.append('};')
    
    # Extract CATEGORIES and SUBCATEGORIES
    categories_match = re.search(r'const CATEGORIES = \{[^}]+\};', content, re.DOTALL)
    subcategories_match = re.search(r'const SUBCATEGORIES = \{[^}]+\};', content, re.DOTALL)
    
    # Extract BookDatabase class
    class_match = re.search(r'class BookDatabase \{[^}]+\}', content, re.DOTALL)
    
    # Rebuild the file
    new_content_parts = [
        '// ========== BOOKSHELF DATABASE ========== //',
        '// Real data scraped from multiple sources with real images',
        '',
        '\n'.join(new_db_lines),
        '',
        '// ========== CATEGORIES ========== //',
        categories_match.group(0) if categories_match else 'const CATEGORIES = {};',
        '',
        '// ========== SUBCATEGORIES ========== //',
        subcategories_match.group(0) if subcategories_match else 'const SUBCATEGORIES = {};',
        '',
        '// ========== BOOK DATABASE CLASS ========== //',
        class_match.group(0) if class_match else 'class BookDatabase {}',
        '',
        '// Export for Node.js',
        'if (typeof module !== \'undefined\' && module.exports) {',
        '    module.exports = { BOOK_DATABASE, CATEGORIES, SUBCATEGORIES, BookDatabase };',
        '}',
        '',
        '// Make available globally',
        'if (typeof window !== \'undefined\') {',
        '    window.BOOK_DATABASE = BOOK_DATABASE;',
        '    window.CATEGORIES = CATEGORIES;',
        '    window.SUBCATEGORIES = SUBCATEGORIES;',
        '    window.BookDatabase = BookDatabase;',
        '}'
    ]
    
    new_content = '\n'.join(new_content_parts)
    
    # Write the new file
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    # Validate syntax
    open_braces = new_content.count('{')
    close_braces = new_content.count('}')
    
    print(f"New file length: {len(new_content)}")
    print(f"Brace balance: {open_braces} open, {close_braces} close")
    
    if open_braces == close_braces:
        print("✅ data.js recreated successfully with proper syntax!")
        return True
    else:
        print("❌ Syntax error still exists")
        return False

if __name__ == "__main__":
    recreate_datajs()
