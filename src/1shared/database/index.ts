import mysql, { PoolOptions } from "mysql2";
import { drizzle } from "drizzle-orm/mysql2";

import { usersTable, credentialsTable } from "@/2entities/user/model/user.schema";
import { commonWorksTable } from "@/2entities/commonWork/model/commonWork.schema";
import { directionsTable, distancesTable, subdivisionsTable } from "@/2entities/division/model/division.schema";
import {
  pprsInfoTable,
  pprsWorkDataTable,
  pprWorkingMansTable,
  pprRaportsNotesTable,
  pprMonthsStatusesTable,
} from "@/2entities/ppr/model/ppr.schema";

if (!process.env.DB_USER || !process.env.DB_HOST || !process.env.DB_NAME) {
  throw new Error('Не заданы данные для подключения к sql серверу')
}

const connectionConfig: PoolOptions = {
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};
/**
 * For the built in migrate function with DDL migrations we and drivers strongly encourage you to use single client connection.
 * For querying purposes feel free to use either client or pool based on your business demands.
 * https://orm.drizzle.team/docs/get-started-mysql
 */
const connection =
  process.env.ENVIRONMENT !== "DEV"
    ? mysql.createPool(connectionConfig)
    : mysql.createConnection({ ...connectionConfig });

export const db = drizzle(connection, {
  mode: "default",
  schema: {
    usersTable,
    credentialsTable,
    commonWorksTable,
    directionsTable,
    distancesTable,
    subdivisionsTable,
    pprMonthsStatusesTable,
    pprRaportsNotesTable,
    pprWorkingMansTable,
    pprsWorkDataTable,
    pprsInfoTable,
  },
});


type DatabaseType = typeof db;
export type DatabaseTransactionType = Parameters<Parameters<DatabaseType["transaction"]>[0]>[0];