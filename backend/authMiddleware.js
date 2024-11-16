const jwt = require('jsonwebtoken');

// Example: Token blacklist (use Redis or a database for production)

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token || tokenBlacklist.has(token)) {
        return res.status(401).json({ message: 'Access denied. No token provided or token is invalid.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to the request
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = authenticateToken;
