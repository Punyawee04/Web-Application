document.addEventListener('DOMContentLoaded', () => {
    // เปิด Popup เมื่อคลิกปุ่ม "Add Staff"
    document.querySelector('.add-staff-btn').addEventListener('click', () => {
        document.getElementById('addAdminPopup').style.display = 'flex';
    });

    // ฟังก์ชันปิด Popup
    function closePopup(popupId) {
        document.getElementById(popupId).style.display = 'none';
    }
    // เปิดใช้งานฟังก์ชันปิด Popup สำหรับ inline `onclick`
    window.closePopup = closePopup; 

    // การจัดการเมื่อส่งฟอร์ม
    document.getElementById('addAdminForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        // รวบรวมข้อมูลจากฟอร์ม
        const formData = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            email: document.getElementById('email').value,
            status: document.getElementById('status').value,
            admin_name: document.getElementById('admin_name').value,
            phone_number: document.getElementById('phone_number').value,
            admin_email: document.getElementById('admin_email').value,
        };

        try {
            const response = await fetch('http://localhost:8080/api/add-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to add admin');
            }

            const result = await response.json();
            alert(result.message);
            closePopup('addAdminPopup');
            document.getElementById('addAdminForm').reset();
        } catch (error) {
            console.error('Error adding admin:', error);
            alert('Failed to add admin.');
        }
    });
});