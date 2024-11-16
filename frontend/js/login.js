document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const messageDiv = document.getElementById('message');

    loginButton.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        // Get the values from the input fields
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        // Clear previous messages
        messageDiv.textContent = '';

        // Validate input
        if (!username || !password) {
            messageDiv.textContent = 'Username and password are required.';
            messageDiv.style.color = 'red';
            return;
        }

        try {
            // Send login request to backend
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Save the JWT token to local storage
                localStorage.setItem('token', data.token);
                messageDiv.textContent = 'Login successful!';
                messageDiv.style.color = 'green';

                // Redirect to the admin dashboard or a protected page
                setTimeout(() => {
                    window.location.href = '/user-manage';
                }, 1000); // Slight delay for user feedback
            } else {
                // Show error message
                messageDiv.textContent = data.message || 'Invalid username or password.';
                messageDiv.style.color = 'red';
            }
        } catch (error) {
            console.error('Error during login:', error);
            messageDiv.textContent = 'An error occurred. Please try again later.';
            messageDiv.style.color = 'red';
        }
    });
});
