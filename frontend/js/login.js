document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const messageDiv = document.getElementById('message');

    if (loginButton) {
        loginButton.addEventListener('click', async () => {
            // Get the values from the input fields
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Clear previous messages
            messageDiv.textContent = '';

            try {
                // Send login request to backend
                const response = await fetch('http://localhost:8080/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Save the JWT token and username to local storage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('username', username); // Save username
                    messageDiv.textContent = 'Login successful!';
                    messageDiv.style.color = 'green';

                    // Redirect to the user management page
                    window.location.href = '/user-manage';
                } else {
                    // Show error message
                    messageDiv.textContent = data.message || 'Login failed';
                    messageDiv.style.color = 'red';
                }
            } catch (error) {
                console.error('Error during login:', error);
                messageDiv.textContent = 'An error occurred. Please try again later.';
                messageDiv.style.color = 'red';
            }
        });
    }

    // Fetch the logged-in username from localStorage
    const username = localStorage.getItem('username');

    if (username) {
        fetchAccountDetails(username);
    } else {
        console.warn('No user logged in.');
    }
});



