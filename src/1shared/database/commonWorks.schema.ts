import { varchar, serial, mysqlTable, decimal } from "drizzle-orm/mysql-core";

export const commonWorksTable = mysqlTable("commonWorks", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  measure: varchar("measure", { length: 128 }).notNull(),
  norm_of_time: decimal("norm_of_time", { precision: 6, scale: 2 }).notNull(),
  norm_of_time_document: varchar("norm_of_time_document", { length: 256 }).notNull(),
});

export type TCommonWorksDB = typeof commonWorksTable.$inferSelect;
