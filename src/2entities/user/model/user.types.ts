import { credentialsTable, usersTable } from "./user.schema";

export type UserRole =
  | "subdivision"
  | "distance_engineer"
  | "distance_time_norm"
  | "distance_security_engineer"
  | "distance_sub_boss"
  | "distance_boss"
  | "direction"
  | "transenergo";

export type Credential = typeof credentialsTable.$inferSelect;

export type User = typeof usersTable.$inferSelect & {
  directionShortName?: string;
  distanceShortName?: string;
  subdivisionShortName?: string;
};
