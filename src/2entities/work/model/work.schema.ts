import { TWorkBranch } from "@/2entities/ppr";

export type TLineClassData = { 1: string; 2: string; 3: string; 4: string; 5: string };

export interface IWork {
  id: string;
  name: string;
  periodicity_normal_data: TLineClassData;
  measure: string;
  norm_of_time: number;
  norm_of_time_document: string;
}

export interface IWorkExtended extends IWork {
  branch: TWorkBranch;
  subbranch: string;
}
