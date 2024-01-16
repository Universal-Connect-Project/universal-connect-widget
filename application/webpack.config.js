const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const path = require('path')

// this file doesn't seem to be in effect, use config-overrides.js instead
module.exports = {
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {loader: 'html?minimize=false'}
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'node_modules/@kyper/'),
        exclude: [/__tests__/],
        loader: 'babel-loader',
      }

    ],
  },
  plugins: [
    new NodePolyfillPlugin()
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
      reduxify: path.resolve(__dirname, 'src/redux'),
    }
  }
}
