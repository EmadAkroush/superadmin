const path = require("path");

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  devServer: {
    port: 8081,
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@service": path.relative(__dirname , "src/@core/services/index.js"),
        "@components" : path.relative(__dirname , "src/@core/components"),
        "@core" : path.relative(__dirname ,"src/@core")

      },
    },
  },
};
