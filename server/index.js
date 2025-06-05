const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { getThoughts, addThought } = require('./handlers/thoughtHandler');

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

// Test route
app.get('/api/test', (req, res) => {
  console.log('Test route accessed');
  res.json({ message: 'Server is running!' });
});

// Routes for thoughts
app.post('/api/thoughts', async (req, res) => {
  try {
    const { content, type, severity, feeling } = req.body;
    
    // Validate input
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    if (!['thought', 'complaint'].includes(type)) {
      return res.status(400).json({ error: 'Type must be either "thought" or "complaint"' });
    }

    if (type === 'complaint' && (!severity || severity < 1 || severity > 5)) {
      return res.status(400).json({ error: 'Severity (1-5) is required for complaints' });
    }

    if (!feeling) {
      return res.status(400).json({ error: 'Feeling is required' });
    }

    const newThought = await addThought({ content, type, severity, feeling });
    res.status(201).json(newThought);
  } catch (error) {
    console.error('Error adding thought:', error);
    res.status(500).json({ error: 'Failed to add thought' });
  }
});

app.get('/api/thoughts', async (req, res) => {
  try {
    const thoughts = await getThoughts();
    res.json({ thoughts });
  } catch (error) {
    console.error('Error fetching thoughts:', error);
    res.status(500).json({ error: 'Failed to fetch thoughts' });
  }
});

// Routes
app.use('/api/complaints', require('./routes/complaints'));

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Complaint Portal API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 