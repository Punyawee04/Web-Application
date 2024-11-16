document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');

    logoutButton.addEventListener('click', async () => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                await fetch('http://localhost:8080/api/logout', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (error) {
                console.error('Error logging out:', error);
            }
        }

        // Clear the token from localStorage
        localStorage.removeItem('token');

        // Redirect to login page
        window.location.href = '/login';
    });
});
