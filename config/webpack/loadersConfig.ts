import { RuleSetRule } from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { ConfigOptions } from "./createConfig";

export default function createRules(options: ConfigOptions): RuleSetRule[] {
  const stylesHandler = MiniCssExtractPlugin.loader;
  const babelLoader = {
    test: /\.(ts|tsx)$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
    },
  };
  const scssLoader = {
    test: /\.s[ac]ss$/i,
    use: [
      options.isDev ? "style-loader" : stylesHandler,
      {
        loader: "css-loader",
        options: {
          modules: {
            localIdentName: options.isDev ? "[path][name]__[local]--[hash:base64:8]" : "[hash:base64:8]",
            auto: (resourcePath: string) => resourcePath.includes(".module."),
          },
        },
      },
      "sass-loader",
    ],
  };
  const svgLoader = {
    test: /\.svg$/i,
    issuer: /\.[jt]sx?$/,
    use: ["@svgr/webpack"],
  };
  const assetsLoader: RuleSetRule = {
    test: /\.(eot|ttf|woff|woff2|png|jpg|gif)$/i,
    type: "asset",
  };

  return [scssLoader, svgLoader, assetsLoader, babelLoader];
}
