var path = require("path");
var webpack = require("webpack");

const isProduction = process.env.NODE_ENV === "production";

var config = {
  target: "web",
  entry: {
    app: "./lib/origin-graphql.js"
  },
  devtool: false,
  output: {
    libraryTarget: "window",
    library: 'OriginGraphQL',
    filename: "origin-graphql.js"
  },
  module: {
    rules: [
      { test: /\.flow$/, loader: "ignore-loader" },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "lib"),
          path.resolve(__dirname, "node_modules/origin-utils")
        ],
        loader: "babel-loader"
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto"
      }
    ]
  },
  resolve: {
    extensions: [".js", ".json"]
  },
  node: {
    fs: "empty"
  },
  mode: "production",
  plugins: []
};

module.exports = config;
