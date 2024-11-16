document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    if (!token) {
        alert('You must log in to access this page.');
        window.location.href = '/login'; // Redirect to login page if no token
        return;
    }

    try {
        // Validate the token with the backend
        const response = await fetch('http://localhost:8080/api/validate-token', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`, // Send the token for validation
            },
        });

        if (!response.ok) {
            throw new Error('Invalid or expired token');
        }

        const data = await response.json();
        console.log('Token is valid:', data); // You can use the user data if needed
    } catch (err) {
        alert('Your session has expired or is invalid. Please log in again.');
        localStorage.removeItem('token'); // Clear the token if invalid
        window.location.href = '/login'; // Redirect to login page
    }
});
