import { varchar, mysqlTable, mysqlEnum, int } from "drizzle-orm/mysql-core";

import { directionsTable, distancesTable, subdivisionsTable } from "@/2entities/division/@x/user";

import { TUserRole } from "./user.types";
import { USER_ROLES } from "./user.const";


export const usersTable = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("first_name", { length: 32 }).notNull(),
  lastName: varchar("last_name", { length: 32 }).notNull(),
  middleName: varchar("middle_name", { length: 32 }).notNull(),
  role: mysqlEnum("role", USER_ROLES as [string])
    .$type<TUserRole>()
    .notNull(),
  idSubdivision: int("id_subdivision").references(() => subdivisionsTable.id),
  idDistance: int("id_distance").references(() => distancesTable.id),
  idDirection: int("id_direction").references(() => directionsTable.id),
});

export const credentialsTable = mysqlTable("credentials", {
  id: int("id")
    .references(() => usersTable.id)
    .notNull(),
  username: varchar("username", { length: 32 }).notNull().unique(),
  password: varchar("password", { length: 32 }).notNull(),
});
