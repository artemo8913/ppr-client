import { TimePeriod } from "@/1shared/lib/date";
import {
  IPprData,
  PlanValueField,
  PlanTimeField,
  FactValueField,
  FactTimeField,
  FactNormTimeField,
  PlanNormTimeField,
  PlanTabelTimeField,
} from "./ppr.types";
import {
  factNormTimeFieldsSet,
  factTimeFieldsSet,
  factWorkFieldsSet,
  factWorkToFactNormTimeFieldsPair,
  factWorkToPlanWorkFieldsPair,
  planFactWorkFieldsSet,
  planNormTimeFieldsSet,
  planNormTimeToPlanTabelTimeFieldsPair,
  planTabelTimeFieldsSet,
  planTabelTimeToPlanTimeFieldsPair,
  planTimeFieldsSet,
  planTimeToPlanWorkFieldsPair,
  planWorkFieldsSet,
  planWorkToPlanTimeFieldsPair,
  pprTableFieldsSet,
  workAndTimeFieldsSet,
} from "./ppr.const";

export class PprField {
  static getPlanWorkFieldByTimePeriod(timePeriod: TimePeriod): PlanValueField {
    return `${timePeriod}_plan_work`;
  }

  static getFactWorkFieldByTimePeriod(timePeriod: TimePeriod): FactValueField {
    return `${timePeriod}_fact_work`;
  }

  static getPlanTimeFieldByTimePeriod(timePeriod: TimePeriod): PlanTimeField {
    return `${timePeriod}_plan_time`;
  }

  static getPlanTabelTimeFieldByTimePeriod(timePeriod: TimePeriod): PlanTabelTimeField {
    return `${timePeriod}_plan_tabel_time`;
  }

  static getPlanNormTimeFieldByTimePeriod(timePeriod: TimePeriod): PlanNormTimeField {
    return `${timePeriod}_plan_norm_time`;
  }

  static getFactTimeFieldByTimePeriod(timePeriod: TimePeriod): FactTimeField {
    return `${timePeriod}_fact_time`;
  }

  static getFactNormTimeFieldByTimePeriod(timePeriod: TimePeriod): FactNormTimeField {
    return `${timePeriod}_fact_norm_time`;
  }

  static getByTimePeriod(timePeriod: TimePeriod) {
    return {
      planWorkField: this.getPlanWorkFieldByTimePeriod(timePeriod),
      planTimeField: this.getPlanTimeFieldByTimePeriod(timePeriod),
      planTabelTimeField: this.getPlanTabelTimeFieldByTimePeriod(timePeriod),
      planNormTimeField: this.getPlanNormTimeFieldByTimePeriod(timePeriod),
      factWorkField: this.getFactWorkFieldByTimePeriod(timePeriod),
      factNormTimeField: this.getFactNormTimeFieldByTimePeriod(timePeriod),
      factTimeField: this.getFactTimeFieldByTimePeriod(timePeriod),
    };
  }

  static isPprData(field: any): field is keyof IPprData {
    return pprTableFieldsSet.has(field);
  }

  static isPlanWork(field: any): field is PlanValueField {
    return planWorkFieldsSet.has(field);
  }

  static isFactWork(field: any): field is FactValueField {
    return factWorkFieldsSet.has(field);
  }

  static isPlanTime(field: any): field is PlanTimeField {
    return planTimeFieldsSet.has(field);
  }

  static isFactTime(field: any): field is FactTimeField {
    return factTimeFieldsSet.has(field);
  }

  static isPlanNormTime(field: any): field is PlanNormTimeField {
    return planNormTimeFieldsSet.has(field);
  }

  static isFactNormTime(field: any): field is FactNormTimeField {
    return factNormTimeFieldsSet.has(field);
  }

  static isPlanTabelTime(field: any): field is PlanTabelTimeField {
    return planTabelTimeFieldsSet.has(field);
  }

  static isPlanOrFactWork(field: any): field is PlanValueField | FactValueField {
    return planFactWorkFieldsSet.has(field);
  }
  static isWorkOrTime(
    field: any
  ): field is PlanValueField | PlanTimeField | FactValueField | FactNormTimeField | FactTimeField {
    return workAndTimeFieldsSet.has(field);
  }

  static getPlanTimeFieldByPlanWorkField(field: PlanValueField): PlanTimeField {
    return planWorkToPlanTimeFieldsPair[field];
  }

  static getFactTimeFieldByFactWorkField(field: FactValueField): FactNormTimeField {
    return factWorkToFactNormTimeFieldsPair[field];
  }

  static getPlanWorkFieldByPlanTimeField(field: PlanTimeField): PlanValueField {
    return planTimeToPlanWorkFieldsPair[field];
  }

  static getPlanWorkFieldByFactWorkField(field: FactValueField): PlanValueField {
    return factWorkToPlanWorkFieldsPair[field];
  }

  static getPlanTimeFieldByPlanTabelTimeField(field: PlanTabelTimeField): PlanTimeField {
    return planTabelTimeToPlanTimeFieldsPair[field];
  }

  static getPlanTabelTimeFieldByPlanNormTimeField(field: PlanNormTimeField): PlanTabelTimeField {
    return planNormTimeToPlanTabelTimeFieldsPair[field];
  }
}
