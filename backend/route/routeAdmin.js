
const express = require('express');
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const router = express.Router();




// Route to fetch data from the LoginDetail table
router.get('/loginDetails', (req, res) => {
    db.query('SELECT * FROM LoginDetail', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Route to insert a new user into the LoginDetail table
router.post('/addLoginDetail', async (req, res) => {
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

// API to fetch Administrator data
router.get('/admins', (req, res) => {
    const query = `
        SELECT 
            a.admin_id, 
            a.admin_name, 
            a.login_Date, 
            a.login_Time, 
            l.Email AS admin_email 
        FROM 
            Administrator a
        JOIN 
            LoginDetail l ON a.login_id = l.login_id;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.status(200).json(results);
    });
});



// Register
router.post('/register', async (req, res) => {
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
router.post('/login', (req, res) => {
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


module.exports = router;