
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { getThoughts, addThought } = require('./handlers/thoughtHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`CORS enabled for http://localhost:3000`);
}); 