import mysql from "mysql2";
import { drizzle } from "drizzle-orm/mysql2";

import { usersTable } from "./users.schema";
import { credentialsTable } from "./credentials.schema";
import { commonWorksTable } from "./commonWorks.schema";
import { directionsTable, distancesTable, subdivisionsTable } from "./divisions.schema";
import {
  pprMonthsStatusesTable,
  pprWorkingMansTable,
  pprsInfoTable,
  pprsWorkDataTable,
} from "./maintenancePlan.schema";

const connection = mysql.createConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

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
