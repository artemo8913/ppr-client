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
    totalObject[field]! += value;
  } else {
    totalObject[field] = value;
  }
}

function handleWorkingMansPeriod(
  totalObject: TWorkingManFieldsTotalValues,
  value: number,
  field: keyof TWorkingManFieldsTotalValues
) {
  if (totalObject[field] !== undefined) {
    totalObject[field]! += value;
  } else {
    totalObject[field] = value;
  }
}

export interface IBranchDefaultMeta {
  type: "branch" | "subbranch";
  name: string;
  orderIndex: string;
  total: TPprDataFieldsTotalValues;
  workIds: Set<TPprDataWorkId>;
  indexToPlaceTitle: number;
  prev: IBranchDefaultMeta | null;
  isInit?: boolean;
}

export interface IBranchMeta extends IBranchDefaultMeta {
  subbranches: IBranchDefaultMeta[];
}

export interface IPprMeta {
  branchesMeta: IBranchMeta[];
  branchesAndSubbrunchesOrder: {
    [indexToPlace: number]: {
      branch?: IBranchMeta;
      subbranch: IBranchDefaultMeta;
    };
  };
  subbranchesList: string[];
  totalValues: TTotalFieldsValues;
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

  const worksTotalValue: TPprDataFieldsTotalValues = {};
  const workingMansTotalValues: TWorkingManFieldsTotalValues = {};

  const totalValues: TTotalFieldsValues = { works: worksTotalValue, peoples: workingMansTotalValues };

  let tempBranchMeta: IBranchMeta = {
    workIds: new Set(),
    indexToPlaceTitle: 0,
    name: "",
    subbranches: [],
    orderIndex: "",
    type: "branch",
    total: {},
    prev: null,
    isInit: true,
  };

  let tempSubbranchMeta: IBranchDefaultMeta = {
    workIds: new Set(),
    indexToPlaceTitle: 0,
    name: "",
    orderIndex: "",
    type: "subbranch",
    total: {},
    prev: null,
    isInit: true,
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
      prev: tempBranchMeta.isInit ? null : tempBranchMeta,
    };
  }

  function updateTempSubbranchMeta(subbranchName: string, index: number, isBranchChange?: boolean) {
    tempSubbranchMeta = {
      workIds: new Set(),
      indexToPlaceTitle: index,
      name: subbranchName,
      orderIndex: `${branchesMeta.length + (isBranchChange ? 1 : 0)}.${tempBranchMeta.subbranches.length + 1}.`,
      type: "subbranch",
      total: {},
      prev: tempSubbranchMeta.isInit ? null : tempSubbranchMeta,
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
    branchesMeta,
    branchesAndSubbrunchesOrder,
    subbranchesList: Array.from(subbranchesSet),
    totalValues,
  };
}
