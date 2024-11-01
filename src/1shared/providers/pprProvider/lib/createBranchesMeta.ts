import { IPprData, TPprDataWorkId, TWorkBranch } from "@/2entities/ppr";

export interface IBranchDefaultMeta {
  workIds: Set<TPprDataWorkId>;
  name: string;
  orderIndex: string;
  indexToPlaceTitle: number;
  type: "branch" | "subbranch";
}

export interface IBranchMeta extends IBranchDefaultMeta {
  subbranches: IBranchDefaultMeta[];
}

export function createBranchesMeta(pprData: IPprData[]): {
  branchesMeta: IBranchMeta[];
  branchesAndSubbrunchesOrder: {
    [indexToPlace: number]: IBranchDefaultMeta[];
  };
  subbranchesList: string[];
} {
  const branchesMeta: IBranchMeta[] = [];
  const branchesAndSubbrunchesOrder: { [indexToPlace: number]: IBranchDefaultMeta[] } = {};
  const subbranchesSet = new Set<string>();

  let prevBranchMeta: IBranchMeta = {
    workIds: new Set(),
    indexToPlaceTitle: 0,
    name: "",
    subbranches: [],
    orderIndex: "",
    type: "branch",
  };

  let prevSubbranchMeta: IBranchDefaultMeta = {
    workIds: new Set(),
    indexToPlaceTitle: 0,
    name: "",
    orderIndex: "",
    type: "subbranch",
  };

  function initPrevBranchMeta(branchName: TWorkBranch, index: number) {
    prevBranchMeta = {
      workIds: new Set(),
      indexToPlaceTitle: index,
      name: branchName,
      subbranches: [],
      orderIndex: `${branchesMeta.length + 1}.`,
      type: "branch",
    };
  }

  function initPrevSubbranchMeta(subbranchName: string, index: number, isBranchChange?: boolean) {
    prevSubbranchMeta = {
      workIds: new Set(),
      indexToPlaceTitle: index,
      name: subbranchName,
      orderIndex: `${branchesMeta.length + (isBranchChange ? 1 : 0)}.${prevBranchMeta.subbranches.length + 1}.`,
      type: "subbranch",
    };
  }

  pprData.forEach((pprData, index) => {
    if (pprData.branch !== prevBranchMeta.name) {
      initPrevBranchMeta(pprData.branch, index);
      initPrevSubbranchMeta(pprData.subbranch, index, true);
      prevBranchMeta.subbranches.push(prevSubbranchMeta);
      branchesMeta.push(prevBranchMeta);
      subbranchesSet.add(prevSubbranchMeta.name);
      branchesAndSubbrunchesOrder[index] = [prevBranchMeta, prevSubbranchMeta];
    } else if (pprData.subbranch !== prevSubbranchMeta.name) {
      initPrevSubbranchMeta(pprData.subbranch, index);
      prevBranchMeta.subbranches.push(prevSubbranchMeta);
      subbranchesSet.add(prevSubbranchMeta.name);
      branchesAndSubbrunchesOrder[index] = [prevSubbranchMeta];
    }
    prevBranchMeta.workIds.add(pprData.id);
    prevSubbranchMeta.workIds.add(pprData.id);
  });

  return {
    branchesMeta,
    branchesAndSubbrunchesOrder,
    subbranchesList: Array.from(subbranchesSet),
  };
}
