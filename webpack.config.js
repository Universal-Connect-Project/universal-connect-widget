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
}
