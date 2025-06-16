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
} from "../model/ppr.const";
import {
  IPprData,
  PlanWorkField,
  FactWorkField,
  PlanTimeField,
  FactTimeField,
  PlanNormTimeField,
  FactNormTimeField,
  PlanTabelTimeField,
} from "../model/ppr.types";

class PprFieldValidator {
  isPprData(field: any): field is keyof IPprData {
    return pprTableFieldsSet.has(field);
  }

  isPlanWork(field: any): field is PlanWorkField {
    return planWorkFieldsSet.has(field);
  }

  isFactWork(field: any): field is FactWorkField {
    return factWorkFieldsSet.has(field);
  }

  isPlanTime(field: any): field is PlanTimeField {
    return planTimeFieldsSet.has(field);
  }

  isFactTime(field: any): field is FactTimeField {
    return factTimeFieldsSet.has(field);
  }

  isPlanNormTime(field: any): field is PlanNormTimeField {
    return planNormTimeFieldsSet.has(field);
  }

  isFactNormTime(field: any): field is FactNormTimeField {
    return factNormTimeFieldsSet.has(field);
  }

  isPlanTabelTime(field: any): field is PlanTabelTimeField {
    return planTabelTimeFieldsSet.has(field);
  }

  isPlanOrFactWork(field: any): field is PlanWorkField | FactWorkField {
    return planFactWorkFieldsSet.has(field);
  }
  isWorkOrTime(field: any): field is PlanWorkField | PlanTimeField | FactWorkField | FactNormTimeField | FactTimeField {
    return workAndTimeFieldsSet.has(field);
  }
}

export const pprFieldValidator = new PprFieldValidator();
