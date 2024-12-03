import { cwd } from "node:process";
import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

loadEnvConfig(cwd());

export default defineConfig({
  schema: "./src/1shared/database/*.schema.ts",
  dialect: "mysql",
  out: "./drizzle",
  dbCredentials: {
    url: "db",
    host: process.env[`DB_HOST_${process.env.DB_LOCATION}`],
    database: process.env[`DB_NAME_${process.env.DB_LOCATION}`],
    port: Number(process.env[`DB_PORT_${process.env.DB_LOCATION}`]),
    user: process.env[`DB_USER_${process.env.DB_LOCATION}`],
    password: process.env[`DB_PASSWORD_${process.env.DB_LOCATION}`],
  },
});
