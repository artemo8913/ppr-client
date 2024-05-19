import { IUser } from "../../user";
import { TMonth } from "@/1shared/types/date";

export type TYearPprStatus =
  | "template"
  | "plan_creating"
  | "plan_on_agreement_engineer"
  | "plan_on_agreement_time_norm"
  | "plan_on_agreement_security_engineer"
  | "plan_on_agreement_sub_boss"
  | "plan_on_correction"
  | "plan_on_aprove"
  | "plan_aproved"
  | "in_process"
  | "done";

export type TMonthPprStatus =
  | "none"
  | "plan_creating"
  | "plan_on_agreement_engineer"
  | "plan_on_agreement_time_norm"
  | "plan_on_correction"
  | "plan_on_aprove"
  | "plan_aproved"
  | "in_process"
  | "fact_filling"
  | "fact_verification_engineer"
  | "fact_verification_time_norm"
  | "fact_on_agreement_sub_boss"
  | "done";

export type TAllMonthStatuses = {
  [month in TMonth]: TMonthPprStatus;
};

export interface IPlanWorkPeriods {
  year_plan_work: number;
  jan_plan_work: number;
  feb_plan_work: number;
  mar_plan_work: number;
  apr_plan_work: number;
  may_plan_work: number;
  june_plan_work: number;
  july_plan_work: number;
  aug_plan_work: number;
  sept_plan_work: number;
  oct_plan_work: number;
  nov_plan_work: number;
  dec_plan_work: number;
}

export interface IPlanTimePeriods {
  year_plan_time: number;
  jan_plan_time: number;
  feb_plan_time: number;
  mar_plan_time: number;
  apr_plan_time: number;
  may_plan_time: number;
  june_plan_time: number;
  july_plan_time: number;
  aug_plan_time: number;
  sept_plan_time: number;
  oct_plan_time: number;
  nov_plan_time: number;
  dec_plan_time: number;
}

export interface IFactWorkPeriods {
  year_fact_work: number;
  jan_fact_work: number;
  feb_fact_work: number;
  mar_fact_work: number;
  apr_fact_work: number;
  may_fact_work: number;
  june_fact_work: number;
  july_fact_work: number;
  aug_fact_work: number;
  sept_fact_work: number;
  oct_fact_work: number;
  nov_fact_work: number;
  dec_fact_work: number;
}

export interface IFactNormTimePeriods {
  year_fact_norm_time: number;
  jan_fact_norm_time: number;
  feb_fact_norm_time: number;
  mar_fact_norm_time: number;
  apr_fact_norm_time: number;
  may_fact_norm_time: number;
  june_fact_norm_time: number;
  july_fact_norm_time: number;
  aug_fact_norm_time: number;
  sept_fact_norm_time: number;
  oct_fact_norm_time: number;
  nov_fact_norm_time: number;
  dec_fact_norm_time: number;
}

export interface IFactTimePeriods {
  year_fact_time: number;
  jan_fact_time: number;
  feb_fact_time: number;
  mar_fact_time: number;
  apr_fact_time: number;
  may_fact_time: number;
  june_fact_time: number;
  july_fact_time: number;
  aug_fact_time: number;
  sept_fact_time: number;
  oct_fact_time: number;
  nov_fact_time: number;
  dec_fact_time: number;
}

export interface IPpr {
  id: string;
  name: string;
  year: number;
  status: TYearPprStatus;
  created_at: string;
  created_by: IUser;
  months_statuses: TAllMonthStatuses;
  id_direction: number | null;
  id_distance: number | null;
  id_subdivision: number | null;
  peoples: IWorkingManYearPlan[];
  data: IPprData[];
  corrections: {
    peoples: { [id: string]: TPprDataCorrection<IPlanTimePeriods> | undefined };
    works: { [id: string]: TPprDataCorrection<IPlanWorkPeriods> | undefined };
  };
}

export interface IHandlePprData extends IPprData {
  rowSpan?: number;
  isHandMade?: boolean;
}

export type TWorkPlanCorrection = {
  [id: string]: { [planPeriod in keyof IPlanWorkPeriods]?: number } | undefined;
};

export type TPprDataCorrection<T> = {
  [fieldNameFrom in keyof T]?: {
    newValue: number;
    diff: number;
    fieldsTo: { fieldNameTo: keyof T; value: number; is_approved: boolean }[] | null | undefined;
  };
};

export interface IWorkingManYearPlan extends IPlanTimePeriods, IFactTimePeriods {
  id: string;
  full_name: string;
  work_position: string;
  participation: number;
}

export interface IPprData
  extends IPlanWorkPeriods,
    IPlanTimePeriods,
    IFactWorkPeriods,
    IFactNormTimePeriods,
    IFactTimePeriods {
  id: string;
  workId: string | null;
  is_work_aproved: boolean;
  branch: string;
  subbranch: string;
  name: string;
  location: string;
  line_class: number;
  measure: string;
  total_count: number;
  entry_year: number;
  periodicity_normal: number;
  periodicity_fact: number;
  last_maintenance_year: number;
  norm_of_time: number;
  norm_of_time_document: string;
  unity: string;
}

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
