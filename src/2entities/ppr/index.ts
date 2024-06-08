export type {
  IPprData,
  IPprDataWithRowSpan,
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
  TPprCorrections,
  TCorrection,
  TWorkPlanCorrection,
  TCorrectionTransfer,
} from "./model/ppr.schema";
export {
  pprDataColumnsFields,
  planWorkPeriods,
  getPlanFieldPair,
  checkIsColumnField,
  checkIsPlanFactWorkPeriodField,
  checkIsPlanWorkPeriodField,
} from "./model/ppr.schema";
export { getPprTable, addPprTable, deletePprTable, getManyPprsShortInfo } from "./model/ppr.actions";
