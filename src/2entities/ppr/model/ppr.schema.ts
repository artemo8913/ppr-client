import { IUser } from "../../user";
import { TMonth, TTimePeriod } from "@/1shared/lib/date";

export type TYearPprStatus =
  | "template"
  | "plan_creating"
  | "plan_on_agreement_engineer"
  | "plan_on_agreement_time_norm"
  | "plan_on_agreement_sub_boss"
  | "plan_on_aprove"
  | "in_process"
  | "done";

export type TMonthPprStatus =
  | "none"
  | "plan_creating"
  | "plan_on_agreement_engineer"
  | "plan_on_agreement_time_norm"
  | "plan_on_aprove"
  | "in_process"
  | "fact_filling"
  | "fact_verification_engineer"
  | "fact_verification_time_norm"
  | "fact_on_agreement_sub_boss"
  | "done";

export type TAllMonthStatuses = {
  [month in TMonth]: TMonthPprStatus;
};

export type TTransfer = { fieldTo: keyof TPlanWorkPeriodsFields; value: number };

export type TPlanWorkPeriods = `${TTimePeriod}_plan_work`;
export type TFactWorkPeriods = `${TTimePeriod}_fact_work`;
export type TPlanNormTimePeriods = `${TTimePeriod}_plan_norm_time`;
export type TPlanTabelTimePeriods = `${TTimePeriod}_plan_tabel_time`;
export type TPlanTimePeriods = `${TTimePeriod}_plan_time`;
export type TFactNormTimePeriods = `${TTimePeriod}_fact_norm_time`;
export type TFactTimePeriods = `${TTimePeriod}_fact_time`;

export interface IPlanWorkValues {
  original: number;
  handCorrection: number | null;
  final: number;
  outsideCorrectionsSum: number;
  planTransfersSum: number;
  planTransfers: TTransfer[] | null;
  undoneTransfersSum: number;
  undoneTransfers: TTransfer[] | null;
}

export interface TPlanTimeValues {
  original: number;
  final: number;
};

export type TPlanWorkPeriodsFields = {
  [key in TPlanWorkPeriods]: IPlanWorkValues;
};

export type TFactWorkPeriodsFields = {
  [key in TFactWorkPeriods]: number;
};

export type TPlanNormTimePeriodsFields = {
  [key in TPlanNormTimePeriods]: number;
};

export type TPlanTabelTimePeriodsFields = {
  [key in TPlanTabelTimePeriods]: number;
};
/**Поля месячных и годовых планируемых трудозатрат (для работ)*/
export type TWorkPlanTimePeriodsFields = {
  [key in TPlanTimePeriods]: TPlanTimeValues;
};
/**Поля месячных и годовых планируемых трудозатрат (для людей)*/
export type TPlanTimePeriodsFields = {
  [key in TPlanTimePeriods]: number;
};

export type TFactNormTimePeriodsFields = {
  [key in TFactNormTimePeriods]: number;
};

export type TFactTimePeriodsFields = {
  [key in TFactTimePeriods]: number;
};

export type TPprDataFieldsTotalValues = Partial<TPlanTimePeriodsFields> &
  Partial<TFactNormTimePeriodsFields> &
  Partial<TFactTimePeriodsFields>;

export type TWorkingManFieldsTotalValues = Partial<TPlanNormTimePeriodsFields> &
  Partial<TPlanTabelTimePeriodsFields> &
  Partial<TPlanTimePeriodsFields> &
  Partial<TFactTimePeriodsFields>;

export type TTotalFieldsValues = {
  peoples: TWorkingManFieldsTotalValues;
  works: TPprDataFieldsTotalValues;
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
  total_fields_value: TTotalFieldsValues;
}

export interface IPprDataWithRowSpan extends IPprData {
  rowSpan?: number;
}

export interface IWorkingManYearPlan
  extends TPlanNormTimePeriodsFields,
    TPlanTabelTimePeriodsFields,
    TPlanTimePeriodsFields,
    TFactTimePeriodsFields {
  id: string;
  full_name: string;
  work_position: string;
  participation: number;
}

export interface IPprData
  extends TPlanWorkPeriodsFields,
    TWorkPlanTimePeriodsFields,
    TFactWorkPeriodsFields,
    TFactNormTimePeriodsFields,
    TFactTimePeriodsFields {
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
