import { ResolveOptions } from "webpack";
import { ConfigOptions } from "./createConfig";

export default function createResolves(options: ConfigOptions): ResolveOptions {
  return {
    extensions: [".tsx", ".ts", ".js"],
    preferAbsolute: true,
    mainFiles: ['index'],
    modules: [options.paths.src, "node_modules"]
  };
}
