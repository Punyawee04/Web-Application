document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:8080/api/products')
        .then(response => response.json())
        .then(products => {
            const container = document.getElementById('product-container');
            const limitedProducts = products.slice(0, 4);

            limitedProducts.forEach(product => {
                const card = document.createElement('div');
                card.classList.add('product-card');
                card.innerHTML = `
                    <img src="${product.image_url}" alt="${product.name}" class="product-image" />
                    <h3 class="product-name">${product.product_name}</h3>
                    <p class="product-price">฿${product.price}</p>
                    <p class="product-rating">⭐ ${product.product_rating}</p>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
});
