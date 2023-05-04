/// <reference path="../../node_modules/webpack-dev-server/types/lib/Server.d.ts"/>
import { Configuration } from "webpack";
import createPlugins from "./pluginsConfig";
import createRules from "./rulesConfig";
import createResolves from "./resolvesConfig";
import createDevServerConfig from "./devServerConfig";

export type ConfigMode = "development" | "production";

export interface ConfigEnv {
  mode: ConfigMode;
  port: number | string;
}

export interface ConfigPaths {
  entry: string;
  output: string;
  src: string;
  html: string;
}

export interface ConfigOptions {
  mode: ConfigMode;
  paths: ConfigPaths;
  port: number;
  isDev: boolean;
}

export default function createConfig(options: ConfigOptions): Configuration {
  const mode = options.mode;
  const isDev = options.isDev;
  return {
    mode,
    entry: options.paths.entry,
    output: {
      path: options.paths.output,
      filename: "[name].[contenthash].js",
      clean: true,
    },
    plugins: createPlugins(options),
    module: {
      rules: createRules(options),
    },
    resolve: createResolves(options),
    devtool: isDev ? "inline-source-map" : undefined,
    devServer: isDev ? createDevServerConfig(options) : undefined,
  };
}
