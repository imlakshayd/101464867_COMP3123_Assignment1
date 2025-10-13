const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({

    first_name: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    last_name: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    position: {
        type: String,
        required: [true, 'Position is required'],
        trim: true
    },
    salary: {
        type: Number,
        required: [true, 'Salary is required'],
        min: [0, 'Salary cannot be negative']
    },
    date_of_joining: {
        type: Date,
        required: [true, 'Date of joining is required'],
        default: Date.now
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Middleware to update the updated_at field before each save
employeeSchema.pre('save',function(next){
    this.updated_at = Date.now();
    next();
});


employeeSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updated_at: Date.now() });
    next();
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;  

