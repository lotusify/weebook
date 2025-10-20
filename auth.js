// ========== AUTHENTICATION SYSTEM ========== //
// Complete authentication system for BookShelf

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
    const email = formData.get('email').trim();
    const password = formData.get('password').trim();
    const rememberMe = document.getElementById('rememberMe').checked;

    if (!email || !password) {
        showNotification('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }

    // --- Kiểm tra tài khoản mặc định ---
    const defaultAccount = {
        email: "admin@bookshelf.com",
        password: "12345678",
        name: "Administrator",
        role: "admin"
    };

    if (email.toLowerCase() === defaultAccount.email.toLowerCase() &&
    password === defaultAccount.password) {
    const adminSession = {
        id: "admin",
        name: defaultAccount.name,
        email: defaultAccount.email,
        role: defaultAccount.role,
        loginTime: new Date().toISOString(),
        rememberMe: rememberMe
    };

    if (rememberMe) {
        localStorage.setItem('bookshelf-user', JSON.stringify(adminSession));
    } else {
        sessionStorage.setItem('bookshelf-user', JSON.stringify(adminSession));
    }

    showNotification('Đăng nhập thành công (Administrator)!', 'success');

    // Điều hướng sang giao diện Admin
    setTimeout(() => {
        window.location.href = 'admin.html';
    }, 1000);

    return;
}
    // --- Kiểm tra tài khoản người dùng đã đăng ký ---
    const users = JSON.parse(localStorage.getItem('bookshelf-users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        showNotification('Sai email hoặc mật khẩu!', 'error');
        return;
    }

    // --- Lưu session khi đăng nhập thành công ---
    const userSession = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: 'user',
        loginTime: new Date().toISOString(),
        rememberMe: rememberMe
    };

    if (rememberMe) {
        localStorage.setItem('bookshelf-user', JSON.stringify(userSession));
    } else {
        sessionStorage.setItem('bookshelf-user', JSON.stringify(userSession));
    }

    showNotification(`Chào mừng ${userSession.name}!`, 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

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

    //  Lấy danh sách người dùng hiện tại
    const users = getUsers();

    // Kiểm tra email trùng
    if (users.find(u => u.email === email)) {
        showNotification('Email đã được sử dụng!', 'error');
        return;
    }

    // Tạo tài khoản mới
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

    // Lưu vào localStorage
    users.push(newUser);
    localStorage.setItem('bookshelf-users', JSON.stringify(users));

    showNotification('Tạo tài khoản thành công!', 'success');

    // Tự động đăng nhập sau khi đăng ký
    setTimeout(() => {
        const userSession = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            loginTime: new Date().toISOString(),
            rememberMe: false
        };

        sessionStorage.setItem('bookshelf-user', JSON.stringify(userSession));
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
    return JSON.parse(localStorage.getItem('bookshelf-users')) || [];
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
    const userSession = localStorage.getItem('bookshelf-user') || sessionStorage.getItem('bookshelf-user');
    return userSession ? JSON.parse(userSession) : null;
}

function logout() {
    localStorage.removeItem('bookshelf-user');
    sessionStorage.removeItem('bookshelf-user');
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
