document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("addProductForm");
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("product_id");

    if (productId) {
        // Fetch and populate product data for editing
        const product = await fetchProduct(productId);
        populateForm(product);
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = {
            product_id: document.getElementById("product_id").value,
            product_name: document.getElementById("product_name").value,
            category_name: document.getElementById("category_name").value,
            description: document.getElementById("description").value,
            price: parseFloat(document.getElementById("price").value),
            stock_quantity: parseInt(document.getElementById("stock_quantity").value),
        };

        if (productId) {
            // Update product
            await updateProduct(formData);
        } else {
            // Add new product
            await addProduct(formData);
        }

        window.location.href = "product-manage"; // Redirect back to product list
    });

    async function fetchProduct(productId) {
        const response = await fetch(`http://localhost:8080/api/products/${productId}`);
        return await response.json();
    }

    function populateForm(product) {
        document.getElementById("product_id").value = product.product_id;
        document.getElementById("product_name").value = product.product_name;
        document.getElementById("category_name").value = product.category_name;
        document.getElementById("description").value = product.description;
        document.getElementById("price").value = product.price;
        document.getElementById("stock_quantity").value = product.stock_quantity;
    }


    async function addProduct(product) {
        await fetch("http://localhost:8080/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
        });
    }
});
