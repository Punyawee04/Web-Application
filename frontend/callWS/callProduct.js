document.addEventListener('DOMContentLoaded', () => {
    console.log('callProduct.js loaded'); // Debug log

    // Fetch product data from the backend API
    fetch('http://localhost:8080/api/products')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(products => {
            console.log('Products:', products); // Log the fetched products for debugging
            const container = document.getElementById('product-container');

            // Clear the container (if necessary)
            container.innerHTML = '';

            // Display each product in a card format
            products.forEach(product => {
                const card = document.createElement('div');
                card.classList.add('product'); // Add class for styling

                // Insert HTML structure for each product card
                card.innerHTML = `
                    <img src="${product.image_url}" alt="${product.name}" class="product-image"/>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">${product.price} บาท</p>
                    <button class="btn-buy">ซื้อสินค้า</button>
                `;

                // Append the card to the container
                container.appendChild(card);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
});
