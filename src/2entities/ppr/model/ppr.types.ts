import { IUser } from "@/2entities/user/@x/ppr";
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

type TReportsNotes = {
  [month in TMonth]: string;
};

export type TTransfer = { fieldTo: keyof TPlanWorkPeriodsFields; value: number };
//TODO: переименовать Periods в Fields
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
}

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
  //TODO: переименовать в working mans
  peoples: TWorkingManFieldsTotalValues;
  works: TPprDataFieldsTotalValues;
};

export interface IPpr {
  id: number;
  name: string;
  year: number;
  status: TYearPprStatus;
  created_at: Date;
  created_by: IUser;
  months_statuses: TAllMonthStatuses;
  raports_notes: TReportsNotes;
  idDirection: number | null;
  idDistance: number | null;
  idSubdivision: number | null;
  workingMans: IWorkingManYearPlan[];
  data: IPprData[];
  directionShortName?: string | null;
  distanceShortName?: string | null;
  subdivisionShortName?: string | null;
}

export type TPprShortInfo = Omit<IPpr, "data" | "workingMans" | "total_fields_value" | "raports_notes">;

export interface IPprDataWithRowSpan extends IPprData {
  rowSpan?: number;
}

export type TWorkingManId = number | string;

export interface IWorkingManYearPlan
  extends TPlanNormTimePeriodsFields,
    TPlanTabelTimePeriodsFields,
    TPlanTimePeriodsFields,
    TFactTimePeriodsFields {
  id: TWorkingManId;
  full_name: string;
  work_position: string;
  participation: number;
  is_working_man_aproved: boolean;
}

export type TWorkBranch = "exploitation" | "additional" | "unforeseen";

export type TPprDataWorkId = number | string;

export interface IPprBasicData {
  id: TPprDataWorkId;
  common_work_id: number | null;
  is_work_aproved: boolean;
  branch: TWorkBranch;
  subbranch: string;
  note: string;
  name: string;
  measure: string;
  periodicity_normal: string;
  periodicity_fact: string;
  norm_of_time: number;
  norm_of_time_document: string;
  location: string;
  line_class: string;
  total_count: string;
  entry_year: string;
  last_maintenance_year: string;
  unity: string;
}

export interface IPprData
  extends IPprBasicData,
    TPlanWorkPeriodsFields,
    TWorkPlanTimePeriodsFields,
    TFactWorkPeriodsFields,
    TFactNormTimePeriodsFields,
    TFactTimePeriodsFields {}
