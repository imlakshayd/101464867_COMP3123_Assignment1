const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/userController');
const { validateSignup, validateLogin } = require('../middleware/validation');

// @route   POST /api/v1/user/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', validateSignup, signup);

// @route   POST /api/v1/user/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', validateLogin, login);

module.exports = router;