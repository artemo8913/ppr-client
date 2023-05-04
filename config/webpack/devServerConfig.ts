import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import { ConfigOptions } from "./createConfig";

export default function createDevServerConfig(options: ConfigOptions): DevServerConfiguration {
  return {
    port: options.port,
    open: false,
    static: {
      directory: options.paths.output,
    },
    hot: true,
    historyApiFallback: true,
    client: {
      overlay: false,
    },
  };
}
