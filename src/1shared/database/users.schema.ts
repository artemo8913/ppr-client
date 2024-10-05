import { varchar, mysqlTable, mysqlEnum, int } from "drizzle-orm/mysql-core";

import { TUserRole } from "@/2entities/user/model/user.types";
import { USER_ROLES } from "@/2entities/user/lib/const";
import { directionsTable, distancesTable, subdivisionsTable } from "./divisions.schema";

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

export type TUserDB = typeof usersTable.$inferSelect;
