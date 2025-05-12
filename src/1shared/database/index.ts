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

const connectionConfig: PoolOptions = {
  host: process.env[`DB_HOST_${process.env.DB_LOCATION}`],
  database: process.env[`DB_NAME_${process.env.DB_LOCATION}`],
  port: Number(process.env[`DB_PORT_${process.env.DB_LOCATION}`]),
  user: process.env[`DB_USER_${process.env.DB_LOCATION}`],
  password: process.env[`DB_PASSWORD_${process.env.DB_LOCATION}`],
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
