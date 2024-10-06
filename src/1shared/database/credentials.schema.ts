import { varchar, mysqlTable, int } from "drizzle-orm/mysql-core";

import { usersTable } from "@/1shared/database/users.schema";

export const credentialsTable = mysqlTable("credentials", {
  id: int("id")
    .references(() => usersTable.id)
    .notNull(),
  username: varchar("username", { length: 32 }).notNull().unique(),
  password: varchar("password", { length: 32 }).notNull(),
});

export type TCredentialsDB = typeof credentialsTable.$inferSelect;
