import { cwd } from "node:process";
import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

loadEnvConfig(cwd());

export default defineConfig({
  schema: "./src/1shared/database/*.schema.ts",
  dialect: "mysql",
  out: "./drizzle",
  dbCredentials: {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    host: "localhost",
    url: "db",
  },
});
