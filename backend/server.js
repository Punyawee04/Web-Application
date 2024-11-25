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

const authenticateToken = require('./authMiddleware');
const productRoutes = require('./route/routeProduct');

dotenv.config();
const app = express();
app.use(cors({
    origin: 'http://localhost:8081', // Frontend URL
}));
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

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

// Register
app.post('/api/register', async (req, res) => {
    const { firstname, lastname, username, password, email, img_src } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const uuid = crypto.randomUUID();
        const hashedPassword = await bcrypt.hash(password, 10);

        const sqlLoginDetail = `INSERT INTO LoginDetail (login_id, UserName, Password, Email, login_Time, logout_Time, login_Date, Status) 
                                VALUES (?, ?, ?, ?, '00:00', '00:00', CURDATE(), 'Active')`;

        const sqlAdministrator = `INSERT INTO Administor (admin_name, login_id, image_url, login_Date, login_Time) 
                                  VALUES (?, ?, ?, CURDATE(), '00:00')`;

        db.query(sqlLoginDetail, [uuid, username, hashedPassword, email], (err, result) => {
            if (err) {
                if (err.code == 'ER_DUP_ENTRY') {
                    console.error('Database Error:', err);
                    return res.status(500).json({ message: 'Error duplicate data' });
                }
                console.error('Database Error:', err);
                return res.status(500).json({ message: 'Database error.' });
            }

            db.query(sqlAdministrator, [`${firstname} ${lastname}`, uuid, img_src], (err, result) => {
                if (err) {
                    if (err.code == 'ER_DUP_ENTRY') {
                        console.error('Database Error:', err);
                        return res.status(500).json({ message: 'Error duplicate data' });
                    }
                    console.error('Database Error:', err);
                    return res.status(500).json({ message: 'Database error.' });
                }

                res.status(201).json({ message: 'User registered successfully!' });
            });
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ message: 'Error hashing password.' });
    }
     
});



// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // ตรวจสอบว่า username และ password ถูกส่งมาหรือไม่
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    try{
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
            bcrypt.compare(password, user.Password, (err,data) => {
                if (err) throw err;
                if (data) {
                    const token = jwt.sign(
                        { userId: user.login_id, username: user.UserName },
                        'blommpass', // เปลี่ยนเป็น `process.env.JWT_SECRET` ในระบบจริง
                        { expiresIn: '30d' } // กำหนดอายุ 30 วัน
                    );
            
                    // ส่งกลับ Token และข้อความแจ้งเตือน
                    res.json({ 
                        message: 'Login successful!', 
                        token,
                        expiresIn: 2592000 // อายุของ Token เป็นวินาที (30 วัน)
                    });
                }else {
                    return res.status(401).json({ msg: "Invalid credencial" });
                }
            });
    
    
            
        });
    }catch (err) {
        console.error('Error hashing password:', err);
        res.status(500).json({ message: 'Error something wrong' });
    }
 

   
});






























// search filter
app.post('/api/filter-search', (req, res) => {
    const { brand, category, priceMin, priceMax } = req.body;

    let sql = `SELECT * FROM Product WHERE 1=1`;
    const params = [];

    if (brand) {
        sql += ` AND brand LIKE ?`;
        params.push(`%${brand}%`);
    }

    if (category) {
        sql += ` AND category_name = ?`;
        params.push(category);
    }

    if (priceMin) {
        sql += ` AND price >= ?`;
        params.push(priceMin);
    }

    if (priceMax) {
        sql += ` AND price <= ?`;
        params.push(priceMax);
    }

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.json(results);
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