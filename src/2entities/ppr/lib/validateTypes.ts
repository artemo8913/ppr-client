import { IFactTimePeriods, IFactWorkPeriods, IPlanTimePeriods, IPlanWorkPeriods, IPprData } from "../model/ppr.schema";
import {
  factTimePeriodsSet,
  factWorkPeriodsSet,
  planFactWorkPeriodsSet,
  planTimePeriodsSet,
  planWorkPeriodsSet,
  pprTableColumnsSet,
  workAndTimeColumnsFieldsSet,
} from "./constFields";

export function checkIsColumnField(column: keyof IPprData | string): column is keyof IPprData {
  return pprTableColumnsSet.has(column);
}

export function checkIsPlanWorkPeriodField(column: keyof IPprData | string): column is keyof IPlanWorkPeriods {
  return planWorkPeriodsSet.has(column);
}

export function checkIsFactWorkPeriodField(column: keyof IPprData | string): column is keyof IFactWorkPeriods {
  return factWorkPeriodsSet.has(column);
}

export function checkIsPlanTimePeriodField(column: keyof IPprData | string): column is keyof IPlanTimePeriods {
  return planTimePeriodsSet.has(column);
}

export function checkIsFactTimePeriodField(column: keyof IPprData | string): column is keyof IFactTimePeriods {
  return factTimePeriodsSet.has(column);
}

export function checkIsPlanFactWorkPeriodField(
  column: keyof IPprData | string
): column is keyof IPlanWorkPeriods | keyof IFactWorkPeriods {
  return planFactWorkPeriodsSet.has(column);
}

export function checkIsWorkAndTimeColumnsFieldsSet(
  column: keyof IPprData | string
): column is keyof IPlanWorkPeriods | keyof IFactWorkPeriods {
  return workAndTimeColumnsFieldsSet.has(column);
}
