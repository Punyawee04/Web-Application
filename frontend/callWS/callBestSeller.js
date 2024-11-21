fetch('http://localhost:8080/api/products')
    .then((response) => response.json())
    .then((products) => {
        const container = document.getElementById('product-container');
        const limitedProducts = products.slice(0, 4); // Limit to 4 products

        // Dynamically create product cards
        limitedProducts.forEach((product) => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.innerHTML = `
                <img src="${product.image_url}" alt="${product.product_name}" class="product-image" />
                <p class="product-name">${product.product_name}</p>
                <p class="product-price">฿${product.price}</p>
                <button class="btn-buy" data-id="${product.product_id}">Buy now</button>
            `;
            container.appendChild(card);
        });

        // Add event listeners to dynamically created buttons
        addBuyButtonListeners();
    })
    .catch((error) => console.error('Error fetching products:', error));

function addBuyButtonListeners() {
    const buyButtons = document.querySelectorAll('.btn-buy');

    if (buyButtons.length === 0) {
        console.warn('No Buy buttons found!');
        return;
    }

    console.log(`Found ${buyButtons.length} buy buttons`);

    buyButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            const productId = button.getAttribute('data-id');
            console.log(`Button clicked with product ID: ${productId}`);

            if (!productId) {
                console.error('Product ID not found!');
                return;
            }

            try {
                // Fetch product details using productId
                const response = await fetch(
                    `http://localhost:8080/api/product-detail/${productId}`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const productData = await response.json();
                console.log('Fetched product data:', productData);

                // Save product data to localStorage
                localStorage.setItem('selectedProductData', JSON.stringify(productData));

                // Redirect to product-detail page
                window.location.href = '/product-detail';
            } catch (error) {
                console.error('Error fetching product details:', error);
                alert('Failed to fetch product details. Please try again.');
            }
        });
    });
}
