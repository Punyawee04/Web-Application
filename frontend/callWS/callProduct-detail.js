// document.addEventListener("DOMContentLoaded", () => {
//     console.log("JavaScript Loaded");

//     // Define buyButtons by selecting all buttons with the class 'btn-buy'
//     const buyButtons = document.querySelectorAll(".btn-buy");

//     // Check if buttons are found
//     if (buyButtons.length === 0) {
//         console.warn("No buy buttons found!");
//         return;
//     }

//     console.log(`Found ${buyButtons.length} buy buttons`);

//     // Add event listeners to each button
//     buyButtons.forEach(button => {
//         button.addEventListener("click", async () => {
//             const productId = button.getAttribute("data-id");
//             console.log(`Button clicked with product ID: ${productId}`);

//             if (!productId) {
//                 console.error("Product ID not found!");
//                 return;
//             }

//             // Fetch product details
//             try {
//                 const response = await fetch(`http://localhost:8080/api/product-detail/${productId}`);
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }

//                 const productData = await response.json();
//                 console.log("Fetched product data:", productData);

//                 // Save product data to localStorage
//                 localStorage.setItem("selectedProductData", JSON.stringify(productData));

//                 // Redirect to product-detail page
//                 window.location.href = "/product-detail";
//             } catch (error) {
//                 console.error("Error fetching product details:", error);
//                 alert("Failed to fetch product details. Please try again.");
//             }
//         });
//     });
// });
