// นำเข้าโมดูลที่จำเป็น
const express = require('express');
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
// ใช้สำหรับการแฮชรหัสผ่าน
const bcrypt = require('bcryptjs');
// ใช้สำหรับสร้างและตรวจสอบ JWT
const jwt = require('jsonwebtoken');
// ใช้จัดการไฟล์ในระบบไฟล์
const fs = require('fs');

const router = express.Router();

// Route to fetch data from the LoginDetail table
// Testing: loginDetails
// method: GET
// URL: http://localhost:8080/api/loginDetails
// body:
//GET: ดึงข้อมูลจากตาราง LoginDetail
router.get('/loginDetails', (req, res) => {
    db.query('SELECT * FROM LoginDetail', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Route to insert a new user into the LoginDetail table
// Testing1: addLoginDetail
// method: POST
// URL: http://localhost:8080/api/addLoginDetail
// body: raw JSON
// {
//   "username": "admin3",
//   "password": "3333"
// }

// Testing2: addLoginDetail
// method: POST
// URL: http://localhost:8080/api/addLoginDetail
// body:
// {
//   "username": "admin4",
//   "password": "4444"
// }
//POST: เพิ่มผู้ใช้ใหม่ในตาราง LoginDetail พร้อมแฮชรหัสผ่าน
router.post('/addLoginDetail', async (req, res) => {
    const { username, password } = req.body;
    // ตรวจสอบว่ามีการส่งข้อมูลครบถ้วนหรือไม่
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        // แฮชรหัสผ่านก่อนบันทึก
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
// Testing: /admins
// method: GET
// URL: http://localhost:8080/api/admins
// body:
//GET: ดึงข้อมูลจากตาราง Administrator
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

// Login endpoint
// Testing1: /login
// method: POST
// URL: http://localhost:8080/api/login
// body: raw JSON
// {
//   "username": "admin2",
//   "password": "2222"
// }

// Testing2: /login
// method: POST
// URL: http://localhost:8080/api/login
// body:
// {
//   "username": "admin3",
//   "password": "3333"
// }
//POST: เข้าสู่ระบบ
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    console.log('Login Request:', { username, password });

    // ตรวจสอบว่ามีการส่งข้อมูลครบถ้วนหรือไม่
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

        // ตรวจสอบว่าพบผู้ใช้หรือไม่
        if (results.length === 0) {
            console.log('User not found:', username);
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        const user = results[0];
        console.log('Stored Password:', user.Password);

        // ตรวจสอบรหัสผ่านที่รับมาว่าตรงกับรหัสผ่านที่เก็บในฐานข้อมูลหรือไม่
        if (password !== user.Password) {
            console.log('Passwords do not match!');
            return res.status(400).json({ message: 'Invalid username or password.' });
        }
        // สร้าง JWT Token เมื่อการตรวจสอบสำเร็จ
        const token = jwt.sign(
            { userId: user.login_id, username: user.UserName },
            'blommpass',
            { expiresIn: '1h' }  // Token หมดอายุใน 1 ชั่วโมง
        );


        res.json({
            message: 'Login successful!',
            token,
            expiresIn: 3600 // อายุการใช้งานของ Token (หน่วยเป็นวินาที)
        });
    });
});


module.exports = router;