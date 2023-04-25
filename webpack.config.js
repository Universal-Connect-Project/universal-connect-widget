const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
// this file doesn't seem to be in effect, use config-overrides.js instead
module.exports = {
  module: {
    rules: [
        {
          test: /\.js$/,
          include: path.resolve(__dirname, 'node_modules/@kyper/'),
          exclude: [/__tests__/],
          loader: 'babel-loader',
          query: {
              presets: ['@babel/preset-react'],
          },
        },
        {
          test: /\.svg$/,
          type: "asset/inline",
        }
    ],
  },
  plugins: [
    new NodePolyfillPlugin()
  ]
}
