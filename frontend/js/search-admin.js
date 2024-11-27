document.addEventListener("DOMContentLoaded", async () => {
    const adminList = document.querySelector("#admin-list");
    const searchBar = document.querySelector(".search-bar");
    const showAllButton = document.getElementById("show-all-button");
    // เก็บรายชื่อผู้ดูแลระบบทั้งหมด
    let allAdmins = [];

    // ดึงข้อมูลผู้ดูแลระบบจากเซิร์ฟเวอร์
    async function fetchAdmins() {
        try {
            const response = await fetch("http://localhost:8080/api/admins"); // Replace with your API URL
            if (!response.ok) throw new Error("Failed to fetch admins");
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    // แสดงรายชื่อผู้ดูแลระบบในตาราง
    function displayAdmins(admins) {
        adminList.innerHTML = "";
        admins.forEach((admin) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="../src/Guest.jpg" alt="Admin Pic" style="width: 50px; height: 50px;"></td>
                <td>${admin.admin_name}</td>
                <td>${admin.admin_email}</td>
                <td>
                    <button onclick="editAdmin(${admin.admin_id})" class="edit-btn" data-id="${admin.admin_id}">Edit</button>
                    <button onclick="deleteAdmin(${admin.admin_id})" class="delete-btn" data-id="${admin.admin_id}">Delete</button>
                </td>`;
            adminList.appendChild(row);
        });
    }

    // ฟังก์ชันค้นหาผู้ดูแลระบบ
    searchBar.addEventListener("input", () => {
        const query = searchBar.value.toLowerCase();
        const filteredAdmins = allAdmins.filter((admin) =>
            admin.admin_name.toLowerCase().includes(query) ||
            admin.admin_email.toLowerCase().includes(query)
        );
        displayAdmins(filteredAdmins);
    });

    // ฟังก์ชันสำหรับปุ่ม "แสดงทั้งหมด" (ถ้ามี)
    if (showAllButton) {
        showAllButton.addEventListener("click", () => {
            searchBar.value = "";
            displayAdmins(allAdmins);
        });
    }

    // ดึงข้อมูลผู้ดูแลระบบและแสดงในตารางเมื่อโหลดหน้า
    allAdmins = await fetchAdmins();
    displayAdmins(allAdmins);
});
