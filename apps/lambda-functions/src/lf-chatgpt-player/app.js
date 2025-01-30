const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware to parse JSON bodies
app.use(express.json());
// Enable CORS for localhost:3000
app.use(
  cors({
    origin: 'https://localhost:3000',
  }),
);

const run = async (roomId, gameId) => {
  dotenv.config().parsed;
  // Get the file path from command-line arguments

  // eslint-disable-next-line no-undef
  const filePath = process.argv[2];

  if (!filePath) {
    // eslint-disable-next-line no-undef
    console.error('Please provide a JavaScript file to load.');
    // eslint-disable-next-line no-undef
    process.exit(1);
  }

  try {
    // eslint-disable-next-line no-undef
    const loadedModule = require(filePath);
    if (loadedModule && typeof loadedModule.handler === 'function') {
      return await loadedModule.handler(roomId, gameId); // Call the module if it's a function
    } else {
      // eslint-disable-next-line no-undef
      console.log('Loaded module:', loadedModule);
    }
  } catch (error) {
    // eslint-disable-next-line no-undef
    console.error('Error loading file:', error.message);
  }
};

// Define a route to handle GET requests
app.get('/', async (req, res) => {
  const roomId = req.query.roomId;
  const gameId = req.query.gameId;
  const data = await run(roomId, gameId);
  res.send(data);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
