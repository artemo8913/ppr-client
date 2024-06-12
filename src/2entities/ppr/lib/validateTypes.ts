import { IFactTimePeriods, IFactWorkPeriods, IPlanTimePeriods, IPlanWorkPeriods, IPprData } from "../model/ppr.schema";
import {
  factTimeFieldsSet,
  factWorkFieldsSet,
  planFactWorkFieldsSet,
  planTimeFieldsSet,
  planWorkFieldsSet,
  pprTableFieldsSet,
  workAndTimeFieldsSet,
} from "./constFields";

export function checkIsPprDataField(column: keyof IPprData | string): column is keyof IPprData {
  return pprTableFieldsSet.has(column);
}

export function checkIsPlanWorkField(column: keyof IPprData | string): column is keyof IPlanWorkPeriods {
  return planWorkFieldsSet.has(column);
}

export function checkIsFactWorkField(column: keyof IPprData | string): column is keyof IFactWorkPeriods {
  return factWorkFieldsSet.has(column);
}

export function checkIsPlanTimeField(column: keyof IPprData | string): column is keyof IPlanTimePeriods {
  return planTimeFieldsSet.has(column);
}

export function checkIsFactTimeField(column: keyof IPprData | string): column is keyof IFactTimePeriods {
  return factTimeFieldsSet.has(column);
}

export function checkIsPlanOrFactWorkField(
  column: keyof IPprData | string
): column is keyof IPlanWorkPeriods | keyof IFactWorkPeriods {
  return planFactWorkFieldsSet.has(column);
}

export function checkIsWorkOrTimeField(
  column: keyof IPprData | string
): column is keyof IPlanWorkPeriods | keyof IFactWorkPeriods {
  return workAndTimeFieldsSet.has(column);
}
