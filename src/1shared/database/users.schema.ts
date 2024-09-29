import { varchar, serial, smallint, mysqlTable, mysqlEnum } from "drizzle-orm/mysql-core";

import { TUserRole } from "@/2entities/user/model/user.types";
import { USER_ROLES } from "@/2entities/user/lib/const";

export const usersTable = mysqlTable("users", {
  id: serial("id").primaryKey(),
  first_name: varchar("first_name", { length: 32 }).notNull(),
  last_name: varchar("last_name", { length: 32 }).notNull(),
  middle_name: varchar("middle_name", { length: 32 }).notNull(),
  //@ts-ignore
  role: mysqlEnum("role", USER_ROLES).$type<TUserRole>().notNull(),
  id_subdivision: smallint("id_subdivision"),
  id_distance: smallint("id_distance"),
  id_direction: smallint("id_direction"),
});

export type TUserDB = typeof usersTable.$inferSelect;
