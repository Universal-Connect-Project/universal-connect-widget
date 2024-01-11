const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const path = require('path')

// this file doesn't seem to be in effect, use config-overrides.js instead
module.exports = {
  module: {
    rules: [
      { test: /\.html$/, use: {loader: 'html?minimize=false'} }
    ],
  },
  plugins: [
    new NodePolyfillPlugin()
  ],
  resolve: {
    alias: {
      src: path.join(__dirname, 'application/src'),
      reduxify: path.join(__dirname, 'application/src/redux'),
    }
  }
}
