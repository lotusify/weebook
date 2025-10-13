// ========== AUTHENTICATION SYSTEM ========== //
// Complete authentication system for BookSelf

document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

function initializeAuth() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Update tab buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update forms
            authForms.forEach(form => form.classList.remove('active'));
            document.getElementById(`${targetTab}Form`).classList.add('active');
        });
    });

    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        
        // Password strength checker
        const passwordInput = document.getElementById('registerPassword');
        if (passwordInput) {
            passwordInput.addEventListener('input', checkPasswordStrength);
        }
        
        // Confirm password checker
        const confirmPasswordInput = document.getElementById('confirmPassword');
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', checkPasswordMatch);
        }
    }

    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', () => {
            const provider = button.classList.contains('google') ? 'google' : 'facebook';
            handleSocialLogin(provider);
        });
    });

    // Forgot password
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', handleForgotPassword);
    }
}

// ========== LOGIN FUNCTIONALITY ========== //
function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const rememberMe = document.getElementById('rememberMe').checked;

    // Validate input
    if (!email || !password) {
        showNotification('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }

    // Check for admin login
    if (email === 'admin@bookself.com' && password === 'admin@bookself.com') {
        const adminSession = {
            id: 'admin',
            name: 'Administrator',
            email: email,
            role: 'admin',
            loginTime: new Date().toISOString(),
            rememberMe: rememberMe
        };

        // Store admin session
        if (rememberMe) {
            localStorage.setItem('bookself-user', JSON.stringify(adminSession));
        } else {
            sessionStorage.setItem('bookself-user', JSON.stringify(adminSession));
        }

        showNotification('Chào mừng Administrator!', 'success');
        
        // Redirect to admin dashboard
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1500);
        return;
    }

    // Check for default user login
    if (email === 'user@bookself.com' && password === 'user@bookself.com') {
        const userSession = {
            id: 'user',
            name: 'Người dùng',
            email: email,
            phone: '0123456789',
            role: 'user',
            loginTime: new Date().toISOString(),
            rememberMe: rememberMe
        };

        // Store user session
        if (rememberMe) {
            localStorage.setItem('bookself-user', JSON.stringify(userSession));
        } else {
            sessionStorage.setItem('bookself-user', JSON.stringify(userSession));
        }

        showNotification(`Chào mừng ${userSession.name}!`, 'success');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        return;
    }

    // Check for regular user login
    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        showNotification('Email không tồn tại!', 'error');
        return;
    }

    if (user.password !== password) {
        showNotification('Mật khẩu không đúng!', 'error');
        return;
    }

    // Regular user login successful
    const userSession = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: 'user',
        loginTime: new Date().toISOString(),
        rememberMe: rememberMe
    };

    // Store session
    if (rememberMe) {
        localStorage.setItem('bookself-user', JSON.stringify(userSession));
    } else {
        sessionStorage.setItem('bookself-user', JSON.stringify(userSession));
    }

    showNotification(`Chào mừng ${userSession.name}!`, 'success');
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// ========== REGISTER FUNCTIONALITY ========== //
function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Validate input
    if (!name || !email || !phone || !password || !confirmPassword) {
        showNotification('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }

    if (!agreeTerms) {
        showNotification('Vui lòng đồng ý với điều khoản sử dụng!', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Mật khẩu xác nhận không khớp!', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Mật khẩu phải có ít nhất 6 ký tự!', 'error');
        return;
    }

    // For front-end demo, allow any email (no duplicate check)
    // const users = getUsers();
    // if (users.find(u => u.email === email)) {
    //     showNotification('Email đã được sử dụng!', 'error');
    //     return;
    // }

    // Create new user
    const newUser = {
        id: generateUserId(),
        name: name,
        email: email,
        phone: phone,
        password: password,
        createdAt: new Date().toISOString(),
        orders: [],
        wishlist: [],
        reviews: []
    };

    // Save user
    users.push(newUser);
    localStorage.setItem('bookself-users', JSON.stringify(users));

    showNotification('Tạo tài khoản thành công!', 'success');
    
    // Auto login
    setTimeout(() => {
        const userSession = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            loginTime: new Date().toISOString(),
            rememberMe: false
        };
        
        sessionStorage.setItem('bookself-user', JSON.stringify(userSession));
        window.location.href = 'index.html';
    }, 1500);
}

// ========== PASSWORD STRENGTH CHECKER ========== //
function checkPasswordStrength() {
    const password = document.getElementById('registerPassword').value;
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    let strength = 0;
    let text = 'Mật khẩu yếu';
    let color = '#e53e3e';
    
    if (password.length >= 6) strength += 1;
    if (password.match(/[a-z]/)) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 1;
    
    switch(strength) {
        case 0:
        case 1:
            text = 'Mật khẩu yếu';
            color = '#e53e3e';
            break;
        case 2:
        case 3:
            text = 'Mật khẩu trung bình';
            color = '#ed8936';
            break;
        case 4:
        case 5:
            text = 'Mật khẩu mạnh';
            color = '#38a169';
            break;
    }
    
    if (strengthBar) {
        strengthBar.style.width = `${(strength / 5) * 100}%`;
        strengthBar.style.backgroundColor = color;
    }
    
    if (strengthText) {
        strengthText.textContent = text;
        strengthText.style.color = color;
    }
}

// ========== PASSWORD MATCH CHECKER ========== //
function checkPasswordMatch() {
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmInput = document.getElementById('confirmPassword');
    
    if (confirmPassword && password !== confirmPassword) {
        confirmInput.style.borderColor = '#e53e3e';
        confirmInput.style.backgroundColor = '#fed7d7';
    } else {
        confirmInput.style.borderColor = '#38a169';
        confirmInput.style.backgroundColor = '#c6f6d5';
    }
}

// ========== SOCIAL LOGIN ========== //
function handleSocialLogin(provider) {
    showNotification(`Đăng nhập với ${provider} sẽ được phát triển trong phiên bản tiếp theo!`, 'info');
}

// ========== FORGOT PASSWORD ========== //
function handleForgotPassword(e) {
    e.preventDefault();
    showNotification('Chức năng quên mật khẩu sẽ được phát triển trong phiên bản tiếp theo!', 'info');
}

// ========== UTILITY FUNCTIONS ========== //
function getUsers() {
    return JSON.parse(localStorage.getItem('bookself-users')) || [];
}

function generateUserId() {
    const users = getUsers();
    return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// ========== USER SESSION MANAGEMENT ========== //
function getCurrentUser() {
    const userSession = localStorage.getItem('bookself-user') || sessionStorage.getItem('bookself-user');
    return userSession ? JSON.parse(userSession) : null;
}

function logout() {
    localStorage.removeItem('bookself-user');
    sessionStorage.removeItem('bookself-user');
    showNotification('Đã đăng xuất thành công!', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

function requireAdmin() {
    if (!isAdmin()) {
        showNotification('Bạn không có quyền truy cập trang này!', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        return false;
    }
    return true;
}

// Export functions for use in other files
if (typeof window !== 'undefined') {
    window.getCurrentUser = getCurrentUser;
    window.logout = logout;
    window.isLoggedIn = isLoggedIn;
    window.isAdmin = isAdmin;
    window.requireAdmin = requireAdmin;
    window.getUsers = getUsers;
}
