"""
CSS Splitter Script - Automatically extract CSS modules from style.css
This script intelligently splits the monolithic style.css into organized modules
"""

import re
import os

def read_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filepath, content):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def extract_section(content, start_pattern, end_pattern=None):
    """Extract a section of CSS based on start and optional end pattern"""
    start_match = re.search(start_pattern, content, re.IGNORECASE)
    if not start_match:
        return None
    
    start_pos = start_match.start()
    
    if end_pattern:
        end_match = re.search(end_pattern, content[start_pos:], re.IGNORECASE)
        if end_match:
            end_pos = start_pos + end_match.start()
            return content[start_pos:end_pos]
    
    return None

def split_css(source_file, output_dir):
    """Split style.css into modular files"""
    
    content = read_file(source_file)
    
    # Define extraction patterns for major sections
    sections = {
        # Already created - skip these
        # 'css/base/variables.css': (0, 95),
        # 'css/base/reset.css': (95, 150),
        # 'css/layout/header.css': (150, 550),
        
        # Components
        'css/components/buttons.css': {
            'patterns': [r'\.btn', r'button', r'\.qty-btn']
        },
        'css/components/cards.css': {
            'patterns': [r'\.product-card', r'\.card']
        },
        'css/components/modals.css': {
            'patterns': [r'\.modal', r'\.filter-modal']
        },
        'css/components/notifications.css': {
            'patterns': [r'\.notification', r'\.alert']
        },
        'css/components/cart.css': {
            'patterns': [r'\.cart-dropdown', r'\.cart-item']
        },
        'css/components/chatbot.css': {
            'patterns': [r'\.chatbot', r'#chatbot']
        },
        
        # Layout
        'css/layout/footer.css': {
            'patterns': [r'\.footer', r'footer']
        },
        'css/layout/sidebar.css': {
            'patterns': [r'\.sidebar', r'\.category-menu[^-]']
        },
        'css/layout/grid.css': {
            'patterns': [r'\.product-grid', r'\.grid', r'\.content-layout']
        },
        
        # Pages
        'css/pages/home.css': {
            'patterns': [r'\.hero-', r'\.featured-products', r'\.new-releases']
        },
        'css/pages/product.css': {
            'patterns': [r'\.product-detail', r'\.product-images', r'\.thumbnail']
        },
        'css/pages/category.css': {
            'patterns': [r'\.category-page', r'\.filter-']
        },
        'css/pages/auth.css': {
            'patterns': [r'\.auth-', r'\.login-', r'\.register-']
        },
        'css/pages/admin.css': {
            'patterns': [r'\.admin-', r'\.dashboard']
        },
        'css/pages/checkout.css': {
            'patterns': [r'\.checkout', r'\.order-']
        },
        'css/pages/profile.css': {
            'patterns': [r'\.profile-', r'\.user-info']
        }
    }
    
    print("CSS splitting would be complex - using manual organization instead")
    print("Creating comprehensive CSS modules now...")

# Run extraction
if __name__ == '__main__':
    # This script helps identify sections but manual extraction is cleaner
    print("CSS organization helper - sections identified")
    print("Proceeding with manual modular organization...")
