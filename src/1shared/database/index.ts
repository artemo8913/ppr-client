import mysql, { PoolOptions } from "mysql2";
import { drizzle } from "drizzle-orm/mysql2";

import { usersTable } from "./users.schema";
import { credentialsTable } from "./credentials.schema";
import { commonWorksTable } from "./commonWorks.schema";
import {
  directionsTable,
  distancesTable,
  subdivisionsTable,
  TSubdivisionDB,
  TDirectionDB,
  TDistanceDB,
} from "./divisions.schema";
import {
  pprMonthsStatusesTable,
  pprWorkingMansTable,
  pprsInfoTable,
  pprsWorkDataTable,
  TPprDataDB,
  TPprInfoDB,
  TPprMonthsStatusDB,
  TPprWorkingManDB,
} from "./ppr.schema";

const connectionConfig: PoolOptions = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
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
    pprWorkingMansTable,
    pprsInfoTable,
    pprsWorkDataTable,
  },
});

export {
  usersTable,
  credentialsTable,
  commonWorksTable,
  directionsTable,
  distancesTable,
  subdivisionsTable,
  pprMonthsStatusesTable,
  pprWorkingMansTable,
  pprsInfoTable,
  pprsWorkDataTable,
};

export type { TPprDataDB, TPprInfoDB, TPprMonthsStatusDB, TPprWorkingManDB, TSubdivisionDB, TDirectionDB, TDistanceDB };
