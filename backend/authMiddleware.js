const jwt = require('jsonwebtoken');
// Token blacklist (use Redis or database in production)
const tokenBlacklist = new Set();  // Example for blacklisted tokens. Replace with your actual implementation.

const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header is missing.' });
        }

        const token = authHeader.split(' ')[1];  // Extract token from 'Bearer <token>'
        if (!token) {
            return res.status(401).json({ message: 'Token is missing in Authorization header.' });
        }

        if (tokenBlacklist.has(token)) {
            return res.status(401).json({ message: 'Token is blacklisted.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Replace with your actual secret key
        req.user = decoded;  // Attach user info to the request

        // Continue to the next middleware or route handler
        next();
    } catch (err) {
        console.error('Error in authenticateToken middleware:', err);  // Log error for debugging
        res.status(500).json({ message: 'Internal server error. Please check the server logs.' });
    }
};

module.exports = authenticateToken;
