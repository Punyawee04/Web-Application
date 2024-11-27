document.addEventListener('DOMContentLoaded', async () => {
    // ดึงโทเค็นจาก localStorage
    const token = localStorage.getItem('token');

    if (!token) {
        alert('You must log in to access this page.');
        window.location.href = '/login';
        return;
    }

    try {
        // ตรวจสอบโทเค็นกับ backend
        const response = await fetch('http://localhost:8080/api/validate-token', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // หากโทเค็นไม่ถูกต้องหรือหมดอายุ
        if (!response.ok) {
            throw new Error('Invalid or expired token');
        }

        const data = await response.json();
        console.log('Token is valid:', data);
    } catch (err) {
        // กรณีโทเค็นไม่ถูกต้องหรือมีข้อผิดพลาด
        alert('Your session has expired or is invalid. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
});
