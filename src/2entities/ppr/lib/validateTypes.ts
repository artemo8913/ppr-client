import {
  IFactNormTimePeriods,
  IFactTimePeriods,
  IFactWorkPeriods,
  IPlanNormTimePeriods,
  IPlanTabelTimePeriods,
  IPlanTimePeriods,
  IPlanWorkPeriods,
  IPprData,
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

export function checkIsPlanWorkField(column: any): column is keyof IPlanWorkPeriods {
  return planWorkFieldsSet.has(column);
}

export function checkIsFactWorkField(column: any): column is keyof IFactWorkPeriods {
  return factWorkFieldsSet.has(column);
}

export function checkIsPlanTimeField(column: any): column is keyof IPlanTimePeriods {
  return planTimeFieldsSet.has(column);
}

export function checkIsFactTimeField(column: any): column is keyof IFactTimePeriods {
  return factTimeFieldsSet.has(column);
}

export function checkIsPlanNormTimeField(column: any): column is keyof IPlanNormTimePeriods {
  return planNormTimeFieldsSet.has(column);
}

export function checkIsFactNormTimeField(column: any): column is keyof IFactNormTimePeriods {
  return factNormTimeFieldsSet.has(column);
}

export function checkIsPlanTabelTimeField(column: any): column is keyof IPlanTabelTimePeriods {
  return planTabelTimeFieldsSet.has(column);
}

export function checkIsPlanOrFactWorkField(column: any): column is keyof IPlanWorkPeriods | keyof IFactWorkPeriods {
  return planFactWorkFieldsSet.has(column);
}

export function checkIsWorkOrTimeField(column: any): column is keyof IPlanWorkPeriods | keyof IFactWorkPeriods {
  return workAndTimeFieldsSet.has(column);
}
