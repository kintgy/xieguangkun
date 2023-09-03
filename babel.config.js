const path = require("path")
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          views: path.join(__dirname, './src/views'),
          static: path.join(__dirname, './src/static'),
          assets: path.join(__dirname, './src/assets')
        }
      }
    ]
  ]
}
