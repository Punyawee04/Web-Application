// Import required modules
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const fs = require("fs");

const authenticateToken = require('./authMiddleware');


dotenv.config();
const app = express();
app.use(cors());
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

// Route to fetch all products
app.get('/api/products', (req, res) => {
    const sql = `SELECT * FROM Product`;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json({ error: 'Failed to fetch products' });
        }

        console.log('Products Fetched:', results); // Debug log
        res.json(results);
    });
});




// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/'); // Directory to save uploaded images
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    },
});

const upload = multer({ storage });
// Add
app.post('/api/add-product', upload.single('image'), (req, res) => {
    const {
        product_id,
        product_name,
        category_name,
        price,
        description,
        product_rating,
        stock_quantity,
        origin,
        benefit,
        skin_type,
        quantity,
        ingredients,
        brand,
    } = req.body;

    // Generate the image URL based on the uploaded file
    const imageUrl = req.file ? `http://localhost:8080/images/${req.file.filename}` : null;

    if (!product_id || !product_name || !price) {
        return res.status(400).json({ message: 'Product ID, name, and price are required.' });
    }

    const query = `
        INSERT INTO Product (
            product_id, product_name, category_name, price, description, product_rating, stock_quantity, 
            origin, benefit, skin_type, quantity, ingredients, brand, image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        product_id,
        product_name,
        category_name,
        price,
        description,
        product_rating || null,
        stock_quantity || null,
        origin || null,
        benefit || null,
        skin_type || null,
        quantity || null,
        ingredients || null,
        brand || null,
        imageUrl, // Use the generated image URL
    ];

    db.query(query, values, (err) => {
        if (err) {
            console.error('Error saving product:', err);
            return res.status(500).json({ message: 'Failed to add product. Please try again.' });
        }
        res.status(201).json({ message: 'Product added successfully!' });
    });
});



// Route to fetch a single product by ID
app.get('/api/products/:id', (req, res) => {
    const productId = req.params.id;

    const query = `SELECT * FROM Product WHERE product_id = ?`;

    db.query(query, [productId], (err, results) => {
        if (err) {
            console.error("Error fetching product:", err);
            return res.status(500).json({ error: 'Failed to fetch product' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(results[0]); // Return the first matching product
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

// DELETE product endpoint
app.delete("/api/delete-product/:id", (req, res) => {
    const productId = req.params.id;

    // Query to delete the product
    const query = "DELETE FROM product WHERE product_id = ?";

    db.query(query, [productId], (err, result) => {
        if (err) {
            console.error("Error deleting product:", err);
            return res.status(500).json({
                success: false,
                message: "Failed to delete product from database.",
            });
        }

        if (result.affectedRows === 0) {
            // No product found with the given ID
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        // Successfully deleted the product
        res.status(200).json({
            success: true,
            message: "Product deleted successfully.",
        });
    });
});

// Update
app.put("/api/products/:id", upload.single("image"), (req, res) => {
    const productId = req.params.id; // Extract product ID from URL
    const {
        product_name,
        category_name,
        price,
        description,
        product_rating,
        stock_quantity,
        origin,
        benefit,
        skin_type,
        quantity,
        ingredients,
        brand,
    } = req.body;

    // Query to fetch existing product
    const selectQuery = `SELECT * FROM Product WHERE product_id = ?`;

    db.query(selectQuery, [productId], (err, results) => {
        if (err) {
            console.error("Error fetching product:", err);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch product.",
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found.",
            });
        }

        const existingProduct = results[0];
        const newImageUrl = req.file ? `http://localhost:8080/images/${req.file.filename}` : existingProduct.image_url;

        // Delete old image if a new one is uploaded
        if (req.file && existingProduct.image_url) {
            const oldImagePath = path.join(__dirname, existingProduct.image_url);
            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    console.error("Error deleting old image:", err);
                } else {
                    console.log("Old image deleted:", oldImagePath);
                }
            });
        }

        // Update product in the database
        const updateQuery = `
            UPDATE Product
            SET 
                product_name = ?, 
                category_name = ?, 
                price = ?, 
                description = ?, 
                product_rating = ?, 
                stock_quantity = ?, 
                origin = ?, 
                benefit = ?, 
                skin_type = ?, 
                quantity = ?, 
                ingredients = ?, 
                brand = ?, 
                image_url = ?
            WHERE product_id = ?
        `;

        const values = [
            product_name || existingProduct.product_name,
            category_name || existingProduct.category_name,
            parseFloat(price) || existingProduct.price,
            description || existingProduct.description,
            parseFloat(product_rating) || existingProduct.product_rating,
            parseInt(stock_quantity) || existingProduct.stock_quantity,
            origin || existingProduct.origin,
            benefit || existingProduct.benefit,
            skin_type || existingProduct.skin_type,
            parseInt(quantity) || existingProduct.quantity,
            ingredients || existingProduct.ingredients,
            brand || existingProduct.brand,
            newImageUrl,
            productId,
        ];

        db.query(updateQuery, values, (err, result) => {
            if (err) {
                console.error("Error updating product:", err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to update product.",
                });
            }

            res.status(200).json({
                success: true,
                message: "Product updated successfully.",
            });
        });
    });
});












































































































































































































// product-detail
app.get('/api/product-detail/:id', (req, res) => {
    const productId = req.params.id;
    const sql = `SELECT * FROM Product WHERE product_id = ?`;
    db.query(sql, [productId], (err, results) => {
        if (err) {
            console.error('Error fetching product:', err);
            return res.status(500).json({ error: 'Failed to fetch product' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(results[0]);
    });
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
