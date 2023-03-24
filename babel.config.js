module.exports = {
  presets: [
    '@babel/env',
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
    'js-logger',
  ],
}
