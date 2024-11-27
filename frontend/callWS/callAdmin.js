// เมื่อหน้าเว็บโหลดเสร็จสิ้น (DOMContentLoaded)
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // ส่งคำขอไปยัง API เพื่อดึงข้อมูลผู้ดูแลระบบ
        const response = await fetch('http://localhost:8080/api/admins'); // Replace with your API URL
        if (!response.ok) {
            throw new Error('Failed to fetch administrator data.');
        }

        const admins = await response.json();
        // เลือกส่วน table body ที่จะแสดงข้อมูลผู้ดูแลระบบ
        const adminList = document.getElementById('admin-list');

        adminList.innerHTML = '';
        // เติมข้อมูลผู้ดูแลระบบในตาราง
        admins.forEach(admin => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td><img src="../src/Guest.jpg" alt="Admin Pic" width="40"></td>
                <td>${admin.admin_name}</td>
                <td>${admin.admin_email}</td>
                <td>
                    <button onclick="editAdmin(${admin.admin_id})" class="edit-btn" data-id="${admin.admin_id}">Edit</button>
                    <button onclick="deleteAdmin(${admin.admin_id})" class="delete-btn" data-id="${admin.admin_id}">Delete</button>
                </td>
            `;
            adminList.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading administrator data:', error);
        alert('Failed to load administrator data. Please try again.');
    }
});
// เปิดหน้าต่าง Popup สำหรับอัปเดตข้อมูลผู้ดูแลระบบ
function openUpdatePopup(adminId) {
    fetch(`http://localhost:8080/api/get-admin/${adminId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch admin data.');
            }
            return response.json();
        })
        .then((data) => {
            // เติมข้อมูลลงในฟอร์มอัปเดต
            document.getElementById('update_admin_id').value = adminId;
            document.getElementById('update_username').value = data.username;

            // ตรวจสอบและเติมรหัสผ่านถ้ามี
            const passwordField = document.getElementById('update_password');
            if (data.password) {
                passwordField.value = data.password;
            } else {
                passwordField.value = ''; // Optional: Default to empty if not provided
            }

            document.getElementById('update_email').value = data.email;
            document.getElementById('update_status').value = data.status;
            document.getElementById('update_admin_name').value = data.admin_name;
            document.getElementById('update_phone_number').value = data.phone_number;
            document.getElementById('update_admin_email').value = data.admin_email;

            // แสดงหน้าต่าง Popup
            document.getElementById('updateAdminPopup').style.display = 'flex';
        })
        .catch((error) => {
            console.error('Error fetching admin data:', error);
            alert('Failed to fetch admin details.');
        });
}

// ฟังก์ชันสำหรับเปิด/ปิดการแสดงรหัสผ่าน
function togglePasswordVisibility() {
    const passwordField = document.getElementById('update_password');
    const toggleCheckbox = document.getElementById('toggle_password_visibility');
    passwordField.type = toggleCheckbox.checked ? 'text' : 'password';
}

// ฟังก์ชันสำหรับกดปุ่มแก้ไข (Edit Admin)
function editAdmin(adminId) {
    console.log(`Editing admin with ID: ${adminId}`);
    openUpdatePopup(adminId);
}

// ฟังก์ชันสำหรับลบผู้ดูแลระบบ
async function deleteAdmin(adminId) {
    try {
        // ส่งคำขอ DELETE ไปยัง API
        const response = await fetch(`http://localhost:8080/api/delete-admin/${adminId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete admin');
        }

        alert('Admin deleted successfully!');
        location.reload(); // Reload the page to reflect changes
    } catch (error) {
        console.error('Error deleting admin:', error);
        alert('Failed to delete admin.');
    }
}

// ฟังก์ชันสำหรับปิดหน้าต่าง Popup
function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}