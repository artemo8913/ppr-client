import webpack, { WebpackPluginInstance } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import WorkboxWebpackPlugin from "workbox-webpack-plugin";
import { ConfigOptions } from "./createConfig";

export default function createPlugins(options: ConfigOptions): WebpackPluginInstance[] {
  const progressPlugin = new webpack.ProgressPlugin();

  const htmlPlugin = new HtmlWebpackPlugin({
    template: options.paths.html,
  });

  const miniCssPlugin = new MiniCssExtractPlugin({
    filename: "css/[name].[contenthash:8].css",
    chunkFilename: "css/[name].[contenthash:8].css",
  });

  // const pwaPlagin = new WorkboxWebpackPlugin.GenerateSW();

  return [progressPlugin, htmlPlugin, miniCssPlugin];
}
