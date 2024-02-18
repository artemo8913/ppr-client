import { TMonths } from "@/1shared/types/date";

export type TPprStatus = "none" | "template" | "creating" | "on_agreement" | "on_aprove" | "fulfilling" | "done";

export interface IPprInfo {
  id: string;
  name: string;
  year: number;
  status: TPprStatus;
  month?: TMonths;
  id_direction: number | null;
  id_distance: number | null;
  id_subdivision: number | null;
}

export interface IAddPprInfoRequest {
  name: string;
  year: number;
  id_direction: number | null;
  id_distance: number | null;
  id_subdivision: number | null;
}
