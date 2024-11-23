import { cwd } from "node:process";
import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

loadEnvConfig(cwd());

export default defineConfig({
  schema: "./src/1shared/database/*.schema.ts",
  dialect: "mysql",
  out: "./drizzle",
});
