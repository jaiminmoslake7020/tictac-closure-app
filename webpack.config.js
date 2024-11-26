const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:3000',  // Required for HMR
    'webpack/hot/dev-server',  // Required for HMR
    './app/index.ts',
  ],
  target: 'es5',
  resolve: {
    extensions: ['.ts','.js']
  },
  module: {
    rules: [
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
    open: true,
    port: 3000,
    hot: true
  },
  plugins: [
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
}
