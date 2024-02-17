import { TMonths } from "@/1shared/types/date";

export type TPprStatus = "none" | "template" | "creating" | "on_agreement" | "on_aprove" | "fulfilling" | "done";

export interface IPprInfo {
  id: number;
  name: string;
  year: number;
  id_direction: number;
  id_distance: number;
  id_subdivision: number;
  status: TPprStatus;
  month?: TMonths;
}
