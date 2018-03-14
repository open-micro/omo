var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, './public/assets');
var APP_DIR = path.resolve(__dirname, './app/client');

const config = {
   entry: {
     main: APP_DIR + '/client.js'
   },
   mode: 'development',
   output: {
     filename: 'bundle.js',
     path: BUILD_DIR,
     publicPath: '/assets/'
   },
   devServer: {
    contentBase: path.join(__dirname, "./public")
    },
   module: {
    rules: [
     {
       test: /(\.css|.scss)$/,
       use: [{
           loader: "style-loader" // creates style nodes from JS strings
       }, {
           loader: "css-loader" // translates CSS into CommonJS
       }, {
           loader: "sass-loader" // compiles Sass to CSS
       }]
     },
     { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
     {
       test: /\.(jsx|js)?$/,
       exclude: /(node_modules|bower_components)/,
       use: [{loader: 'babel-loader',
           options: {
             cacheDirectory: true,
             plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy', 'syntax-object-rest-spread'],
             presets: ['react', 'es2016'] // Transpiles JSX and ES6
           }
         }]
     }
    ],

  }
};

module.exports = config;
