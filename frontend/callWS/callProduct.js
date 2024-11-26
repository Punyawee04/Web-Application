// Add an event listener for when the DOM content is loaded
document.addEventListener("DOMContentLoaded", async () => {
    console.log("callProduct.js loaded"); // Debug log

    // Check if the product container exists (for the product card page)
    const container = document.getElementById("product-container");
    const tableBody = document.querySelector("tbody");

    // Fetch products from the backend
    const products = await fetchProducts();

    if (tableBody) {
        tableBody.innerHTML = ""; // Clear the table body

        products.forEach((product) => {
            const row = document.createElement("tr");
            console.log("Product category:", product.category);
            
            row.innerHTML = `
            
                <td><img src="${product.image_url}" alt="${product.product_name}" style="width: 50px; height: 50px; margin-left:30px;"></td>
                <td>${product.product_id}</td>
                <td>${product.product_name}</td>
                <td>${product.brand || " -"}</td>
                <td>${product.category_name  || "Category"}</td>
                <td>${product.stock_quantity || 0} in stock</td>
                <td>${product.price || "0.00"} บาท</td>
                <td><span class="${product.status === "Active" ? "status-active" : "status-draft"}">${product.status || "Active"}</span></td>
                <td style"display:flex;     flex-direction: row;">
                    <button class="delete-button" data-id="${product.product_id}"><i class="bi bi-trash3"></i></button>

                    <button class="edit-button">Edit</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

         // Event delegation for delete buttons
         tableBody.addEventListener("click", (event) => {
            if (event.target.closest(".delete-button")) {
                const productId = event.target.closest(".delete-button").getAttribute("data-id");

                // Confirm deletion
                if (confirm("Are you sure you want to delete this product?")) {
                    deleteProduct(productId);
                }
            }
        });
    }
    // Render product cards if on the product list page
    if (container) {
        container.innerHTML = ""; // Clear the container

        products.forEach((product) => {
            const card = document.createElement("div");
            card.classList.add("product");

            card.innerHTML = `
                <img src="${product.image_url}" alt="${product.product_name}" class="product-image"/>
                <h5 class="product-name">${product.product_name}</h5>
                <p class="product-price">${product.price} บาท</p>
                <button class="btn-buy" data-id="${product.product_id}">Buy now</button>
            `;

            container.appendChild(card);
        });
    }

});
// Delete product for Admin pages
async function deleteProduct(productId) {
    try {
        const response = await fetch(`http://localhost:8080/api/delete-product/${productId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        alert("Product deleted successfully!");
        location.reload(); // Reload the page to reflect changes
    } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete the product.");
    }
}

// Define the reusable fetchProducts function 
async function fetchProducts() {
    try {
        const response = await fetch("http://localhost:8080/api/products");
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const products = await response.json();
        console.log("Products:", products); // Log the fetched products for debugging
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return []; // Return an empty array if there is an error
    }
}

