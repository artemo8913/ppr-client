import {
  FactNormTimeField,
  FactTimeField,
  FactValueField,
  IPprData,
  MonthPprStatus,
  PlanNormTimeField,
  PlanTabelTimeField,
  PlanTimeField,
  PlanValueField,
  TWorkBranch,
  YearPprStatus,
} from "./ppr.types";

export const YEAR_STATUSES: YearPprStatus[] = [
  "template",
  "plan_creating",
  "plan_on_agreement_engineer",
  "plan_on_agreement_time_norm",
  "plan_on_agreement_sub_boss",
  "plan_on_aprove",
  "in_process",
  "done",
] as const;

export const MONTH_STATUSES: MonthPprStatus[] = [
  "none",
  "plan_creating",
  "plan_on_agreement_engineer",
  "plan_on_agreement_time_norm",
  "plan_on_aprove",
  "in_process",
  "fact_filling",
  "fact_verification_engineer",
  "fact_verification_time_norm",
  "fact_on_agreement_sub_boss",
  "done",
] as const;

export const BRANCHES: TWorkBranch[] = ["exploitation", "additional", "unforeseen"] as const;

export const PLAN_WORK_FIELDS: PlanValueField[] = [
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

export const PLAN_TIME_FIELDS: PlanTimeField[] = [
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

export const FACT_WORK_FIELDS: FactValueField[] = [
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

export const FACT_TIME_FIELDS: FactTimeField[] = [
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

export const FACT_NORM_TIME_FIELDS: FactNormTimeField[] = [
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

export const PLAN_NORM_TIME_FIELDS: PlanNormTimeField[] = [
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

export const PLAN_TABEL_TIME_FIELDS: PlanTabelTimeField[] = [
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

export const WORK_AND_TIME_FIELDS = [
  ...PLAN_WORK_FIELDS,
  ...PLAN_TIME_FIELDS,
  ...FACT_WORK_FIELDS,
  ...FACT_NORM_TIME_FIELDS,
  ...FACT_TIME_FIELDS,
];

export const PPR_DATA_BASIC_FIELDS: Array<keyof IPprData> = [
  "name",
  "location",
  "line_class",
  "measure",
  "total_count",
  "entry_year",
  "periodicity_normal",
  // "periodicity_fact",
  "last_maintenance_year",
  "norm_of_time",
  "norm_of_time_document",
  "unity",
] as const;

export const PPR_DATA_FIELDS: (keyof IPprData)[] = [
  "id",
  "common_work_id",
  "is_work_aproved",
  "branch",
  "subbranch",
  ...PPR_DATA_BASIC_FIELDS,
  // year
  "year_plan_work",
  "year_plan_time",
  "year_fact_work",
  "year_fact_norm_time",
  "year_fact_time",
  // jan
  "jan_plan_work",
  "jan_plan_time",
  "jan_fact_work",
  "jan_fact_norm_time",
  "jan_fact_time",
  // feb
  "feb_plan_work",
  "feb_plan_time",
  "feb_fact_work",
  "feb_fact_norm_time",
  "feb_fact_time",
  // mar
  "mar_plan_work",
  "mar_plan_time",
  "mar_fact_work",
  "mar_fact_norm_time",
  "mar_fact_time",
  // apr
  "apr_plan_work",
  "apr_plan_time",
  "apr_fact_work",
  "apr_fact_norm_time",
  "apr_fact_time",
  // may
  "may_plan_work",
  "may_plan_time",
  "may_fact_work",
  "may_fact_norm_time",
  "may_fact_time",
  // june
  "june_plan_work",
  "june_plan_time",
  "june_fact_work",
  "june_fact_norm_time",
  "june_fact_time",
  // july
  "july_plan_work",
  "july_plan_time",
  "july_fact_work",
  "july_fact_norm_time",
  "july_fact_time",
  // aug
  "aug_plan_work",
  "aug_plan_time",
  "aug_fact_work",
  "aug_fact_norm_time",
  "aug_fact_time",
  // sept
  "sept_plan_work",
  "sept_plan_time",
  "sept_fact_work",
  "sept_fact_norm_time",
  "sept_fact_time",
  // oct
  "oct_plan_work",
  "oct_plan_time",
  "oct_fact_work",
  "oct_fact_norm_time",
  "oct_fact_time",
  // nov
  "nov_plan_work",
  "nov_plan_time",
  "nov_fact_work",
  "nov_fact_norm_time",
  "nov_fact_time",
  // dec
  "dec_plan_work",
  "dec_plan_time",
  "dec_fact_work",
  "dec_fact_norm_time",
  "dec_fact_time",
] as const;

export const pprTableFieldsSet: Set<keyof IPprData> = new Set(PPR_DATA_FIELDS);
export const planWorkFieldsSet: Set<PlanValueField> = new Set(PLAN_WORK_FIELDS);
export const factWorkFieldsSet: Set<FactValueField> = new Set(FACT_WORK_FIELDS);
export const planTimeFieldsSet: Set<PlanTimeField> = new Set(PLAN_TIME_FIELDS);
export const factTimeFieldsSet: Set<FactTimeField> = new Set(FACT_TIME_FIELDS);
export const planFactWorkFieldsSet: Set<PlanValueField | FactValueField> = new Set([
  ...PLAN_WORK_FIELDS,
  ...FACT_WORK_FIELDS,
]);
export const workAndTimeFieldsSet: Set<
  PlanValueField | PlanTimeField | FactValueField | FactNormTimeField | FactTimeField
> = new Set(WORK_AND_TIME_FIELDS);
export const planNormTimeFieldsSet: Set<PlanNormTimeField> = new Set(PLAN_NORM_TIME_FIELDS);
export const planTabelTimeFieldsSet: Set<PlanTabelTimeField> = new Set(PLAN_TABEL_TIME_FIELDS);
export const factNormTimeFieldsSet: Set<FactNormTimeField> = new Set(FACT_NORM_TIME_FIELDS);

export const planWorkToPlanTimeFieldsPair: { [field in PlanValueField]: PlanTimeField } = {
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

export const factWorkToPlanWorkFieldsPair: { [field in FactValueField]: PlanValueField } = {
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

export const factWorkToFactNormTimeFieldsPair: {
  [field in FactValueField]: FactNormTimeField;
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

export const planTimeToPlanWorkFieldsPair: { [field in PlanTimeField]: PlanValueField } = {
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

export const planTabelTimeToPlanTimeFieldsPair: {
  [field in PlanTabelTimeField]: PlanTimeField;
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

export const planNormTimeToPlanTabelTimeFieldsPair: {
  [field in PlanNormTimeField]: PlanTabelTimeField;
} = {
  year_plan_norm_time: "year_plan_tabel_time",
  jan_plan_norm_time: "jan_plan_tabel_time",
  feb_plan_norm_time: "feb_plan_tabel_time",
  mar_plan_norm_time: "mar_plan_tabel_time",
  apr_plan_norm_time: "apr_plan_tabel_time",
  may_plan_norm_time: "may_plan_tabel_time",
  june_plan_norm_time: "june_plan_tabel_time",
  july_plan_norm_time: "july_plan_tabel_time",
  aug_plan_norm_time: "aug_plan_tabel_time",
  sept_plan_norm_time: "sept_plan_tabel_time",
  oct_plan_norm_time: "oct_plan_tabel_time",
  nov_plan_norm_time: "nov_plan_tabel_time",
  dec_plan_norm_time: "dec_plan_tabel_time",
};
