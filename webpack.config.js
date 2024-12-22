const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack');
const dotenv = require('dotenv');

// Load environment variables
const env = dotenv.config().parsed;

// Convert environment variables to stringified format for DefinePlugin
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

console.log('envKeys', envKeys);

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
      '@utils': path.resolve(__dirname, 'app/utils')
    }
  },
  module: {
    rules: env.production ? [
      {
        test: /\.scss$/, // Handle CSS files
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.ts?$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf|otf|json)$/,
        type: 'asset/resource', // Automatically handles these files
        generator: {
          filename: 'assets/[name][hash][ext]', // Output directory and filename
        },
      },
    ] : [
      {
        test: /\.scss$/, // Handle CSS files
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.ts?$/,
        use: ['ts-loader'],
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
      ],
    }),
  ]
});
