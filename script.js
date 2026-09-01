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
    const registerForm = document.getElementById('register-form');
    const resetForm = document.getElementById('reset-form');
    const profileForm = document.getElementById('profile-form');
    const complaintForm = document.getElementById('complaint-form');

    // Section Views Handling
    const homeSection = document.getElementById('home-section');
    const menuSection = document.getElementById('menu-section');
    const requestSection = document.getElementById('request-section');

    const navHome = document.getElementById('nav-home');
    const navMenu = document.getElementById('nav-menu');
    const navRequest = document.getElementById('nav-request');

    // Password Reset View Toggles
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

    // Password must contain both letters and numbers, min 6 characters
    function isValidPassword(password) {
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/.test(password);
    }

    // Navigation logic for completely separated views
    function showHomeOnly() {
        homeSection.style.display = 'block';
        menuSection.style.display = 'none';
        requestSection.style.display = 'none';
    }

    function showMenuOnly() {
        homeSection.style.display = 'none';
        menuSection.style.display = 'block';
        requestSection.style.display = 'none';
    }

    function showRequestOnly() {
        homeSection.style.display = 'none';
        menuSection.style.display = 'none';
        requestSection.style.display = 'block';
    }

    navHome.addEventListener('click', (e) => { e.preventDefault(); showHomeOnly(); });
    navMenu.addEventListener('click', (e) => { e.preventDefault(); showMenuOnly(); });
    navRequest.addEventListener('click', (e) => { e.preventDefault(); showRequestOnly(); });

    // Category Filtering Logic (All / Rice / Beverages)
    const filterBtns = document.querySelectorAll('.filter-btn');
    const foodCards = document.querySelectorAll('.food-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');
            foodCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    updateUserNav();
    autoFillComplaintForm();

    // Add to Cart Logic
    document.querySelectorAll('.btn-add').forEach((button) => {
        button.addEventListener('click', () => {
            const card = button.closest('.food-card');
            const name = sanitizeInput(card.querySelector('h3').innerText);
            const priceText = card.querySelector('.price').innerText;
            const price = parseFloat(priceText.replace('RM', '').trim());

            window.cart.push({ name, price });
            updateCartButton();
            
            button.innerText = "Added!";
            button.style.background = "#c5a059";
            setTimeout(() => {
                button.innerText = "Add to Cart";
                button.style.background = "black";
            }, 1000);
        });
    });

    function updateCartButton() {
        cartBtn.innerText = `Cart (${window.cart.length})`;
    }

    function updateUserNav() {
        if (window.userProfile) {
            const safeName = sanitizeInput(window.userProfile.name);
            userBtn.innerText = `Hi, ${safeName.split(' ')[0]}`;
        } else {
            userBtn.innerText = "Login / Profile";
        }
    }

    function autoFillComplaintForm() {
        if (window.userProfile) {
            document.getElementById('ticket-name').value = sanitizeInput(window.userProfile.name);
            document.getElementById('ticket-phone').value = sanitizeInput(window.userProfile.phone);
        }
    }

    userBtn.addEventListener('click', () => {
        userModal.style.display = 'block';
        if (window.userProfile) {
            showProfileView();
        } else {
            showAuthView();
        }
    });

    closeUserBtn.onclick = () => userModal.style.display = 'none';

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
            alert("Please register first!");
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

    tabAuthBtn.addEventListener('click', showAuthView);
    tabProfileBtn.addEventListener('click', showProfileView);

    // Password Reset View Navigation
    forgotPassLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        resetForm.style.display = 'block';
        authTitle.innerText = "Reset Password";
    });

    backToRegLink.addEventListener('click', (e) => {
        e.preventDefault();
        resetForm.style.display = 'none';
        registerForm.style.display = 'block';
        authTitle.innerText = "User Registration";
    });

    // Registration Handler with Admin Email Alert & Password Validation
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = sanitizeInput(document.getElementById('reg-name').value);
        const email = sanitizeInput(document.getElementById('reg-email').value);
        const phone = sanitizeInput(document.getElementById('reg-phone').value);
        const password = document.getElementById('reg-password').value;
        const address = sanitizeInput(document.getElementById('reg-address').value);

        if (!isValidEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!isValidPhone(phone)) {
            alert("Please enter a valid phone number.");
            return;
        }

        if (!isValidPassword(password)) {
            alert("Password must be at least 6 characters long and include both letters and numbers.");
            return;
        }

        const user = { name, email, phone, address, password };
        localStorage.setItem('kanmani_user', JSON.stringify(user));
        window.userProfile = user;
        updateUserNav();
        autoFillComplaintForm();

        const submitBtn = registerForm.querySelector('button[type="submit"]');
        submitBtn.innerText = "Registering...";
        submitBtn.disabled = true;

        // Send registration details alert to your email via EmailJS
        const adminTemplateParams = {
            to_email: "s241201503@studentmail.unimap.edu.my",
            user_name: name,
            user_email: email,
            user_phone: phone,
            user_address: address
        };

        emailjs.send('service_52froww', 'template_0l5m72k', adminTemplateParams)
            .then(() => {
                alert("Registration successful! Notification sent to admin.");
                userModal.style.display = 'none';
            })
            .catch((error) => {
                console.error("Email Notification Error:", error);
                alert("Registration saved successfully!");
                userModal.style.display = 'none';
            })
            .finally(() => {
                submitBtn.innerText = "Save & Register";
                submitBtn.disabled = false;
            });
    });

    // Password Reset Handler via EmailJS
    resetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const resetEmail = sanitizeInput(document.getElementById('reset-email').value);

        if (!isValidEmail(resetEmail)) {
            alert("Please enter a valid email address.");
            return;
        }

        const storedUser = JSON.parse(localStorage.getItem('kanmani_user'));

        if (!storedUser || storedUser.email.toLowerCase() !== resetEmail.toLowerCase()) {
            alert("No account registered with this email address.");
            return;
        }

        const submitBtn = resetForm.querySelector('button[type="submit"]');
        submitBtn.innerText = "Sending Email...";
        submitBtn.disabled = true;

        const templateParams = {
            to_email: resetEmail,
            user_name: storedUser.name,
            user_password: storedUser.password
        };

        emailjs.send('service_52froww', 'template_0l5m72k', templateParams)
            .then(() => {
                alert("Password details sent to your registered email!");
                userModal.style.display = 'none';
                resetForm.reset();
            })
            .catch((error) => {
                console.error("EmailJS Error:", error);
                alert("Failed to send email. Please check your network connection.");
            })
            .finally(() => {
                submitBtn.innerText = "Send Password Email";
                submitBtn.disabled = false;
            });
    });

    // Profile Update Handler
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = sanitizeInput(document.getElementById('prof-name').value);
        const email = sanitizeInput(document.getElementById('prof-email').value);
        const phone = sanitizeInput(document.getElementById('prof-phone').value);
        const address = sanitizeInput(document.getElementById('prof-address').value);

        if (!isValidEmail(email) || !isValidPhone(phone)) {
            alert("Please check your email and phone number input.");
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

    // Support Ticket Submission via WhatsApp
    complaintForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const type = sanitizeInput(document.getElementById('ticket-type').value);
        const name = sanitizeInput(document.getElementById('ticket-name').value);
        const phone = sanitizeInput(document.getElementById('ticket-phone').value);
        const desc = sanitizeInput(document.getElementById('ticket-desc').value);

        const ticketId = 'TICK-' + Math.floor(1000 + Math.random() * 9000);
        const phoneNumber = "60175566130";

        let message = `*NEW ${type.toUpperCase()} [${ticketId}]*\n`;
        message += `------------------------------\n`;
        message += `*Customer:* ${name}\n`;
        message += `*Contact:* ${phone}\n`;
        message += `*Details:* ${desc}\n`;

        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    });

    // Cart Modal Handling
    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        renderCart();
        modal.style.display = 'block';
    });

    closeBtn.onclick = () => modal.style.display = 'none';

    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = 'none';
        if (event.target == userModal) userModal.style.display = 'none';
    };

    function renderCart() {
        const list = document.getElementById('cart-items-list');
        const totalSpan = document.getElementById('grand-total');
        const timeDisplay = document.getElementById('request-time');
        
        timeDisplay.innerText = "Requested on: " + sanitizeInput(new Date().toLocaleString());
        list.innerHTML = '';
        let total = 0;

        if (window.cart.length === 0) {
            list.innerHTML = '<p style="text-align:center; padding: 20px;">Your cart is empty.</p>';
        } else {
            window.cart.forEach((item, index) => {
                const itemRow = document.createElement('div');
                itemRow.style.cssText = "display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #eee; padding-bottom:8px;";
                
                itemRow.innerHTML = `
                    <div>
                        <strong style="display:block;">${sanitizeInput(item.name)}</strong>
                        <span style="color:#666;">RM ${item.price.toFixed(2)}</span>
                    </div>
                    <button onclick="removeItem(${index})" style="background:#ff4d4d; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; font-size:0.8rem;">Remove</button>
                `;
                list.appendChild(itemRow);
                total += item.price;
            });
        }
        totalSpan.innerText = total.toFixed(2);
    }

    window.removeItem = (index) => {
        window.cart.splice(index, 1);
        updateCartButton();
        renderCart();
    };

    // Checkout Handler via WhatsApp
    checkoutBtn.addEventListener('click', () => {
        if (window.cart.length === 0) {
            alert("Please add items to your cart first!");
            return;
        }
        
        const phoneNumber = "60175566130";
        let message = `*Order Confirmation from Kanmani Food Corner*\n`;
        message += `------------------------------\n`;
        
        if (window.userProfile) {
            message += `*Customer:* ${sanitizeInput(window.userProfile.name)}\n`;
            message += `*Phone:* ${sanitizeInput(window.userProfile.phone)}\n`;
            message += `*Address:* ${sanitizeInput(window.userProfile.address)}\n`;
            message += `------------------------------\n`;
        }

        message += "I would like to order:\n";
        const counts = {};
        window.cart.forEach(item => {
            const cleanName = sanitizeInput(item.name);
            counts[cleanName] = (counts[cleanName] || 0) + 1;
        });

        for (const [name, qty] of Object.entries(counts)) {
            const item = window.cart.find(i => sanitizeInput(i.name) === name);
            message += `• ${qty}x ${name} (RM ${(item.price * qty).toFixed(2)})\n`;
        }
        
        const total = window.cart.reduce((sum, item) => sum + item.price, 0);
        message += `\n*Total Amount: RM ${total.toFixed(2)}*`;
        message += `\nPayment: Cash on Delivery`;

        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    });
});
            
