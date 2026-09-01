document.addEventListener('DOMContentLoaded', () => {
    // Shared state
    window.cart = []; 
    window.userProfile = JSON.parse(localStorage.getItem('kanmani_user')) || null;

    const cartBtn = document.querySelector('.cart-btn');
    const modal = document.getElementById('cart-modal');
    const closeBtn = document.querySelector('.close-modal');
    const checkoutBtn = document.querySelector('.btn-checkout');

    // Profile & Modal DOM Elements
    const userBtn = document.getElementById('user-btn');
    const userModal = document.getElementById('user-modal');
    const closeUserBtn = document.querySelector('.close-user-modal');
    const tabAuthBtn = document.getElementById('tab-auth-btn');
    const tabProfileBtn = document.getElementById('tab-profile-btn');
    const authView = document.getElementById('auth-view');
    const profileView = document.getElementById('profile-view');
    const registerForm = document.getElementById('register-form');
    const profileForm = document.getElementById('profile-form');
    const complaintForm = document.getElementById('complaint-form');

    // =========================================================
    // SECURITY IMPLEMENTATION: Input Validation & XSS Prevention
    // =========================================================
    function sanitizeInput(str) {
        if (!str) return '';
        const temp = document.createElement('div');
        temp.textContent = str.trim();
        return temp.innerHTML
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        // Validates Malaysian phone formats (e.g., 0175566130, +60175566130)
        const phoneRegex = /^(\+?60|0)1[0-46-9]\d{7,8}$/;
        return phoneRegex.test(phone.replace(/\s+/g, ''));
    }

    // Initial Setup
    updateUserNav();
    autoFillComplaintForm();

    // 1. Add to Cart Logic
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

    // 2. User Registration & Profile Logic
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

        // Load values into form safely
        document.getElementById('prof-name').value = sanitizeInput(window.userProfile.name);
        document.getElementById('prof-email').value = sanitizeInput(window.userProfile.email);
        document.getElementById('prof-phone').value = sanitizeInput(window.userProfile.phone);
        document.getElementById('prof-address').value = sanitizeInput(window.userProfile.address);
    }

    tabAuthBtn.addEventListener('click', showAuthView);
    tabProfileBtn.addEventListener('click', showProfileView);

    // Save Registration with Input Validation & XSS Cleaning
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = sanitizeInput(document.getElementById('reg-name').value);
        const email = sanitizeInput(document.getElementById('reg-email').value);
        const phone = sanitizeInput(document.getElementById('reg-phone').value);
        const address = sanitizeInput(document.getElementById('reg-address').value);

        if (!isValidEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!isValidPhone(phone)) {
            alert("Please enter a valid Malaysian phone number (e.g., 0175566130).");
            return;
        }

        const user = { name, email, phone, address };
        localStorage.setItem('kanmani_user', JSON.stringify(user));
        window.userProfile = user;
        updateUserNav();
        autoFillComplaintForm();
        alert("Registration successful!");
        userModal.style.display = 'none';
    });

    // Update Profile with Security Validation
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = sanitizeInput(document.getElementById('prof-name').value);
        const email = sanitizeInput(document.getElementById('prof-email').value);
        const phone = sanitizeInput(document.getElementById('prof-phone').value);
        const address = sanitizeInput(document.getElementById('prof-address').value);

        if (!isValidEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!isValidPhone(phone)) {
            alert("Please enter a valid Malaysian phone number.");
            return;
        }

        const user = { name, email, phone, address };
        localStorage.setItem('kanmani_user', JSON.stringify(user));
        window.userProfile = user;
        updateUserNav();
        autoFillComplaintForm();
        alert("Profile updated successfully!");
        userModal.style.display = 'none';
    });

    // 3. Complaint & Request Submission Logic (Sanitization Applied)
    complaintForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const type = sanitizeInput(document.getElementById('ticket-type').value);
        const name = sanitizeInput(document.getElementById('ticket-name').value);
        const phone = sanitizeInput(document.getElementById('ticket-phone').value);
        const desc = sanitizeInput(document.getElementById('ticket-desc').value);

        if (!isValidPhone(phone)) {
            alert("Please enter a valid phone number for support requests.");
            return;
        }

        const ticketId = 'TICK-' + Math.floor(1000 + Math.random() * 9000);
        const phoneNumber = "60175566130";

        let message = `*NEW ${type.toUpperCase()} [${ticketId}]*\n`;
        message += `------------------------------\n`;
        message += `*Customer:* ${name}\n`;
        message += `*Contact:* ${phone}\n`;
        message += `*Details:* ${desc}\n`;

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    });

    // 4. Cart Modal Controls
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
                
                // Safe innerHTML assignment using text content conversion
                const safeName = sanitizeInput(item.name);
                itemRow.innerHTML = `
                    <div>
                        <strong style="display:block;">${safeName}</strong>
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

    // Checkout via WhatsApp
    checkoutBtn.addEventListener('click', () => {
        if (window.cart.length === 0) {
            alert("Please add items to your cart first!");
            return;
        }
        
        const phoneNumber = "60175566130";
        let message = `*Order Confirmation from Kan Mani Food Cart*\n`;
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

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    });
});
                                  
