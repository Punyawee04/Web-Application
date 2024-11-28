document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("addProductForm");
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("product_id");

    if (productId) {
        const product = await fetchProduct(productId);
        populateForm(product);
    }
    // จัดการการส่งฟอร์ม
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        // รวบรวมข้อมูลจากฟอร์ม
        const formData = {
            product_id: document.getElementById("product_id").value,
            product_name: document.getElementById("product_name").value,
            category_name: document.getElementById("category_name").value,
            description: document.getElementById("description").value,
            price: parseFloat(document.getElementById("price").value),
            stock_quantity: parseInt(document.getElementById("stock_quantity").value),
        };

        if (productId) {
            // หากมี `product_id` ให้แก้ไขสินค้า
            await updateProduct(formData);
        } else {
            // หากไม่มี `product_id` ให้เพิ่มสินค้าใหม่
            await addProduct(formData);
        }
        // เปลี่ยนเส้นทางกลับไปยังหน้ารายการสินค้า
        window.location.href = "product-manage"; 
    });

    // ฟังก์ชันดึงข้อมูลสินค้า
    async function fetchProduct(productId) {
        const response = await fetch(`http://localhost:8080/api/products/${productId}`);
        return await response.json();
    }
    // ฟังก์ชันเติมข้อมูลสินค้าในฟอร์ม
    function populateForm(product) {
        document.getElementById("product_id").value = product.product_id;
        document.getElementById("product_name").value = product.product_name;
        document.getElementById("category_name").value = product.category_name;
        document.getElementById("description").value = product.description;
        document.getElementById("price").value = product.price;
        document.getElementById("stock_quantity").value = product.stock_quantity;
    }

    // ฟังก์ชันเพิ่มสินค้าใหม่
    async function addProduct(product) {
        await fetch("http://localhost:8080/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product),
        });
    }
});
