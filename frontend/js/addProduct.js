document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('saveButton');

    saveButton.addEventListener('click', async () => {
        // Gather product data from the form
        const productData = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            mediaUrl: document.getElementById('mediaUrl').value,
            price: parseFloat(document.getElementById('price').value),
            comparePrice: parseFloat(document.getElementById('comparePrice').value),
            costPerItem: parseFloat(document.getElementById('costPerItem').value),
            status: document.getElementById('status').value,
            vendor: document.getElementById('vendor').value,
            category: document.getElementById('category').value,
            collections: document.getElementById('collections').value,
            quantity: parseInt(document.getElementById('quantity').value),
        };

        // Send product data to the backend API
        try {
            const response = await fetch('http://localhost:8080/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                // Optionally reset form after successful save
                document.getElementById('addProductForm').reset();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product. Please try again later.');
        }
    });
});
