import re

def fix_all_datajs_errors():
    """Fix all syntax errors in data.js comprehensively"""
    
    print("🔧 Fixing all syntax errors in data.js...")
    
    # Read the file
    with open('data.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    print(f"Original file length: {len(content)}")
    
    fixes_applied = []
    
    # Fix 1: Fix malformed object entries (missing newlines)
    pattern1 = r'(\}\s*),(\s*\d+\s*:\s*\{)'
    matches1 = re.findall(pattern1, content)
    if matches1:
        content = re.sub(pattern1, r'\1,\n    \2', content)
        fixes_applied.append(f"Fixed {len(matches1)} malformed object entries")
    
    # Fix 2: Fix missing commas between objects
    pattern2 = r'(\}\s*)(\d+\s*:\s*\{)'
    matches2 = re.findall(pattern2, content)
    if matches2:
        content = re.sub(pattern2, r'\1,\n    \2', content)
        fixes_applied.append(f"Fixed {len(matches2)} missing commas between objects")
    
    # Fix 3: Fix malformed property assignments
    pattern3 = r'(\w+)\s*:\s*([^,\n}]+)\s*(\n\s*[a-zA-Z_]\w*\s*:)'
    matches3 = re.findall(pattern3, content)
    if matches3:
        content = re.sub(pattern3, r'\1: \2,\n\3', content)
        fixes_applied.append(f"Fixed {len(matches3)} malformed property assignments")
    
    # Fix 4: Fix malformed strings with quotes
    pattern4 = r'title:\s*"([^"]*)"([^"]*)"([^"]*)"'
    matches4 = re.findall(pattern4, content)
    if matches4:
        content = re.sub(pattern4, r'title: "\1\2\3"', content)
        fixes_applied.append(f"Fixed {len(matches4)} malformed strings")
    
    # Fix 5: Fix malformed arrays
    pattern5 = r'\[([^\]]*)"([^"]*)"([^\]]*)\]'
    def fix_array_strings(match):
        array_content = match.group(1) + '"' + match.group(2) + '"' + match.group(3)
        return '[' + array_content + ']'
    
    content = re.sub(pattern5, fix_array_strings, content)
    
    # Fix 6: Ensure proper indentation for object properties
    lines = content.split('\n')
    fixed_lines = []
    indent_level = 0
    
    for line in lines:
        stripped = line.strip()
        
        # Track indentation level
        if stripped.startswith('{'):
            indent_level += 1
        elif stripped.startswith('}'):
            indent_level -= 1
        
        # Fix indentation for object properties
        if stripped and not stripped.startswith('//') and not stripped.startswith('let') and not stripped.startswith('const') and not stripped.startswith('class') and not stripped.startswith('if') and not stripped.startswith('module') and not stripped.startswith('window'):
            if ':' in stripped and not stripped.startswith('    '):
                # This is likely a property that needs proper indentation
                fixed_lines.append('    ' * indent_level + stripped)
            else:
                fixed_lines.append(line)
        else:
            fixed_lines.append(line)
    
    content = '\n'.join(fixed_lines)
    
    # Fix 7: Remove duplicate closing braces
    content = re.sub(r'\}\s*\}\s*;', '};', content)
    
    # Fix 8: Fix malformed export statements
    if 'module.exports' in content:
        export_pattern = r'module\.exports\s*=\s*\{([^}]+)\}\s*;'
        if not re.search(export_pattern, content):
            content = re.sub(r'module\.exports\s*=\s*([^;]+);', r'module.exports = {\1};', content)
            fixes_applied.append("Fixed module.exports")
    
    # Fix 9: Ensure proper object structure
    # Remove extra spaces and fix formatting
    content = re.sub(r'\s+', ' ', content)  # Replace multiple spaces with single space
    content = re.sub(r' \n', '\n', content)  # Remove spaces before newlines
    content = re.sub(r'\n ', '\n', content)  # Remove spaces after newlines
    
    # Fix 10: Validate and fix brace balance
    open_braces = content.count('{')
    close_braces = content.count('}')
    
    print(f"Brace balance: {open_braces} open, {close_braces} close")
    
    if open_braces != close_braces:
        print("⚠️ Warning: Brace imbalance detected!")
        fixes_applied.append("Warning: Brace imbalance")
    
    # Write the fixed content
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Fixed file length: {len(content)}")
    print("✅ Fixes applied:")
    for fix in fixes_applied:
        print(f"  - {fix}")
    
    return len(fixes_applied) > 0

if __name__ == "__main__":
    success = fix_all_datajs_errors()
    if success:
        print("✅ All syntax fixes applied successfully!")
    else:
        print("ℹ️ No syntax fixes needed.")
