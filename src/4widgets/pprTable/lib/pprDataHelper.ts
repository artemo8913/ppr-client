import { IPprData, TWorkBranch } from "@/2entities/ppr";

type TPprDataFilteredByBranches = {
  [key in TWorkBranch]: IPprData[];
};

export function useFilterPprDataByBranches(data?: IPprData[]): TPprDataFilteredByBranches {
  const exploitation: IPprData[] = [];
  const additional: IPprData[] = [];
  const unforeseen: IPprData[] = [];
  const security: IPprData[] = [];
  const withoutBranchCategory: IPprData[] = [];

  data?.forEach((pprData) => {
    switch (pprData.branch) {
      case "additional":
        additional.push(pprData);
        break;
      case "exploitation":
        exploitation.push(pprData);
        break;
      case "security":
        security.push(pprData);
        break;
      case "unforeseen":
        unforeseen.push(pprData);
        break;
      default:
        withoutBranchCategory.push(pprData);
        break;
    }
  });

  return {
    additional,
    exploitation,
    security,
    unforeseen,
    none: withoutBranchCategory,
  };
}
