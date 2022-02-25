
var path = require('path');
var webpack = require('webpack');
 
module.exports = {
  entry: './src/test/test.jsx',
  output: { path: __dirname, filename: 'build/bundle.js' },
  module: {
    loaders: [
    	{ test: /\.(jpg|png)$/, loader: 'url?limit=25000' },
    	{ test: /\.scss$/, loader: "style!css!sass" },
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
};