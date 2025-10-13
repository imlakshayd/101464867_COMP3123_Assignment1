const express = require('express');
const router = express.Router();
const {
    getAllEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
} = require('../controllers/employeeController');
const {
    validateEmployee,
    validateEmployeeUpdate,
    validateEmployeeId,
    validateEmployeeQuery
} = require('../middleware/validation');

const { protect } = require('../middleware/authentication'); 

// @route   GET /api/v1/emp/employees
// @desc    Get all employees
// @access  Public (add 'protect' middleware to make it protected)
router.get('/employees', protect, getAllEmployees);

// @route   POST /api/v1/emp/employees
// @desc    Create new employee
// @access  Public (add 'protect' middleware to make it protected)
router.post('/employees', protect, validateEmployee, createEmployee);

// @route   GET /api/v1/emp/employees/:eid
// @desc    Get employee by ID
// @access  Public (add 'protect' middleware to make it protected)
router.get('/employees/:eid', protect, validateEmployeeId, getEmployeeById);

// @route   PUT /api/v1/emp/employees/:eid
// @desc    Update employee
// @access  Public (add 'protect' middleware to make it protected)
router.put('/employees/:eid', protect, [validateEmployeeId, ...validateEmployeeUpdate], updateEmployee);

// @route   DELETE /api/v1/emp/employees?eid=xxx
// @desc    Delete employee
// @access  Public (add 'protect' middleware to make it protected)
router.delete('/employees', protect, validateEmployeeQuery, deleteEmployee);

module.exports = router;