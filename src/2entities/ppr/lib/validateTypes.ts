import {
  IPprData,
  TPlanWorkPeriods,
  TFactWorkPeriods,
  TPlanTimePeriods,
  TFactTimePeriods,
  TPlanNormTimePeriods,
  TFactNormTimePeriods,
  TPlanTabelTimePeriods,
} from "../model/ppr.schema";
import {
  factNormTimeFieldsSet,
  factTimeFieldsSet,
  factWorkFieldsSet,
  planFactWorkFieldsSet,
  planNormTimeFieldsSet,
  planTabelTimeFieldsSet,
  planTimeFieldsSet,
  planWorkFieldsSet,
  pprTableFieldsSet,
  workAndTimeFieldsSet,
} from "./constFields";

export function checkIsPprDataField(column: any): column is keyof IPprData {
  return pprTableFieldsSet.has(column);
}

export function checkIsPlanWorkField(column: any): column is TPlanWorkPeriods {
  return planWorkFieldsSet.has(column);
}

export function checkIsFactWorkField(column: any): column is TFactWorkPeriods {
  return factWorkFieldsSet.has(column);
}

export function checkIsPlanTimeField(column: any): column is TPlanTimePeriods {
  return planTimeFieldsSet.has(column);
}

export function checkIsFactTimeField(column: any): column is TFactTimePeriods {
  return factTimeFieldsSet.has(column);
}

export function checkIsPlanNormTimeField(column: any): column is TPlanNormTimePeriods {
  return planNormTimeFieldsSet.has(column);
}

export function checkIsFactNormTimeField(column: any): column is TFactNormTimePeriods {
  return factNormTimeFieldsSet.has(column);
}

export function checkIsPlanTabelTimeField(column: any): column is TPlanTabelTimePeriods {
  return planTabelTimeFieldsSet.has(column);
}

export function checkIsPlanOrFactWorkField(column: any): column is TPlanWorkPeriods | TFactWorkPeriods {
  return planFactWorkFieldsSet.has(column);
}

export function checkIsWorkOrTimeField(
  column: any
): column is TPlanWorkPeriods | TPlanTimePeriods | TFactWorkPeriods | TFactNormTimePeriods | TFactTimePeriods {
  return workAndTimeFieldsSet.has(column);
}
