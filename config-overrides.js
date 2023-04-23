// Overrides create-react-app webpack configs without ejecting
// https://github.com/timarney/react-app-rewired

const { override, useBabelRc, addWebpackModuleRule } = require("customize-cra");
const path = require("path");
const { removeModuleScopePlugin } = require('customize-cra')

module.exports = removeModuleScopePlugin()
module.exports = override(
  useBabelRc(),
  removeModuleScopePlugin(),
  addWebpackModuleRule(
    {
      test: /\.js$/,
      include: path.resolve(__dirname, 'node_modules/@kyper/'),
      exclude: [/__tests__/],
      loader: 'babel-loader',
      options: {"sourceType": "unambiguous",
      presets: [
        [
          "@babel/env",
          {
            "useBuiltIns": "entry",
            "corejs": "3.29",
            "modules": "commonjs"
          }
        ],'@babel/preset-react'],
        sourceType: "unambiguous"
      },
    },
  ),
  function override(config) {
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.alias,
        'services': path.resolve(__dirname, '/server/connect'),
        'interfaces': path.resolve(__dirname, '/shared/connect')
      },
      fallback: { 
        ...config.resolve.fallback, 
        crypto: require.resolve("crypto-browserify"),
        buffer: require.resolve("buffer-browserify"),
        stream: require.resolve("stream-browserify"),
        assert: require.resolve("assert-browserify")
      },
    };
    config.optimization = {
      minimize: false,
      splitChunks: {
        cacheGroups: {
          default: false,
        },
      },
      runtimeChunk: false
    }
    // console.log(JSON.stringify(config))
    delete config.module.rules[1].oneOf[4].include
    return config;
  }
)
