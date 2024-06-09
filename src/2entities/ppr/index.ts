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
  factWorkPeriods,
  factTimePeriods,
  getWorkToTimePlanFieldPair,
  getTimeToWorkPlanFieldPair,
  getWorkToTimeFactFieldPair,
} from "./lib/constFields";
export {
  checkIsColumnField,
  checkIsPlanFactWorkPeriodField,
  checkIsPlanWorkPeriodField,
  checkIsPlanTimePeriodField,
  checkIsWorkAndTimeColumnsFieldsSet,
  checkIsFactWorkPeriodField,
  checkIsFactTimePeriodField,
} from "./lib/validateTypes";
export { getPprTable, addPprTable, deletePprTable, getManyPprsShortInfo, updatePprTable } from "./model/ppr.actions";
