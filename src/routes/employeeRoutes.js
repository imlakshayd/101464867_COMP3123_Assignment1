const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');
const { body, validationResult } = require('express-validator');

// Validation middleware for employee data
const validateEmployee = [
    body('first_name').trim().notEmpty().withMessage('First name is required'),
    body('last_name').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('position').trim().notEmpty().withMessage('Position is required'),
    body('salary').isNumeric().withMessage('Salary must be a number').custom(value => value >= 0).withMessage('Salary cannot be negative'),
    body('date_of_joining').optional().isISO8601().withMessage('Valid date is required'),
    body('department').trim().notEmpty().withMessage('Department is required')
];

const validateEmployeeUpdate = [
   body('first_name').optional().trim().notEmpty().withMessage('First name cannot be empty'),
    body('last_name').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('position').optional().trim().notEmpty().withMessage('Position cannot be empty'),
    body('salary').optional().isNumeric().withMessage('Salary must be a number').custom(value => value >= 0).withMessage('Salary cannot be negative'),
    body('date_of_joining').optional().isISO8601().withMessage('Valid date is required'),
    body('department').optional().trim().notEmpty().withMessage('Department cannot be empty')
];

// GET /api/v1/emp/employees - Get all employees
router.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.find():
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Error fetching employees',
            error: err.message
        });
    
    }
});
// POST /api/v1/emp/employees - Create new employee
router.post('/employees', validateEmployee, async (req, res) => {
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
        const { first_name, last_name, email, position, salary, date_of_joining, department } = req.body;

        // Check if employee with email already exists
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ 
                status: false, 
                message: 'Employee with this email already exists' 
            });
        }

        // Create new employee
        const newEmployee = new Employee({
            first_name,
            last_name,
            email,
            position,
            salary,
            date_of_joining: date_of_joining || Date.now(),
            department
        });

        await newEmployee.save();

        res.status(201).json({
            message: 'Employee created successfully.',
            employee_id: newEmployee._id
        });
    } catch (err) {
        res.status(500).json({ 
            status: false, 
            message: 'Error creating employee', 
            error: err.message 
        });
    }
});

// GET /api/v1/emp/employees/:eid - Get employee by ID
router.get('/employees/:eid', [
    param('eid').isMongoId().withMessage('Invalid employee ID')
], async (req, res) => {
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
        const employee = await Employee.findById(req.params.eid);
        
        if (!employee) {
            return res.status(404).json({ 
                status: false, 
                message: 'Employee not found' 
            });
        }

        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ 
            status: false, 
            message: 'Error fetching employee', 
            error: err.message 
        });
    }
});

// PUT /api/v1/emp/employees/:eid - Update employee
router.put('/employees/:eid', [
    param('eid').isMongoId().withMessage('Invalid employee ID'),
    ...validateEmployeeUpdate
], async (req, res) => {
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
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.eid,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ 
                status: false, 
                message: 'Employee not found' 
            });
        }

        res.status(200).json({
            message: 'Employee details updated successfully.',
            employee: updatedEmployee
        });
    } catch (err) {
        res.status(500).json({ 
            status: false, 
            message: 'Error updating employee', 
            error: err.message 
        });
    }
});

// DELETE /api/v1/emp/employees?eid=xxx - Delete employee
router.delete('/employees', [
    query('eid').isMongoId().withMessage('Invalid employee ID')
], async (req, res) => {
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
        const deletedEmployee = await Employee.findByIdAndDelete(req.query.eid);

        if (!deletedEmployee) {
            return res.status(404).json({ 
                status: false, 
                message: 'Employee not found' 
            });
        }

        res.status(204).send(); // No content response
    } catch (err) {
        res.status(500).json({ 
            status: false, 
            message: 'Error deleting employee', 
            error: err.message 
        });
    }
});

module.exports = router;
