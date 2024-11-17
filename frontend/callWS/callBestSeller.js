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
                    <p class="product-name">${product.product_name}</p>
                    <p class="product-price">฿${product.price}</p>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
});
