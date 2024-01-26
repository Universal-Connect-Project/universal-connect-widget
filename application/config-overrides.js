// Overrides create-react-app webpack configs without ejecting
// https://github.com/timarney/react-app-rewired

const { override, useBabelRc, addWebpackModuleRule, addWebpackPlugin } = require("customize-cra");
const path = require("path");
const { removeModuleScopePlugin } = require('customize-cra')
const { DefinePlugin } = require('webpack')

module.exports = removeModuleScopePlugin()
module.exports = override(
  useBabelRc(),
  removeModuleScopePlugin(),
  addWebpackPlugin(new DefinePlugin({
    // This is to pass the api keys to client code for mobile use
    // TODO: try to see a better way to auth mobile app with api server
    'process.client_envs': process.env.mobile ? {
      MxApiSecret: JSON.stringify(process.env.MxApiSecret),
      MxApiSecretProd: JSON.stringify(process.env.MxApiSecretProd),
      SophtronApiUserSecret: JSON.stringify(process.env.SophtronApiUserSecret),
    }: {}
  })),
  addWebpackModuleRule({
      test: /\.js$/,
      include: path.resolve(__dirname, 'node_modules/@kyper/'),
      exclude: [
        /__tests__/,
        path.resolve(__dirname,'node_modules/@redis')
      ],
      loader: 'babel-loader',
      options: {
        presets: [
          [
            "@babel/env",
            {
              "useBuiltIns": "entry",
              "corejs": "3.29",
              "modules": "commonjs"
            }
          ],
          '@babel/preset-react'
        ],
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
        'interfaces': path.resolve(__dirname, '/shared/connect'),
        'redis': path.resolve(__dirname, '/server/serviceClients/storageClient/redis_mock.js'),
        clients: path.resolve(__dirname, 'src/clients'),
        components: path.resolve(__dirname, 'src/components'),
        config: path.resolve(__dirname, 'src/config'),
        constants: path.resolve(__dirname, 'src/constants'),
        // css: path.resolve(__dirname, 'src/css'),
        loggerInit: path.resolve(__dirname, 'loggerInit.js'),
        reduxify: path.resolve(__dirname, 'src/redux'),
        schemas: path.resolve(__dirname, 'src/schemas'),
        // stores: path.resolve(__dirname, 'src/stores'),
        streams: path.resolve(__dirname, 'src/streams'),
        utils: path.resolve(__dirname, 'src/utils'),
        widgets: path.resolve(__dirname, 'src/widgets'),
        src: path.resolve(__dirname, 'src'),
      },
      fallback: { 
        ...config.resolve.fallback, 
        crypto: require.resolve("crypto-browserify"),
        buffer: require.resolve("buffer-browserify"),
        stream: require.resolve("stream-browserify"),
        assert: require.resolve("assert-browserify"),
        url: require.resolve("url/"),
        net: false,
        tls: false,
        redis: false
      },
    };
    config.optimization = {
      minimize: false,
      splitChunks: {
        cacheGroups: {
          default: false,
        },
      },
      runtimeChunk: false,
    }
    // config.plugins[0].userOptions.minify.minifyJS = false
    // console.log(JSON.stringify(config))
    delete config.module.rules[1].oneOf[4].include
    // config.module.rules[1].oneOf.unshift(
    //   { test: /\.html$/, use: {loader: 'html?minimize=false'} }
    //   )
    return config;
  }
)
