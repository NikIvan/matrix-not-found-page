const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const autoprefixer = require('autoprefixer');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'source-map',
  output: {
    filename: 'scripts/[name].[chunkhash].js',
    chunkFilename: 'scripts/[name].[chunkhash].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new UglifyJSPlugin({
      sourceMap: false,
      // sourceMap: false,
      // output: {
      //   comments: false,
      // },
      // ie8: false,
      // parallel: true,
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new ExtractTextPlugin('styles/[name].[chunkhash].css'),
    new AssetsPlugin({
      filename: 'webpack-assets.json',
      path: path.join(__dirname + '/build/server/views'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'images/[name].[ext]',
              limit: 4000,
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: false,
              mozjpeg: {progressive: true},
              gifsicle: {interlaced: false},
              optipng: {optimizationLevel: 7},
              pngquant: {
                quality: '75-90',
                speed: 3,
              },
            },
          },
        ],
      },
      {
        test: /\.(scss|css)$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                minimize: true,
                localIdentName: '[local]',
                // localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                parser: 'postcss-scss',
                plugins: () => {
                  return [
                    autoprefixer({browsers: ['last 2 versions']}),
                  ];
                },
              },
            },
            {
              loader: 'sass-loader',
            },
          ],
        }),
      },
    ],
  },
});
