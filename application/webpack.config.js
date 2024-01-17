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

      // actions: './src/actions',
      clients: path.resolve(__dirname, 'src/clients'),
      components: path.resolve(__dirname, 'src/components'),
      config: path.resolve(__dirname, 'src/config'),
      constants: path.resolve(__dirname, 'src/constants'),
      // css: path.resolve(__dirname, 'src/css'),
      loggerInit: path.resolve(__dirname, 'loggerInit.js'),
      reduxify: path.resolve(__dirname, 'src/redux'),
      schemas: path.resolve(__dirname, 'src/schemas'),
      src: path.resolve(__dirname, 'src'),
      // stores: path.resolve(__dirname, 'src/stores'),
      streams: path.resolve(__dirname, 'src/streams'),
      utils: path.resolve(__dirname, 'src/utils'),
      widgets: path.resolve(__dirname, 'src/widgets'),
    }
  }
}
