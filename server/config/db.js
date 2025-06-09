const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        console.log('Attempting to connect to MongoDB...');
        
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Test the connection
        conn.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
        });

        conn.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        return conn;
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB; 