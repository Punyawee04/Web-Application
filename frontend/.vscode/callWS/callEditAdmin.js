document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('You must log in to access this page.');
        window.location.href = '/login';
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/users-data', {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Invalid or expired token');
        }

        const data = await response.json();
        const adminList = document.getElementById("admin-list");

        for (let i = 0; i < data.length; i++) {
            const admin = data[i];

            const adminRow = `
                <tr>
                    <td><img src="${admin.img_url}" alt="Staff Profile" width="30"></td>
                    <td>${admin.userName}</td>
                    <td>${admin.email}</td>
                    <td class="action-buttons">
                        <button class="action-button" onclick="openEditPopup(${admin.login_id}, '${admin.userName}', '${admin.email}', '${admin.img_url}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="black" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                            </svg>
                        </button>
                    </td>
                </tr>
            `;

            adminList.insertAdjacentHTML("beforeend", adminRow);
        }

    } catch (err) {
        console.error('Error fetching user data:', err);
        alert('Failed to load user data. Please try again later.');
    }
});

// Function to open the edit popup
function openEditPopup(id, userName, email, imgUrl) {
    const popup = document.getElementById('editPopup');
    popup.style.display = 'block';

    // Populate the form with user data
    document.getElementById('editUserId').value = id;
    document.getElementById('editUserName').value = userName;
    document.getElementById('editUserEmail').value = email;
    document.getElementById('editUserImg').value = imgUrl;
}

// Function to save the edited data
async function saveEdit() {
    const id = document.getElementById('editUserId').value;
    const userName = document.getElementById('editUserName').value;
    const email = document.getElementById('editUserEmail').value;
    const imgUrl = document.getElementById('editUserImg').value;

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:8080/api/users-data/${id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ userName, email, img_url: imgUrl })
        });

        if (response.ok) {
            alert('User updated successfully!');
            window.location.reload();
        } else {
            throw new Error('Failed to update user');
        }
    } catch (err) {
        console.error('Error updating user:', err);
        alert('Failed to save changes. Please try again.');
    }
}

// Close the popup
function closePopup() {
    document.getElementById('editPopup').style.display = 'none';
}
