const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = (env) => ({
  target: 'node', // Ensure Webpack targets Node.js
  entry: './src/index.ts', // Your app's entry point
  devtool: env.production ? false : 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs2', // Required for Node.js modules
  },
  externals: [nodeExternals({
    modulesDir: path.resolve(__dirname, '../../../../node_modules'),
  })], // Exclude `node_modules` from the bundle
  resolve: {
    extensions: ['.ts', '.js'], // Resolve both .ts and .js files
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['babel-loader', 'ts-loader'], // Use Babel and TypeScript loaders
        exclude: [
          '/node_modules/', // Exclude dependencies from bundling
        ],
      },
    ],
  },
});
