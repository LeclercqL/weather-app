 const webpack = require('webpack');
 const path = require('path');
 const ExtractTextPlugin = require("extract-text-webpack-plugin");
 
 let config = {
   entry: {
     main: [
       './js/script.js',
       './scss/style.scss'
     ]
   },
   output: {
     path: path.resolve(__dirname, '../dist/js/'),
     filename: 'script.js'
   },
   devtool: 'inline-source-map',
   module: {
     rules: [
       {
         test: /\.js/,
         loader: 'babel-loader'
       },
       {
         test: /\.scss$/,
         use: ExtractTextPlugin.extract({
           fallback: 'style-loader',
           use: [
             {
               loader: 'css-loader',
               options: {
                 minimize: true,
                 sourceMap: true,
                 url : false,
               }
             },
             {
               loader: 'postcss-loader',
               options: {
                 sourceMap: true,
               }
             },
             {
               loader: 'sass-loader',
               options: {
                 sourceMap: true,
               }
             },
           ]
         })
       },
       {
         test: /.(png|woff(2)?|eot|ttf|svg|gif)(\?[a-z0-9=\.]+)?$/,
         use: [
           {
             loader: 'file-loader',
             options: {
               name: '../css/[hash].[ext]'
             }
           }
         ]
       },
       {
         test : /\.css$/,
         use: ['style-loader', 'css-loader', 'postcss-loader']
       }
     ]
   },
   plugins: [
     new ExtractTextPlugin(path.join('..', 'css', 'style.css'))
   ]
 };
 
 module.exports = config;
 