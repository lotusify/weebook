// ========== AUTHENTICATION INTEGRATION ========== //

function initializeAuth() {
    updateUserInterface();
    
    // User account link
    const userAccountLink = document.querySelector('.user-actions a[href="#"]');
    if (userAccountLink) {
        userAccountLink.addEventListener('click', handleUserAccountClick);
    }
}

// Get current logged in user
function getCurrentUser() {
    // Check localStorage first (remember me)
    let userSession = localStorage.getItem('bookself-user');
    
    // If not found, check sessionStorage
    if (!userSession) {
        userSession = sessionStorage.getItem('bookself-user');
    }
    
    if (userSession) {
        try {
            return JSON.parse(userSession);
        } catch (e) {
            console.error('Error parsing user session:', e);
            return null;
        }
    }
    
    return null;
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Get all users from localStorage
function getUsers() {
    const users = localStorage.getItem('bookself-users');
    return users ? JSON.parse(users) : [];
}

// Logout user
function logout() {
    localStorage.removeItem('bookself-user');
    sessionStorage.removeItem('bookself-user');
    updateUserInterface();
    showNotification('Đã đăng xuất thành công!', 'success');
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function updateUserInterface() {
    const user = getCurrentUser();
    const accountLink = document.querySelector('.account-link');
    const logoutLink = document.querySelector('.logout-link');
    const adminLink = document.querySelector('.admin-link');
    
    if (accountLink) {
        if (user) {
            // User is logged in
            accountLink.innerHTML = `
                <i class="fas fa-user"></i>
                <span>${user.name || user.email}</span>
            `;
            accountLink.href = 'profile.html';
            
            // Show logout link
            if (logoutLink) {
                logoutLink.style.display = 'block';
            } else {
                addLogoutOption();
            }
            
            // Show admin link if user is admin
            if (adminLink && user.role === 'admin') {
                adminLink.style.display = 'block';
            } else if (adminLink) {
                adminLink.style.display = 'none';
            }
        } else {
            // User is not logged in
            accountLink.innerHTML = `
                <i class="fas fa-user"></i>
                <span>Đăng nhập</span>
            `;
            accountLink.href = 'auth.html';
            
            // Hide logout link
            if (logoutLink) {
                logoutLink.style.display = 'none';
            }
            
            // Hide admin link
            if (adminLink) {
                adminLink.style.display = 'none';
            }
        }
    }
}

function handleUserAccountClick(e) {
    // For front-end demo, always go to auth page
    e.preventDefault();
    window.location.href = 'auth.html';
}

function addLogoutOption() {
    // Remove existing logout option if any
    const existingLogout = document.querySelector('.logout-option');
    if (existingLogout) {
        existingLogout.remove();
    }
    
    const userActions = document.querySelector('.user-actions');
    if (userActions) {
        const logoutLink = document.createElement('a');
        logoutLink.href = '#';
        logoutLink.className = 'logout-option';
        logoutLink.innerHTML = `
            <i class="fas fa-sign-out-alt"></i>
            <span>Đăng xuất</span>
        `;
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
        userActions.appendChild(logoutLink);
    }
}

// Export to global scope
if (typeof window !== 'undefined') {
    window.initializeAuth = initializeAuth;
    window.getCurrentUser = getCurrentUser;
    window.isLoggedIn = isLoggedIn;
    window.getUsers = getUsers;
    window.logout = logout;
    window.updateUserInterface = updateUserInterface;
}
