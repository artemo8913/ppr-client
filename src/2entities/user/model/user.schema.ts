export type TUserRole =
  | "subdivision"
  | "distance_engineer"
  | "distance_time_norm"
  | "distance_security_engineer"
  | "distance_sub_boss"
  | "distance_boss"
  | "direction"
  | "transenergo";

export interface IUser {
  id: string;
  role: TUserRole;
  id_subdivision: number | null;
  id_distance: number | null;
  id_direction: number | null;
}
