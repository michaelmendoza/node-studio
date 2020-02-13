
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
    rules: [
      { test: /\.(js|jsx)$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.(jpg|png)$/, loader: 'url?limit=25000' },
      { test: /\.(scss|css)$/, loader: "style-loader!css-loader!sass-loader" }
    ]
  },
};
