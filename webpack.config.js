const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
// this file doesn't seem to be in effect, use config-overrides.js instead
module.exports = {
  module: {
    rules: [
      { test: /\.html$/, use: {loader: 'html?minimize=false'} }
    ],
  },
  plugins: [
    new NodePolyfillPlugin()
  ]
}
