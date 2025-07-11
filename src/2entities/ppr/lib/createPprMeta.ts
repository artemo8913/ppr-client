import { roundToFixed } from "@/1shared/lib/math/roundToFixed";

import {
  FACT_NORM_TIME_FIELDS,
  FACT_TIME_FIELDS,
  PLAN_NORM_TIME_FIELDS,
  PLAN_TABEL_TIME_FIELDS,
  PLAN_TIME_FIELDS,
} from "../model/ppr.const";
import {
  PlannedWorkWithCorrections,
  PlannedWorkingMans,
  PlannedWorkTotalTimes,
  PlannedWorkId,
  PlannedWorksAndWorkingMansTotalTimes,
  PlannedWorkBranch,
  WorkingMansTotalTimes,
} from "../model/ppr.types";

function handleWorkPeriod(
  totalObject: PlannedWorkTotalTimes,
  value: number,
  field: keyof PlannedWorkTotalTimes
) {
  if (totalObject[field] !== undefined) {
    totalObject[field] = roundToFixed(value + totalObject[field]!);
  } else {
    totalObject[field] = roundToFixed(value);
  }
}

function handleWorkingMansPeriod(
  totalObject: WorkingMansTotalTimes,
  value: number,
  field: keyof WorkingMansTotalTimes
) {
  if (totalObject[field] !== undefined) {
    totalObject[field] = roundToFixed(value + totalObject[field]!);
  } else {
    totalObject[field] = roundToFixed(value);
  }
}

export interface IBranchDefaultMeta {
  name: string;
  orderIndex: string;
  workIds: Set<PlannedWorkId>;
  type: "branch" | "subbranch";
  prev: IBranchDefaultMeta | null;
  total: { final: PlannedWorkTotalTimes; original: PlannedWorkTotalTimes };
}

export interface IBranchMeta extends IBranchDefaultMeta {
  subbranches: IBranchDefaultMeta[];
}

export interface IPprMeta {
  worksOrder: { [id: PlannedWorkId]: string };
  worksRowSpan: number[];
  subbranchesList: string[];
  branchesMeta: IBranchMeta[];
  totalValues: { final: PlannedWorksAndWorkingMansTotalTimes; original: PlannedWorksAndWorkingMansTotalTimes };
  branchesAndSubbrunchesOrder: {
    [id: PlannedWorkId]: {
      branch?: IBranchMeta;
      subbranch: IBranchDefaultMeta;
    };
  };
}

interface ICreatePprMetaArgs {
  pprData?: PlannedWorkWithCorrections[];
  workingMansData?: PlannedWorkingMans[];
}

export function createPprMeta({ pprData, workingMansData }: ICreatePprMetaArgs): IPprMeta {
  const branchesMeta: IBranchMeta[] = [];

  const branchesAndSubbrunchesOrder: {
    [id: PlannedWorkId]: {
      branch?: IBranchMeta;
      subbranch: IBranchDefaultMeta;
    };
  } = {};

  const subbranchesSet = new Set<string>();

  const worksOrder: { [id: PlannedWorkId]: string } = {};

  const worksRowSpan: number[] = [];

  const worksTotalFinalValue: PlannedWorkTotalTimes = {};

  const worksTotalOriginalValue: PlannedWorkTotalTimes = {};

  const workingMansTotalValues: WorkingMansTotalTimes = {};

  const totalFinalValues: PlannedWorksAndWorkingMansTotalTimes = { works: worksTotalFinalValue, workingMans: workingMansTotalValues };

  const totalOriginalValues: PlannedWorksAndWorkingMansTotalTimes = { works: worksTotalOriginalValue, workingMans: workingMansTotalValues };

  let isInit = true;

  let tempWorkOrderForRowSpan = 0;

  let tempWorkRowSpan: {
    name: string;
    note?: string | null;
    branch?: PlannedWorkBranch;
    subbranch?: string;
    indexStart: number;
  } = {
    name: "",
    note: "",
    branch: "additional",
    subbranch: "",
    indexStart: 0,
  };

  let tempBranchMeta: IBranchMeta = {
    workIds: new Set(),
    name: "",
    subbranches: [],
    orderIndex: "",
    type: "branch",
    total: { final: {}, original: {} },
    prev: null,
  };

  let tempSubbranchMeta: IBranchDefaultMeta = {
    workIds: new Set(),
    name: "",
    orderIndex: "",
    type: "subbranch",
    total: { final: {}, original: {} },
    prev: null,
  };

  function updateTempBranchMeta(branchName: PlannedWorkBranch, index: number) {
    tempBranchMeta = {
      workIds: new Set(),
      name: branchName,
      subbranches: [],
      orderIndex: `${branchesMeta.length + 1}.`,
      type: "branch",
      total: { final: {}, original: {} },
      prev: isInit ? null : tempBranchMeta,
    };
  }

  function updateTempSubbranchMeta(subbranchName: string, index: number, isBranchChange?: boolean) {
    // Обнуляем счетчик порядкового номера работы внутри подраздела
    tempWorkOrderForRowSpan = 0;

    tempSubbranchMeta = {
      workIds: new Set(),
      name: subbranchName,
      orderIndex: `${branchesMeta.length + (isBranchChange ? 1 : 0)}.${tempBranchMeta.subbranches.length + 1}.`,
      type: "subbranch",
      total: { final: {}, original: {} },
      prev: isInit ? null : tempSubbranchMeta,
    };
  }

  function resetTempWorkCombine(indexStart: number, pprData: PlannedWorkWithCorrections) {
    tempWorkRowSpan = {
      indexStart,
      name: pprData.name,
      branch: pprData.branch,
      note: pprData.note,
      subbranch: pprData.subbranch,
    };
  }

  pprData?.forEach((pprData, index) => {
    if (pprData.branch !== tempBranchMeta.name) {
      // Инициируем новые сслыки на значения раздела и подраздела работ
      updateTempBranchMeta(pprData.branch, index);
      updateTempSubbranchMeta(pprData.subbranch, index, true);

      // Добавляем к разделу работ ссылку на подраздел
      tempBranchMeta.subbranches.push(tempSubbranchMeta);

      // Добавляем ссылку на раздел работ в полный перечень разделов
      branchesMeta.push(tempBranchMeta);

      // В SET наименований подразделов добавляем новое имя
      subbranchesSet.add(tempSubbranchMeta.name);

      // Добавляем ссылки на раздел и подраздел работ в индексированный список
      branchesAndSubbrunchesOrder[pprData.id] = { branch: tempBranchMeta, subbranch: tempSubbranchMeta };
    } else if (pprData.subbranch !== tempSubbranchMeta.name) {
      // Инициируем новую сслыку на значения подраздел работ
      updateTempSubbranchMeta(pprData.subbranch, index);

      // Добавляем к текущему разделу работ ссылку на подраздел
      tempBranchMeta.subbranches.push(tempSubbranchMeta);

      // В SET наименований подразделов добавляем новое имя
      subbranchesSet.add(tempSubbranchMeta.name);

      // Добавляем ссылку на подраздел работ в индексированный список
      branchesAndSubbrunchesOrder[pprData.id] = { subbranch: tempSubbranchMeta };
    }

    // Расчитать rowSpan для наименования и обновить tempWorkOrder и tempWorkOrderForRowSpan

    if (
      pprData.name !== tempWorkRowSpan.name ||
      pprData.note !== tempWorkRowSpan.note ||
      pprData.branch !== tempWorkRowSpan.branch ||
      pprData.subbranch !== tempWorkRowSpan.subbranch
    ) {
      tempWorkOrderForRowSpan++;
      worksRowSpan[index] = 1;
      resetTempWorkCombine(index, pprData);
    } else {
      worksRowSpan[tempWorkRowSpan.indexStart] += 1;
      worksRowSpan[index] = 0;
    }

    // Добавить порядковый номер работы в перечень
    worksOrder[pprData.id] = `${tempSubbranchMeta.orderIndex}${tempWorkOrderForRowSpan}`;

    if (isInit) {
      isInit = false;
    }

    // Добавить id работы в SET разделов
    tempBranchMeta.workIds.add(pprData.id);

    // Счиатаем общие чел.-ч по запланированным работам
    PLAN_TIME_FIELDS.forEach((field) => {
      handleWorkPeriod(tempBranchMeta.total.final, pprData[field].final, field);
      handleWorkPeriod(tempSubbranchMeta.total.final, pprData[field].final, field);
      handleWorkPeriod(worksTotalFinalValue, pprData[field].final, field);

      handleWorkPeriod(tempBranchMeta.total.original, pprData[field].original, field);
      handleWorkPeriod(tempSubbranchMeta.total.original, pprData[field].original, field);
      handleWorkPeriod(worksTotalOriginalValue, pprData[field].original, field);
    });

    FACT_NORM_TIME_FIELDS.forEach((field) => {
      handleWorkPeriod(tempBranchMeta.total.final, pprData[field], field);
      handleWorkPeriod(tempSubbranchMeta.total.final, pprData[field], field);
      handleWorkPeriod(worksTotalFinalValue, pprData[field], field);

      handleWorkPeriod(tempBranchMeta.total.original, pprData[field], field);
      handleWorkPeriod(tempSubbranchMeta.total.original, pprData[field], field);
      handleWorkPeriod(worksTotalOriginalValue, pprData[field], field);
    });

    FACT_TIME_FIELDS.forEach((field) => {
      handleWorkPeriod(tempBranchMeta.total.final, pprData[field], field);
      handleWorkPeriod(tempSubbranchMeta.total.final, pprData[field], field);
      handleWorkPeriod(worksTotalFinalValue, pprData[field], field);

      handleWorkPeriod(tempBranchMeta.total.original, pprData[field], field);
      handleWorkPeriod(tempSubbranchMeta.total.original, pprData[field], field);
      handleWorkPeriod(worksTotalOriginalValue, pprData[field], field);
    });

    // Добавить id работы в SET подразделов
    tempSubbranchMeta.workIds.add(pprData.id);
  });

  // Счиатаем общие чел.-ч по запланированным трудовым ресурсам
  workingMansData?.forEach((workingMan) => {
    PLAN_NORM_TIME_FIELDS.forEach((field) => handleWorkingMansPeriod(workingMansTotalValues, workingMan[field], field));
    PLAN_TABEL_TIME_FIELDS.forEach((field) =>
      handleWorkingMansPeriod(workingMansTotalValues, workingMan[field], field)
    );
    PLAN_TIME_FIELDS.forEach((field) => handleWorkingMansPeriod(workingMansTotalValues, workingMan[field], field));
    FACT_TIME_FIELDS.forEach((field) => handleWorkingMansPeriod(workingMansTotalValues, workingMan[field], field));
  });

  return {
    totalValues: { final: totalFinalValues, original: totalOriginalValues },
    worksRowSpan,
    branchesMeta,
    worksOrder,
    branchesAndSubbrunchesOrder,
    subbranchesList: Array.from(subbranchesSet),
  };
}
