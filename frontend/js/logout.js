document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');
    // เพิ่ม event listener เมื่อคลิกปุ่ม logout
    logoutButton.addEventListener('click', async () => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                // ส่งคำขอ logout ไปยัง backend
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

        // ลบ token ออกจาก localStorage
        localStorage.removeItem('token');

        // เปลี่ยนเส้นทางไปยังหน้า login
        window.location.href = '/login';
    });
});
