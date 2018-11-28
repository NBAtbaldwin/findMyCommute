var path = require('path');

module.exports = {
  entry: './scripts/app.jsx',
  output: {
    path: __dirname,
    filename: './scripts/bundle.js',
  },
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
};
