require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

connectDB(); // Connect to the database

const app = express();

app.use(express.json()); // Middleware to parse JSON request bodies

// Root endpoint
app.get('/', (req, res) => {
    res.send('API is running...');
});

// User routes - matching assignment requirements
app.use('/api/v1/user', userRoutes);

// Employee routes - matching assignment requirements
app.use('/api/v1/emp', employeeRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
}); 