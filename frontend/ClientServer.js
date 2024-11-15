// Import the Express module
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const port =8081
// Initialize the Express app
const app = express();


// Serve static files from the root directory (optional, if you have styles, etc.)
app.use(express.static(__dirname));
app.use("/css",express.static(path.join(__dirname,"html/css")));
app.use("/js", express.static(path.join(__dirname, "callWS")));
app.use("/js", express.static(path.join(__dirname, "js")));
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
app.get('/search-all', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'search-result.html'));
});
app.get('/add-product', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'Product_mana_from.html'));
});
app.get('/user_acc_manage.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'user_acc_manage.html'));
});

console.log("Serving JavaScript files from:", path.join(__dirname, "callWS"));

    
// Handle invalid paths
app.use((req, res, next) => {
    console.log(`Request at ${req.url}`);
    console.log(`404: Invalid accessed`);
    res.sendFile(path.join(__dirname, 'html', 'page not found.html'));
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
