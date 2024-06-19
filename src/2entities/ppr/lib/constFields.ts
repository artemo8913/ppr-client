import { TTimePeriod } from "@/1shared/lib/date";
import {
  IFactNormTimePeriods,
  IFactTimePeriods,
  IFactWorkPeriods,
  IPlanNormTimePeriods,
  IPlanTabelTimePeriods,
  IPlanTimePeriods,
  IPlanWorkPeriods,
  IPprData,
} from "../model/ppr.schema";

export const planWorkFields: (keyof IPlanWorkPeriods)[] = [
  "year_plan_work",
  "jan_plan_work",
  "feb_plan_work",
  "mar_plan_work",
  "apr_plan_work",
  "may_plan_work",
  "june_plan_work",
  "july_plan_work",
  "aug_plan_work",
  "sept_plan_work",
  "oct_plan_work",
  "nov_plan_work",
  "dec_plan_work",
] as const;

export const planTimeFields: (keyof IPlanTimePeriods)[] = [
  "year_plan_time",
  "jan_plan_time",
  "feb_plan_time",
  "mar_plan_time",
  "apr_plan_time",
  "may_plan_time",
  "june_plan_time",
  "july_plan_time",
  "aug_plan_time",
  "sept_plan_time",
  "oct_plan_time",
  "nov_plan_time",
  "dec_plan_time",
] as const;

export const factWorkFields: (keyof IFactWorkPeriods)[] = [
  "year_fact_work",
  "jan_fact_work",
  "feb_fact_work",
  "mar_fact_work",
  "apr_fact_work",
  "may_fact_work",
  "june_fact_work",
  "july_fact_work",
  "aug_fact_work",
  "sept_fact_work",
  "oct_fact_work",
  "nov_fact_work",
  "dec_fact_work",
] as const;

export const factTimeFields: (keyof IFactTimePeriods)[] = [
  "year_fact_time",
  "jan_fact_time",
  "feb_fact_time",
  "mar_fact_time",
  "apr_fact_time",
  "may_fact_time",
  "june_fact_time",
  "july_fact_time",
  "aug_fact_time",
  "sept_fact_time",
  "oct_fact_time",
  "nov_fact_time",
  "dec_fact_time",
] as const;

export const factNormTimeFields: (keyof IFactNormTimePeriods)[] = [
  "year_fact_norm_time",
  "jan_fact_norm_time",
  "feb_fact_norm_time",
  "mar_fact_norm_time",
  "apr_fact_norm_time",
  "may_fact_norm_time",
  "june_fact_norm_time",
  "july_fact_norm_time",
  "aug_fact_norm_time",
  "sept_fact_norm_time",
  "oct_fact_norm_time",
  "nov_fact_norm_time",
  "dec_fact_norm_time",
] as const;

export const planNormTimeFields: (keyof IPlanNormTimePeriods)[] = [
  "year_plan_norm_time",
  "jan_plan_norm_time",
  "feb_plan_norm_time",
  "mar_plan_norm_time",
  "apr_plan_norm_time",
  "may_plan_norm_time",
  "june_plan_norm_time",
  "july_plan_norm_time",
  "aug_plan_norm_time",
  "sept_plan_norm_time",
  "oct_plan_norm_time",
  "nov_plan_norm_time",
  "dec_plan_norm_time",
] as const;

export const planTabelTimeFields: (keyof IPlanTabelTimePeriods)[] = [
  "year_plan_tabel_time",
  "jan_plan_tabel_time",
  "feb_plan_tabel_time",
  "mar_plan_tabel_time",
  "apr_plan_tabel_time",
  "may_plan_tabel_time",
  "june_plan_tabel_time",
  "july_plan_tabel_time",
  "aug_plan_tabel_time",
  "sept_plan_tabel_time",
  "oct_plan_tabel_time",
  "nov_plan_tabel_time",
  "dec_plan_tabel_time",
] as const;

export const workAndTimeFields = [
  ...planWorkFields,
  ...planTimeFields,
  ...factWorkFields,
  ...factNormTimeFields,
  ...factTimeFields,
];

export const pprDataFields: (keyof IPprData)[] = [
  "id",
  "workId",
  "is_work_aproved",
  "branch",
  "subbranch",
  "name",
  "location",
  "line_class",
  "measure",
  "total_count",
  "entry_year",
  "periodicity_normal",
  "periodicity_fact",
  "last_maintenance_year",
  "norm_of_time",
  "norm_of_time_document",
  "unity",
  ...planWorkFields,
  ...planTimeFields,
  ...factWorkFields,
  ...factNormTimeFields,
  ...factTimeFields,
] as const;

export const pprTableFieldsSet: Set<keyof IPprData> = new Set(pprDataFields);
export const planWorkFieldsSet: Set<keyof IPlanWorkPeriods> = new Set(planWorkFields);
export const factWorkFieldsSet: Set<keyof IFactWorkPeriods> = new Set(factWorkFields);
export const planTimeFieldsSet: Set<keyof IPlanTimePeriods> = new Set(planTimeFields);
export const factTimeFieldsSet: Set<keyof IFactTimePeriods> = new Set(factTimeFields);
export const planFactWorkFieldsSet: Set<keyof IPlanWorkPeriods | keyof IFactWorkPeriods> = new Set([
  ...planWorkFields,
  ...factWorkFields,
]);
export const workAndTimeFieldsSet: Set<
  | keyof IFactNormTimePeriods
  | keyof IPlanWorkPeriods
  | keyof IPlanTimePeriods
  | keyof IFactWorkPeriods
  | keyof IFactTimePeriods
> = new Set(workAndTimeFields);
export const planNormTimeFieldsSet: Set<keyof IPlanNormTimePeriods> = new Set(planNormTimeFields);
export const planTabelTimeFieldsSet: Set<keyof IPlanTabelTimePeriods> = new Set(planTabelTimeFields);
export const factNormTimeFieldsSet: Set<keyof IFactNormTimePeriods> = new Set(factNormTimeFields);

export const workPlanToTimePlanFieldsPair: { [field in keyof IPlanWorkPeriods]: keyof IPlanTimePeriods } = {
  year_plan_work: "year_plan_time",
  jan_plan_work: "jan_plan_time",
  feb_plan_work: "feb_plan_time",
  mar_plan_work: "mar_plan_time",
  apr_plan_work: "apr_plan_time",
  may_plan_work: "may_plan_time",
  june_plan_work: "june_plan_time",
  july_plan_work: "july_plan_time",
  aug_plan_work: "aug_plan_time",
  sept_plan_work: "sept_plan_time",
  oct_plan_work: "oct_plan_time",
  nov_plan_work: "nov_plan_time",
  dec_plan_work: "dec_plan_time",
};

export const workFactToFactPlanFieldsPair: { [field in keyof IFactWorkPeriods]: keyof IPlanWorkPeriods } = {
  year_fact_work: "year_plan_work",
  jan_fact_work: "jan_plan_work",
  feb_fact_work: "feb_plan_work",
  mar_fact_work: "mar_plan_work",
  apr_fact_work: "apr_plan_work",
  may_fact_work: "may_plan_work",
  june_fact_work: "june_plan_work",
  july_fact_work: "july_plan_work",
  aug_fact_work: "aug_plan_work",
  sept_fact_work: "sept_plan_work",
  oct_fact_work: "oct_plan_work",
  nov_fact_work: "nov_plan_work",
  dec_fact_work: "dec_plan_work",
};

export const workFactToNormTimeFactFieldsPair: { [field in keyof IFactWorkPeriods]: keyof IFactNormTimePeriods } = {
  year_fact_work: "year_fact_norm_time",
  jan_fact_work: "jan_fact_norm_time",
  feb_fact_work: "feb_fact_norm_time",
  mar_fact_work: "mar_fact_norm_time",
  apr_fact_work: "apr_fact_norm_time",
  may_fact_work: "may_fact_norm_time",
  june_fact_work: "june_fact_norm_time",
  july_fact_work: "july_fact_norm_time",
  aug_fact_work: "aug_fact_norm_time",
  sept_fact_work: "sept_fact_norm_time",
  oct_fact_work: "oct_fact_norm_time",
  nov_fact_work: "nov_fact_norm_time",
  dec_fact_work: "dec_fact_norm_time",
};

export const timePlanToWorkPlanFieldsPair: { [field in keyof IPlanTimePeriods]: keyof IPlanWorkPeriods } = {
  year_plan_time: "year_plan_work",
  jan_plan_time: "jan_plan_work",
  feb_plan_time: "feb_plan_work",
  mar_plan_time: "mar_plan_work",
  apr_plan_time: "apr_plan_work",
  may_plan_time: "may_plan_work",
  june_plan_time: "june_plan_work",
  july_plan_time: "july_plan_work",
  aug_plan_time: "aug_plan_work",
  sept_plan_time: "sept_plan_work",
  oct_plan_time: "oct_plan_work",
  nov_plan_time: "nov_plan_work",
  dec_plan_time: "dec_plan_work",
};

export const tabelTimePlanToTimePlanFieldsPair: { [field in keyof IPlanTabelTimePeriods]: keyof IPlanTimePeriods } = {
  year_plan_tabel_time: "year_plan_time",
  jan_plan_tabel_time: "jan_plan_time",
  feb_plan_tabel_time: "feb_plan_time",
  mar_plan_tabel_time: "mar_plan_time",
  apr_plan_tabel_time: "apr_plan_time",
  may_plan_tabel_time: "may_plan_time",
  june_plan_tabel_time: "june_plan_time",
  july_plan_tabel_time: "july_plan_time",
  aug_plan_tabel_time: "aug_plan_time",
  sept_plan_tabel_time: "sept_plan_time",
  oct_plan_tabel_time: "oct_plan_time",
  nov_plan_tabel_time: "nov_plan_time",
  dec_plan_tabel_time: "dec_plan_time",
};

export function getPlanWorkFieldByTimePeriod(timePeriod: TTimePeriod): keyof IPlanWorkPeriods {
  return `${timePeriod}_plan_work`;
}

export function getFactWorkFieldByTimePeriod(timePeriod: TTimePeriod): keyof IFactWorkPeriods {
  return `${timePeriod}_fact_work`;
}

export function getPlanTimeFieldByTimePeriod(timePeriod: TTimePeriod): keyof IPlanTimePeriods {
  return `${timePeriod}_plan_time`;
}

export function getFactTimeFieldByTimePeriod(timePeriod: TTimePeriod): keyof IFactTimePeriods {
  return `${timePeriod}_fact_time`;
}

export function getFactNormTimeFieldByTimePeriod(timePeriod: TTimePeriod): keyof IFactNormTimePeriods {
  return `${timePeriod}_fact_norm_time`;
}

export function getPlanTimeFieldByPlanWorkField(field: keyof IPlanWorkPeriods): keyof IPlanTimePeriods {
  return workPlanToTimePlanFieldsPair[field];
}

export function getFactTimeFieldByFactWorkField(field: keyof IFactWorkPeriods): keyof IFactNormTimePeriods {
  return workFactToNormTimeFactFieldsPair[field];
}

export function getPlanWorkFieldByPlanTimeField(field: keyof IPlanTimePeriods): keyof IPlanWorkPeriods {
  return timePlanToWorkPlanFieldsPair[field];
}

export function getPlanWorkFieldByFactWorkField(field: keyof IFactWorkPeriods): keyof IPlanWorkPeriods {
  return workFactToFactPlanFieldsPair[field];
}

export function getPlanTimeFieldByPlanTabelTimeField(field: keyof IPlanTabelTimePeriods): keyof IPlanTimePeriods {
  return tabelTimePlanToTimePlanFieldsPair[field];
}
