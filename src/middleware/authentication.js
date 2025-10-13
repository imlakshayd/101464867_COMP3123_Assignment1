const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware to protect routes - verify JWT token
const protect = async (req, res, next) => {
    let token;

    // Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (format: Bearer <token>)
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token (excluding password)
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ 
                    status: false, 
                    message: 'Not authorized, user not found' 
                });
            }

            next(); // Continue to the next middleware/controller
        } catch (err) {
            console.error(err);
            return res.status(401).json({ 
                status: false, 
                message: 'Not authorized, token failed' 
            });
        }
    }

    if (!token) {
        return res.status(401).json({ 
            status: false, 
            message: 'Not authorized, no token provided' 
        });
    }
};

module.exports = { protect };