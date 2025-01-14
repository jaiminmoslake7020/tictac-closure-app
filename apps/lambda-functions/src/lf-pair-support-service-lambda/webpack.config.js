const path = require('path');
const dotenv = require('dotenv');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

// Load environment variables
const env = dotenv.config().parsed;
// Convert environment variables to stringified format for DefinePlugin
const envKeys = !process.env.FIREBASE_PROJECT_ID
  ? Object.keys(env).reduce((prev, next) => {
      prev[`process.env.${next}`] = JSON.stringify(env[next]);
      return prev;
    }, {})
  : {
      'process.env.FIREBASE_PROJECT_ID': JSON.stringify(
        process.env.FIREBASE_PROJECT_ID,
      ),
      'process.env.FIREBASE_CLIENT_EMAIL': JSON.stringify(
        process.env.FIREBASE_CLIENT_EMAIL,
      ),
      'process.env.FIREBASE_PRIVATE_KEY_BASE64': JSON.stringify(
        process.env.FIREBASE_PRIVATE_KEY_BASE64,
      ),
    };

module.exports = (env) => ({
  target: 'node', // Ensure Webpack targets Node.js
  entry: './src/index.ts', // Your app's entry point
  devtool: env.production ? false : 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs2', // Required for Node.js modules
  },
  externals: [nodeExternals()], // Exclude `node_modules` from the bundle
  resolve: {
    extensions: ['.ts', '.js'], // Resolve both .ts and .js files
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['babel-loader', 'ts-loader'], // Use Babel and TypeScript loaders
        exclude: /node_modules/, // Exclude dependencies from bundling
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin(envKeys), // Pass environment
  ],
});
