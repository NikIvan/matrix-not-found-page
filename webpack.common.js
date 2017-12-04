'use strict';

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
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
    new CleanWebpackPlugin([path.join(__dirname, './build/client')]),
    new HtmlWebpackPlugin({
      hash: true,
      template: path.join(__dirname, './src/client/boot/index.ejs'),
      inject: true,
    }),
    /**
     * Move modules that occur in multiple entry chunks to a new entry chunk
     * (the commons chunk).
     * [https://webpack.js.org/plugins/commons-chunk-plugin/]
     */
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      chunks: ['bundle'],
      minChunks: function(module) {
        // this assumes your vendor imports exist in the node_modules directory
        return module.context && module.context.indexOf('node_modules') !== -1;
      },
    }),
    // CommonChunksPlugin will now extract all the common modules
    // from vendor and main bundles
    new webpack.optimize.CommonsChunkPlugin({
      // But since there are no more common modules between them
      // we end up with just the runtime code included in the manifest file
      name: 'manifest',
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
                ['react'],
                ['stage-2'],
                ['env', {
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
              plugins: ["transform-runtime"],
            },
          },
        ],
      },
      {
        test: /\.(ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {name: 'fonts/[name].[ext]'},
          },
        ],
      },
      // {
      //   test: /\.svg$/,
      //   loader: 'svg-inline-loader?classPrefix'
      // },
      {
        test: /\.svg$/,
        loader: 'file-loader'
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
