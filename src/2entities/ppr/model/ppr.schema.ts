import { IUser } from "../../user";
import { TMonth, TTimePeriod } from "@/1shared/lib/date";

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

export type IPlanWorkPeriods = {
  [key in `${TTimePeriod}_plan_work`]: number;
};

export type IPlanNormTimePeriods = {
  [key in `${TTimePeriod}_plan_norm_time`]: number;
};

export type IPlanTabelTimePeriods = {
  [key in `${TTimePeriod}_plan_tabel_time`]: number;
};

export type IPlanTimePeriods = {
  [key in `${TTimePeriod}_plan_time`]: number;
};

export type IFactWorkPeriods = {
  [key in `${TTimePeriod}_fact_work`]: number;
};

export type IFactNormTimePeriods = {
  [key in `${TTimePeriod}_fact_norm_time`]: number;
};

export type IFactTimePeriods = {
  [key in `${TTimePeriod}_fact_time`]: number;
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
  peoples: IWorkingManYearPlan[];
  data: IPprData[];
  corrections: TPprCorrections;
}

export type TPprCorrections = {
  peoples: { [id: string]: TCorrection<IPlanTimePeriods> | undefined };
  works: { [id: string]: TCorrection<IPlanWorkPeriods> | undefined };
};

export interface IPprDataWithRowSpan extends IPprData {
  rowSpan?: number;
}

export type TWorkPlanCorrection = {
  [id: string]: { [planPeriod in keyof IPlanWorkPeriods]?: number } | undefined;
};

export type TTransfer<T> = { fieldTo: keyof T; value: number; is_approved: boolean };

export type TCorrection<T> = {
  [fieldNameFrom in keyof T]?: {
    newValue: number;
    diff: number;
    transfers: TTransfer<T>[] | null;
  };
};

export interface IWorkingManYearPlan
  extends IPlanNormTimePeriods,
    IPlanTabelTimePeriods,
    IPlanTimePeriods,
    IFactTimePeriods {
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
