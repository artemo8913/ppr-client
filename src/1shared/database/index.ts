import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2";

import * as users from "@/1shared/database/user.schema";
import * as credentials from "@/1shared/database/credentials.schema";

const connection = mysql.createConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const db = drizzle(connection, { mode: "default", schema: { ...users, ...credentials } });
