// https://orm.drizzle.team/docs/guides/upsert
import { getTableColumns, SQL, sql } from "drizzle-orm";
import { MySqlTable } from "drizzle-orm/mysql-core";

export const buildConflictUpdateColumns = <T extends MySqlTable, Q extends keyof T["_"]["columns"]>(
  table: T,
  columns: Q[]
) => {
  const cls = getTableColumns(table);

  return columns.reduce((acc, column) => {
    acc[column] = sql`values(${cls[column]})`;
  
    return acc;
  }, {} as Record<Q, SQL>);
};
