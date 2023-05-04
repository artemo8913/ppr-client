import createConfig, { ConfigEnv, ConfigOptions } from "./config/webpack/createConfig";
import { Configuration } from "webpack";
import path from "path";

export default (env: ConfigEnv) => {
  const mode = env.mode ? env.mode : "development";
  const isDev = mode === "development";
  const options: ConfigOptions = {
    mode,
    isDev,
    paths: {
      entry: path.resolve(__dirname, "src", "index.tsx"),
      html: path.resolve(__dirname, "public", "index.html"),
      output: path.resolve(__dirname, "build"),
      src: path.resolve(__dirname, "src"),
    },
    port: Number(env.port),
  };
  const config: Configuration = createConfig(options);
  return config;
};
