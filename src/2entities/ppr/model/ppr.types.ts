import { User } from "@/2entities/user/@x/ppr";
import { Month, TimePeriod } from "@/1shared/lib/date";

export type YearPlanStatus =
  | "template"
  | "plan_creating"
  | "plan_on_agreement_engineer"
  | "plan_on_agreement_time_norm"
  | "plan_on_agreement_sub_boss"
  | "plan_on_aprove"
  | "in_process"
  | "done";

export type MonthPlanStatus =
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

export type AllMonthsPlansStatuses = {
  [month in Month]: MonthPlanStatus;
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

export interface PlanValueWithCorrection {
  original: number;
  handCorrection: number | null;
  final: number;
  outsideCorrectionsSum: number;
  planTransfersSum: number;
  planTransfers: WorkTransfer[] | null;
  undoneTransfersSum: number;
  undoneTransfers: WorkTransfer[] | null;
}

export interface PlanTimeWithCorrection {
  original: number;
  final: number;
}

export type AllPlanValuesWithCorrections = {
  [key in PlanValueField]: PlanValueWithCorrection;
};

export type AllPlanValues = {
  [key in PlanValueField]: number;
};

export type AllFactValues = {
  [key in FactValueField]: number;
};

export type AllPlanNormTimes = {
  [key in PlanNormTimeField]: number;
};

export type AllPlanTabelTimes = {
  [key in PlanTabelTimeField]: number;
};

export type AllPlanTimesWithCorrections = {
  [key in PlanTimeField]: PlanTimeWithCorrection;
};

export type AllPlanTimes = {
  [key in PlanTimeField]: number;
};

export type AllFactNormTimes = {
  [key in FactNormTimeField]: number;
};

export type AllFactTimes = {
  [key in FactTimeField]: number;
};

export type PlannedWorkTotalTimes = Partial<AllPlanTimes> & Partial<AllFactNormTimes> & Partial<AllFactTimes>;

export type WorkingMansTotalTimes = Partial<AllPlanNormTimes> &
  Partial<AllPlanTabelTimes> &
  Partial<AllPlanTimes> &
  Partial<AllFactTimes>;

export type PlannedWorksAndWorkingMansTotalTimes = {
  works: PlannedWorkTotalTimes;
  workingMans: WorkingMansTotalTimes;
};

interface YearPlanInvolvedDivisions {
  idDirection: number | null;
  idDistance: number | null;
  idSubdivision: number | null;
  directionShortName?: string | null;
  distanceShortName?: string | null;
  subdivisionShortName?: string | null;
}

interface PlannedWorksAndWorkingMans {
  data: PlannedWorkWithCorrections[];
  workingMans: PlannedWorkingMans[];
  raports_notes: ReportsNotes;
}

export interface YearPlanBasicData extends YearPlanInvolvedDivisions {
  id: number;
  name: string;
  year: number;
  created_by: User;
  created_at: Date;
  status: YearPlanStatus;
  months_statuses: AllMonthsPlansStatuses;
}

export interface YearPlan extends YearPlanBasicData, PlannedWorksAndWorkingMans {}

export type PlannedWorkingManId = number | string;

export interface PlannedWorkingMans extends AllPlanNormTimes, AllPlanTabelTimes, AllPlanTimes, AllFactTimes {
  id: PlannedWorkingManId;
  full_name: string;
  work_position: string;
  participation: number;
  is_working_man_aproved: boolean;
}

export type PlannedWorkBranch = "exploitation" | "additional" | "unforeseen";

export type PlannedWorkId = number | string;

export interface PlannedWorkBasicData {
  id: PlannedWorkId;
  common_work_id: number | null;
  is_work_aproved: boolean;
  branch: PlannedWorkBranch;
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

export interface PlannedWorkWithCorrections
  extends PlannedWorkBasicData,
    AllPlanValuesWithCorrections,
    AllPlanTimesWithCorrections,
    AllFactValues,
    AllFactNormTimes,
    AllFactTimes {}

export interface PlannedWork
  extends PlannedWorkBasicData,
    AllPlanValues,
    AllPlanTimes,
    AllFactValues,
    AllFactNormTimes,
    AllFactTimes {}
