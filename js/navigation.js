// ========== NAVIGATION ========== //
function initializeNavigation() {
    // Set active navigation item
    setActiveNavigationItem();
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
    
    // Category menu hover and clicks
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        const submenu = item.querySelector('.category-submenu');
        if (submenu) {
            // Ensure submenu is properly positioned
            submenu.style.position = 'absolute';
            submenu.style.top = '0';
            submenu.style.left = '100%';
            submenu.style.zIndex = '1000';
            
            // Handle hover events
            item.addEventListener('mouseenter', () => {
                submenu.style.opacity = '1';
                submenu.style.visibility = 'visible';
                submenu.style.transform = 'translateX(0)';
                submenu.style.display = 'block';
            });
            
            item.addEventListener('mouseleave', () => {
                // Add delay before hiding
                setTimeout(() => {
                    submenu.style.opacity = '0';
                    submenu.style.visibility = 'hidden';
                    submenu.style.transform = 'translateX(-10px)';
                }, 150);
            });
            
            // Keep submenu visible when hovering over it
            submenu.addEventListener('mouseenter', () => {
                submenu.style.opacity = '1';
                submenu.style.visibility = 'visible';
                submenu.style.transform = 'translateX(0)';
            });
            
            submenu.addEventListener('mouseleave', () => {
                submenu.style.opacity = '0';
                submenu.style.visibility = 'hidden';
                submenu.style.transform = 'translateX(-10px)';
            });
        }
        
        // Category link clicks
        const categoryLink = item.querySelector('a[data-category]');
        if (categoryLink) {
            categoryLink.addEventListener('click', (e) => {
                e.preventDefault();
                const category = categoryLink.dataset.category;
                window.location.href = `category.html?category=${category}`;
            });
        }
        
        // Subcategory link clicks
        const subcategoryLinks = item.querySelectorAll('a[data-subcategory]');
        subcategoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const subcategory = link.dataset.subcategory;
                const parentCategoryLink = item.querySelector('a[data-category]');
                const category = parentCategoryLink ? parentCategoryLink.dataset.category : '';
                window.location.href = `category.html?category=${category}&subcategory=${subcategory}`;
            });
        });
    });
}

function setActiveNavigationItem() {
    const currentPage = getCurrentPage();
    console.log('Setting active nav for page:', currentPage);
    
    const navLinks = document.querySelectorAll('.nav-links a');
    console.log('Found nav links:', navLinks.length);
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        console.log('Checking link:', href, 'for page:', currentPage);
        
        if (currentPage === 'index' && href.includes('index.html')) {
            link.classList.add('active');
            console.log('Set active for index page');
        } else if (currentPage === 'category' && href.includes('category.html')) {
            link.classList.add('active');
            console.log('Set active for category page');
        } else if (currentPage === 'product' && href.includes('category.html')) {
            link.classList.add('active');
            console.log('Set active for product page (using category link)');
        } else if (currentPage === 'about' && href.includes('about.html')) {
            link.classList.add('active');
            console.log('Set active for about page');
        }
    });
}
