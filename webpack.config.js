const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

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
    ],
  },
  plugins: [
    new NodePolyfillPlugin()
  ]
}
