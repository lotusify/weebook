// ========== COMPONENT LOADER ========== //
// Load header, footer, and chatbot components
// This file loads the modular components for backward compatibility

(function() {
    // Check if already loaded via script.js
    if (window.componentsLoaded) {
        console.log('✅ Components already loaded via script.js');
        return;
    }
    
    // Load component modules
    const componentModules = [
        'js/header.js',
        'js/footer.js'
    ];
    
    componentModules.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => console.log(`✅ Loaded: ${src}`);
        script.onerror = () => console.error(`❌ Failed to load: ${src}`);
        document.head.appendChild(script);
    });
    
    window.componentsLoaded = true;
})();
