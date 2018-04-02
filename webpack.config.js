const path = require('path')
const nodeExternals = require('webpack-node-externals');


module.exports = {
  entry: './src/index.ts',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts']
  },
  output: {
    filename: 'index.js', // <-- Important
    libraryTarget: 'this' // <-- Important
  },
  externals: [nodeExternals()]
};