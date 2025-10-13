const Employee = require('../models/employee');
const { validationResult } = require('express-validator');

// Helper function to serialize employee data
const serializeEmployee = (emp) => ({
  employee_id: emp._id,
  first_name: emp.first_name,
  last_name: emp.last_name,
  email: emp.email,
  position: emp.position,
  salary: emp.salary,
  date_of_joining: emp.date_of_joining,
  department: emp.department,
  created_at: emp.created_at || emp.createdAt,
  updated_at: emp.updated_at || emp.updatedAt
});


// @desc    Get all employees
// @route   GET /api/v1/emp/employees
// @access  Private
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    const data = employees.map(serializeEmployee);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: 'Error fetching employees',
      error: err.message
    });
  }
};


// @desc    Create new employee
// @route   POST /api/v1/emp/employees
// @access  Private
const createEmployee = async (req, res) => {

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
};

// @desc    Get employee by ID
// @route   GET /api/v1/emp/employees/:eid
// @access  Private
const getEmployeeById = async (req, res) => {
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
      return res.status(404).json({ status: false, message: 'Employee not found' });
    }
    return res.status(200).json(serializeEmployee(employee));
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: 'Error fetching employee',
      error: err.message
    });
  }
};


// @desc    Update employee
// @route   PUT /api/v1/emp/employees/:eid
// @access  Public (or Protected if you add auth middleware)
const updateEmployee = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            status: false, 
            message: 'Validation failed', 
            errors: errors.array() 
        });
    }

    try {
        // Extract only the fields that are provided in the request
        const updateFields = {};
        const allowedFields = ['first_name', 'last_name', 'email', 'position', 'salary', 'date_of_joining', 'department'];
        
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateFields[field] = req.body[field];
            }
        });

        const updated = await Employee.findByIdAndUpdate(
            req.params.eid,
            updateFields,
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ status: false, message: 'Employee not found' });
        }

        return res.status(200).json({
            message: 'Employee updated successfully.',
            employee: serializeEmployee(updated)
        });
    } catch (err) {
        res.status(500).json({ 
            status: false, 
            message: 'Error updating employee', 
            error: err.message 
        });
    }
};

// @desc    Delete employee
// @route   DELETE /api/v1/emp/employees?eid=xxx
// @access  Public (or Protected if you add auth middleware)
const deleteEmployee = async (req, res) => {
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
      return res.status(404).json({ status: false, message: 'Employee not found' });
    }
    return res.status(204).send(); // 204 should not have a body
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: 'Error deleting employee',
      error: err.message
    });
  }
};

module.exports = {
    getAllEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};