var path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

module.exports = () => {
  const env = dotenv.config().parsed;
  
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    entry: './scripts/app.jsx',
    output: {
      path: __dirname,
      filename: './scripts/bundle.js',
    },
    plugins: [
      new webpack.DefinePlugin(envKeys)
    ],
    module: {
      rules: [
        {
          test: [/\.jsx?$/],
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            query: {
              presets: ['@babel/env', '@babel/react']
            }
          },
        },
        {
           test: /\.css$/,
           exclude: /(node_modules)/,
           use: [ 'style-loader', 'css-loader' ]
         },
        {
          exclude: /(node_modules)/,
        },
         {
           test: /\.json$/,
           exclude: /(node_modules)/,
           use: {
             loader: 'json-loader',
           },
         },
      ]
    },
    devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.jsx', '*', '.json']
    }
  }

};
