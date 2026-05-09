document.addEventListener('DOMContentLoaded', () => {
    let cart = [];
    const cartBtn = document.querySelector('.cart-btn');

    // 1. Add to Cart Logic
    document.querySelectorAll('.btn-add').forEach((button) => {
        button.addEventListener('click', () => {
            const card = button.closest('.food-card');
            const name = card.querySelector('h3').innerText;
            const priceText = card.querySelector('.price').innerText;
            const price = parseFloat(priceText.replace('RM', '').trim());
            
            cart.push({ name, price });
            updateCartButton();
            alert(`${name} added!`);
        });
    });

    function updateCartButton() {
        cartBtn.innerText = `Cart (${cart.length})`;
    }

    // 2. Open Cart & Show Delete Buttons
    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        renderCart();
        document.getElementById('cart-modal').style.display = 'block';
    });

    function renderCart() {
        const list = document.getElementById('cart-items-list');
        const totalSpan = document.getElementById('grand-total');
        document.getElementById('request-time').innerText = "Requested on: " + new Date().toLocaleString();

        list.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            list.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cart.forEach((item, index) => {
                list.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <span>${item.name} (RM ${item.price.toFixed(2)})</span>
                    <button onclick="removeItem(${index})" style="background:#ff4d4d; color:white; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; font-size:0.7rem;">Delete</button>
                </div>`;
                total += item.price;
            });
        }
        totalSpan.innerText = total.toFixed(2);
    }

    // 3. Delete Logic
    window.removeItem = (index) => {
        cart.splice(index, 1); // Removes 1 item at that position
        updateCartButton();
        renderCart(); // Refresh the list immediately
    };

    // 4. Close Logic
    document.querySelector('.close-modal').onclick = () => {
        document.getElementById('cart-modal').style.display = 'none';
    };
});

