import {
  IFactNormTimePeriods,
  IFactTimePeriods,
  IFactWorkPeriods,
  IPlanTimePeriods,
  IPlanWorkPeriods,
  IPprData,
} from "../model/ppr.schema";

export const planWorkPeriods: (keyof IPlanWorkPeriods)[] = [
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

export const planTimePeriods: (keyof IPlanTimePeriods)[] = [
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

export const factWorkPeriods: (keyof IFactWorkPeriods)[] = [
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

export const factTimePeriods: (keyof IFactTimePeriods)[] = [
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

export const normTimePeriods: (keyof IFactNormTimePeriods)[] = [
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

export const workAndTimeColumnsFields = [
  ...planWorkPeriods,
  ...planTimePeriods,
  ...factWorkPeriods,
  ...normTimePeriods,
  ...factTimePeriods,
];

export const pprDataColumnsFields: (keyof IPprData)[] = [
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
  ...planWorkPeriods,
  ...planTimePeriods,
  ...factWorkPeriods,
  ...normTimePeriods,
  ...factTimePeriods,
] as const;

export const pprTableColumnsSet: Set<keyof IPprData | string> = new Set(pprDataColumnsFields);
export const planWorkPeriodsSet: Set<keyof IPlanWorkPeriods | string> = new Set(planWorkPeriods);
export const factWorkPeriodsSet: Set<keyof IFactWorkPeriods | string> = new Set(factWorkPeriods);
export const planTimePeriodsSet: Set<keyof IPlanTimePeriods | string> = new Set(planTimePeriods);
export const factTimePeriodsSet: Set<keyof IFactTimePeriods | string> = new Set(factTimePeriods);
export const planFactWorkPeriodsSet: Set<keyof IPlanWorkPeriods | keyof IFactWorkPeriods | string> = new Set([
  ...planWorkPeriods,
  ...factWorkPeriods,
]);
export const workAndTimeColumnsFieldsSet: Set<
  | keyof IFactNormTimePeriods
  | keyof IPlanWorkPeriods
  | keyof IPlanTimePeriods
  | keyof IFactWorkPeriods
  | keyof IFactTimePeriods
  | string
> = new Set(workAndTimeColumnsFields);

export const workToTimePlanFieldsPair: { [field in keyof IPlanWorkPeriods | string]?: keyof IPlanTimePeriods } = {
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

export const workToNormTimeFactFieldsPair: { [field in keyof IFactWorkPeriods | string]?: keyof IFactNormTimePeriods } =
  {
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

export const timeToWorkPlanFieldsPair: { [field in keyof IPlanTimePeriods | string]?: keyof IPlanWorkPeriods } = {
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

export function getWorkToTimePlanFieldPair(field: keyof IPlanWorkPeriods | string): keyof IPlanTimePeriods | undefined {
  return workToTimePlanFieldsPair[field];
}

export function getWorkToTimeFactFieldPair(
  field: keyof IFactWorkPeriods | string
): keyof IFactNormTimePeriods | undefined {
  return workToNormTimeFactFieldsPair[field];
}

export function getTimeToWorkPlanFieldPair(field: keyof IPlanTimePeriods | string): keyof IPlanWorkPeriods | undefined {
  return timeToWorkPlanFieldsPair[field];
}
