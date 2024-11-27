
const express = require('express');
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const router = express.Router();




// Route to fetch data from the LoginDetail table

// Testing: loginDetails
// method: GET
// URL: http://localhost:8080/api/loginDetails
// body:
router.get('/loginDetails', (req, res) => {
    db.query('SELECT * FROM LoginDetail', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Route to insert a new user into the LoginDetail table
// Testing: addLoginDetail
// method: POST
// URL: http://localhost:8080/api/addLoginDetail
// body: raw JSON
// {
//   "username": "admin3",
//   "password": "3333"
// }
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
// Testing: /admins
// method: GET
// URL: http://localhost:8080/api/admins
// body:
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



// // Register
// router.post('/register', async (req, res) => {
//     const { username, password, email } = req.body;

//     if (!username || !password) {
//         return res.status(400).json({ message: 'Username and password are required.' });
//     }

//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const sql = 'INSERT INTO LoginDetail (UserName, Password, Email, login_Time, logout_Time, login_Date, Status) VALUES (?, ?, ?, "00:00", "00:00", CURDATE(), "Active")';
//         db.query(sql, [username, hashedPassword, email], (err, result) => {
//             if (err) {
//                 console.error('Database Error:', err);
//                 return res.status(500).json({ message: 'Database error.' });
//             }
//             res.status(201).json({ message: 'User registered successfully!' });
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Error hashing password.' });
//     }
// });



// Login endpoint
// Testing: /login
// method: POST
// URL: http://localhost:8080/api/login
// body: raw JSON
// {
//   "username": "admin2",
//   "password": "2222"
// }
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    console.log('Login Request:', { username, password });

    // Validate that both username and password are provided
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

        // Check if the user exists
        if (results.length === 0) {
            console.log('User not found:', username);
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        const user = results[0];
        console.log('Stored Password:', user.Password);

        // Validate the password
        if (password !== user.Password) {
            console.log('Passwords do not match!');
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        // Generate a JWT token (valid for 1 hour)
        const token = jwt.sign(
            { userId: user.login_id, username: user.UserName },
            'blommpass', // Replace with `process.env.JWT_SECRET` in production
            { expiresIn: '1h' } // Token expiration: 1 hour
        );

        // Send back the token and success message
        res.json({
            message: 'Login successful!',
            token,
            expiresIn: 3600 // Token lifespan in seconds (1 hour)
        });
    });
});


module.exports = router;