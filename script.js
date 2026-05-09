document.addEventListener('DOMContentLoaded', () => {
    // Shared cart state
    window.cart = []; 
    const cartBtn = document.querySelector('.cart-btn');
    const modal = document.getElementById('cart-modal');
    const closeBtn = document.querySelector('.close-modal');
    const checkoutBtn = document.querySelector('.btn-checkout');

    // 1. Add to Cart Logic
    document.querySelectorAll('.btn-add').forEach((button) => {
        button.addEventListener('click', () => {
            const card = button.closest('.food-card');
            const name = card.querySelector('h3').innerText;
            const priceText = card.querySelector('.price').innerText;
            const price = parseFloat(priceText.replace('RM', '').trim());

            window.cart.push({ name, price });
            updateCartButton();
            
            // UI Feedback
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

    // 2. Modal Controls
    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        renderCart();
        modal.style.display = 'block';
    });

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // 3. Render Cart Items
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

    // 4. Remove Item Logic
    window.removeItem = (index) => {
        window.cart.splice(index, 1);
        updateCartButton();
        renderCart();
    };

    // 5. Checkout Logic
    checkoutBtn.addEventListener('click', () => {
        if (window.cart.length === 0) {
            alert("Please add items to your cart first!");
            return;
        }
        window.openWhatsApp("Order Confirmation");
    });
});

// 6. WhatsApp Global Function with updated number 0175566130
window.openWhatsApp = (type = "Chat Request") => {
    // Corrected Phone Number for Malaysia
    const phoneNumber = "60175566130"; 
    
    let message = `*${type} from Kan Mani Food Cart*\n`;
    message += `------------------------------\n`;
    
    if (window.cart && window.cart.length > 0) {
        message += "I would like to order:\n";
        window.cart.forEach(item => {
            message += `• ${item.name} (RM ${item.price.toFixed(2)})\n`;
        });
        
        const total = window.cart.reduce((sum, item) => sum + item.price, 0);
        message += `\n*Total Amount: RM ${total.toFixed(2)}*`;
        message += `\nPayment: Cash on Delivery`;
    } else {
        message += "Hello! I would like to request an item or chat about my order.";
    }

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
};
        
