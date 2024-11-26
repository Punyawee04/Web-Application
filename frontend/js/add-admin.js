document.addEventListener('DOMContentLoaded', () => {
    // Open Popup
    document.querySelector('.add-staff-btn').addEventListener('click', () => {
        document.getElementById('addAdminPopup').style.display = 'flex';
    });

    // Close Popup
    function closePopup(popupId) {
        document.getElementById(popupId).style.display = 'none';
    }

    window.closePopup = closePopup; // Expose to inline `onclick`

    // Handle Form Submission
    document.getElementById('addAdminForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        // Gather Form Data
        const formData = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            email: document.getElementById('email').value,
            status: document.getElementById('status').value,
            admin_name: document.getElementById('admin_name').value,
            phone_number: document.getElementById('phone_number').value,
            admin_email: document.getElementById('admin_email').value,
        };

        try {
            const response = await fetch('http://localhost:8080/api/add-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to add admin');
            }

            const result = await response.json();
            alert(result.message);
            closePopup('addAdminPopup'); // Close the popup
            document.getElementById('addAdminForm').reset(); // Reset form
        } catch (error) {
            console.error('Error adding admin:', error);
            alert('Failed to add admin.');
        }
    });
});