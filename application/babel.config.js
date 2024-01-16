module.exports = {
  sourceType: "unambiguous",
  presets: [
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-transform-modules-commonjs',
    'js-logger',
    [
      'module-resolver',
      {
        alias: {
          // actions: './src/actions',
          clients: './src/clients',
          components: './src/components',
          config: './src/config',
          constants: './src/constants',
          // css: './src/css',
          loggerInit: './loggerInit.js',
          reduxify: './src/redux',
          schemas: './src/schemas',
          src: './src',
          // stores: './src/stores',
          streams: './src/streams',
          utils: './src/utils',
          widgets: './src/widgets',
        },
      },
    ],
  ],
  env: {
    test: {
      plugins: ['dynamic-import-node'],
    },
  },
}
