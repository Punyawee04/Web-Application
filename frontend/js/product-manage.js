document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in first.');
        window.location.href = 'login.html';
    }
    const tableBody = document.querySelector("tbody");

    const products = await fetchProducts();
    renderProducts(products);

    function renderProducts(products) {
        if (!tableBody) return;

        tableBody.innerHTML = ""; // Clear the table body

        products.forEach((product) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td><img src="${product.image_url}" alt="${product.product_name}" style="width: 50px; height: 50px;"></td>
                <td>${product.product_id}</td>
                <td>${product.product_name}</td>
                <td>${product.brand || "-"}</td>
                <td>${product.category_name || "Category"}</td>
                <td>${product.stock_quantity || 0} in stock</td>
                <td>${product.price || "0.00"} บาท</td>
                <td>
                    <button class="edit-button" data-id="${product.product_id}">Edit</button>
                    <button class="delete-button" data-id="${product.product_id}">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        tableBody.addEventListener("click", (event) => {
            const target = event.target.closest("button");
            if (!target) return;

            const productId = target.getAttribute("data-id");

            if (target.classList.contains("edit-button")) {
                // Redirect to add-product.html with the product ID
                window.location.href = `update-product?product_id=${productId}`;
            } 
        });
    }

    async function fetchProducts() {
        const response = await fetch("http://localhost:8080/api/products");
        return await response.json();
    }

    async function deleteProduct(productId) {
        await fetch(`http://localhost:8080/api/products/${productId}`, { method: "DELETE" });
        location.reload(); // Refresh the page
    }
});

