// This waits for the entire page to load first
document.addEventListener('DOMContentLoaded', () => {
    let cart = [];

    // Select the cart button
    const cartBtn = document.querySelector('.cart-btn');

    // 1. Add to Cart Logic
    document.querySelectorAll('.btn-add').forEach((button) => {
        button.addEventListener('click', (e) => {
            const card = button.closest('.food-card');
            const name = card.querySelector('h3').innerText;
            const priceText = card.querySelector('.price').innerText;
            
            // This takes "RM 10.50" and turns it into 10.50
            const price = parseFloat(priceText.replace('RM', '').trim());
            
            cart.push({ name, price });
            
            // Update the button text - use BACKTICKS (the key next to 1)
            cartBtn.innerText = `Cart (${cart.length})`;
            alert(`${name} added to cart!`);
        });
    });

    // 2. Open Cart Logic
    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = document.getElementById('cart-modal');
        const list = document.getElementById('cart-items-list');
        const totalSpan = document.getElementById('grand-total');
        
        document.getElementById('request-time').innerText = "Requested on: " + new Date().toLocaleString();

        list.innerHTML = '';
        let total = 0;

        if(cart.length === 0) {
            list.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                list.innerHTML += `<p style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span>${item.name}</span> 
                    <span>RM ${item.price.toFixed(2)}</span>
                </p>`;
                total += item.price;
            });
        }

        totalSpan.innerText = total.toFixed(2);
        modal.style.display = 'block';
    });

    // 3. Close Cart Logic
    document.querySelector('.close-modal').onclick = () => {
        document.getElementById('cart-modal').style.display = 'none';
    };
});
