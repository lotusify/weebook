import re

def fix_datajs_syntax():
    """Fix syntax errors in data.js"""
    
    # Read the file
    with open('data.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Original file length:", len(content))
    
    # Fix common syntax errors
    fixes_applied = []
    
    # Fix 1: Remove extra commas after closing braces
    pattern1 = r'(\}\s*,\s*)(\d+\s*:\s*\{)'
    matches1 = re.findall(pattern1, content)
    if matches1:
        content = re.sub(pattern1, r'\2', content)
        fixes_applied.append(f"Fixed {len(matches1)} extra commas after closing braces")
    
    # Fix 2: Fix malformed object entries
    pattern2 = r'(\d+)\s*:\s*\{([^}]*)\}\s*,\s*(\d+)\s*:\s*\{'
    matches2 = re.findall(pattern2, content)
    if matches2:
        content = re.sub(pattern2, r'\1: {\2},\n    \3: {', content)
        fixes_applied.append(f"Fixed {len(matches2)} malformed object entries")
    
    # Fix 3: Fix missing commas between object properties
    pattern3 = r'(\w+)\s*:\s*([^,\n}]+)\s*(\n\s*\w+\s*:)'
    matches3 = re.findall(pattern3, content)
    if matches3:
        content = re.sub(pattern3, r'\1: \2,\n\3', content)
        fixes_applied.append(f"Fixed {len(matches3)} missing commas")
    
    # Fix 4: Fix typeof issues
    content = content.replace('typeof module', 'typeof module')
    
    # Fix 5: Fix malformed strings in arrays
    pattern5 = r'\[([^\]]*)"([^"]*)"([^\]]*)\]'
    def fix_array_strings(match):
        array_content = match.group(1) + '"' + match.group(2) + '"' + match.group(3)
        return '[' + array_content + ']'
    
    content = re.sub(pattern5, fix_array_strings, content)
    
    # Fix 6: Ensure proper object structure
    # Fix missing commas between objects
    pattern6 = r'(\}\s*)(\d+\s*:\s*\{)'
    content = re.sub(pattern6, r'\1,\n    \2', content)
    
    # Fix 7: Fix malformed property assignments
    pattern7 = r'(\w+)\s*:\s*([^,\n}]+)\s*(\n\s*[a-zA-Z_]\w*\s*:)'
    content = re.sub(pattern7, r'\1: \2,\n\3', content)
    
    # Fix 8: Ensure proper closing of BOOK_DATABASE
    if 'BOOK_DATABASE = {' in content:
        # Find the end of BOOK_DATABASE object
        start_idx = content.find('BOOK_DATABASE = {')
        brace_count = 0
        end_idx = start_idx + len('BOOK_DATABASE = {')
        
        for i, char in enumerate(content[start_idx + len('BOOK_DATABASE = {'):], start_idx + len('BOOK_DATABASE = {')):
            if char == '{':
                brace_count += 1
            elif char == '}':
                brace_count -= 1
                if brace_count == -1:
                    end_idx = i + 1
                    break
        
        # Ensure proper closing
        if end_idx < len(content) and content[end_idx:end_idx+2] != '};':
            content = content[:end_idx] + '};' + content[end_idx:]
            fixes_applied.append("Fixed BOOK_DATABASE closing")
    
    # Fix 9: Remove duplicate closing braces
    content = re.sub(r'\}\s*\}\s*;', '};', content)
    
    # Fix 10: Fix malformed export statements
    if 'module.exports' in content:
        export_pattern = r'module\.exports\s*=\s*\{([^}]+)\}\s*;'
        if not re.search(export_pattern, content):
            content = re.sub(r'module\.exports\s*=\s*([^;]+);', r'module.exports = {\1};', content)
            fixes_applied.append("Fixed module.exports")
    
    # Validate syntax by checking brace balance
    open_braces = content.count('{')
    close_braces = content.count('}')
    
    print(f"Brace balance: {open_braces} open, {close_braces} close")
    
    if open_braces != close_braces:
        print("Warning: Brace imbalance detected!")
        fixes_applied.append("Warning: Brace imbalance")
    
    # Write the fixed content
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Fixed file length:", len(content))
    print("Fixes applied:")
    for fix in fixes_applied:
        print(f"  - {fix}")
    
    return len(fixes_applied) > 0

if __name__ == "__main__":
    print("Fixing data.js syntax errors...")
    success = fix_datajs_syntax()
    if success:
        print("✅ Syntax fixes applied successfully!")
    else:
        print("ℹ️ No syntax fixes needed.")
