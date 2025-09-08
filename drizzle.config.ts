import { cwd } from "node:process";
import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

loadEnvConfig(cwd());

export default defineConfig({
  schema: "./src/2entities/**/*.schema.ts",
  dialect: "mysql",
  out: "./drizzle",

  dbCredentials: {
    url: "db",
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
});
