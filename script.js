// Main JavaScript file - Dynamic module loader
const modules = [
    'js/utils.js',
    'js/header.js',
    'js/footer.js',
    'js/navigation.js',
    'js/cart.js',
    'js/wishlist.js',
    'js/auth.js',
    'js/chatbot.js',
    'js/product.js',
    'js/category.js',
    'js/home.js'
];

function loadModules() {
    return Promise.all(modules.map(src => new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    })));
}

const waitForData = () => {
    if (window.BookDatabase) {
        const currentPage = getCurrentPage();
        if (typeof initializeProductGrid === 'function') initializeProductGrid();
        
        switch(currentPage) {
            case 'index': if (typeof initializeHomePage === 'function') initializeHomePage(); break;
            case 'product': if (typeof initializeProductPage === 'function') initializeProductPage(); break;
            case 'category': if (typeof initializeCategoryPage === 'function') initializeCategoryPage(); break;
            case 'about': if (typeof initializeAboutPage === 'function') initializeAboutPage(); break;
        }
    } else {
        setTimeout(waitForData, 50);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    loadModules().then(() => {
        setTimeout(() => {
            if (typeof initializeChatbotTimestamp === 'function') initializeChatbotTimestamp();
            setTimeout(() => { if (typeof initializeChatbotEnterKey === 'function') initializeChatbotEnterKey(); }, 100);
            
            if (typeof initializeNavigation === 'function') initializeNavigation();
            if (typeof initializeSearch === 'function') initializeSearch();
            if (typeof initializeCart === 'function') initializeCart();
            if (typeof initializeAuth === 'function') initializeAuth();
            if (typeof initializeCartSyncListener === 'function') initializeCartSyncListener();
            
            setTimeout(waitForData, 10);
        }, 100);
    });
});
