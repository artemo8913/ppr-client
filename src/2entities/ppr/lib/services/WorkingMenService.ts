import { roundToFixed } from "@/1shared/lib/math/roundToFixed";

import {
  PlannedWorkingMans,
  PlannedWorkingManId,
  PlanNormTimeField,
  PlanTabelTimeField,
  FactTimeField,
} from "../../model/ppr.types";
import {
  FACT_TIME_FIELDS,
  PLAN_NORM_TIME_FIELDS,
  PLAN_TABEL_TIME_FIELDS,
} from "../../model/ppr.const";
import { PprField } from "../../model/service/PprField";
import { createNewWorkingManInstance } from "../createNewWorkingManInstance";

/**
 * Сервис для работы с данными работников ППР.
 * Все функции чистые — принимают данные и возвращают новые данные.
 */
export const WorkingMenService = {
  /**
   * Добавить работника в список.
   * Если указан nearWorkingManId, новый работник добавляется после указанного.
   * Иначе добавляется в конец списка.
   */
  addWorkingMan(
    workingMans: PlannedWorkingMans[],
    nearWorkingManId?: PlannedWorkingManId
  ): PlannedWorkingMans[] {
    let indexToPlace: number | null = null;

    for (let i = 0; i < workingMans.length; i++) {
      if (workingMans[i].id !== nearWorkingManId) {
        continue;
      }
      indexToPlace = i;
      break;
    }

    return indexToPlace !== null
      ? workingMans
          .slice(0, indexToPlace + 1)
          .concat(createNewWorkingManInstance())
          .concat(workingMans.slice(indexToPlace + 1))
      : workingMans.concat(createNewWorkingManInstance());
  },

  /**
   * Удалить работника из списка по id.
   */
  deleteWorkingMan(
    workingMans: PlannedWorkingMans[],
    id: PlannedWorkingManId
  ): PlannedWorkingMans[] {
    return workingMans.filter((man) => man.id !== id);
  },

  /**
   * Обновить данные работника по индексу строки.
   */
  updateWorkingMan(
    workingMans: PlannedWorkingMans[],
    rowIndex: number,
    field: keyof PlannedWorkingMans,
    value: unknown
  ): PlannedWorkingMans[] {
    return workingMans.map((man, arrayIndex) => {
      if (arrayIndex === rowIndex) {
        return {
          ...man,
          [field]: value,
        };
      }
      return man;
    });
  },

  /**
   * Обновить план нормативного времени работника.
   * Пересчитывает годовой итог.
   */
  updateWorkingManPlanNormTime(
    workingMans: PlannedWorkingMans[],
    rowIndex: number,
    field: PlanNormTimeField,
    value: number
  ): PlannedWorkingMans[] {
    const correctedWorkingMan = { ...workingMans[rowIndex] };
    correctedWorkingMan[field] = value;
    correctedWorkingMan.year_plan_norm_time = 0;

    for (const planNormPeriod of PLAN_NORM_TIME_FIELDS) {
      if (planNormPeriod === "year_plan_norm_time") {
        continue;
      }
      correctedWorkingMan.year_plan_norm_time += correctedWorkingMan[planNormPeriod];
    }

    return workingMans.map((man, index) => {
      if (rowIndex === index) {
        return { ...correctedWorkingMan };
      }
      return man;
    });
  },

  /**
   * Обновить план табельного времени работника.
   * Пересчитывает годовой итог и plan_time с учётом participation.
   */
  updateWorkingManPlanTabelTime(
    workingMans: PlannedWorkingMans[],
    rowIndex: number,
    field: PlanTabelTimeField,
    value: number
  ): PlannedWorkingMans[] {
    const correctedWorkingMan = { ...workingMans[rowIndex] };
    correctedWorkingMan[field] = value;
    correctedWorkingMan.year_plan_tabel_time = 0;

    for (const planTabelPeriod of PLAN_TABEL_TIME_FIELDS) {
      if (planTabelPeriod === "year_plan_tabel_time") {
        continue;
      }
      correctedWorkingMan.year_plan_tabel_time += correctedWorkingMan[planTabelPeriod];

      const planTimePeriod = PprField.getPlanTimeFieldByPlanTabelTimeField(planTabelPeriod);

      correctedWorkingMan[planTimePeriod] = roundToFixed(
        correctedWorkingMan.participation * correctedWorkingMan[planTabelPeriod]
      );
    }

    correctedWorkingMan.year_plan_time = roundToFixed(
      correctedWorkingMan.participation * correctedWorkingMan.year_plan_tabel_time
    );

    return workingMans.map((man, index) => {
      if (rowIndex === index) {
        return { ...correctedWorkingMan };
      }
      return man;
    });
  },

  /**
   * Обновить фактическое время работника.
   * Пересчитывает годовой итог.
   */
  updateWorkingManFactTime(
    workingMans: PlannedWorkingMans[],
    rowIndex: number,
    field: FactTimeField,
    value: number
  ): PlannedWorkingMans[] {
    const correctedWorkingMan = { ...workingMans[rowIndex] };
    correctedWorkingMan[field] = value;
    correctedWorkingMan.year_fact_time = 0;

    for (const factPeriod of FACT_TIME_FIELDS) {
      if (factPeriod === "year_fact_time") {
        continue;
      }
      correctedWorkingMan.year_fact_time += correctedWorkingMan[factPeriod];
    }

    return workingMans.map((man, index) => {
      if (rowIndex === index) {
        return { ...correctedWorkingMan };
      }
      return man;
    });
  },

  /**
   * Обновить коэффициент участия работника.
   * Пересчитывает plan_time для всех месяцев.
   */
  updateWorkingManParticipation(
    workingMans: PlannedWorkingMans[],
    rowIndex: number,
    value: number
  ): PlannedWorkingMans[] {
    const correctedWorkingMan = { ...workingMans[rowIndex] };
    correctedWorkingMan.participation = value;

    for (const planTabelPeriod of PLAN_TABEL_TIME_FIELDS) {
      const planTimePeriod = PprField.getPlanTimeFieldByPlanTabelTimeField(planTabelPeriod);
      correctedWorkingMan[planTimePeriod] = roundToFixed(
        correctedWorkingMan.participation * correctedWorkingMan[planTabelPeriod]
      );
    }

    return workingMans.map((man, index) => {
      if (rowIndex === index) {
        return { ...correctedWorkingMan };
      }
      return man;
    });
  },
};
