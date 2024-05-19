export type {
  IPprData,
  IHandlePprData,
  IPpr,
  TAllMonthStatuses,
  TMonthPprStatus,
  TYearPprStatus,
  IWorkingManYearPlan,
  IFactNormTimePeriods,
  IFactTimePeriods,
  IFactWorkPeriods,
  IPlanTimePeriods,
  IPlanWorkPeriods,
  TPprDataCorrection,
  TWorkPlanCorrection,
} from "./model/pprTable.schema";
export { planWorkPeriods, factWorkPeriods, planTimePeriods, factTimePeriods } from "./model/pprTable.schema";
export { getPprTable, addPprTable, deletePprTable } from "./model/pprTable.actions";
