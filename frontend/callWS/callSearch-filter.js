// ฟังก์ชันสำหรับดึงข้อมูลผลการค้นหาด้วยตัวกรอง
function fetchFilteredResults(searchParams) {
    return fetch('http://localhost:8080/api/filter-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            localStorage.setItem('searchResults', JSON.stringify(data)); // เก็บผลลัพธ์ใน LocalStorage
            return data;
        })
        .catch((error) => {
            console.error('Error fetching filtered results:', error);
            throw error;
        });
}

// เพิ่มฟังก์ชันนี้เข้า global scope
window.fetchFilteredResults = fetchFilteredResults;
