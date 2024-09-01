import { TTimePeriod } from "@/1shared/lib/date";
import {
  IPprData,
  TPlanWorkPeriods,
  TPlanTimePeriods,
  TFactWorkPeriods,
  TFactTimePeriods,
  TFactNormTimePeriods,
  TPlanNormTimePeriods,
  TPlanTabelTimePeriods,
} from "../model/ppr.schema";

export const planWorkFields: TPlanWorkPeriods[] = [
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

export const planTimeFields: TPlanTimePeriods[] = [
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

export const factWorkFields: TFactWorkPeriods[] = [
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

export const factTimeFields: TFactTimePeriods[] = [
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

export const factNormTimeFields: TFactNormTimePeriods[] = [
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

export const planNormTimeFields: TPlanNormTimePeriods[] = [
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

export const planTabelTimeFields: TPlanTabelTimePeriods[] = [
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
export const planWorkFieldsSet: Set<TPlanWorkPeriods> = new Set(planWorkFields);
export const factWorkFieldsSet: Set<TFactWorkPeriods> = new Set(factWorkFields);
export const planTimeFieldsSet: Set<TPlanTimePeriods> = new Set(planTimeFields);
export const factTimeFieldsSet: Set<TFactTimePeriods> = new Set(factTimeFields);
export const planFactWorkFieldsSet: Set<TPlanWorkPeriods | TFactWorkPeriods> = new Set([
  ...planWorkFields,
  ...factWorkFields,
]);
export const workAndTimeFieldsSet: Set<
  TPlanWorkPeriods | TPlanTimePeriods | TFactWorkPeriods | TFactNormTimePeriods | TFactTimePeriods
> = new Set(workAndTimeFields);
export const planNormTimeFieldsSet: Set<TPlanNormTimePeriods> = new Set(planNormTimeFields);
export const planTabelTimeFieldsSet: Set<TPlanTabelTimePeriods> = new Set(planTabelTimeFields);
export const factNormTimeFieldsSet: Set<TFactNormTimePeriods> = new Set(factNormTimeFields);

export const workPlanToTimePlanFieldsPair: { [field in TPlanWorkPeriods]: TPlanTimePeriods } = {
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

export const workFactToFactPlanFieldsPair: { [field in TFactWorkPeriods]: TPlanWorkPeriods } = {
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

export const workFactToNormTimeFactFieldsPair: {
  [field in TFactWorkPeriods]: TFactNormTimePeriods;
} = {
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

export const timePlanToWorkPlanFieldsPair: { [field in TPlanTimePeriods]: TPlanWorkPeriods } = {
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

export const tabelTimePlanToTimePlanFieldsPair: {
  [field in TPlanTabelTimePeriods]: TPlanTimePeriods;
} = {
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

export function getPlanWorkFieldByTimePeriod(timePeriod: TTimePeriod): TPlanWorkPeriods {
  return `${timePeriod}_plan_work`;
}

export function getFactWorkFieldByTimePeriod(timePeriod: TTimePeriod): TFactWorkPeriods {
  return `${timePeriod}_fact_work`;
}

export function getPlanTimeFieldByTimePeriod(timePeriod: TTimePeriod): TPlanTimePeriods {
  return `${timePeriod}_plan_time`;
}

export function getFactTimeFieldByTimePeriod(timePeriod: TTimePeriod): TFactTimePeriods {
  return `${timePeriod}_fact_time`;
}

export function getFactNormTimeFieldByTimePeriod(timePeriod: TTimePeriod): TFactNormTimePeriods {
  return `${timePeriod}_fact_norm_time`;
}

export function getPlanTimeFieldByPlanWorkField(field: TPlanWorkPeriods): TPlanTimePeriods {
  return workPlanToTimePlanFieldsPair[field];
}

export function getFactTimeFieldByFactWorkField(field: TFactWorkPeriods): TFactNormTimePeriods {
  return workFactToNormTimeFactFieldsPair[field];
}

export function getPlanWorkFieldByPlanTimeField(field: TPlanTimePeriods): TPlanWorkPeriods {
  return timePlanToWorkPlanFieldsPair[field];
}

export function getPlanWorkFieldByFactWorkField(field: TFactWorkPeriods): TPlanWorkPeriods {
  return workFactToFactPlanFieldsPair[field];
}

export function getPlanTimeFieldByPlanTabelTimeField(field: TPlanTabelTimePeriods): TPlanTimePeriods {
  return tabelTimePlanToTimePlanFieldsPair[field];
}
