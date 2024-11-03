// Import the Express module
const express = require('express');
const path = require('path'); // Import the 'path' module

// Initialize the Express app
const app = express();

// Set the port to listen on
const PORT = process.env.PORT || 3000;

// Serve static files from the root directory (optional, if you have styles, etc.)
app.use(express.static(__dirname)); // This allows serving files from the root

// Set up a route 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html') )
    
});
app.get('/team', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'Team.html') )
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
