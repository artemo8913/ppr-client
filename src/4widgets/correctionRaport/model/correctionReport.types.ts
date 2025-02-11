import { IPprData } from "@/2entities/ppr";

export interface TCorrectionItem {
  pprData: IPprData;
  firstCompareValue: number;
  secondCompareValue: number;
}

export interface ICorrectionSummary {
  plan: number;
  fact: number;
}
