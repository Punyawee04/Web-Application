// นำเข้าโมดูล express เพื่อใช้สร้าง API และ router
const express = require('express');
// สร้าง Router สำหรับจัดการเส้นทาง API
const router = express.Router();
// นำเข้า mysql2/promise เพื่อจัดการการเชื่อมต่อฐานข้อมูลแบบ asynchronous
const mysql = require('mysql2/promise');
// นำเข้า dotenv เพื่อโหลดตัวแปรสภาพแวดล้อมจากไฟล์ .env
const dotenv = require('dotenv');

dotenv.config();

// การตั้งค่าการเชื่อมต่อฐานข้อมูลแบบ pool เพื่อเพิ่มประสิทธิภาพ
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});


// Add a new admin
// Testing1: Add a new admin
// method: POST
// URL: http://localhost:8080/api/add-admin
// body: raw JSON
// {
//     "username": "admin4",
//     "password": "4444",
//     "email": "admin4@gmail.com",
//     "admin_name": "Test Admin",
//     "phone_number": "111-111-1111",
//     "admin_email": "admin4@gmail.com"
// }

// Testing2: Add a new admin
// method: POST
// URL: http://localhost:8080/api/add-admin
// body: raw JSON
// {
//     "username": "admin4",
//     "password": "4444",
//     "email": "admin4@gmail.com",
//     "admin_name": "Victor",
//     "phone_number": "444-444-4444",
//     "admin_email": "admin4@gmail.com"
// }
// API สำหรับเพิ่มข้อมูลผู้ดูแลระบบ
router.post('/add-admin', async (req, res) => {
    const {
        username,
        password,
        email,
        status = 'Active',
        admin_name,
        phone_number,
        admin_email,
    } = req.body;
    // ตรวจสอบว่าข้อมูลที่จำเป็นครบถ้วนหรือไม่
    if (!username || !password || !email || !admin_name || !phone_number || !admin_email) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    let connection;
    try {
        connection = await db.getConnection();

        await connection.beginTransaction();

        // เพิ่มข้อมูลในตาราง LoginDetail
        const loginDetailQuery = `
            INSERT INTO LoginDetail (UserName, Password, Email, login_Time, logout_Time, login_Date, Status)
            VALUES (?, ?, ?, "00:00", "00:00", CURDATE(), ?)
        `;

        const [loginResult] = await connection.execute(loginDetailQuery, [
            username,
            password,
            email,
            status,
        ]);

        const login_id = loginResult.insertId;

        // เพิ่มข้อมูลในตาราง Administrator
        const adminQuery = `
            INSERT INTO Administrator (admin_id, admin_name, login_Date, login_Time, login_id)
            VALUES (NULL, ?, CURDATE(), "00:00", ?)
        `;
        const [adminResult] = await connection.execute(adminQuery, [
            admin_name,
            login_id,
        ]);

        const admin_id = adminResult.insertId;
        // เพิ่มหมายเลขโทรศัพท์ในตาราง Administrator_phonenum
        const phoneQuery = `
            INSERT INTO Administrator_phonenum (admin_id, admin_phone_number)
            VALUES (?, ?)
        `;
        await connection.execute(phoneQuery, [admin_id, phone_number]);
        // เพิ่มอีเมลในตาราง Email
        const emailQuery = `
            INSERT INTO Email (admin_id, admin_email)
            VALUES (?, ?)
        `;
        await connection.execute(emailQuery, [admin_id, admin_email]);

        await connection.commit();

        res.status(201).json({ message: 'Admin added successfully!' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Transaction Error:', error.message);
        res.status(500).json({ message: 'Failed to add admin.', error: error.message });
    } finally {
        if (connection) connection.release();
    }
});

// Testing1: delete-admin/:id
// method: DELETE
// URL: http://localhost:8080/api/delete-admin/1003
// body: 

// Testing2: delete-admin/:id
// method: DELETE
// URL: http://localhost:8080/api/delete-admin/1004
// body: 
//  DELETE สำหรับลบผู้ดูแลระบบ
router.delete('/delete-admin/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Admin ID is required.' });
    }

    let connection;
    try {
        connection = await db.getConnection();

        await connection.beginTransaction();

        const [loginResult] = await connection.execute(
            `SELECT login_id FROM Administrator WHERE admin_id = ?`,
            [id]
        );
        const login_id = loginResult[0]?.login_id;

        if (!login_id) {
            throw new Error('Administrator not found.');
        }
        // ลบข้อมูลในตารางต่าง ๆ ที่เกี่ยวข้องกับ admin_id
        await connection.execute(
            `DELETE FROM Administrator_phonenum WHERE admin_id = ?`,
            [id]
        );

        await connection.execute(
            `DELETE FROM Email WHERE admin_id = ?`,
            [id]
        );

        await connection.execute(
            `DELETE FROM Administrator WHERE admin_id = ?`,
            [id]
        );

        await connection.execute(
            `DELETE FROM LoginDetail WHERE login_id = ?`,
            [login_id]
        );

        await connection.commit();
        res.status(200).json({ message: 'Admin deleted successfully!' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Delete Transaction Error:', error.message);
        res.status(500).json({ message: 'Failed to delete admin.', error: error.message });
    } finally {
        if (connection) connection.release();
    }
});


// Testing1: update-admin/:id
// Testing: update-admin/:id
// method: PUT
// URL: http://localhost:8080/api/update-admin/1002
// body: raw JSON
// {
//     "username": "Admin2",
//     "password": "2222",
//     "email": "admin3@gmail.com",
//     "status": "Active",
//     "admin_name": "Bob Smith",
//     "phone_number": "0987654321",
//     "admin_email": "admin2@gmail.com"
// }

// Testing2: update-admin/:id
// method: PUT
// URL: http://localhost:8080/api/update-admin/1003
// body: raw JSON
// {
//     "username": "Admin3",
//     "password": "3333",
//     "email": "admin3@gmail.com",
//     "status": "Active",
//     "admin_name": "Janet Smith",
//     "phone_number": "0987654321",
//     "admin_email": "admin3@gmail.com"
// }
// PUT สำหรับแก้ไขข้อมูลผู้ดูแลระบบ
router.put('/update-admin/:id', async (req, res) => {
    const { id } = req.params;
    const {
        username,
        password,
        email,
        status,
        admin_name,
        phone_number,
        admin_email,
    } = req.body;
    // ตรวจสอบว่าข้อมูลที่จำเป็นครบถ้วนหรือไม่
    if (!username || !email || !admin_name || !phone_number || !admin_email) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [loginResult] = await connection.execute(
            `SELECT login_id, Password FROM LoginDetail 
             WHERE login_id = (SELECT login_id FROM Administrator WHERE admin_id = ?)`,
            [id]
        );
        const login_id = loginResult[0]?.login_id;
        const currentPassword = loginResult[0]?.Password;

        if (!login_id) {
            throw new Error('Administrator not found.');
        }
        // ใช้รหัสผ่านเดิมหากไม่มีการส่งรหัสผ่านใหม่
        const newPassword = password !== undefined && password !== null ? password : currentPassword;

        const loginDetailQuery = `
            UPDATE LoginDetail
            SET UserName = ?, Password = ?, Email = ?, Status = ?
            WHERE login_id = ?
        `;
        await connection.execute(loginDetailQuery, [
            username,
            newPassword,
            email,
            status,
            login_id,
        ]);
        // อัปเดตข้อมูลในตาราง
        const adminQuery = `
            UPDATE Administrator
            SET admin_name = ?
            WHERE admin_id = ?
        `;
        await connection.execute(adminQuery, [admin_name, id]);

        const phoneQuery = `
            UPDATE Administrator_phonenum
            SET admin_phone_number = ?
            WHERE admin_id = ?
        `;
        await connection.execute(phoneQuery, [phone_number, id]);


        const emailQuery = `
            UPDATE Email
            SET admin_email = ?
            WHERE admin_id = ?
        `;
        await connection.execute(emailQuery, [admin_email, id]);

        await connection.commit();
        res.status(200).json({ message: 'Admin updated successfully!' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Update Transaction Error:', error.message);
        res.status(500).json({ message: 'Failed to update admin.', error: error.message });
    } finally {
        if (connection) connection.release();
    }
});


// Get admin details by ID
// Testing1: get-admin/:id
// method: GET
// URL: http://localhost:8080/api/get-admin/1001
// body:

// Testing2: get-admin/:id
// method: GET
// URL: http://localhost:8080/api/get-admin/1002
// body: 
// GET สำหรับดึงข้อมูลผู้ดูแลระบบตาม ID
router.get('/get-admin/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query(
            `SELECT LoginDetail.UserName AS username, LoginDetail.Password AS password, 
                    LoginDetail.Email AS email, LoginDetail.Status AS status, 
                    Administrator.admin_name, Administrator_phonenum.admin_phone_number AS phone_number, 
                    Email.admin_email 
             FROM LoginDetail 
             JOIN Administrator ON LoginDetail.login_id = Administrator.login_id 
             JOIN Administrator_phonenum ON Administrator.admin_id = Administrator_phonenum.admin_id 
             JOIN Email ON Administrator.admin_id = Email.admin_id 
             WHERE Administrator.admin_id = ?`,
            [id]
        );
        // ตรวจสอบว่าพบข้อมูลหรือไม่
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Admin not found.' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching admin details:', error);
        res.status(500).json({ message: 'Error fetching admin details.' });
    }
});

// Testing1: account-details/:username
// method: GET
// URL: http://localhost:8080/api/account-details/admin1
// body:

// Testing2: account-details/:username
// method: GET
// URL: http://localhost:8080/api/account-details/admin2
// body:
// GET สำหรับดึงรายละเอียดบัญชีโดยใช้ชื่อผู้ใช้ (username)
router.get('/account-details/:username', async (req, res) => {
    const { username } = req.params;

    try {
        // ดึงข้อมูลบัญชีที่เกี่ยวข้องกับ username
        const sql = `
            SELECT ld.UserName, ld.Email, a.admin_name, e.admin_email, a.image_url
            FROM LoginDetail ld
            JOIN Administrator a ON ld.login_id = a.login_id
            JOIN Email e ON a.admin_id = e.admin_id
            WHERE ld.UserName = ?
        `;

        const [results] = await db.query(sql, [username]);
        // ตรวจสอบว่าพบข้อมูลหรือไม่
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching account details:', error);
        res.status(500).json({ message: 'Error fetching account details.' });
    }
});
module.exports = router;
