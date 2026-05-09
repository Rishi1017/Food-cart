let cart = [];

// This part makes the "Add to Cart" buttons work
document.querySelectorAll('.btn-add').forEach((button) => {
    button.addEventListener('click', () => {
        const card = button.closest('.food-card');
        const name = card.querySelector('h3').innerText;
        const priceText = card.querySelector('.price').innerText;
        // This takes "RM 10.50" and turns it into the number 10.50
        const price = parseFloat(priceText.replace('RM ', ''));
        
        cart.push({ name, price });
        
        // Updates the number on the Cart button at the top
        document.querySelector('.cart-btn').innerText = 'Cart (${cart.length}');
        alert(name + " added to cart!");
    });
});

// This part opens the Cart window when you click the Cart button
document.querySelector('.cart-btn').addEventListener('click', (e) => {
    e.preventDefault();
    const modal = document.getElementById('cart-modal');
    const list = document.getElementById('cart-items-list');
    const totalSpan = document.getElementById('grand-total');
    
    // Shows the current time of the request
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

// This part closes the Cart window
document.querySelector('.close-modal').onclick = () => {
    document.getElementById('cart-modal').style.display = 'none';
};
