

document.addEventListener("DOMContentLoaded", async () => {
    
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    if (!token) {
        alert('You must log in to access this page.');
        window.location.href = '/login'; // Redirect to login if token is missing
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/user-data', {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
   
        if (!response.ok) {
            throw new Error('Invalid or expired token');
        }
   
        const data = await response.json();
        document.getElementById('admin-profile').src = data.image_url || "";
        document.getElementById('admin-username').textContent = data.username || 'N/A';
        document.getElementById('admin-email').textContent = data.email || 'N/A';
    
   } catch (err) {
        console.error('Error fetching user data:', err);
        alert('Failed to load user data. Please try again later.');
   }
   
});
