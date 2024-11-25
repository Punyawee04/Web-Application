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


// ployyyyy
// Get User Data Endpoint with Parameters
app.get('/api/user-data', (req, res) => {
    // Get token from Authorization header
    const token = req.headers['authorization'];

    // Check if token exists
    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    // Remove 'Bearer ' prefix if it exists
    const tokenValue = token.split(' ')[1]

    // Verify the token
    jwt.verify(tokenValue, 'blommpass', (err, decoded) => {
        if (err) {
            console.error('Token verification failed:', err);
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }

        // Successfully decoded token
        const { userId, username } = decoded;

        // Retrieve query parameters from the request (optional)
        const requestedUserId = req.query.userId || userId;  // Default to decoded userId if none provided
        const requestedUsername = req.query.username || username;  // Default to decoded username if none provided

        // Query the database for the user's data using the requested userId or username
        const logindataquery = 'SELECT * FROM LoginDetail WHERE login_id = ?';
        const userdataquery = 'SELECT * FROM Administor WHERE login_id = ?';
        db.query(logindataquery, [requestedUserId, requestedUsername], (err, result1) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Database error.' });
            }

            // Check if user exists in the database
            if (result1.length === 0) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const logindata = result1[0];
            db.query(userdataquery, [requestedUserId, requestedUsername], (err, result2) =>{
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ message: 'Database error.' });
                }

                if (result2.length === 0) {
                    return res.status(404).json({ message: 'User not found.' });
                }

                const userdata = result2[0];

                res.json({
                    username: logindata.UserName,
                    email: logindata.Email, // If available in your database schema
                    // logintime: user.login_time,
                    // logindata: user.login_date
                    image_url: userdata.image_url
                    
                });
            });

            
        });
    });
});





// ployyyyy
// Get Users Data Endpoint with Parameters
app.get('/api/users-data', (req, res) => {
    // Get token from Authorization header
    const token = req.headers['authorization'];

    // Check if token exists
    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    // Remove 'Bearer ' prefix if it exists
    const tokenValue = token.split(' ')[1];

    // Verify the token
    jwt.verify(tokenValue, 'blommpass', (err, decoded) => {
        if (err) {
            console.error('Token verification failed:', err);
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }
        // Successfully decoded token
        const {userId} = decoded; //del userId,

        // Retrieve query parameters from the request (optional)
        const requestedUserId = req.query.userId || userId;  // Default to decoded username if none provided

        // Query the database for the user's data using the requested userId or username
        const logindataquery = 'SELECT (LoginDetail.email) AS email,(LoginDetail.login_id) AS login_id,(Administor.image_url) AS img_url,(LoginDetail.UserName) AS userName FROM LoginDetail INNER JOIN Administor WHERE LoginDetail.login_id != ? AND LoginDetail.login_id = Administor.login_id'; //login_id เรา

        db.query(logindataquery, [requestedUserId], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Database error.' });
            }

            // Check if user exists in the database
            if (result.length === 0) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const logindata = result;
            console.log(logindata);
            res.json(logindata);

            
        });
    });
});

// // DELETE staff endpoint
app.delete('/api/users-data/:id', (req, res) => {
    const staffId = req.params.id;

    // ตรวจสอบว่า ID ถูกส่งมาหรือไม่
    if (!staffId) {
        return res.status(400).json({ 
            success: false, 
            message: 'Staff ID is required.' 
        });
    }

    // SQL Query สำหรับการลบข้อมูล staff
    const AdministorQuery = 'DELETE FROM Administor WHERE login_id = ?';
    const loginDetailsQuery = 'DELETE FROM LoginDetail WHERE login_id = ?';

    db.query(AdministorQuery, [staffId], (err, result) => {
        if (err) {
            console.error('Error deleting staff:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to delete staff from database.',
            });
        }
         //ไม่เจอ สตาฟ ที่จะลบ
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Staff not found.',
            });
        }

        db.query(loginDetailsQuery, [staffId], (err, result) => {
            if (err) {
                console.error('Error deleting staff:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to delete staff from database.',
                });
            }
             //ไม่เจอ สตาฟ ที่จะลบ
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Staff not found.',
                });
            }
    
                // ลบข้อมูลสำเร็จ
        res.status(200).json({
            success: true,
            message: 'Staff deleted successfully.',
        });
    
            
        });
        
    });

    

});



/// Edit-users-data 
app.put("/api/users-data/:id", (req, res) => {
    const userId = req.params.id; // Extract product ID from URL
    const {
        image_url,
        username,
        email,
    } = req.body;

    // Query to fetch existing product
    const logindataquery = 'UPDATE LoginDetail SET UserName = ?, Email = ? WHERE login_id = ?';
    const userdataquery = 'UPDATE Administor SET image_url = ? WHERE login_id = ?';

    db.query(logindataquery, [username,email,userId], (err, results) => {
        if (err) {
            console.error("Error to update admin:", err);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch Admin.",
            });
        }

        db.query(userdataquery,[image_url,userId] ,(err, result) => {
            if (err) {
                console.error("Error to update admin:", err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch Admin.",
                });
            }

            res.status(200).json({
                success: true,
                message: "Admin updated successfully.",
            });
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