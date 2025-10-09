import re

def validate_js_syntax():
    """Validate JavaScript syntax in data.js"""
    
    print("🔍 Validating JavaScript syntax in data.js...")
    
    # Read the file
    with open('data.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    errors = []
    warnings = []
    
    # Check 1: Brace balance
    open_braces = content.count('{')
    close_braces = content.count('}')
    if open_braces != close_braces:
        errors.append(f"Brace imbalance: {open_braces} open, {close_braces} close")
    
    # Check 2: Parenthesis balance
    open_parens = content.count('(')
    close_parens = content.count(')')
    if open_parens != close_parens:
        errors.append(f"Parenthesis imbalance: {open_parens} open, {close_parens} close")
    
    # Check 3: Bracket balance
    open_brackets = content.count('[')
    close_brackets = content.count(']')
    if open_brackets != close_brackets:
        errors.append(f"Bracket imbalance: {open_brackets} open, {close_brackets} close")
    
    # Check 4: Malformed object entries
    malformed_entries = re.findall(r'(\}\s*),(\s*\d+\s*:\s*\{)', content)
    if malformed_entries:
        errors.append(f"Found {len(malformed_entries)} malformed object entries")
    
    # Check 5: Missing commas between objects
    missing_commas = re.findall(r'(\}\s*)(\d+\s*:\s*\{)', content)
    if missing_commas:
        errors.append(f"Found {len(missing_commas)} missing commas between objects")
    
    # Check 6: Malformed strings
    malformed_strings = re.findall(r'title:\s*"([^"]*)"([^"]*)"([^"]*)"', content)
    if malformed_strings:
        errors.append(f"Found {len(malformed_strings)} malformed strings")
    
    # Check 7: Check for BOOK_DATABASE structure
    if 'let BOOK_DATABASE = {' not in content:
        errors.append("Missing BOOK_DATABASE declaration")
    
    if '};' not in content:
        errors.append("Missing BOOK_DATABASE closing")
    
    # Check 8: Check for BookDatabase class
    if 'class BookDatabase' not in content:
        errors.append("Missing BookDatabase class")
    
    # Check 9: Check for proper export
    if 'module.exports' not in content and 'window.BookDatabase' not in content:
        warnings.append("No export statements found")
    
    # Check 10: Count book entries
    book_entries = re.findall(r'(\d+):\s*\{', content)
    print(f"Found {len(book_entries)} book entries")
    
    # Report results
    if errors:
        print("❌ Syntax errors found:")
        for error in errors:
            print(f"  - {error}")
        return False
    else:
        print("✅ No syntax errors found!")
        if warnings:
            print("⚠️ Warnings:")
            for warning in warnings:
                print(f"  - {warning}")
        return True

if __name__ == "__main__":
    success = validate_js_syntax()
    if success:
        print("✅ data.js syntax is valid!")
    else:
        print("❌ data.js has syntax errors!")
