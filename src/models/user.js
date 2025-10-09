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
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to update the updatedAt field before each save
userSchema.pre('save', async function(next) {

    // Only hash the password if it has been modified (or is new) to avoid re-hashing
    if (!this.isModified('password')) {
        return next();
    }

    // Hash the password before saving it to the database
    try {
        const salt = await bcrypt.genSalt(10); // Generate a salt with 10 round - Salt is random data that is used as an additional input to a one-way function that "hashes" a password or passphrase.
        this.password = await bcrypt.hash(this.password, salt); // Hash the password using the generated salt
        this.updatedAt = Date.now(); // Update the updatedAt field to the current date
        next();
    } catch (err) { 
        next(err); // Pass any errors to the next middleware
    }   
});

// Compare entered password with the hashed password in the database
userSchema.methods.comparePassword = async function(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
}; 

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;