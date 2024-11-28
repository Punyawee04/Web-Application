// นำเข้าโมดูลที่จำเป็น
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./config/db');
const cors = require('cors');
const multer = require('multer');
const fs = require("fs");

// นำเข้า routes
const authenticateToken = require('./authMiddleware');
const productRoutes = require('./route/routeProduct');
const adminRoutes = require('./route/routeAdmin');
const adminAction = require('./route/adminAction');


dotenv.config();
const app = express();
app.use(cors({
    origin: 'http://localhost:8081', // Frontend URL
}));
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api', productRoutes);
app.use('/api', adminRoutes);
app.use('/api', adminAction);

// การจัดการ user management และ product management
app.get('/api/user-manage', authenticateToken, (req, res) => {
    res.json({ message: 'User Management Access Granted', user: req.user });
});
app.get('/api/product-manage', authenticateToken, (req, res) => {
    res.json({ message: 'User Management Access Granted', user: req.user });
});


// ไม่พบหมายเลขอ้างอิง 404
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// จัดการกับ errors
app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Internal server error' });
});


// เริ่มต้นเซิร์ฟเวอร์
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});