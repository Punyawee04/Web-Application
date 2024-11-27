// รอจนกว่า DOM จะโหลดเสร็จสมบูรณ์
document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const productContainer = document.getElementById("product-container");
    const searchTermElement = document.getElementById("search-term");
    // เพิ่ม Event Listener ให้ฟอร์ม เมื่อกด Submit
    searchForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const query = searchInput.value.trim();
        if (!query) {
            alert("Please enter a search term!");
            return;
        }

        try {
            // ส่งคำขอ (Request) แบบ POST ไปยัง API /search
            const response = await fetch("http://localhost:8080/api/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: query }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch search results");
            }

            const products = await response.json();

            // เก็บผลลัพธ์ใน LocalStorage เพื่อให้หน้าอื่นนำไปใช้
            localStorage.setItem("searchResults", JSON.stringify(products));
            localStorage.setItem("searchQuery", query);

            // เปลี่ยนไปยังหน้า search-result(ce).html
            window.location.href = "http://localhost:8081/search-result";
        } catch (error) {
            console.error("Error fetching search results:", error);
            alert("An error occurred while fetching search results.");
        }
    });
});