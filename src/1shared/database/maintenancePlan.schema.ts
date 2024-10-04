import {
  varchar,
  serial,
  smallint,
  mysqlTable,
  mysqlEnum,
  date,
  double,
  boolean,
  tinyint,
  json,
  bigint,
} from "drizzle-orm/mysql-core";

import { BRANCHES, MONTH_STATUSES, YEAR_STATUSES } from "@/2entities/ppr/lib/constFields";
import { IPlanWorkValues, TMonthPprStatus, TWorkBranch, TYearPprStatus } from "@/2entities/ppr/model/ppr.types";

import { usersTable } from "./users.schema";
import { directionsTable, distancesTable, subdivisionsTable } from "./divisions.schema";
import { commonWorksTable } from "./commonWorks.schema";

function createMysqlPprMonthStatusType(fieldName: string) {
  return mysqlEnum(fieldName, MONTH_STATUSES as [string])
    .$type<TMonthPprStatus>()
    .default("none");
}

function createMysqlDoubleField(fieldName: string) {
  return double(fieldName, { precision: 6, scale: 3 }).default(0);
}

function createMysqlBigDoubleField(fieldName: string) {
  return double(fieldName, { precision: 12, scale: 3 }).default(0);
}

function createMysqlJsonPlanField(fieldName: string) {
  return json(fieldName).$type<IPlanWorkValues>().notNull();
}

export const pprsInfoTable = mysqlTable("pprs_info", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  year: smallint("year").notNull(),
  status: mysqlEnum("status", YEAR_STATUSES as [string])
    .$type<TYearPprStatus>()
    .notNull(),
  createdAt: date("created_at").notNull(),
  idUserCreatedBy: bigint("id_user_created_by", { mode: "bigint", unsigned: true }).references(() => usersTable.id),
  idDirection: bigint("id_direction", { mode: "bigint", unsigned: true }).references(() => directionsTable.id),
  idDistance: bigint("id_distance", { mode: "bigint", unsigned: true }).references(() => distancesTable.id),
  idSubdivision: bigint("id_subdivision", { mode: "bigint", unsigned: true }).references(() => subdivisionsTable.id),
});

export const pprMonthsStatusesTable = mysqlTable("ppr_months_statuses", {
  idPpr: bigint("id_ppr", { mode: "bigint", unsigned: true })
    .references(() => pprsInfoTable.id)
    .unique(),
  jan: createMysqlPprMonthStatusType("jan"),
  feb: createMysqlPprMonthStatusType("feb"),
  mar: createMysqlPprMonthStatusType("mar"),
  apr: createMysqlPprMonthStatusType("apr"),
  may: createMysqlPprMonthStatusType("may"),
  june: createMysqlPprMonthStatusType("june"),
  july: createMysqlPprMonthStatusType("july"),
  aug: createMysqlPprMonthStatusType("aug"),
  sept: createMysqlPprMonthStatusType("sept"),
  oct: createMysqlPprMonthStatusType("oct"),
  nov: createMysqlPprMonthStatusType("nov"),
  dec: createMysqlPprMonthStatusType("dec"),
});

export const pprWorkingMansTable = mysqlTable("ppr_working_mans", {
  idPpr: bigint("id_ppr", { mode: "bigint", unsigned: true })
    .references(() => pprsInfoTable.id)
    .unique(),
  full_name: varchar("full_name", { length: 128 }),
  work_position: varchar("work_position", { length: 256 }),
  participation: createMysqlDoubleField("participation"),
  // Запланированное оплачиваемое время работника
  year_plan_time: createMysqlDoubleField("year_plan_time"),
  jan_plan_time: createMysqlDoubleField("jan_plan_time"),
  feb_plan_time: createMysqlDoubleField("feb_plan_time"),
  mar_plan_time: createMysqlDoubleField("mar_plan_time"),
  apr_plan_time: createMysqlDoubleField("apr_plan_time"),
  may_plan_time: createMysqlDoubleField("may_plan_time"),
  june_plan_time: createMysqlDoubleField("june_plan_time"),
  july_plan_time: createMysqlDoubleField("july_plan_time"),
  aug_plan_time: createMysqlDoubleField("aug_plan_time"),
  sept_plan_time: createMysqlDoubleField("sept_plan_time"),
  oct_plan_time: createMysqlDoubleField("oct_plan_time"),
  nov_plan_time: createMysqlDoubleField("nov_plan_time"),
  dec_plan_time: createMysqlDoubleField("dec_plan_time"),
  // Настой часов (непосредственные трудозатраты работника, получаемые при вычитании отпуска)
  year_plan_norm_time: createMysqlDoubleField("year_plan_norm_time"),
  jan_plan_norm_time: createMysqlDoubleField("jan_plan_norm_time"),
  feb_plan_norm_time: createMysqlDoubleField("feb_plan_norm_time"),
  mar_plan_norm_time: createMysqlDoubleField("mar_plan_norm_time"),
  apr_plan_norm_time: createMysqlDoubleField("apr_plan_norm_time"),
  may_plan_norm_time: createMysqlDoubleField("may_plan_norm_time"),
  june_plan_norm_time: createMysqlDoubleField("june_plan_norm_time"),
  july_plan_norm_time: createMysqlDoubleField("july_plan_norm_time"),
  aug_plan_norm_time: createMysqlDoubleField("aug_plan_norm_time"),
  sept_plan_norm_time: createMysqlDoubleField("sept_plan_norm_time"),
  oct_plan_norm_time: createMysqlDoubleField("oct_plan_norm_time"),
  nov_plan_norm_time: createMysqlDoubleField("nov_plan_norm_time"),
  dec_plan_norm_time: createMysqlDoubleField("dec_plan_norm_time"),
  // Настой часов с учетом доли участия работника
  year_plan_tabel_time: createMysqlDoubleField("year_plan_tabel_time"),
  jan_plan_tabel_time: createMysqlDoubleField("jan_plan_tabel_time"),
  feb_plan_tabel_time: createMysqlDoubleField("feb_plan_tabel_time"),
  mar_plan_tabel_time: createMysqlDoubleField("mar_plan_tabel_time"),
  apr_plan_tabel_time: createMysqlDoubleField("apr_plan_tabel_time"),
  may_plan_tabel_time: createMysqlDoubleField("may_plan_tabel_time"),
  june_plan_tabel_time: createMysqlDoubleField("june_plan_tabel_time"),
  july_plan_tabel_time: createMysqlDoubleField("july_plan_tabel_time"),
  aug_plan_tabel_time: createMysqlDoubleField("aug_plan_tabel_time"),
  sept_plan_tabel_time: createMysqlDoubleField("sept_plan_tabel_time"),
  oct_plan_tabel_time: createMysqlDoubleField("oct_plan_tabel_time"),
  nov_plan_tabel_time: createMysqlDoubleField("nov_plan_tabel_time"),
  dec_plan_tabel_time: createMysqlDoubleField("dec_plan_tabel_time"),
  // Фактически трудозатраты работника
  year_fact_time: createMysqlDoubleField("year_fact_time"),
  jan_fact_time: createMysqlDoubleField("jan_fact_time"),
  feb_fact_time: createMysqlDoubleField("feb_fact_time"),
  mar_fact_time: createMysqlDoubleField("mar_fact_time"),
  apr_fact_time: createMysqlDoubleField("apr_fact_time"),
  may_fact_time: createMysqlDoubleField("may_fact_time"),
  june_fact_time: createMysqlDoubleField("june_fact_time"),
  july_fact_time: createMysqlDoubleField("july_fact_time"),
  aug_fact_time: createMysqlDoubleField("aug_fact_time"),
  sept_fact_time: createMysqlDoubleField("sept_fact_time"),
  oct_fact_time: createMysqlDoubleField("oct_fact_time"),
  nov_fact_time: createMysqlDoubleField("nov_fact_time"),
  dec_fact_time: createMysqlDoubleField("dec_fact_time"),
});

export const pprsWorkDataTable = mysqlTable("pprs_data", {
  idPpr: bigint("id_ppr", { mode: "bigint", unsigned: true }).references(() => pprsInfoTable.id),
  order: smallint("order"),
  id: serial("id").primaryKey(),
  idCommonWork: bigint("id_common_work", { mode: "bigint", unsigned: true }).references(() => commonWorksTable.id),
  isWorkAproved: boolean("is_work_aproved").notNull(),
  branch: mysqlEnum("branch", BRANCHES as [string])
    .$type<TWorkBranch>()
    .notNull(),
  subbranch: varchar("subbranch", { length: 128 }),
  name: varchar("name", { length: 256 }),
  location: varchar("location", { length: 128 }),
  lineClass: tinyint("line_class"),
  measure: varchar("measure", { length: 128 }).notNull(),
  totalCount: double("total_count", { precision: 10, scale: 3 }),
  entryYear: smallint("entry_year"),
  periodicityNormal: varchar("periodicity_normal", { length: 10 }),
  periodicityFact: varchar("periodicity_fact", { length: 10 }),
  lastMaintenanceYear: smallint("last_maintenance_year"),
  normOfTime: double("norm_of_time", { precision: 6, scale: 3 }).notNull(),
  normOfTimeNameFull: varchar("norm_of_time_name_full", { length: 256 }).notNull(),
  unity: varchar("periodicity_fact", { length: 16 }),
  // Запланированные объемы работ
  year_plan_work: createMysqlJsonPlanField("year_plan_work"),
  jan_plan_work: createMysqlJsonPlanField("jan_plan_work"),
  feb_plan_work: createMysqlJsonPlanField("feb_plan_work"),
  mar_plan_work: createMysqlJsonPlanField("mar_plan_work"),
  apr_plan_work: createMysqlJsonPlanField("apr_plan_work"),
  may_plan_work: createMysqlJsonPlanField("may_plan_work"),
  june_plan_work: createMysqlJsonPlanField("june_plan_work"),
  july_plan_work: createMysqlJsonPlanField("july_plan_work"),
  aug_plan_work: createMysqlJsonPlanField("aug_plan_work"),
  sept_plan_work: createMysqlJsonPlanField("sept_plan_work"),
  oct_plan_work: createMysqlJsonPlanField("oct_plan_work"),
  nov_plan_work: createMysqlJsonPlanField("nov_plan_work"),
  dec_plan_work: createMysqlJsonPlanField("dec_plan_work"),
  // Запланированные трудозатраты
  year_plan_time: createMysqlBigDoubleField("year_plan_time"),
  jan_plan_time: createMysqlBigDoubleField("jan_plan_time"),
  feb_plan_time: createMysqlBigDoubleField("feb_plan_time"),
  mar_plan_time: createMysqlBigDoubleField("mar_plan_time"),
  apr_plan_time: createMysqlBigDoubleField("apr_plan_time"),
  may_plan_time: createMysqlBigDoubleField("may_plan_time"),
  june_plan_time: createMysqlBigDoubleField("june_plan_time"),
  july_plan_time: createMysqlBigDoubleField("july_plan_time"),
  aug_plan_time: createMysqlBigDoubleField("aug_plan_time"),
  sept_plan_time: createMysqlBigDoubleField("sept_plan_time"),
  oct_plan_time: createMysqlBigDoubleField("oct_plan_time"),
  nov_plan_time: createMysqlBigDoubleField("nov_plan_time"),
  dec_plan_time: createMysqlBigDoubleField("dec_plan_time"),
  // Фактические объемы работ
  year_fact_work: createMysqlDoubleField("year_fact_work"),
  jan_fact_work: createMysqlDoubleField("jan_fact_work"),
  feb_fact_work: createMysqlDoubleField("feb_fact_work"),
  mar_fact_work: createMysqlDoubleField("mar_fact_work"),
  apr_fact_work: createMysqlDoubleField("apr_fact_work"),
  may_fact_work: createMysqlDoubleField("may_fact_work"),
  june_fact_work: createMysqlDoubleField("june_fact_work"),
  july_fact_work: createMysqlDoubleField("july_fact_work"),
  aug_fact_work: createMysqlDoubleField("aug_fact_work"),
  sept_fact_work: createMysqlDoubleField("sept_fact_work"),
  oct_fact_work: createMysqlDoubleField("oct_fact_work"),
  nov_fact_work: createMysqlDoubleField("nov_fact_work"),
  dec_fact_work: createMysqlDoubleField("dec_fact_work"),
  // Трудозатраты на фактически выполненный объем работ согласно нормам времени (трудозатраты, которые "по идее" должны были быть затрачены)
  year_fact_norm_time: createMysqlBigDoubleField("year_fact_norm_time"),
  jan_fact_norm_time: createMysqlBigDoubleField("jan_fact_norm_time"),
  feb_fact_norm_time: createMysqlBigDoubleField("feb_fact_norm_time"),
  mar_fact_norm_time: createMysqlBigDoubleField("mar_fact_norm_time"),
  apr_fact_norm_time: createMysqlBigDoubleField("apr_fact_norm_time"),
  may_fact_norm_time: createMysqlBigDoubleField("may_fact_norm_time"),
  june_fact_norm_time: createMysqlBigDoubleField("june_fact_norm_time"),
  july_fact_norm_time: createMysqlBigDoubleField("july_fact_norm_time"),
  aug_fact_norm_time: createMysqlBigDoubleField("aug_fact_norm_time"),
  sept_fact_norm_time: createMysqlBigDoubleField("sept_fact_norm_time"),
  oct_fact_norm_time: createMysqlBigDoubleField("oct_fact_norm_time"),
  nov_fact_norm_time: createMysqlBigDoubleField("nov_fact_norm_time"),
  dec_fact_norm_time: createMysqlBigDoubleField("dec_fact_norm_time"),
  // Фактические трудозатраты на выполненный объем работ
  year_fact_time: createMysqlBigDoubleField("year_fact_work"),
  jan_fact_time: createMysqlBigDoubleField("jan_fact_work"),
  feb_fact_time: createMysqlBigDoubleField("feb_fact_work"),
  mar_fact_time: createMysqlBigDoubleField("mar_fact_work"),
  apr_fact_time: createMysqlBigDoubleField("apr_fact_work"),
  may_fact_time: createMysqlBigDoubleField("may_fact_work"),
  june_fact_time: createMysqlBigDoubleField("june_fact_work"),
  july_fact_time: createMysqlBigDoubleField("july_fact_work"),
  aug_fact_time: createMysqlBigDoubleField("aug_fact_work"),
  sept_fact_time: createMysqlBigDoubleField("sept_fact_work"),
  oct_fact_time: createMysqlBigDoubleField("oct_fact_work"),
  nov_fact_time: createMysqlBigDoubleField("nov_fact_work"),
  dec_fact_time: createMysqlBigDoubleField("dec_fact_work"),
});

export type TPprInfoDB = typeof pprsInfoTable.$inferSelect;

export type TPprMonthsStatusDB = typeof pprMonthsStatusesTable.$inferSelect;

export type TPprWorkingManDB = typeof pprWorkingMansTable.$inferSelect;

export type TPprDataDB = typeof pprsWorkDataTable.$inferSelect;
