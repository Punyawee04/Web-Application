// นำเข้าโมดูล Express
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const port = 8081
// สร้างแอปพลิเคชัน Express
const app = express();
// ให้บริการไฟล์ static เช่น รูปภาพ
app.use('/images', express.static(path.join(__dirname, 'images')));

// ให้บริการไฟล์ static จาก root directory เช่น CSS หรือ JavaScript
app.use(express.static(__dirname));
app.use("/css", express.static(path.join(__dirname, "html/css")));
app.use("/js", express.static(path.join(__dirname, "callWS")));
app.use("/js", express.static(path.join(__dirname, "js")));
app.use(express.static(path.join(__dirname, 'html')));

// ให้บริการไฟล์ static สำหรับ frontend
const publicDirectory = path.join(__dirname, 'frontend'); // Adjust to your directory structure
app.use(express.static(publicDirectory));

// กำหนด route สำหรับการเข้าถึงไฟล์เฉพาะ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});
app.get('/team', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'Team.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'login.html'));
});
app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'search.html'));
});
app.get('/search-all', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'search-result.html'));
});
app.get('/add-product', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'add-product.html'));
});
app.get('/update-product', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'update-product.html'));
});
app.get('/user-manage', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'user_acc_manage.html'));
});
app.get('/product-manage', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'promanage.html'));
});
console.log("Serving JavaScript files from:", path.join(__dirname, "callWS"));

app.get('/search-result', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'search-result(ce).html'));
});

app.get('/filter-search', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'search-result(ce).html'));
});

app.get('/product-detail', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'Product_detail.html'));
});

app.get('/404', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'page not found.html'));
});

// ดักจับเส้นทางที่ไม่มีในระบบ และแสดงหน้า 404
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'html', 'page not found.html'));
});
// เริ่มต้นเซิร์ฟเวอร์
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
