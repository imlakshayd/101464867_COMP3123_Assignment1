const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    // id: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    // Using MongoDB's default _id field as the unique identifier
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true // Remove leading/trailing whitespace
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true, // Convert email to lowercase
        match: [/.+\@.+\..+/, 'Please fill a valid email address'] // Basic email format validation
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'] 
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

// Middleware to update the updatedAt field before each save
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        this.updated_at = Date.now();
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        this.updated_at = Date.now();
        next();
    } catch (err) { 
        next(err);
    }   
});

// Compare entered password with the hashed password in the database
userSchema.methods.comparePassword = async function(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
}; 

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;