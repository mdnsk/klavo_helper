const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    'background-script': './src/background-script.js',
    'content-script': './src/content-script.js',
  },

  output: {
    path: path.resolve(__dirname, './extension/dist'),
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },

  performance: {
    hints: false,
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },

  // Необходимо отключить ненужные полифиллы, чтобы успешно пройти проверку web-ext lint.
  node: {
    global: false,
    setImmediate: false,
  },

  devtool: false,
};

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
  ]);
}
