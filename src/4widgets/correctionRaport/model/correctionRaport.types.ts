import { IPprData, TWorkBranch } from "@/2entities/ppr";

export interface TCorrectionItem {
  pprData: IPprData;
  planWork: number;
  factWork: number;
  planTime: number;
  factTime: number;
  workDiff: number;
  timeDiff: number;
}

export interface ICorrectionRaportMeta {
  branches: {
    [indexToPlace: number]: {
      name: TWorkBranch;
      planTime: number;
      factTime: number;
      timeDiff: number;
    };
  };
  subbranches: {
    [indexToPlace: number]: {
      name: string;
      planTime: number;
      factTime: number;
      timeDiff: number;
    };
  };
  total: {
    planTime: number;
    factTime: number;
    timeDiff: number;
  };
}
