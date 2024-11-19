fetch('http://localhost:8080/api/products')
    .then(response => response.json())
    .then(products => {
        const container = document.getElementById('product-container');
        const limitedProducts = products.slice(0, 4); // Limit to 4 products

        // สร้างสินค้าแบบ Dynamic
        limitedProducts.forEach(product => {
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

        // เรียกฟังก์ชันเพิ่ม Event Listener ให้ปุ่ม
        addBuyButtonListeners();
    })
    .catch(error => console.error('Error fetching products:', error));


buyButtons.forEach(button => {
    button.addEventListener("click", async () => {
        const productId = button.getAttribute("data-id");
        console.log(`Button clicked with product ID: ${productId}`);

        if (!productId) {
            console.error("Product ID not found!");
            return;
        }

        // Fetch product details
        try {
            const response = await fetch(`http://localhost:8080/api/product-detail/${productId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const productData = await response.json();
            console.log("Fetched product data:", productData);

            // Save product data to localStorage
            localStorage.setItem("selectedProductData", JSON.stringify(productData));

            // Redirect to product-detail page
            window.location.href = "/product-detail";
        } catch (error) {
            console.error("Error fetching product details:", error);
            alert("Failed to fetch product details. Please try again.");
        }
    });
});
function addBuyButtonListeners() {
    const buyButtons = document.querySelectorAll('.btn-buy');

    if (buyButtons.length === 0) {
        console.warn('No Buy buttons found!');
        return;
    }

    console.log(`Found ${buyButtons.length} buy buttons`);

    buyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const productId = button.getAttribute('data-id');
            console.log(`Button clicked with product ID: ${productId}`);

            if (!productId) {
                console.error('Product ID not found!');
                return;
            }

            try {
                // ดึงข้อมูลสินค้าโดยใช้ productId
                const response = await fetch(`http://localhost:8080/api/product-detail/${productId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const productData = await response.json();
                console.log('Fetched product data:', productData);

                // บันทึกข้อมูลสินค้าใน localStorage
                localStorage.setItem('selectedProductData', JSON.stringify(productData));

                // เปลี่ยนเส้นทางไปยังหน้ารายละเอียดสินค้า
                window.location.href = '/product-detail';
            } catch (error) {
                console.error('Error fetching product details:', error);
                alert('Failed to fetch product details. Please try again.');
            }
        });
    });
}

