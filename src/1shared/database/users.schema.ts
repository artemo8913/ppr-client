import { varchar, serial, smallint, mysqlTable, mysqlEnum } from "drizzle-orm/mysql-core";

import { TUserRole } from "@/2entities/user/model/user.types";
import { USER_ROLES } from "@/2entities/user/lib/const";

export const usersTable = mysqlTable("users", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 32 }).notNull(),
  lastName: varchar("last_name", { length: 32 }).notNull(),
  middleName: varchar("middle_name", { length: 32 }).notNull(),
  role: mysqlEnum("role", USER_ROLES as [string])
    .$type<TUserRole>()
    .notNull(),
  idSubdivision: smallint("id_subdivision"),
  idDistance: smallint("id_distance"),
  idDirection: smallint("id_direction"),
});

export type TUserDB = typeof usersTable.$inferSelect;
