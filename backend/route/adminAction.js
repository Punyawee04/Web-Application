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

router.put('/update-admin/:id', async (req, res) => {
    const { id } = req.params; // `id` is the `admin_id`
    const {
        username,
        password,
        email,
        status,
        admin_name,
        phone_number,
        admin_email,
    } = req.body;

    if (!username || !email || !admin_name || !phone_number || !admin_email) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Step 1: Get `login_id` for the given `admin_id`
        const [loginResult] = await connection.execute(
            `SELECT login_id FROM Administrator WHERE admin_id = ?`,
            [id]
        );
        const login_id = loginResult[0]?.login_id;

        if (!login_id) {
            throw new Error('Administrator not found.');
        }

        // Step 2: Update `LoginDetail`
        const loginDetailQuery = `
            UPDATE LoginDetail
            SET UserName = ?, Password = ?, Email = ?, Status = ?
            WHERE login_id = ?
        `;
        await connection.execute(loginDetailQuery, [
            username,
            password || null, // Use null if password is not provided
            email,
            status,
            login_id,
        ]);

        // Step 3: Update `Administrator`
        const adminQuery = `
            UPDATE Administrator
            SET admin_name = ?
            WHERE admin_id = ?
        `;
        await connection.execute(adminQuery, [admin_name, id]);

        // Step 4: Update `Administrator_phonenum`
        const phoneQuery = `
            UPDATE Administrator_phonenum
            SET admin_phone_number = ?
            WHERE admin_id = ?
        `;
        await connection.execute(phoneQuery, [phone_number, id]);

        // Step 5: Update `Email`
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
router.get('/get-admin/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.query(
            `SELECT LoginDetail.UserName AS username, LoginDetail.Email AS email, 
                    LoginDetail.Status AS status, Administrator.admin_name, 
                    Administrator_phonenum.admin_phone_number AS phone_number, 
                    Email.admin_email 
             FROM LoginDetail 
             JOIN Administrator ON LoginDetail.login_id = Administrator.login_id 
             JOIN Administrator_phonenum ON Administrator.admin_id = Administrator_phonenum.admin_id 
             JOIN Email ON Administrator.admin_id = Email.admin_id 
             WHERE Administrator.admin_id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Admin not found.' });
        }

        res.json(rows[0]); // Return the admin details
    } catch (error) {
        console.error('Error fetching admin details:', error);
        res.status(500).json({ message: 'Error fetching admin details.' });
    }
});

router.get('/account-details/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const sql = `
            SELECT ld.UserName, ld.Email, a.admin_name, e.admin_email, a.image_url
            FROM LoginDetail ld
            JOIN Administrator a ON ld.login_id = a.login_id
            JOIN Email e ON a.admin_id = e.admin_id
            WHERE ld.UserName = ?
        `;

        const [results] = await db.query(sql, [username]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(results[0]); // Return the first result (unique user)
    } catch (error) {
        console.error('Error fetching account details:', error);
        res.status(500).json({ message: 'Error fetching account details.' });
    }
});
module.exports = router;
