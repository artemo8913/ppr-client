export type {
  IPprData,
  IHandlePprData,
  IPpr,
  TAllMonthStatuses,
  TMonthPprStatus,
  TYearPprStatus,
  IWorkingManYearPlan,
  IFactNormTime,
  IFactTime,
  IFactWork,
  IPlanTime,
  IPlanWork,
  IWorkingManFactTimeValues,
  IWorkingManPlanTimeValues,
  TPprDataCorrection,
  TWorkPlanCorrection,
} from "./model/pprTable.schema";
export { planWorkPeriods } from "./model/pprTable.schema";
export { getPprTable, addPprTable, deletePprTable } from "./model/pprTable.actions";
