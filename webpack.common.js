'use strict';

const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'bundle': './src/client/boot/entry.js',
  },
  output: {
    publicPath: '/',
    path: path.join(__dirname, './build/client'),
    filename: 'scripts/[name].js',
    chunkFilename: 'scripts/[name].js',
    sourceMapFilename: 'bundle.js.map'
  },
  resolve: {
    modules: ['src', 'node_modules'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      hash: true,
      template: path.join(__dirname, './src/client/boot/index.ejs'),
      inject: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              sourceMaps: 'inline',
              presets: [
                ['@babel/preset-react'],
                ['@babel/preset-env', {
                  targets: {
                    browsers: [
                      "last 6 versions",
                      "safari >= 7",
                    ],
                  },
                  loose: false,
                  modules: false,
                }],
              ],
              plugins: ["@babel/plugin-transform-runtime"],
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        loader: 'file-loader',
        options: {
          esModule: false,
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {name: 'templates/[name].[ext]'},
          },
        ],
      },
    ],
  },
};
