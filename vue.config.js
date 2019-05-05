var webpack = require("webpack");

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          PACKAGE_JSON:
            '"' + escape(JSON.stringify(require("./package.json"))) + '"'
        }
      })
    ]
  }
};
