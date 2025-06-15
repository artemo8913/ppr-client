import { credentialsTable, usersTable } from "./user.schema";

export type Credential = typeof credentialsTable.$inferSelect;

export type User = typeof usersTable.$inferSelect & {
  directionShortName?: string;
  distanceShortName?: string;
  subdivisionShortName?: string;
};
