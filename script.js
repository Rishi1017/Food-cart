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

    // Initial Setup
    updateUserNav();
    autoFillComplaintForm();

    // 1. Add to Cart Logic
    document.querySelectorAll('.btn-add').forEach((button) => {
        button.addEventListener('click', () => {
            const card = button.closest('.food-card');
            const name = card.querySelector('h3').innerText;
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
            userBtn.innerText = `Hi, ${window.userProfile.name.split(' ')[0]}`;
        } else {
            userBtn.innerText = "Login / Profile";
        }
    }

    function autoFillComplaintForm() {
        if (window.userProfile) {
            document.getElementById('ticket-name').value = window.userProfile.name;
            document.getElementById('ticket-phone').value = window.userProfile.phone;
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

        // Load values into form
        document.getElementById('prof-name').value = window.userProfile.name;
        document.getElementById('prof-email').value = window.userProfile.email;
        document.getElementById('prof-phone').value = window.userProfile.phone;
        document.getElementById('prof-address').value = window.userProfile.address;
    }

    tabAuthBtn.addEventListener('click', showAuthView);
    tabProfileBtn.addEventListener('click', showProfileView);

    // Save Registration
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = {
            name: document.getElementById('reg-name').value,
            email: document.getElementById('reg-email').value,
            phone: document.getElementById('reg-phone').value,
            address: document.getElementById('reg-address').value
        };
        localStorage.setItem('kanmani_user', JSON.stringify(user));
        window.userProfile = user;
        updateUserNav();
        autoFillComplaintForm();
        alert("Registration successful!");
        userModal.style.display = 'none';
    });

    // Update Profile
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = {
            name: document.getElementById('prof-name').value,
            email: document.getElementById('prof-email').value,
            phone: document.getElementById('prof-phone').value,
            address: document.getElementById('prof-address').value
        };
        localStorage.setItem('kanmani_user', JSON.stringify(user));
        window.userProfile = user;
        updateUserNav();
        autoFillComplaintForm();
        alert("Profile updated successfully!");
        userModal.style.display = 'none';
    });

    // 3. Complaint & Request Submission Logic
    complaintForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const type = document.getElementById('ticket-type').value;
        const name = document.getElementById('ticket-name').value;
        const phone = document.getElementById('ticket-phone').value;
        const desc = document.getElementById('ticket-desc').value;
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
        
        timeDisplay.innerText = "Requested on: " + new Date().toLocaleString();
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
                        <strong style="display:block;">${item.name}</strong>
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
            message += `*Customer:* ${window.userProfile.name}\n`;
            message += `*Phone:* ${window.userProfile.phone}\n`;
            message += `*Address:* ${window.userProfile.address}\n`;
            message += `------------------------------\n`;
        }

        message += "I would like to order:\n";
        const counts = {};
        window.cart.forEach(item => {
            counts[item.name] = (counts[item.name] || 0) + 1;
        });

        for (const [name, qty] of Object.entries(counts)) {
            const item = window.cart.find(i => i.name === name);
            message += `• ${qty}x ${name} (RM ${(item.price * qty).toFixed(2)})\n`;
        }
        
        const total = window.cart.reduce((sum, item) => sum + item.price, 0);
        message += `\n*Total Amount: RM ${total.toFixed(2)}*`;
        message += `\nPayment: Cash on Delivery`;

        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    });
});
        
