const dotenv = require('dotenv');
const http = require('http');

const run = async () => {
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
      await loadedModule.handler(); // Call the module if it's a function
    } else {
      // eslint-disable-next-line no-undef
      console.log('Loaded module:', loadedModule);
    }
  } catch (error) {
    // eslint-disable-next-line no-undef
    console.error('Error loading file:', error.message);
  }
};


const PORT = 3000; // Define your port
const server = http.createServer(async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  await run();
  res.end('Hello, Node.js!');
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
