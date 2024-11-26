const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise'); // Use promise-based MySQL
const dotenv = require('dotenv');

dotenv.config();

// Database pool connection
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
router.post('/add-admin', async (req, res) => {
    const {
        username,
        password,
        email,
        status = 'Active', // Default status
        admin_name,
        phone_number,
        admin_email,
    } = req.body;

    if (!username || !password || !email || !admin_name || !phone_number || !admin_email) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    let connection;
    try {
        connection = await db.getConnection();

        await connection.beginTransaction();

        // Insert into LoginDetail
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

        // Insert into Administrator
        const adminQuery = `
            INSERT INTO Administrator (admin_id, admin_name, login_Date, login_Time, login_id)
            VALUES (NULL, ?, CURDATE(), "00:00", ?)
        `;
        const [adminResult] = await connection.execute(adminQuery, [
            admin_name,
            login_id,
        ]);

        const admin_id = adminResult.insertId;

        // Insert into Administrator_phonenum
        const phoneQuery = `
            INSERT INTO Administrator_phonenum (admin_id, admin_phone_number)
            VALUES (?, ?)
        `;
        await connection.execute(phoneQuery, [admin_id, phone_number]);

        // Insert into Email
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

router.delete('/delete-admin/:id', async (req, res) => {
    const { id } = req.params; // `id` is the `admin_id`

    if (!id) {
        return res.status(400).json({ message: 'Admin ID is required.' });
    }

    let connection;
    try {
        connection = await db.getConnection();

        await connection.beginTransaction(); // Start the transaction

        // Step 1: Get `login_id` for the given `admin_id`
        const [loginResult] = await connection.execute(
            `SELECT login_id FROM Administrator WHERE admin_id = ?`,
            [id]
        );
        const login_id = loginResult[0]?.login_id;

        if (!login_id) {
            throw new Error('Administrator not found.');
        }

        // Step 2: Delete from `Administrator_phonenum`
        await connection.execute(
            `DELETE FROM Administrator_phonenum WHERE admin_id = ?`,
            [id]
        );

        // Step 3: Delete from `Email`
        await connection.execute(
            `DELETE FROM Email WHERE admin_id = ?`,
            [id]
        );

        // Step 4: Delete from `Administrator`
        await connection.execute(
            `DELETE FROM Administrator WHERE admin_id = ?`,
            [id]
        );

        // Step 5: Delete from `LoginDetail`
        await connection.execute(
            `DELETE FROM LoginDetail WHERE login_id = ?`,
            [login_id]
        );

        await connection.commit(); // Commit the transaction
        res.status(200).json({ message: 'Admin deleted successfully!' });
    } catch (error) {
        if (connection) await connection.rollback(); // Rollback transaction on error
        console.error('Delete Transaction Error:', error.message);
        res.status(500).json({ message: 'Failed to delete admin.', error: error.message });
    } finally {
        if (connection) connection.release(); // Release the connection
    }
});

module.exports = router;
