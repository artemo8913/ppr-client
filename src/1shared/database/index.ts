import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2";

import * as users from "./users.schema";
import * as credentials from "./credentials.schema";
import * as commonWorks from "./commonWorks.schema";

const connection = mysql.createConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const db = drizzle(connection, { mode: "default", schema: { ...users, ...credentials, ...commonWorks } });
