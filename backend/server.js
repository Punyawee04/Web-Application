// Import required modules
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./config/db');
const cors = require('cors');
const multer = require('multer');
const fs = require("fs");

// Import routes
const authenticateToken = require('./authMiddleware');
const productRoutes = require('./route/routeProduct');

dotenv.config();
const app = express();
app.use(cors({
    origin: 'http://localhost:8081', // Frontend URL
}));
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api', productRoutes);



// Route to fetch data from the LoginDetail table
app.get('/api/loginDetails', (req, res) => {
    db.query('SELECT * FROM LoginDetail', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Route to insert a new user into the LoginDetail table
app.post('/api/addLoginDetail', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = 'INSERT INTO LoginDetail (UserName, Password) VALUES (?, ?)';
        db.query(sql, [username, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'User added successfully!', userId: result.insertId });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error hashing password.' });
    }
});

// Secure user management and product management
app.get('/api/user-manage', authenticateToken, (req, res) => {
    res.json({ message: 'User Management Access Granted', user: req.user });
});
app.get('/api/product-manage', authenticateToken, (req, res) => {
    res.json({ message: 'User Management Access Granted', user: req.user });
});
// Register
app.post('/api/register', async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = 'INSERT INTO LoginDetail (UserName, Password, Email, login_Time, logout_Time, login_Date, Status) VALUES (?, ?, ?, "00:00", "00:00", CURDATE(), "Active")';
        db.query(sql, [username, hashedPassword, email], (err, result) => {
            if (err) {
                console.error('Database Error:', err);
                return res.status(500).json({ message: 'Database error.' });
            }
            res.status(201).json({ message: 'User registered successfully!' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error hashing password.' });
    }
});
// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    console.log('Login Request:', { username, password });

    // ตรวจสอบว่า username และ password ถูกส่งมาหรือไม่
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const sql = 'SELECT * FROM LoginDetail WHERE UserName = ?';
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ message: 'Database error.' });
        }

        console.log('Database Results:', results);

        // ตรวจสอบว่าเจอผู้ใช้งานหรือไม่
        if (results.length === 0) {
            console.log('User not found:', username);
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        const user = results[0];
        console.log('Stored Password:', user.Password);

        // ตรวจสอบ Password (ในกรณีนี้ยังไม่มีการใช้ bcrypt แต่ควรใช้ในระบบจริง)
        if (password !== user.Password) {
            console.log('Passwords do not match!');
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        // สร้าง JWT Token พร้อมกำหนดอายุ 1 ชั่วโมง
        const token = jwt.sign(
            { userId: user.login_id, username: user.UserName },
            'blommpass', // เปลี่ยนเป็น `process.env.JWT_SECRET` ในระบบจริง
            { expiresIn: '1h' } // กำหนดอายุ 1 ชั่วโมง
        );

        // ส่งกลับ Token และข้อความแจ้งเตือน
        res.json({ 
            message: 'Login successful!', 
            token,
            expiresIn: 3600 // อายุของ Token เป็นวินาที (1 ชั่วโมง)
        });
    });
});

// Handle 404 Not Found
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Handle unexpected errors
app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Internal server error' });
});


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});