export type TUserRole = "subdivision" | "distance_engineer" | "distance_boss" | "direction" | "transenergo";
export interface IUser {
  id: number;
  roles: TUserRole;
  id_subdivision: string;
  id_distance: string;
  id_direction: string;
}
