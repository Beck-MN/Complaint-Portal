const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        // Ensure the URI includes the database name
        let uri = process.env.MONGODB_URI;
        if (!uri.includes('complaint-portal')) {
            uri = `${uri.replace(/\/?$/, '/')}/complaint-portal`;
        }

        console.log('Attempting to connect to MongoDB...');
        
        const conn = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database Name: ${conn.connection.name}`);
        
        // List all collections
        const collections = await conn.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));

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