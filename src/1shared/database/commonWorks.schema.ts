import { varchar, mysqlTable, double, int } from "drizzle-orm/mysql-core";

export const commonWorksTable = mysqlTable("common_works", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 512 }).notNull(),
  measure: varchar("measure", { length: 128 }).notNull(),
  normOfTime: double("norm_of_time", { precision: 6, scale: 3 }).notNull(),
  normOfTimeNameShort: varchar("norm_of_time_name_short", { length: 32 }).notNull(),
  normOfTimeNameFull: varchar("norm_of_time_name_full", { length: 256 }).notNull(),
  normOfTimeDocumentName: varchar("norm_of_time_document_name", { length: 256 }).notNull(),
});

export type TCommonWorksDB = typeof commonWorksTable.$inferSelect;
