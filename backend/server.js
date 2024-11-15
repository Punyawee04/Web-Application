// Import required modules
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const cors = require('cors');
const authenticateToken = require('./authMiddleware');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to enable CORS for cross-origin requests
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Connection to MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Connect to DB
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log(`Connected to DB ${process.env.DB_NAME}`);
});

// Serve static files from the root directory (optional)
app.use(express.static(__dirname));

// Route to fetch all products
app.get('/api/products', (req, res) => {
    const sql = 'SELECT * FROM Product'; // Ensure your table is named correctly
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results); // Send product data as JSON
    });
});

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
app.post('/api/addLoginDetail', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }

    const sql = 'INSERT INTO LoginDetail (username, password) VALUES (?, ?)';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'User added successfully!', userId: result.insertId });
    });
});


// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Query the database for the user with the provided username
    const sql = 'SELECT * FROM LoginDetail WHERE UserName = ?';
    db.query(sql, [username], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const user = results[0]; // Get the user object from the results

        // Compare the provided password with the stored password directly
        if (password !== user.Password) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Generate JWT if the password matches
        const token = jwt.sign({ username: user.UserName }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.json({ token });
    });
});




// Catch-all route for undefined routes
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
