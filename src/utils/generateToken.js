const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { // Sign the token with the user's ID and a secret key from environment variables
        expiresIn: '30d' // Token expires in 30 days
    });
}

module.exports = generateToken;