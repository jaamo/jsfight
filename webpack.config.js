const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/main.ts",

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/dist/"
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  watchOptions: {
    ignored: /node_modules/
  }
};
