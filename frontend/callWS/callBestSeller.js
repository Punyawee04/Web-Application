// Add an event listener for when the DOM content is loaded
document.addEventListener("DOMContentLoaded", async () => {
    console.log("callProduct.js loaded");

    // Fetch products from the backend
    const products = await fetchProducts();

    // Render product cards
    renderProductCards(products);

    // Add "Buy Now" functionality to the product cards
    addBuyButtonListeners();
});

// Function to fetch products from the backend
async function fetchProducts() {
    try {
        const response = await fetch("http://localhost:8080/api/products");
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const products = await response.json();
        console.log("Products fetched:", products);
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return []; // Return an empty array if there's an error
    }
}

// Function to render product cards
function renderProductCards(products) {
    const container = document.getElementById("product-container");

    if (!container) {
        console.error("Product container not found!");
        return;
    }

    container.innerHTML = ""; // Clear the container before rendering

    const limitedProducts = products.slice(0, 4); // Limit to 4 products

    limitedProducts.forEach((product) => {
        const card = document.createElement("div");
        card.classList.add("product-card");
        card.innerHTML = `
            <img src="${product.image_url}" alt="${product.product_name}" class="product-image" />
            <p class="product-name">${product.product_name}</p>
            <p class="product-price">฿${product.price}</p>
            <button class="btn-buy" data-id="${product.product_id}">Buy now</button>
        `;
        container.appendChild(card);
    });
}

// Function to add "Buy Now" event listeners to buttons
function addBuyButtonListeners() {
    const buyButtons = document.querySelectorAll(".btn-buy");

    if (buyButtons.length === 0) {
        console.warn("No Buy buttons found!");
        return;
    }

    console.log(`Found ${buyButtons.length} Buy buttons`);

    buyButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const productId = button.getAttribute("data-id");
            console.log(`Redirecting to: product-detail?product_id=${productId}`);

            if (productId) {
                // Redirect to product detail page with the product ID in the query string
                window.location.href = `/product-detail?product_id=${productId}`;
            } else {
                console.error("Product ID not found!");
            }
        });
    });
}
