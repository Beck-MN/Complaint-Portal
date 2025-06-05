const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '../data/thoughts.json');

// Ensure the data directory exists
const ensureDataDir = async () => {
  const dir = path.dirname(dataPath);
  try {
    await fs.access(dir);
    console.log('Data directory exists:', dir);
  } catch (error) {
    console.log('Creating data directory:', dir);
    await fs.mkdir(dir, { recursive: true });
  }
};

// Initialize data file if it doesn't exist
const initDataFile = async () => {
  try {
    await fs.access(dataPath);
    console.log('Data file exists:', dataPath);
  } catch (error) {
    console.log('Creating new data file:', dataPath);
    await fs.writeFile(dataPath, JSON.stringify({ thoughts: [] }, null, 2));
  }
};

// Read all thoughts
const getThoughts = async () => {
  try {
    console.log('Ensuring data directory exists...');
    await ensureDataDir();
    
    console.log('Ensuring data file exists...');
    await initDataFile();
    
    console.log('Reading thoughts from:', dataPath);
    const data = await fs.readFile(dataPath, 'utf8');
    const thoughts = JSON.parse(data).thoughts;
    console.log(`Successfully read ${thoughts.length} thoughts`);
    return thoughts;
  } catch (error) {
    console.error('Error in getThoughts:', error);
    throw new Error(`Failed to get thoughts: ${error.message}`);
  }
};

// Add a new thought
const addThought = async (thought) => {
  try {
    console.log('Ensuring data directory exists...');
    await ensureDataDir();
    
    console.log('Ensuring data file exists...');
    await initDataFile();
    
    console.log('Reading existing thoughts...');
    const data = await fs.readFile(dataPath, 'utf8');
    const { thoughts } = JSON.parse(data);
    
    const newThought = {
      id: Date.now(),
      content: thought.content,
      type: thought.type,
      severity: thought.severity,
      feeling: thought.feeling,
      createdAt: new Date().toISOString()
    };
    
    console.log('Adding new thought:', newThought);
    thoughts.unshift(newThought);
    
    console.log('Saving updated thoughts...');
    await fs.writeFile(dataPath, JSON.stringify({ thoughts }, null, 2));
    console.log('Successfully saved thought');
    
    return newThought;
  } catch (error) {
    console.error('Error in addThought:', error);
    throw new Error(`Failed to add thought: ${error.message}`);
  }
};

module.exports = {
  getThoughts,
  addThought
}; 