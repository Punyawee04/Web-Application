

document.addEventListener("DOMContentLoaded", async () => {
    
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    if (!token) {
        alert('You must log in to access this page.');
        window.location.href = '/login'; // Redirect to login if token is missing
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
            
            const adminId = data[i].login_id;
            const adminEmail = data[i].email;
            const adminName = data[i].userName;
            const adminImg = data[i].img_url;

            // Create a new row of data
            const adminRow = `
                <tr>
                    <td><img src="${adminImg}" alt="Staff Profile" width="30"></td>
                    <td>${adminName}</td>
                    <td>${adminEmail}</td>
                    <td class="action-buttons">
                        <button class="action-button" onclick="openPopup('popupOverlay')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="black" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                            </svg>
                        </button>
                        <button onclick="openPopup('deletePopup', '${adminId}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#EC297B" class="bi bi-trash3" viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                            </svg>
                        </button>
                    </td>
                </tr>
            `;
            
            // Append the new row to the admin list table
            adminList.insertAdjacentHTML("beforeend", adminRow);
   
        }
   
   } catch (err) {
        console.error('Error fetching user data:', err);
        alert('Failed to load user data. Please try again later.');
   }
});
