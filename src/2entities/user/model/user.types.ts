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
  id: number;
  role: TUserRole;
  first_name: string;
  last_name: string;
  middle_name: string;
  id_subdivision: number | null;
  id_distance: number | null;
  id_direction: number | null;
}
