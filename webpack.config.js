const path = require('path');

module.exports = {
  entry: './src/toastify.js',
  output: {
    filename: 'toastify.js',
    path: path.resolve(__dirname, 'dist')
  }
};