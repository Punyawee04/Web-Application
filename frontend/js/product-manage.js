document.addEventListener("DOMContentLoaded", async () => {
    // ดึง token จาก localStorage เพื่อเช็คการ login
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in first.');
        // เปลี่ยนเส้นทางไปหน้า login
        window.location.href = 'login.html';
    }
    const tableBody = document.querySelector("tbody");
    // ดึงข้อมูลสินค้าจาก API
    const products = await fetchProducts();
    renderProducts(products);
    // ฟังก์ชันแสดงข้อมูลสินค้าในตาราง
    function renderProducts(products) {
        if (!tableBody) return;

        tableBody.innerHTML = "";

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
        // เพิ่ม event listener ให้ปุ่ม edit และ delete
        tableBody.addEventListener("click", (event) => {
            const target = event.target.closest("button");
            if (!target) return;

            const productId = target.getAttribute("data-id");

            if (target.classList.contains("edit-button")) {
                // ถ้าคลิกปุ่ม Edit ให้เปลี่ยนเส้นทางไปที่ update-product พร้อมแนบ product_id
                window.location.href = `update-product?product_id=${productId}`;
            }
        });
    }
    // ฟังก์ชันดึงข้อมูลสินค้า
    async function fetchProducts() {
        const response = await fetch("http://localhost:8080/api/products");
        return await response.json();
    }
    // ฟังก์ชันลบสินค้า
    async function deleteProduct(productId) {
        await fetch(`http://localhost:8080/api/products/${productId}`, { method: "DELETE" });
        location.reload();
    }
});



