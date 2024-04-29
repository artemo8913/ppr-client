export type {
  IPprData,
  IHandlePprData,
  IPpr,
  TAllMonthStatuses,
  TMonthPprStatus,
  TYearPprStatus,
  IWorkingManYearPlan
} from "./model/pprTable.schema";
export { getPprTable, addPprTable, deletePprTable } from "./model/pprTable.actions";
