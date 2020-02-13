
module.exports =(env) => {
  return env == null ? require(`./webpack.dev.js`) : require(`./webpack.${env}.js`)
}