import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const directionsTable = mysqlTable("directions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  shortName: varchar("short_name", { length: 16 }).notNull(),
});

export const distancesTable = mysqlTable("distances", {
  id: int("id").autoincrement().primaryKey(),
  idDirection: int("id_direction")
    .references(() => directionsTable.id)
    .notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  shortName: varchar("short_name", { length: 16 }).notNull(),
});

export const subdivisionsTable = mysqlTable("subdivisions", {
  id: int("id").autoincrement().primaryKey(),
  idDistance: int("id_distance")
    .references(() => distancesTable.id)
    .notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  shortName: varchar("short_name", { length: 16 }).notNull(),
});

export type TDirectionDB = typeof directionsTable.$inferSelect;

export type TDistanceDB = typeof distancesTable.$inferSelect;

export type TSubdivisionDB = typeof subdivisionsTable.$inferSelect;
