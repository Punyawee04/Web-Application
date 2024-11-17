// Import required modules
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');

const authenticateToken = require('./authMiddleware');


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage });
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

// Route to fetch all products
app.get('/api/products', (req, res) => {
    const sql = `SELECT 
            product_id,
            product_name,
            brand,
            price,
            image_url,
            stock_quantity,
            category_name
        FROM 
            Product
`;
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});
//Add product


// Add product route
app.post('/api/add-product', upload.single('image'), (req, res) => {
    const {
        product_id,
        product_name,
        price,
        description
    } = req.body;

    const imageUrl = req.file ? `/images/${req.file.filename}` : null;

    const query = `
        INSERT INTO Product (product_id, product_name, price, description, image_url)
        VALUES (?, ?, ?, ?, ?)
    `;

    const values = [product_id, product_name, price, description, imageUrl];

    db.query(query, values, (err) => {
        if (err) {
            console.error('Error saving product:', err);
            res.status(500).json({ message: 'Error saving product' });
        } else {
            res.status(201).json({ message: 'Product added successfully!' });
        }
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

// search
app.post('/api/search', (req, res) => {
    console.log('Request received at /api/search'); // ตรวจสอบว่า Route ถูกเรียก

    const query = req.body.query; // ดึง query จาก req.body
    console.log('Query received:', query); // Debug query

    if (!query) {
        console.log('Query is missing'); // Log กรณีไม่มี query
        return res.status(400).json({ error: 'Query is required' });
    }

    // SQL สำหรับการค้นหา
    const sql = `
        SELECT * FROM Product 
        WHERE product_name LIKE ? 
           OR description LIKE ? 
           OR brand LIKE ? 
           OR benefit LIKE ?
    `;

    const searchValue = `%${query}%`;
    console.log('SQL Query:', sql, 'Search Value:', searchValue); // Debug SQL

    db.query(sql, [searchValue, searchValue, searchValue, searchValue], (err, results) => {
        if (err) {
            console.error('Database Error:', err); // Log ข้อผิดพลาดของฐานข้อมูล
            return res.status(500).json({ error: 'Database query failed' });
        }

        console.log('Search Results:', results); // Debug ผลลัพธ์
        res.setHeader('Content-Type', 'application/json'); // ระบุว่า Response เป็น JSON
        res.json(results); // ส่งผลลัพธ์
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
