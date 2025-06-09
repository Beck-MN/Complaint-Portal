const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.path}`);
  next();
});

// Routes
app.use('/api/complaints', require('./routes/complaints'));

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Complaint Portal API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ 
        success: false,
        error: err.message || 'Something went wrong!'
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error('Unhandled Rejection:', err.message);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
}); 