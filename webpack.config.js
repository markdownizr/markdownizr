const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const DIST = path.resolve(__dirname, 'dist')
const SRC = path.resolve(__dirname, 'src')
const MANIFEST_FILE = 'manifest.json'
const MANIFEST_PATH = path.join(SRC, MANIFEST_FILE)

module.exports = (env, argv) => {
  return {
    optimization: {
      minimize: argv.mode === 'production',
    },
    entry: {
      background: path.join(SRC, 'background.js'),
      content: path.join(SRC, 'content.js'),
    },
    output: {
      path: DIST,
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'src/manifest.json',
            to: 'manifest.json',
          },
          {
            from: 'src/_locales',
            to: '_locales',
          },
          {
            from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js',
            to: 'vendor/[name][ext]',
          },
          // TODO: replace these deps with imported node_modules
          {
            from: 'src/bower_components/jquery/dist/jquery.js',
            to: 'vendor/[name][ext]',
          },
          {
            from: 'src/bower_components/to-markdown/dist/to-markdown.js',
            to: 'vendor/[name][ext]',
          },
          {
            from: 'src/options_custom',
            to: 'options_custom',
          },
          {
            from: 'src/images/**/*',
            to: 'images/[name][ext]',
          },
          {
            from: 'src/background.html',
            to: '[name][ext]',
          },
        ],
      }),
    ],
  }
}
