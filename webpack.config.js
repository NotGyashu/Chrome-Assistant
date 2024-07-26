const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const copyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {

    index: path.resolve(__dirname, "src/index.js"),
    background: path.resolve(__dirname, "public/background.js"),
    content: path.resolve(__dirname, "public/content.js"),
    sidePanel: path.resolve(__dirname, "src/sidePanel.js"),
    
  },

  output: {
    filename: `[name].js`,
    path: path.resolve(__dirname, "dist"),
   
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
      title: "chrome-assistant",
      filename: "index.html",
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/sidePanel.html"),
      filename: "sidePanel.html",
      chunks: ["sidePanel"], // Include only the 'sidePanel' entry point in this HTML file
    }),
    new copyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "public/manifest.json"),
          to: path.resolve(__dirname, "dist"),
        },
        {
          from: path.resolve(__dirname, "public/icon.png"),
          to: path.resolve(__dirname, "dist"),
        },
      ],
    }),
  ],
  
};
