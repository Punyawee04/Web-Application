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
    res.send('Welcome to the Bloom Backend API!');
  });
  
  // Sample route to fetch data from the LoginDetail table
  app.get('/loginDetails', (req, res) => {
    db.query('SELECT * FROM LoginDetail', (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });
  
  // Sample route to insert a new user into the LoginDetail table
  // Route to handle fetching login details
app.get('/loginDetails', (req, res) => {
    db.query('SELECT * FROM LoginDetail', (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results); // Respond with JSON data
    });
  });
  



// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
