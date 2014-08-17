/*
 * Webpack distribution configuration
 *
 * This file is set up for serving the distribution version. It will be compiled to dist/ by default
 */

'use strict';

var webpack = require('webpack');

module.exports = {
  output: {
    publicPatch: 'dist/',
    path: 'dist/scripts/',
    filename: 'infinitescroll.js'
  },
  debug: false,
  devtool: false,
    context: __dirname + '/src',
    entry: './scripts/main.jsx',

  stats: {
    colors: true,
    reasons: false
  },

  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ],

  module: {
    preLoaders: [{
      test: '\\.js$',
      exclude: 'node_modules',
      loader: 'jshint'
    }],

    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css'
      }, {
        test: /\.gif/,
        loader: 'url-loader?limit=10000&minetype=image/gif'
      }, {
        test: /\.jpg/,
        loader: 'url-loader?limit=10000&minetype=image/jpg'
      }, {
        test: /\.png/,
        loader: 'url-loader?limit=10000&minetype=image/png'
      }, {
        test: /\.jsx$/,
        loader: 'jsx-loader'
      }
    ]
  }
};