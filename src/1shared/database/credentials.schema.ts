import { varchar, serial, mysqlTable } from "drizzle-orm/mysql-core";

import { usersTable } from "@/1shared/database/user.schema";

export const credentialsTable = mysqlTable("credentials", {
  id: serial("id").references(() => usersTable.id),
  username: varchar("username", { length: 32 }).notNull().unique(),
  password: varchar("password", { length: 32 }).notNull(),
});

export type TUserDB = typeof credentialsTable.$inferSelect;
