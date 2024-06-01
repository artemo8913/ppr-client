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
  TCorrectionTransfer,
} from "./model/ppr.schema";
export { planWorkPeriods, pprTableColumnsSet, planWorkPeriodsSet } from "./model/ppr.schema";
export { getPprTable, addPprTable, deletePprTable } from "./model/ppr.actions";
