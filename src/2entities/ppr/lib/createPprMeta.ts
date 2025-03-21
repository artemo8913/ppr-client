import { roundToFixed } from "@/1shared/lib/math/roundToFixed";

import {
  FACT_NORM_TIME_FIELDS,
  FACT_TIME_FIELDS,
  PLAN_NORM_TIME_FIELDS,
  PLAN_TABEL_TIME_FIELDS,
  PLAN_TIME_FIELDS,
} from "../model/ppr.const";
import {
  IPprData,
  IWorkingManYearPlan,
  TPprDataFieldsTotalValues,
  TPprDataWorkId,
  TTotalFieldsValues,
  TWorkBranch,
  TWorkingManFieldsTotalValues,
} from "../model/ppr.types";

function handleWorkPeriod(
  totalObject: TPprDataFieldsTotalValues,
  value: number,
  field: keyof TPprDataFieldsTotalValues
) {
  if (totalObject[field] !== undefined) {
    totalObject[field] = roundToFixed(value + totalObject[field]!);
  } else {
    totalObject[field] = roundToFixed(value);
  }
}

function handleWorkingMansPeriod(
  totalObject: TWorkingManFieldsTotalValues,
  value: number,
  field: keyof TWorkingManFieldsTotalValues
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
  workIds: Set<TPprDataWorkId>;
  type: "branch" | "subbranch";
  prev: IBranchDefaultMeta | null;
  total: { final: TPprDataFieldsTotalValues; original: TPprDataFieldsTotalValues };
}

export interface IBranchMeta extends IBranchDefaultMeta {
  subbranches: IBranchDefaultMeta[];
}

export interface IPprMeta {
  worksOrderForRowSpan: { [id: TPprDataWorkId]: string };
  worksRowSpan: number[];
  subbranchesList: string[];
  branchesMeta: IBranchMeta[];
  totalValues: { final: TTotalFieldsValues; original: TTotalFieldsValues };
  branchesAndSubbrunchesOrder: {
    [id: TPprDataWorkId]: {
      branch?: IBranchMeta;
      subbranch: IBranchDefaultMeta;
    };
  };
}

interface ICreatePprMetaArgs {
  pprData?: IPprData[];
  workingMansData?: IWorkingManYearPlan[];
}

export function createPprMeta({ pprData, workingMansData }: ICreatePprMetaArgs): IPprMeta {
  const branchesMeta: IBranchMeta[] = [];

  const branchesAndSubbrunchesOrder: {
    [id: TPprDataWorkId]: {
      branch?: IBranchMeta;
      subbranch: IBranchDefaultMeta;
    };
  } = {};

  const subbranchesSet = new Set<string>();

  const worksOrderForRowSpan: { [id: TPprDataWorkId]: string } = {};

  const worksRowSpan: number[] = [];

  const worksTotalFinalValue: TPprDataFieldsTotalValues = {};

  const worksTotalOriginalValue: TPprDataFieldsTotalValues = {};

  const workingMansTotalValues: TWorkingManFieldsTotalValues = {};

  const totalFinalValues: TTotalFieldsValues = { works: worksTotalFinalValue, peoples: workingMansTotalValues };

  const totalOriginalValues: TTotalFieldsValues = { works: worksTotalOriginalValue, peoples: workingMansTotalValues };

  let isInit = true;

  let tempWorkOrder = 0;

  let tempWorkOrderForRowSpan = 0;

  let tempWorkRowSpan: {
    name: string;
    note?: string | null;
    branch?: TWorkBranch;
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

  function updateTempBranchMeta(branchName: TWorkBranch, index: number) {
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
    tempWorkOrder = 0;
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

  function resetTempWorkCombine(indexStart: number, pprData: IPprData) {
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
    tempWorkOrder++;

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
    worksOrderForRowSpan[pprData.id] = `${tempSubbranchMeta.orderIndex}${tempWorkOrderForRowSpan}`;

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
    worksOrderForRowSpan,
    branchesAndSubbrunchesOrder,
    subbranchesList: Array.from(subbranchesSet),
  };
}
