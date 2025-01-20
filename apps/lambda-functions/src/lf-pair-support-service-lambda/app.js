const cron = require('node-cron');
const dotenv = require('dotenv');

const run = () => {
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
      loadedModule.handler(); // Call the module if it's a function
      cron.schedule('*/10 * * * * *', () => {
        // eslint-disable-next-line no-undef
        console.log('Cron job executed at:', new Date().toISOString());
        loadedModule.handler(); // Call the module if it's a function
      });
    } else {
      // eslint-disable-next-line no-undef
      console.log('Loaded module:', loadedModule);
    }
  } catch (error) {
    // eslint-disable-next-line no-undef
    console.error('Error loading file:', error.message);
  }
};

run();
