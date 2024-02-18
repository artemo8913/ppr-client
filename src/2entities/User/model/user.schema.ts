export type TUserRole = "subdivision" | "distance_engineer" | "distance_boss" | "direction" | "transenergo";
export interface IUser {
  id: number;
  roles: TUserRole;
  id_subdivision: string | null;
  id_distance: string | null;
  id_direction: string | null;
}
