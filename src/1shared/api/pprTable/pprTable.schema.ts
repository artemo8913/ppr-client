import { IUser } from "../user";
import { TMonths } from "@/1shared/types/date";

export type TYearPprStatus =
  | "none"
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
  | "plan_on_agreement_security_engineer"
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
  [month in TMonths]: TMonthPprStatus;
};

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
  data: IPprData[];
}

export interface IHandlePprData extends IPprData {
  rowSpan?: number;
  isHandMade?: boolean;
}

export interface IPprData {
  id: string;
  workId: string | null;
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
  year_plan_work: number;
  year_plan_time: number;
  year_fact_work: number;
  year_fact_norm_time: number;
  year_fact_time: number;
  jan_plan_work: number;
  jan_plan_time: number;
  jan_fact_work: number;
  jan_fact_norm_time: number;
  jan_fact_time: number;
  feb_plan_work: number;
  feb_plan_time: number;
  feb_fact_work: number;
  feb_fact_norm_time: number;
  feb_fact_time: number;
  mar_plan_work: number;
  mar_plan_time: number;
  mar_fact_work: number;
  mar_fact_norm_time: number;
  mar_fact_time: number;
  apr_plan_work: number;
  apr_plan_time: number;
  apr_fact_work: number;
  apr_fact_norm_time: number;
  apr_fact_time: number;
  may_plan_work: number;
  may_plan_time: number;
  may_fact_work: number;
  may_fact_norm_time: number;
  may_fact_time: number;
  june_plan_work: number;
  june_plan_time: number;
  june_fact_work: number;
  june_fact_norm_time: number;
  june_fact_time: number;
  july_plan_work: number;
  july_plan_time: number;
  july_fact_work: number;
  july_fact_norm_time: number;
  july_fact_time: number;
  aug_plan_work: number;
  aug_plan_time: number;
  aug_fact_work: number;
  aug_fact_norm_time: number;
  aug_fact_time: number;
  sept_plan_work: number;
  sept_plan_time: number;
  sept_fact_work: number;
  sept_fact_norm_time: number;
  sept_fact_time: number;
  oct_plan_work: number;
  oct_plan_time: number;
  oct_fact_work: number;
  oct_fact_norm_time: number;
  oct_fact_time: number;
  nov_plan_work: number;
  nov_plan_time: number;
  nov_fact_work: number;
  nov_fact_norm_time: number;
  nov_fact_time: number;
  dec_plan_work: number;
  dec_plan_time: number;
  dec_fact_work: number;
  dec_fact_norm_time: number;
  dec_fact_time: number;
}
