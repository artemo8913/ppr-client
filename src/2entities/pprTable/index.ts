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
  TPprDataCorrection,
  TWorkPlanCorrection,
} from "./model/pprTable.schema";
export { planWorkPeriods, factWorkPeriods, planTimePeriods, factTimePeriods } from "./model/pprTable.schema";
export { getPprTable, addPprTable, deletePprTable } from "./model/pprTable.actions";
