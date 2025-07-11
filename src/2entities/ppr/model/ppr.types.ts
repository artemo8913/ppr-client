import { User } from "@/2entities/user/@x/ppr";
import { Month, TimePeriod } from "@/1shared/lib/date";

export type YearPprStatus =
  | "template"
  | "plan_creating"
  | "plan_on_agreement_engineer"
  | "plan_on_agreement_time_norm"
  | "plan_on_agreement_sub_boss"
  | "plan_on_aprove"
  | "in_process"
  | "done";

export type MonthPprStatus =
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

export type AllMonthStatuses = {
  [month in Month]: MonthPprStatus;
};

type ReportsNotes = {
  [month in Month]: string;
};

export type WorkTransfer = { fieldTo: PlanValueField; value: number };

export type PlanValueField = `${TimePeriod}_plan_work`;
export type FactValueField = `${TimePeriod}_fact_work`;
export type PlanNormTimeField = `${TimePeriod}_plan_norm_time`;
export type PlanTabelTimeField = `${TimePeriod}_plan_tabel_time`;
export type PlanTimeField = `${TimePeriod}_plan_time`;
export type FactNormTimeField = `${TimePeriod}_fact_norm_time`;
export type FactTimeField = `${TimePeriod}_fact_time`;

export interface PlanWork {
  original: number;
  handCorrection: number | null;
  final: number;
  outsideCorrectionsSum: number;
  planTransfersSum: number;
  planTransfers: WorkTransfer[] | null;
  undoneTransfersSum: number;
  undoneTransfers: WorkTransfer[] | null;
}

export interface PlanTime {
  original: number;
  final: number;
}
//TODO: как-то переименовать или удалить в связи с использованием только в actions
export type TPlanWorkPeriodsFields = {
  [key in PlanValueField]: PlanWork;
};

export type TPlanWorkPeriodsFieldsNumber = {
  [key in PlanValueField]: number;
};

export type TFactWorkPeriodsFields = {
  [key in FactValueField]: number;
};

export type TPlanNormTimePeriodsFields = {
  [key in PlanNormTimeField]: number;
};

export type TPlanTabelTimePeriodsFields = {
  [key in PlanTabelTimeField]: number;
};
/**Поля месячных и годовых планируемых трудозатрат (для работ)*/
export type TWorkPlanTimePeriodsFields = {
  [key in PlanTimeField]: PlanTime;
};
/**Поля месячных и годовых планируемых трудозатрат (для людей)*/
export type TPlanTimePeriodsFields = {
  [key in PlanTimeField]: number;
};

export type TFactNormTimePeriodsFields = {
  [key in FactNormTimeField]: number;
};

export type TFactTimePeriodsFields = {
  [key in FactTimeField]: number;
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

export interface Ppr {
  id: number;
  name: string;
  year: number;
  status: YearPprStatus;
  created_at: Date;
  created_by: User;
  months_statuses: AllMonthStatuses;
  raports_notes: ReportsNotes;
  idDirection: number | null;
  idDistance: number | null;
  idSubdivision: number | null;
  workingMans: IWorkingManYearPlan[];
  data: IPprData[];
  directionShortName?: string | null;
  distanceShortName?: string | null;
  subdivisionShortName?: string | null;
}

export type PprShortInfo = Omit<Ppr, "data" | "workingMans" | "total_fields_value" | "raports_notes">;

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

export type PlannedWorkId = number | string;

export interface IPprBasicData {
  id: PlannedWorkId;
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

export interface IPprDataWithSimpleDataStructure
  extends IPprBasicData,
    TPlanWorkPeriodsFieldsNumber,
    TPlanTimePeriodsFields,
    TFactWorkPeriodsFields,
    TFactNormTimePeriodsFields,
    TFactTimePeriodsFields {}
