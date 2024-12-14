import { roundToFixed } from "@/1shared/lib/math";
import {
  FACT_NORM_TIME_FIELDS,
  FACT_TIME_FIELDS,
  getPlanWorkFieldByPlanTimeField,
  IPprData,
  IWorkingManYearPlan,
  PLAN_NORM_TIME_FIELDS,
  PLAN_TABEL_TIME_FIELDS,
  PLAN_TIME_FIELDS,
  TPprDataFieldsTotalValues,
  TPprDataWorkId,
  TTotalFieldsValues,
  TWorkBranch,
  TWorkingManFieldsTotalValues,
} from "@/2entities/ppr";

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
  indexToPlaceTitle: number;
  workIds: Set<TPprDataWorkId>;
  type: "branch" | "subbranch";
  prev: IBranchDefaultMeta | null;
  total: TPprDataFieldsTotalValues;
}

export interface IBranchMeta extends IBranchDefaultMeta {
  subbranches: IBranchDefaultMeta[];
}

export interface IPprMeta {
  worksOrder: string[];
  worksRowSpan: number[];
  worksOrderForRowSpan: string[];
  subbranchesList: string[];
  branchesMeta: IBranchMeta[];
  totalValues: TTotalFieldsValues;
  branchesAndSubbrunchesOrder: {
    [indexToPlace: number]: {
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
    [indexToPlace: number]: {
      branch?: IBranchMeta;
      subbranch: IBranchDefaultMeta;
    };
  } = {};

  const subbranchesSet = new Set<string>();

  const worksOrder: string[] = [];

  const worksOrderForRowSpan: string[] = [];

  const worksRowSpan: number[] = [];

  const worksTotalValue: TPprDataFieldsTotalValues = {};

  const workingMansTotalValues: TWorkingManFieldsTotalValues = {};

  const totalValues: TTotalFieldsValues = { works: worksTotalValue, peoples: workingMansTotalValues };

  let isInit = true;

  let tempWorkOrder = 1;

  let tempWorkOrderForRowSpan = 1;

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
    indexToPlaceTitle: 0,
    name: "",
    subbranches: [],
    orderIndex: "",
    type: "branch",
    total: {},
    prev: null,
  };

  let tempSubbranchMeta: IBranchDefaultMeta = {
    workIds: new Set(),
    indexToPlaceTitle: 0,
    name: "",
    orderIndex: "",
    type: "subbranch",
    total: {},
    prev: null,
  };

  function updateTempBranchMeta(branchName: TWorkBranch, index: number) {
    tempBranchMeta = {
      workIds: new Set(),
      indexToPlaceTitle: index,
      name: branchName,
      subbranches: [],
      orderIndex: `${branchesMeta.length + 1}.`,
      type: "branch",
      total: {},
      prev: isInit ? null : tempBranchMeta,
    };
  }

  function updateTempSubbranchMeta(subbranchName: string, index: number, isBranchChange?: boolean) {
    // Обнуляем счетчик порядкового номера работы внутри подкатегории
    tempWorkOrder = 1;
    tempWorkOrderForRowSpan = 1;

    tempSubbranchMeta = {
      workIds: new Set(),
      indexToPlaceTitle: index,
      name: subbranchName,
      orderIndex: `${branchesMeta.length + (isBranchChange ? 1 : 0)}.${tempBranchMeta.subbranches.length + 1}.`,
      type: "subbranch",
      total: {},
      prev: isInit ? null : tempSubbranchMeta,
    };
  }

  function resetTempWorkCombine(indexStart: number, pprData: IPprData) {
    tempWorkRowSpan = {
      ...pprData,
      indexStart,
    };
  }

  pprData?.forEach((pprData, index) => {
    if (pprData.branch !== tempBranchMeta.name) {
      // Инициируем новые сслыки на значения категории и подкатегории работ
      updateTempBranchMeta(pprData.branch, index);
      updateTempSubbranchMeta(pprData.subbranch, index, true);

      // Добавляем к категории работ ссылку на подкатегорию
      tempBranchMeta.subbranches.push(tempSubbranchMeta);

      // Добавляем ссылку на категорию работ в полный перечень категорий
      branchesMeta.push(tempBranchMeta);

      // В SET наименований подкатегорий добавляем новое имя
      subbranchesSet.add(tempSubbranchMeta.name);

      // Добавляем ссылки на категорию и подкатегорию работ в индексированный список
      branchesAndSubbrunchesOrder[index] = { branch: tempBranchMeta, subbranch: tempSubbranchMeta };
    } else if (pprData.subbranch !== tempSubbranchMeta.name) {
      // Инициируем новую сслыку на значения подкатегории работ
      updateTempSubbranchMeta(pprData.subbranch, index);

      // Добавляем к текущей категории работ ссылку на подкатегорию
      tempBranchMeta.subbranches.push(tempSubbranchMeta);

      // В SET наименований подкатегорий добавляем новое имя
      subbranchesSet.add(tempSubbranchMeta.name);

      // Добавляем ссылку на подкатегорию работ в индексированный список
      branchesAndSubbrunchesOrder[index] = { subbranch: tempSubbranchMeta };
    }

    // Добавить порядковый номер работы в перечень
    worksOrder.push(`${tempSubbranchMeta.orderIndex}${tempWorkOrder}`);
    worksOrderForRowSpan.push(`${tempSubbranchMeta.orderIndex}${tempWorkOrderForRowSpan}`);
    tempWorkOrder++;

    // Расчитать rowSpan для наименования
    if (
      pprData.name !== tempWorkRowSpan.name ||
      pprData.note !== tempWorkRowSpan.note ||
      pprData.branch !== tempWorkRowSpan.branch ||
      pprData.subbranch !== tempWorkRowSpan.subbranch
    ) {
      resetTempWorkCombine(index, pprData);
      worksRowSpan[index] = 1;
      tempWorkOrderForRowSpan++;
    } else {
      worksRowSpan[tempWorkRowSpan.indexStart] += 1;
      worksRowSpan[index] = 0;
    }

    if (isInit) {
      isInit = false;
    }

    // Добавить id работы в SET категории
    tempBranchMeta.workIds.add(pprData.id);

    // Счиатаем общие чел.-ч по запланированным работам
    PLAN_TIME_FIELDS.forEach((field) => {
      const planWorkField = getPlanWorkFieldByPlanTimeField(field);
      const value = pprData[planWorkField].final * pprData.norm_of_time;
      handleWorkPeriod(tempBranchMeta.total, value, field);
      handleWorkPeriod(tempSubbranchMeta.total, value, field);
      handleWorkPeriod(worksTotalValue, value, field);
    });

    FACT_NORM_TIME_FIELDS.forEach((field) => {
      handleWorkPeriod(tempBranchMeta.total, pprData[field], field);
      handleWorkPeriod(tempSubbranchMeta.total, pprData[field], field);
      handleWorkPeriod(worksTotalValue, pprData[field], field);
    });

    FACT_TIME_FIELDS.forEach((field) => {
      handleWorkPeriod(tempBranchMeta.total, pprData[field], field);
      handleWorkPeriod(tempSubbranchMeta.total, pprData[field], field);
      handleWorkPeriod(worksTotalValue, pprData[field], field);
    });

    // Добавить id работы в SET подкатегории
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
    worksOrder,
    totalValues,
    worksRowSpan,
    branchesMeta,
    worksOrderForRowSpan,
    branchesAndSubbrunchesOrder,
    subbranchesList: Array.from(subbranchesSet),
  };
}
