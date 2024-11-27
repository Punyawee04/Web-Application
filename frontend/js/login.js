document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const messageDiv = document.getElementById('message');

    if (loginButton) {
        loginButton.addEventListener('click', async () => {
            // ดึงค่าจากฟิลด์อินพุต
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // ลบข้อความเก่าใน messageDiv
            messageDiv.textContent = '';

            try {
                // ส่งคำขอล็อกอินไปยัง backend
                const response = await fetch('http://localhost:8080/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // หากล็อกอินสำเร็จ ให้บันทึก JWT token และ username ลงใน localStorage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('username', username); // Save username
                    messageDiv.textContent = 'Login successful!';
                    messageDiv.style.color = 'green';

                    // เปลี่ยนเส้นทางไปยังหน้าจัดการผู้ใช้
                    window.location.href = '/user-manage';
                } else {
                    // หากล็อกอินไม่สำเร็จ แสดงข้อความข้อผิดพลาด
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

    // ตรวจสอบว่ามีผู้ใช้ล็อกอินอยู่หรือไม่จาก localStorage
    const username = localStorage.getItem('username');

    if (username) {
        fetchAccountDetails(username);
    } else {
        console.warn('No user logged in.');
    }
});



