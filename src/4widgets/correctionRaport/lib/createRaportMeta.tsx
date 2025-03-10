import { TWorkBranch } from "@/2entities/ppr";

import { ICorrectionRaportMeta, TCorrectionItem } from "../model/correctionRaport.types";

export function createRaportMeta(corrections: TCorrectionItem[]): ICorrectionRaportMeta {
  const reportMeta: ICorrectionRaportMeta = {
    branches: {},
    subbranches: {},
    total: { factTime: 0, planTime: 0, timeDiff: 0 },
  };

  if (!corrections.length) {
    return reportMeta;
  }

  const tempBranch: {
    name: TWorkBranch;
    planTime: number;
    factTime: number;
    timeDiff: number;
  } = {
    name: corrections[0].pprData.branch,
    factTime: corrections[0].factTime,
    planTime: corrections[0].planTime,
    timeDiff: corrections[0].timeDiff,
  };

  function updateTempBranch(correctionItem: TCorrectionItem) {
    tempBranch.name = correctionItem.pprData.branch;
    tempBranch.planTime = correctionItem.planTime;
    tempBranch.factTime = correctionItem.factTime;
    tempBranch.timeDiff = correctionItem.timeDiff;
  }

  const tempSubbranch: {
    name: string;
    factTime: number;
    planTime: number;
    timeDiff: number;
  } = {
    name: corrections[0].pprData.subbranch,
    factTime: corrections[0].factTime,
    planTime: corrections[0].planTime,
    timeDiff: corrections[0].timeDiff,
  };

  function updateTempSubranch(correctionItem: TCorrectionItem) {
    tempSubbranch.name = correctionItem.pprData.subbranch;
    tempSubbranch.planTime = correctionItem.planTime;
    tempSubbranch.factTime = correctionItem.factTime;
    tempSubbranch.timeDiff = correctionItem.timeDiff;
  }

  corrections.forEach((correctionItem, index, array) => {
    // Общая сумма
    reportMeta.total.planTime += correctionItem.planTime;
    reportMeta.total.factTime += correctionItem.factTime;
    reportMeta.total.timeDiff += correctionItem.timeDiff;

    // Раздел
    if (correctionItem.pprData.branch !== tempBranch.name) {
      reportMeta.branches[index - 1] = { ...tempBranch, name: tempBranch.name };

      updateTempBranch(correctionItem);
    } else if (index > 0) {
      tempBranch.planTime += correctionItem.planTime;
      tempBranch.factTime += correctionItem.factTime;
      tempBranch.timeDiff += correctionItem.timeDiff;
    }

    // Подраздел
    if (correctionItem.pprData.subbranch !== tempSubbranch.name) {
      reportMeta.subbranches[index - 1] = { ...tempSubbranch, name: tempSubbranch.name };

      updateTempSubranch(correctionItem);
    } else if (index > 0) {
      tempSubbranch.planTime += correctionItem.planTime;
      tempSubbranch.factTime += correctionItem.factTime;
      tempSubbranch.timeDiff += correctionItem.timeDiff;
    }

    // Последний элемент
    if (index === array.length - 1) {
      reportMeta.branches[index] = { ...tempBranch, name: tempBranch.name };
      reportMeta.subbranches[index] = { ...tempSubbranch, name: tempSubbranch.name };
    }
  });

  return reportMeta;
}
