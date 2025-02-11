export type TUserRole =
  | "subdivision"
  | "distance_engineer"
  | "distance_time_norm"
  | "distance_security_engineer"
  | "distance_sub_boss"
  | "distance_boss"
  | "direction"
  | "transenergo";

export interface ICredential {
  id: number;
  username: string;
  password: string;
}

export interface IUser {
  id: number;
  role: TUserRole;
  firstName: string;
  lastName: string;
  middleName: string;
  idSubdivision: number | null;
  idDistance: number | null;
  idDirection: number | null;
  directionShortName?: string;
  distanceShortName?: string;
  subdivisionShortName?: string;
}
