import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/2entities/**/*.db.ts",
  dialect: "mysql",
  out: "./drizzle",
});
