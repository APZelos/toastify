const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var ZipPlugin = require('zip-webpack-plugin');

module.exports = {
    entry: {
        toastify: ['./src/toastify.js', './src/toastify.scss']
    },
    output: {
        filename: '[name].min.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: {
                        minimize: true
                    }
                }, {
                    loader: 'sass-loader'
                }]
            })
        }]
    },
    plugins: [
        new ExtractTextPlugin('[name].min.css'),
        new UglifyJSPlugin(),
        new ZipPlugin({
            filename: 'toastify.zip'
        })
    ]
};