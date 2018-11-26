var path = require('path');

module.exports = {
  entry: './scripts/app.js',
  output: {
    path: __dirname,
    filename: './scripts/bundle.js',
  },
  module: {
    rules: [
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
    extensions: ['.js', '*', '.json']
  }
};
