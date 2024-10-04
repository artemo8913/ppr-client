import { bigint, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

export const directionsTable = mysqlTable("directions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  shortName: varchar("short_name", { length: 16 }).notNull(),
});

export const distancesTable = mysqlTable("distances", {
  id: serial("id").primaryKey(),
  idDirection: bigint("id_direction", { mode: "bigint", unsigned: true })
    .references(() => directionsTable.id)
    .notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  shortName: varchar("short_name", { length: 16 }).notNull(),
});

export const subdivisionsTable = mysqlTable("subdivisions", {
  id: serial("id").primaryKey(),
  idDistance: bigint("id_distance", { mode: "bigint", unsigned: true })
    .references(() => distancesTable.id)
    .notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  shortName: varchar("short_name", { length: 16 }).notNull(),
});

export type TDirectionDB = typeof directionsTable.$inferSelect;

export type TDistanceDB = typeof distancesTable.$inferSelect;

export type TSubdivisionDB = typeof subdivisionsTable.$inferSelect;
