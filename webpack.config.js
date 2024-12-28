const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack');
const dotenv = require('dotenv');


console.log('FIREBASE_API_KEY', process.env.FIREBASE_API_KEY);

// Load environment variables
const env = dotenv.config().parsed;

// Convert environment variables to stringified format for DefinePlugin
const envKeys = !process.env.FIREBASE_API_KEY ? Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {}) : {
  'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
  'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
  'process.env.FIREBASE_PROJECT_ID': JSON.stringify(process.env.FIREBASE_PROJECT_ID),
  'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
  'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
  'process.env.FIREBASE_APP_ID': JSON.stringify(process.env.FIREBASE_APP_ID),
  'process.env.FIREBASE_MEASUREMENT_ID': JSON.stringify(process.env.FIREBASE_MEASUREMENT_ID),
};

console.log('envKeys', envKeys);

console.log('FIREBASE_API_KEY', process.env.FIREBASE_API_KEY);
console.log('FIREBASE_AUTH_DOMAIN', process.env.FIREBASE_AUTH_DOMAIN);
console.log('FIREBASE_PROJECT_ID', process.env.FIREBASE_PROJECT_ID);
console.log('FIREBASE_STORAGE_BUCKET', process.env.FIREBASE_STORAGE_BUCKET);
console.log('FIREBASE_MESSAGING_SENDER_ID', process.env.FIREBASE_MESSAGING_SENDER_ID);
console.log('FIREBASE_APP_ID', process.env.FIREBASE_APP_ID);
console.log('FIREBASE_MEASUREMENT_ID', process.env.FIREBASE_MEASUREMENT_ID);


module.exports = env  => ({
  entry: env.production ? './app/index.ts' : [
    'webpack-dev-server/client?http://localhost:3000',  // Required for HMR
    'webpack/hot/dev-server',  // Required for HMR
    './app/index.ts',
  ],
  target: env.production ? 'es5' : 'es6',
  resolve: {
    extensions: env.production ? ['.ts'] : ['.ts','.js'],
    alias: {
      '@business-logic': path.resolve(__dirname, 'app/business-logic'),
      '@components': path.resolve(__dirname, 'app/components'),
      "@tic-tac": path.resolve(__dirname, "app/components/game/tic-tac"),
      '@contexts': path.resolve(__dirname, 'app/contexts'),
      '@data': path.resolve(__dirname, 'app/data'),
      '@firebase-dir': path.resolve(__dirname, 'app/firebase'),
      '@helpers': path.resolve(__dirname, 'app/helpers'),
      '@hooks': path.resolve(__dirname, 'app/hooks'),
      '@types-dir': path.resolve(__dirname, 'app/types'),
      '@utils': path.resolve(__dirname, 'app/utils'),
      '@session': path.resolve(__dirname, 'app/session')
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/, // Handle CSS files
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.ts?$/,
        use: env.production ? ['babel-loader', 'ts-loader'] : ['ts-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf|otf|json)$/,
        type: 'asset/resource', // Automatically handles these files
        generator: {
          filename: 'assets/[name][hash][ext]', // Output directory and filename
        },
      },
    ]
  },
  output: {
    chunkFormat: 'array-push',
    path: path.join(__dirname, 'build'),
    filename: 'bundle.[contenthash].js',      // Add content hash to bundle filenames
    chunkFilename: 'chunks.[contenthash].js', // For dynamically imported chunks
    clean: true                              // Clears old files from the dist folder
  },
  devServer: {
    server: 'https',
    open: true,
    port: 3000,
    hot: true
  },
  plugins: [
    new webpack.DefinePlugin(envKeys),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: 'body'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css', // CSS output filename
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/assets', to: 'assets' }, // Copy static files
        {
          from: path.resolve(__dirname, 'public/404.html'), // Source file
          to: path.resolve(__dirname, 'build/404.html'), // Destination file
        },
        {
          from: path.resolve(__dirname, 'public/404.html'), // Source file
          to: path.resolve(__dirname, 'build/404.html'), // Destination file
        },
      ],
    }),
  ]
});
