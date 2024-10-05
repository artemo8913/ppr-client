import {
  IPprData,
  TTotalFieldsValues,
  TPprDataFieldsTotalValues,
  TWorkingManFieldsTotalValues,
  FACT_NORM_TIME_FIELDS,
  FACT_TIME_FIELDS,
  PLAN_TIME_FIELDS,
  getPlanWorkFieldByPlanTimeField,
  IWorkingManYearPlan,
  PLAN_NORM_TIME_FIELDS,
  PLAN_TABEL_TIME_FIELDS,
} from "@/2entities/ppr";

export function calculatePprTotalValues(pprData?: IPprData[], peoplesData?: IWorkingManYearPlan[]): TTotalFieldsValues {
  const totalFieldsValues: TTotalFieldsValues = { works: {}, peoples: {} };

  function handleWorkPeriod(value: number, field: keyof TPprDataFieldsTotalValues) {
    if (totalFieldsValues.works[field] !== undefined) {
      totalFieldsValues.works[field]! += value;
    } else {
      totalFieldsValues.works[field] = value;
    }
  }

  function handleWorkingMansPeriod(value: number, field: keyof TWorkingManFieldsTotalValues) {
    if (totalFieldsValues.peoples[field] !== undefined) {
      totalFieldsValues.peoples[field]! += value;
    } else {
      totalFieldsValues.peoples[field] = value;
    }
  }

  pprData?.forEach((pprData) => {
    PLAN_TIME_FIELDS.forEach((field) => {
      const planWorkField = getPlanWorkFieldByPlanTimeField(field);
      const value = pprData[planWorkField].final * pprData.norm_of_time;
      handleWorkPeriod(value, field);
    });
    FACT_NORM_TIME_FIELDS.forEach((field) => handleWorkPeriod(pprData[field], field));
    FACT_TIME_FIELDS.forEach((field) => handleWorkPeriod(pprData[field], field));
  });

  peoplesData?.forEach((workingMan) => {
    PLAN_NORM_TIME_FIELDS.forEach((field) => handleWorkingMansPeriod(workingMan[field], field));
    PLAN_TABEL_TIME_FIELDS.forEach((field) => handleWorkingMansPeriod(workingMan[field], field));
    PLAN_TIME_FIELDS.forEach((field) => handleWorkingMansPeriod(workingMan[field], field));
    FACT_TIME_FIELDS.forEach((field) => handleWorkingMansPeriod(workingMan[field], field));
  });

  return totalFieldsValues;
}
