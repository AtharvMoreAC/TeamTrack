
const jwt = require('jsonwebtoken');

// Verify JWT Token
const verifyToken = (req, res, next) => {

    // Get token from request header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'Access denied. No token provided.'
        });
    }

    // Extract token from Bearer header
    const token = authHeader.split(' ')[1];

    try {

        // Verify token
        const decoded = jwt.verify(token, 'teamtrack_secret_key');

        // Store user details in request
        req.user = decoded;

        next();

    } catch (err) {

        console.log('JWT Error:', err.message);

        return res.status(401).json({
            message: 'Invalid or expired token'
        });
    }
};

module.exports = { verifyToken };
