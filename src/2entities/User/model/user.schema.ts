export type TUserRole = "subdivision" | "distance_engineer" | "distance_boss" | "direction" | "transenergo";
export interface IUser {
  id: string;
  roles: TUserRole;
  id_subdivision: number | null;
  id_distance: number | null;
  id_direction: number | null;
}
