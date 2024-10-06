import { TUserRole } from "../model/user.types";

export const USER_ROLES: TUserRole[] = [
  "subdivision",
  "distance_engineer",
  "distance_time_norm",
  "distance_security_engineer",
  "distance_sub_boss",
  "distance_boss",
  "direction",
  "transenergo",
] as const;
