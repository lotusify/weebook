// Script to update all HTML pages to use reusable components
const fs = require('fs');
const path = require('path');

// List of HTML files to update (excluding auth.html, admin.html, checkout.html)
const htmlFiles = [
    'index.html',
    'about.html', 
    'category.html',
    'product.html',
    'profile.html',
    'orders.html',
    'reviews.html',
    'order-success.html',
    'info/huong-dan-mua-hang.html',
    'info/huong-dan-thanh-toan.html',
    'info/huong-dan-giao-nhan.html',
    'info/dieu-khoan-dich-vu.html',
    'info/chinh-sach-bao-mat.html',
    'info/chinh-sach-van-chuyen.html',
    'info/chinh-sach-doi-tra.html',
    'info/quy-dinh-su-dung.html'
];

// Function to update a single HTML file
function updateHtmlFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Add load-components.js script if not present
        if (!content.includes('load-components.js')) {
            content = content.replace(
                '<script src="script.js"></script>',
                '<script src="script.js"></script>\n    <script src="load-components.js"></script>'
            );
        }
        
        // Replace header with placeholder
        const headerRegex = /<header>[\s\S]*?<\/header>/;
        if (headerRegex.test(content)) {
            content = content.replace(headerRegex, '<div id="header-placeholder"></div>');
        }
        
        // Replace footer with placeholder
        const footerRegex = /<footer>[\s\S]*?<\/footer>/;
        if (footerRegex.test(content)) {
            content = content.replace(footerRegex, '<div id="footer-placeholder"></div>');
        }
        
        // Replace chatbot with placeholder (only for non-excluded pages)
        const excludedPages = ['auth.html', 'admin.html', 'checkout.html'];
        const fileName = path.basename(filePath);
        
        if (!excludedPages.includes(fileName)) {
            const chatbotRegex = /<!-- Floating Chatbot -->[\s\S]*?<\/div>\s*<\/div>/;
            if (chatbotRegex.test(content)) {
                content = content.replace(chatbotRegex, '<div id="chatbot-placeholder"></div>');
            }
        }
        
        // Write updated content back to file
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
        
    } catch (error) {
        console.error(`Error updating ${filePath}:`, error.message);
    }
}

// Update all files
htmlFiles.forEach(updateHtmlFile);

console.log('All HTML files updated successfully!');
