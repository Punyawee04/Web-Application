// เพิ่ม Event Listener เพื่อรอจนกว่าคอนเทนต์ของ DOM จะโหลดเสร็จ
document.addEventListener("DOMContentLoaded", async () => {
    console.log("callProduct.js loaded");

    // ดึงข้อมูลสินค้า (Products) จาก Backend
    const products = await fetchProducts();

    // แสดงสินค้าผ่าน Product Cards
    renderProductCards(products);

    // เพิ่มฟังก์ชัน "Buy Now" ให้ปุ่มใน Product Cards
    addBuyButtonListeners();
});

// ฟังก์ชันสำหรับดึงข้อมูลสินค้า (Products) จาก Backend
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
        return [];
    }
}

// ฟังก์ชันสำหรับแสดงสินค้าในรูปแบบ Product Cards
function renderProductCards(products) {
    const container = document.getElementById("product-container");

    if (!container) {
        console.error("Product container not found!");
        return;
    }

    container.innerHTML = ""; // Clear the container before rendering

    const limitedProducts = products.slice(0, 4); // Limit to 4 products
    // วนลูปเพื่อสร้าง Card สำหรับสินค้าแต่ละชิ้น
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

// ฟังก์ชันสำหรับเพิ่ม Event Listener ให้ปุ่ม "Buy Now"
function addBuyButtonListeners() {
    const buyButtons = document.querySelectorAll(".btn-buy");

    if (buyButtons.length === 0) {
        console.warn("No Buy buttons found!");
        return;
    }

    console.log(`Found ${buyButtons.length} Buy buttons`);
    // เพิ่ม Event Listener ให้แต่ละปุ่ม
    buyButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const productId = button.getAttribute("data-id");
            console.log(`Redirecting to: product-detail?product_id=${productId}`);

            if (productId) {
                // เปลี่ยนเส้นทางไปยังหน้ารายละเอียดสินค้า พร้อมส่งค่า product_id ใน Query String
                window.location.href = `/product-detail?product_id=${productId}`;
            } else {
                console.error("Product ID not found!");
            }
        });
    });
}
