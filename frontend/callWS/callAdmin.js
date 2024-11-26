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
                    <button onclick="editAdmin(${admin.admin_id})" class="edit-btn" data-id="${admin.admin_id}">Edit</button>
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

// Function to open the update popup and pre-fill data
function openUpdatePopup(adminId) {
    fetch(`http://localhost:8080/api/get-admin/${adminId}`) // Adjust the backend route to fetch admin details
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch admin data.');
            }
            return response.json();
        })
        .then(data => {
            // Pre-fill the form with fetched admin data
            document.getElementById('update_admin_id').value = adminId;
            document.getElementById('update_username').value = data.username;
            document.getElementById('update_password').value = ''; // Leave password blank for security
            document.getElementById('update_email').value = data.email;
            document.getElementById('update_status').value = data.status;
            document.getElementById('update_admin_name').value = data.admin_name;
            document.getElementById('update_phone_number').value = data.phone_number;
            document.getElementById('update_admin_email').value = data.admin_email;

            // Display the update popup
            document.getElementById('updateAdminPopup').style.display = 'flex';
        })
        .catch(error => {
            console.error('Error fetching admin data:', error);
            alert('Failed to fetch admin details.');
        });
}

// Edit Admin button handler
function editAdmin(adminId) {
    console.log(`Editing admin with ID: ${adminId}`);
    openUpdatePopup(adminId);
}

// Handle update form submission
document.getElementById('updateAdminForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const adminId = document.getElementById('update_admin_id').value;
    const updatedData = {
        username: document.getElementById('update_username').value,
        password: document.getElementById('update_password').value || null, // Optional: leave null if not updating
        email: document.getElementById('update_email').value,
        status: document.getElementById('update_status').value,
        admin_name: document.getElementById('update_admin_name').value,
        phone_number: document.getElementById('update_phone_number').value,
        admin_email: document.getElementById('update_admin_email').value,
    };

    try {
        const response = await fetch(`http://localhost:8080/api/update-admin/${adminId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            throw new Error('Failed to update admin');
        }

        alert('Admin updated successfully!');
        document.getElementById('updateAdminPopup').style.display = 'none'; // Close popup
        location.reload(); // Reload the page to reflect changes
    } catch (error) {
        console.error('Error updating admin:', error);
        alert('Failed to update admin.');
    }
});



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

// Function to close the popup
function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}