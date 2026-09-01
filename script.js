document.addEventListener('DOMContentLoaded', () => {
    window.cart = []; 
    window.userProfile = JSON.parse(localStorage.getItem('kanmani_user')) || null;

    const cartBtn = document.querySelector('.cart-btn');
    const modal = document.getElementById('cart-modal');
    const closeBtn = document.querySelector('.close-modal');
    const checkoutBtn = document.querySelector('.btn-checkout');

    const userBtn = document.getElementById('user-btn');
    const userModal = document.getElementById('user-modal');
    const closeUserBtn = document.querySelector('.close-user-modal');
    const tabAuthBtn = document.getElementById('tab-auth-btn');
    const tabProfileBtn = document.getElementById('tab-profile-btn');
    const authView = document.getElementById('auth-view');
    const profileView = document.getElementById('profile-view');
    
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const resetForm = document.getElementById('reset-form');
    const profileForm = document.getElementById('profile-form');
    const complaintForm = document.getElementById('complaint-form');
    const logoutBtn = document.getElementById('logout-btn');

    const btnShowLogin = document.getElementById('btn-show-login');
    const btnShowRegister = document.getElementById('btn-show-register');

    const navHome = document.getElementById('nav-home');
    const navMenu = document.getElementById('nav-menu');
    const navRequest = document.getElementById('nav-request');

    const forgotPassLink = document.getElementById('forgot-pass-link');
    const backToRegLink = document.getElementById('back-to-reg-link');
    const authTitle = document.getElementById('auth-title');

    function sanitizeInput(str) {
        if (!str) return '';
        const temp = document.createElement('div');
        temp.textContent = str.trim();
        return temp.innerHTML.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
        return /^(\+?60|0)1[0-46-9]\d{7,8}$/.test(phone.replace(/\s+/g, ''));
    }

    function isValidPassword(password) {
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/.test(password);
    }

    // Navigation Scrolling
    if (navHome) {
        navHome.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('home-section').scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (navMenu) {
        navMenu.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (navRequest) {
        navRequest.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('request-section').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Toggle Login / Register Sub-Views
    if (btnShowLogin && btnShowRegister) {
        btnShowLogin.addEventListener('click', () => {
            btnShowLogin.classList.add('active');
            btnShowRegister.classList.remove('active');
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            resetForm.style.display = 'none';
            if (authTitle) authTitle.innerText = "User Login";
        });

        btnShowRegister.addEventListener('click', () => {
            btnShowRegister.classList.add('active');
            btnShowLogin.classList.remove('active');
            registerForm.style.display = 'block';
            loginForm.style.display = 'none';
            resetForm.style.display = 'none';
            if (authTitle) authTitle.innerText = "User Registration";
        });
    }

    updateUserNav();
    autoFillComplaintForm();

    function updateUserNav() {
        if (userBtn) {
            if (window.userProfile) {
                const safeName = sanitizeInput(window.userProfile.name);
                userBtn.innerText = `Hi, ${safeName.split(' ')[0]}`;
            } else {
                userBtn.innerText = "Login / Profile";
            }
        }
    }

    function autoFillComplaintForm() {
        if (window.userProfile) {
            const ticketName = document.getElementById('ticket-name');
            const ticketPhone = document.getElementById('ticket-phone');
            if (ticketName) ticketName.value = sanitizeInput(window.userProfile.name);
            if (ticketPhone) ticketPhone.value = sanitizeInput(window.userProfile.phone);
        }
    }

    if (userBtn) {
        userBtn.addEventListener('click', () => {
            userModal.style.display = 'block';
            if (window.userProfile) {
                showProfileView();
            } else {
                showAuthView();
            }
        });
    }

    if (closeUserBtn) closeUserBtn.onclick = () => userModal.style.display = 'none';

    function showAuthView() {
        authView.style.display = 'block';
        profileView.style.display = 'none';
        tabAuthBtn.style.borderBottom = '2px solid #c5a059';
        tabAuthBtn.style.color = '#000';
        tabProfileBtn.style.borderBottom = 'none';
        tabProfileBtn.style.color = '#888';
    }

    function showProfileView() {
        if (!window.userProfile) {
            alert("Please login or register first!");
            showAuthView();
            return;
        }
        authView.style.display = 'none';
        profileView.style.display = 'block';
        tabProfileBtn.style.borderBottom = '2px solid #c5a059';
        tabProfileBtn.style.color = '#000';
        tabAuthBtn.style.borderBottom = 'none';
        tabAuthBtn.style.color = '#888';

        document.getElementById('prof-name').value = sanitizeInput(window.userProfile.name);
        document.getElementById('prof-email').value = sanitizeInput(window.userProfile.email);
        document.getElementById('prof-phone').value = sanitizeInput(window.userProfile.phone);
        document.getElementById('prof-address').value = sanitizeInput(window.userProfile.address);
    }

    if (tabAuthBtn) tabAuthBtn.addEventListener('click', showAuthView);
    if (tabProfileBtn) tabProfileBtn.addEventListener('click', showProfileView);

    if (forgotPassLink) {
        forgotPassLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.style.display = 'none';
            registerForm.style.display = 'none';
            resetForm.style.display = 'block';
            authTitle.innerText = "Reset Password";
        });
    }

    if (backToRegLink) {
        backToRegLink.addEventListener('click', (e) => {
            e.preventDefault();
            resetForm.style.display = 'none';
            loginForm.style.display = 'block';
            authTitle.innerText = "User Login";
        });
    }

    // Login Form Submit
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = sanitizeInput(document.getElementById('login-email').value);
            const password = document.getElementById('login-password').value;

            const storedUser = JSON.parse(localStorage.getItem('kanmani_user'));

            if (storedUser && storedUser.email.toLowerCase() === email.toLowerCase() && storedUser.password === password) {
                window.userProfile = storedUser;
                updateUserNav();
                autoFillComplaintForm();
                alert("Login successful!");
                userModal.style.display = 'none';
            } else {
                alert("Invalid email or password. Please try again or register.");
            }
        });
    }

    // Registration Form Submit
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = sanitizeInput(document.getElementById('reg-name').value);
            const email = sanitizeInput(document.getElementById('reg-email').value);
            const phone = sanitizeInput(document.getElementById('reg-phone').value);
            const password = document.getElementById('reg-password').value;
            const address = sanitizeInput(document.getElementById('reg-address').value);

            if (!isValidEmail(email) || !isValidPhone(phone) || !isValidPassword(password)) {
                alert("Please check your input details. Password must contain letters and numbers.");
                return;
            }

            const user = { name, email, phone, address, password };
            localStorage.setItem('kanmani_user', JSON.stringify(user));
            window.userProfile = user;
            updateUserNav();
            autoFillComplaintForm();

            alert("Registration successful!");
            userModal.style.display = 'none';
        });
    }

    // Profile Form Submit
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = sanitizeInput(document.getElementById('prof-name').value);
            const email = sanitizeInput(document.getElementById('prof-email').value);
            const phone = sanitizeInput(document.getElementById('prof-phone').value);
            const address = sanitizeInput(document.getElementById('prof-address').value);

            if (!isValidEmail(email) || !isValidPhone(phone)) {
                alert("Please check your email and phone format.");
                return;
            }

            const user = { ...window.userProfile, name, email, phone, address };
            localStorage.setItem('kanmani_user', JSON.stringify(user));
            window.userProfile = user;
            updateUserNav();
            autoFillComplaintForm();
            alert("Profile updated successfully!");
            userModal.style.display = 'none';
        });
    }

    // Logout Action
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('kanmani_user');
            window.userProfile = null;
            updateUserNav();
            alert("You have logged out.");
            userModal.style.display = 'none';
        });
    }

    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = 'none';
        if (event.target == userModal) userModal.style.display = 'none';
    };
});
            
