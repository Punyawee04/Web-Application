// Import the Express module
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

// Initialize the Express app
const app = express();

// Connection to MySQL
const mysql = require('mysql2');
var db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Connect to DB
db.connect(function(err){
    if (err) throw err;
    console.log(`Connected to DB ${process.env.DB_NAME}`);
});

// Serve static files from the root directory (optional, if you have styles, etc.)
app.use(express.static(__dirname));

// Set up routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});
app.get('/team', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'Team.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'login.html'));
});
app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'search-result.html'));
});

// Handle invalid paths
app.use((req, res, next) => {
    console.log(`Request at ${req.url}`);
    console.log(`404: Invalid accessed`);
    res.sendFile(path.join(__dirname, 'html', 'page not found.html'));
});
const PORT = 8000
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
