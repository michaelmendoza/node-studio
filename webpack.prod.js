
var path = require('path');
var webpack = require('webpack');

module.exports = { 
  entry: { ImageNodes:'./src/lib.js' },
	output: {
		path: path.join(__dirname, "dist"),
		filename: "[name].js",
		library: "[name]",
		libraryTarget: "umd"
	},
	externals: [
		'd3',
		'events',
		'react',
		'react-dom',
		'dicom-parser',
    'ml-matrix'
	],
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
