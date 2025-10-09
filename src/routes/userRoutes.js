const express = require('express');
const router = express.Router();
const User = require('../models/user');
const generateToken = require('../utils/generateToken');
const { body, validationResult } = require('express-validator');

// Validation middleware for signup
const validateSignup = [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

// Validation middleware for login
const validateLogin = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

// POST /api/v1/user/signup - Create a new user
router.post('/signup', validateSignup, async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            status: false, 
            message: 'Validation failed', 
            errors: errors.array() 
        });
    }

    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ 
                status: false, 
                message: 'Email or username already in use' 
            });
        }

        // Create and save the new user
        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({
            message: 'User created successfully.',
            user_id: newUser._id
        });
    } catch (err) {
        res.status(500).json({ 
            status: false, 
            message: 'Error creating user', 
            error: err.message 
        });
    }
});

// POST /api/v1/user/login - User login
router.post('/login', validateLogin, async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            status: false, 
            message: 'Validation failed', 
            errors: errors.array() 
        });
    }

    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });

        if (user && await user.comparePassword(password)) {
            res.status(200).json({
                message: 'Login successful.',
                jwt_token: generateToken(user._id) // Optional JWT implementation
            });
        } else {
            res.status(401).json({ 
                status: false, 
                message: 'Invalid email or password' 
            });
        }
    } catch (err) {
        res.status(500).json({ 
            status: false, 
            message: 'Error during login', 
            error: err.message 
        });
    } 
});

module.exports = router;