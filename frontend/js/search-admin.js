document.addEventListener("DOMContentLoaded", async () => {
    const adminList = document.querySelector("#admin-list"); // Table body for admins
    const searchBar = document.querySelector(".search-bar"); // Search input
    const showAllButton = document.getElementById("show-all-button"); // Optional "Show All" button

    let allAdmins = [];

    // Fetch admins from the server
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

    // Display admins in the table
    function displayAdmins(admins) {
        adminList.innerHTML = ""; // Clear previous rows
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

    // Search functionality
    searchBar.addEventListener("input", () => {
        const query = searchBar.value.toLowerCase();
        const filteredAdmins = allAdmins.filter((admin) =>
            admin.admin_name.toLowerCase().includes(query) ||
            admin.admin_email.toLowerCase().includes(query)
        );
        displayAdmins(filteredAdmins);
    });

    // Optional: Show all admins when "Show All" button is clicked
    if (showAllButton) {
        showAllButton.addEventListener("click", () => {
            searchBar.value = "";
            displayAdmins(allAdmins);
        });
    }

    // Fetch and display all admins on page load
    allAdmins = await fetchAdmins();
    displayAdmins(allAdmins);
});
