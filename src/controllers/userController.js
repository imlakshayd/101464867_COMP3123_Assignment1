const User = require('../models/user');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');

// @desc    Register a new user
// @route   POST /api/v1/user/signup
// @access  Public
const signup = async (req, res) => {
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
        // Create new user
        const newUser = new User({
            username,
            email,
            password
        });

        const created = await newUser.save();


        const payloadUser = {
            user_id: created._id,
            username: created.username,
            email: created.email,
            created_at: created.createdAt,
            updated_at: created.updatedAt
        };

        return res.status(201).json({
            message: 'User created successfully.',
            ...payloadUser
        });
    } catch (err) {
        res.status(500).json({ 
            status: false, 
            message: 'Error creating user', 
            error: err.message 
        });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/v1/user/login
// @access  Public
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { identifier, password } = req.body;
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier || '');

  try {
    const user = await User.findOne(
      isEmail ? { email: identifier } : { username: identifier }
    );

    if (user && await user.comparePassword(password)) {
      return res.status(200).json({
        message: 'Login successful.',
        jwt_token: generateToken(user._id)
      });
    }

    return res.status(401).json({
      status: false,
      message: 'Invalid username/email or password'
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: 'Error during login',
      error: err.message
    });
  }
};


module.exports = {
    signup,
    login
};

