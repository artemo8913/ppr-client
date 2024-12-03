import { varchar, int, smallint, mysqlTable, mysqlEnum, date, double, boolean, json } from "drizzle-orm/mysql-core";

import { BRANCHES, MONTH_STATUSES, YEAR_STATUSES } from "@/2entities/ppr/lib/constFields";
import {
  IPlanWorkValues,
  TMonthPprStatus,
  TPlanTimeValues,
  TWorkBranch,
  TYearPprStatus,
} from "@/2entities/ppr/model/ppr.types";

import { usersTable } from "./users.schema";
import { directionsTable, distancesTable, subdivisionsTable } from "./divisions.schema";
import { commonWorksTable } from "./commonWorks.schema";

function createMysqlPprMonthStatusType(fieldName: string) {
  return mysqlEnum(fieldName, MONTH_STATUSES as [string])
    .$type<TMonthPprStatus>()
    .notNull()
    .default("none");
}

function createMysqlDoubleField(fieldName: string) {
  return double(fieldName, { precision: 7, scale: 3 }).notNull().default(0);
}

function createMysqlBigDoubleField(fieldName: string) {
  return double(fieldName, { precision: 12, scale: 3 }).notNull().default(0);
}

function createMysqlJsonPlanWorkField(fieldName: string) {
  return json(fieldName).$type<IPlanWorkValues>().notNull();
}

function createMysqlJsonPlanTimeField(fieldName: string) {
  return json(fieldName).$type<TPlanTimeValues>().notNull();
}

export const pprsInfoTable = mysqlTable("pprs_info", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  year: smallint("year").notNull(),
  status: mysqlEnum("status", YEAR_STATUSES as [string])
    .$type<TYearPprStatus>()
    .notNull(),
  created_at: date("created_at").notNull(),
  idUserCreatedBy: int("id_user_created_by")
    .references(() => usersTable.id)
    .notNull(),
  idDirection: int("id_direction").references(() => directionsTable.id),
  idDistance: int("id_distance").references(() => distancesTable.id),
  idSubdivision: int("id_subdivision").references(() => subdivisionsTable.id),
});

export const pprMonthsStatusesTable = mysqlTable("ppr_months_statuses", {
  idPpr: int("id_ppr")
    .references(() => pprsInfoTable.id)
    .unique()
    .notNull(),
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
  idPpr: int("id_ppr")
    .references(() => pprsInfoTable.id)
    .notNull(),
  id: int("id").autoincrement().primaryKey(),
  full_name: varchar("full_name", { length: 128 }).notNull().default(""),
  work_position: varchar("work_position", { length: 256 }).notNull().default(""),
  participation: createMysqlDoubleField("participation").notNull().default(1),
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
  idPpr: int("id_ppr")
    .references(() => pprsInfoTable.id)
    .notNull(),
  order: smallint("order"),
  id: int("id").autoincrement().primaryKey(),
  common_work_id: int("id_common_work").references(() => commonWorksTable.id),
  is_work_aproved: boolean("is_work_aproved").notNull(),
  branch: mysqlEnum("branch", BRANCHES as [string])
    .$type<TWorkBranch>()
    .notNull(),
  subbranch: varchar("subbranch", { length: 128 }).notNull(),
  note: varchar("note", { length: 256 }),
  name: varchar("name", { length: 256 }).notNull(),
  location: varchar("location", { length: 128 }).notNull(),
  line_class: varchar("line_class", { length: 16 }).notNull(),
  measure: varchar("measure", { length: 128 }).notNull(),
  total_count: varchar("total_count", { length: 16 }).notNull(),
  entry_year: varchar("entry_year", { length: 16 }).notNull(),
  periodicity_normal: varchar("periodicity_normal", { length: 10 }).notNull(),
  periodicity_fact: varchar("periodicity_fact", { length: 10 }).notNull(),
  last_maintenance_year: varchar("last_maintenance_year", { length: 16 }).notNull(),
  norm_of_time: double("norm_of_time", { precision: 6, scale: 3 }).notNull(),
  norm_of_time_document: varchar("norm_of_time_name_full", { length: 256 }).notNull(),
  unity: varchar("unity", { length: 16 }).notNull(),
  // Запланированные объемы работ
  year_plan_work: createMysqlJsonPlanWorkField("year_plan_work"),
  jan_plan_work: createMysqlJsonPlanWorkField("jan_plan_work"),
  feb_plan_work: createMysqlJsonPlanWorkField("feb_plan_work"),
  mar_plan_work: createMysqlJsonPlanWorkField("mar_plan_work"),
  apr_plan_work: createMysqlJsonPlanWorkField("apr_plan_work"),
  may_plan_work: createMysqlJsonPlanWorkField("may_plan_work"),
  june_plan_work: createMysqlJsonPlanWorkField("june_plan_work"),
  july_plan_work: createMysqlJsonPlanWorkField("july_plan_work"),
  aug_plan_work: createMysqlJsonPlanWorkField("aug_plan_work"),
  sept_plan_work: createMysqlJsonPlanWorkField("sept_plan_work"),
  oct_plan_work: createMysqlJsonPlanWorkField("oct_plan_work"),
  nov_plan_work: createMysqlJsonPlanWorkField("nov_plan_work"),
  dec_plan_work: createMysqlJsonPlanWorkField("dec_plan_work"),
  // Запланированные трудозатраты
  year_plan_time: createMysqlJsonPlanTimeField("year_plan_time"),
  jan_plan_time: createMysqlJsonPlanTimeField("jan_plan_time"),
  feb_plan_time: createMysqlJsonPlanTimeField("feb_plan_time"),
  mar_plan_time: createMysqlJsonPlanTimeField("mar_plan_time"),
  apr_plan_time: createMysqlJsonPlanTimeField("apr_plan_time"),
  may_plan_time: createMysqlJsonPlanTimeField("may_plan_time"),
  june_plan_time: createMysqlJsonPlanTimeField("june_plan_time"),
  july_plan_time: createMysqlJsonPlanTimeField("july_plan_time"),
  aug_plan_time: createMysqlJsonPlanTimeField("aug_plan_time"),
  sept_plan_time: createMysqlJsonPlanTimeField("sept_plan_time"),
  oct_plan_time: createMysqlJsonPlanTimeField("oct_plan_time"),
  nov_plan_time: createMysqlJsonPlanTimeField("nov_plan_time"),
  dec_plan_time: createMysqlJsonPlanTimeField("dec_plan_time"),
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
  year_fact_time: createMysqlBigDoubleField("year_fact_time"),
  jan_fact_time: createMysqlBigDoubleField("jan_fact_time"),
  feb_fact_time: createMysqlBigDoubleField("feb_fact_time"),
  mar_fact_time: createMysqlBigDoubleField("mar_fact_time"),
  apr_fact_time: createMysqlBigDoubleField("apr_fact_time"),
  may_fact_time: createMysqlBigDoubleField("may_fact_time"),
  june_fact_time: createMysqlBigDoubleField("june_fact_time"),
  july_fact_time: createMysqlBigDoubleField("july_fact_time"),
  aug_fact_time: createMysqlBigDoubleField("aug_fact_time"),
  sept_fact_time: createMysqlBigDoubleField("sept_fact_time"),
  oct_fact_time: createMysqlBigDoubleField("oct_fact_time"),
  nov_fact_time: createMysqlBigDoubleField("nov_fact_time"),
  dec_fact_time: createMysqlBigDoubleField("dec_fact_time"),
});

export type TPprInfoDB = typeof pprsInfoTable.$inferSelect;

export type TPprMonthsStatusDB = typeof pprMonthsStatusesTable.$inferSelect;

export type TPprWorkingManDB = typeof pprWorkingMansTable.$inferSelect;

export type TPprDataDB = typeof pprsWorkDataTable.$inferSelect;
