const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: './src/toastify.js',
    output: {
        filename: 'toastify.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'sass-loader'
            })
        }]
    },
    plugins: [
      new ExtractTextPlugin('toastify.css'),
    ]
};