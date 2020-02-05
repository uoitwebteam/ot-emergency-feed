const path = require('path');
const webpack = require('webpack');
const {
  getIfUtils,
  removeEmpty
} = require('webpack-config-utils');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

const nodeEnv = process.env.NODE_ENV || 'development';
const {
  ifDevelopment,
  ifProduction
} = getIfUtils(nodeEnv);

const babelOptions = {
  presets: [
    [
      'env', {
        'modules': false,
        'include': ['es6.object.assign', 'es6.array.find', 'es6.array.from']
      }
    ]
  ]
}

module.exports = removeEmpty({
  mode: nodeEnv,

  entry: './client/index.ts',

  output: {
    filename: ifProduction('[name]-bundle.[hash].js', '[name]-[hash].js'),
    path: path.resolve(__dirname, 'public'),
  },

  module: {
    rules: [{
        test: /\.(sass|scss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        loader: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [{
            loader: 'babel-loader',
            options: babelOptions
          },
          {
            loader: 'ts-loader'
          }
        ]
      },
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   use: [
      //     {
      //       loader: 'babel-loader',
      //       options: babelOptions
      //     }
      //   ]
      // }
    ],
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },

  devtool: ifDevelopment('eval-source-map', 'source-map'),

  devServer: ifDevelopment({
    host: '0.0.0.0',
    port: 3000,
    stats: 'normal',
    open: true,
    overlay: true,
    proxy: {
      'ws://0.0.0.0:3000': {
        target: 'ws://localhost:8080',
        ws: true
      }
    }
  }),

  plugins: removeEmpty([

    // ifDevelopment(
    new HtmlWebpackPlugin({
      hash: true,
      filename: 'index.html',
      template: './client/index.ejs',
      inject: false,
      environment: nodeEnv,
    }),
    // ),

    // ifProduction(new CopyWebpackPlugin([{ from: 'assets', to: 'assets' }])),

    new MiniCssExtractPlugin()
  ]),
});