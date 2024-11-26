document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:8080/api/admins'); // Replace with your API URL
        if (!response.ok) {
            throw new Error('Failed to fetch administrator data.');
        }

        const admins = await response.json();

        // Get the table body
        const adminList = document.getElementById('admin-list');

        // Clear existing rows
        adminList.innerHTML = '';

        // Populate rows
        admins.forEach(admin => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td><img src="../src/Guest.jpg" alt="Admin Pic" width="40"></td>
                <td>${admin.admin_name}</td>
                <td>${admin.admin_email}</td>
                <td>
                    <button onclick="editAdmin(${admin.admin_id})" class="action-button" data-id="${admin.admin_id}">Edit</button>
                    <button onclick="deleteAdmin(${admin.admin_id})" class="delete-btn" data-id="${admin.admin_id}">Delete</button>
                </td>
            `;
            adminList.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading administrator data:', error);
        alert('Failed to load administrator data. Please try again.');
    }
});

function editAdmin(adminId) {
    alert(`Edit Admin: ${adminId}`); // Replace with actual edit functionality
}

// Delete admin
async function deleteAdmin(adminId) {
    try {
        const response = await fetch(`http://localhost:8080/api/delete-admin/${adminId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete admin');
        }

        alert('Admin deleted successfully!');
        location.reload(); // Reload the page to reflect changes
    } catch (error) {
        console.error('Error deleting admin:', error);
        alert('Failed to delete admin.');
    }
}


