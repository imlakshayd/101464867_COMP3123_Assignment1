const { body, param, query } = require('express-validator');

// User validation rules
const validateSignup = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long'),
    body('email')
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

const validateLogin = [
  body('identifier')
    .trim()
    .notEmpty()
    .withMessage('Identifier (email or username) is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// Employee validation rules
const validateEmployee = [
    body('first_name')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 characters long'),
    body('last_name')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: 2 })
        .withMessage('Last name must be at least 2 characters long'),
    body('email')
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),
    body('position')
        .trim()
        .notEmpty()
        .withMessage('Position is required'),
    body('salary')
        .isNumeric()
        .withMessage('Salary must be a number')
        .custom(value => value >= 0)
        .withMessage('Salary cannot be negative'),
    body('date_of_joining')
        .optional()
        .isISO8601() 
        .withMessage('Valid date is required (ISO 8601 format)'),
    body('department')
        .trim()
        .notEmpty()
        .withMessage('Department is required')
];

const validateEmployeeUpdate = [
    body('first_name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('First name cannot be empty')
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 characters long'),
    body('last_name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Last name cannot be empty')
        .isLength({ min: 2 })
        .withMessage('Last name must be at least 2 characters long'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),
    body('position')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Position cannot be empty'),
    body('salary')
        .optional()
        .isNumeric()
        .withMessage('Salary must be a number')
        .custom(value => value >= 0)
        .withMessage('Salary cannot be negative'),
    body('date_of_joining')
        .optional()
        .isISO8601()
        .withMessage('Valid date is required (ISO 8601 format)'),
    body('department')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Department cannot be empty')
];

const validateEmployeeId = [
    param('eid')
        .isMongoId()
        .withMessage('Invalid employee ID format')
];

const validateEmployeeQuery = [
    query('eid')
        .isMongoId()
        .withMessage('Invalid employee ID format')
];

module.exports = {
    validateSignup,
    validateLogin,
    validateEmployee,
    validateEmployeeUpdate,
    validateEmployeeId,
    validateEmployeeQuery
};