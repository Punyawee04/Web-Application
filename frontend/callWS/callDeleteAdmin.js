export async function deleteAdmin(adminId) {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    try {
        const response = await fetch(`http://localhost:8080/api/users-data/${adminId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete admin');
        }

        // Remove the admin row from the table
        document.getElementById(`admin-${adminId}`).remove();
        alert('Admin deleted successfully');
    } catch (err) {
        console.error('Error deleting admin:', err);
        alert('Failed to delete admin. Please try again later.');
    }
}
