import { Month } from "@/1shared/lib/date";
import { roundToFixed } from "@/1shared/lib/math/roundToFixed";

import {
  PlannedWorkWithCorrections,
  PlannedWorkId,
  PlannedWorkBasicData,
  PlanValueField,
  FactValueField,
  FactTimeField,
  WorkTransfer,
  PlanValueWithCorrection,
} from "../../model/ppr.types";
import {
  FACT_TIME_FIELDS,
  FACT_WORK_FIELDS,
  PLAN_WORK_FIELDS,
} from "../../model/ppr.const";
import { PprField } from "../../model/service/PprField";
import { createNewPprWorkInstance } from "../createNewPprWorkInstance";

/**
 * Сервис для работы с данными работ ППР.
 * Все функции чистые — принимают данные и возвращают новые данные.
 */
export const WorksService = {
  /**
   * Добавить работу в массив data.
   * Если указан nearWorkId, новая работа добавляется после указанной.
   * Иначе добавляется в конец массива.
   */
  addWork(
    data: PlannedWorkWithCorrections[],
    newWork: Partial<PlannedWorkWithCorrections>,
    nearWorkId?: PlannedWorkId
  ): PlannedWorkWithCorrections[] {
    let indexToPlace: number | null = null;

    for (let i = 0; i < data.length; i++) {
      if (data[i].id !== nearWorkId) {
        continue;
      }
      indexToPlace = i;
      break;
    }

    return indexToPlace !== null
      ? data
          .slice(0, indexToPlace + 1)
          .concat(createNewPprWorkInstance(newWork))
          .concat(data.slice(indexToPlace + 1))
      : data.concat(createNewPprWorkInstance(newWork));
  },

  /**
   * Скопировать работу с сохранением основных данных.
   * Новая работа вставляется сразу после оригинала.
   */
  copyWork(
    data: PlannedWorkWithCorrections[],
    id: PlannedWorkId
  ): PlannedWorkWithCorrections[] {
    let newWork: Partial<PlannedWorkWithCorrections> = {};
    let rowIndex: number = 0;

    const mappedData = data.map((pprData, index) => {
      if (pprData.id !== id) {
        return pprData;
      }

      rowIndex = index;

      newWork = {
        name: pprData?.name,
        common_work_id: pprData?.common_work_id,
        branch: pprData?.branch,
        subbranch: pprData?.subbranch,
        measure: pprData?.measure,
        periodicity_normal: pprData?.periodicity_normal,
        periodicity_fact: pprData?.periodicity_fact,
        norm_of_time: pprData?.norm_of_time,
        norm_of_time_document: pprData?.norm_of_time_document,
        unity: pprData?.unity,
        note: pprData?.note,
      };
      return pprData;
    });

    return mappedData
      .slice(0, rowIndex + 1)
      .concat(createNewPprWorkInstance(newWork))
      .concat(data.slice(rowIndex + 1));
  },

  /**
   * Удалить работу из массива по id.
   */
  deleteWork(
    data: PlannedWorkWithCorrections[],
    id: PlannedWorkId
  ): PlannedWorkWithCorrections[] {
    return data.filter((pprData) => pprData.id !== id);
  },

  /**
   * Редактировать базовые данные работы.
   * При изменении norm_of_time пересчитывает план-время и факт-время.
   */
  editWork(
    data: PlannedWorkWithCorrections[],
    workData: Partial<PlannedWorkBasicData>
  ): PlannedWorkWithCorrections[] {
    return data.map((pprData) => {
      if (pprData.id !== workData?.id) {
        return pprData;
      }

      const newPprData = { ...pprData, ...workData };

      for (const planWorkField of PLAN_WORK_FIELDS) {
        const planTimeField = PprField.getPlanTimeFieldByPlanWorkField(planWorkField);
        newPprData[planTimeField].original = roundToFixed(
          newPprData.norm_of_time * newPprData[planWorkField].original
        );
        newPprData[planTimeField].final = roundToFixed(
          newPprData.norm_of_time * newPprData[planWorkField].final
        );
      }

      for (const factWorkField of FACT_WORK_FIELDS) {
        const factTimeField = PprField.getFactTimeFieldByFactWorkField(factWorkField);
        newPprData[factTimeField] = roundToFixed(
          newPprData.norm_of_time * newPprData[factWorkField]
        );
      }

      return newPprData;
    });
  },

  /**
   * Обновить норму времени и пересчитать все связанные поля.
   */
  updateNormOfTime(
    data: PlannedWorkWithCorrections[],
    id: PlannedWorkId,
    value: number
  ): PlannedWorkWithCorrections[] {
    return data.map((pprData) => {
      if (pprData.id !== id) {
        return pprData;
      }

      const newPprData: PlannedWorkWithCorrections = { ...pprData };
      newPprData.norm_of_time = value;

      for (const planWorkField of PLAN_WORK_FIELDS) {
        const planTimeField = PprField.getPlanTimeFieldByPlanWorkField(planWorkField);
        newPprData[planTimeField].original = roundToFixed(
          newPprData.norm_of_time * newPprData[planWorkField].original
        );
        newPprData[planTimeField].final = roundToFixed(
          newPprData.norm_of_time * newPprData[planWorkField].final
        );
      }

      for (const factWorkField of FACT_WORK_FIELDS) {
        const factTimeField = PprField.getFactTimeFieldByFactWorkField(factWorkField);
        newPprData[factTimeField] = roundToFixed(
          newPprData.norm_of_time * newPprData[factWorkField]
        );
      }

      return newPprData;
    });
  },

  /**
   * Обновить плановый объём работ (при создании годового плана).
   * Пересчитывает годовой итог и план-время.
   */
  updatePlanWork(
    data: PlannedWorkWithCorrections[],
    id: PlannedWorkId,
    field: PlanValueField,
    value: number
  ): PlannedWorkWithCorrections[] {
    return data.map((pprData) => {
      if (pprData.id !== id) {
        return pprData;
      }

      const newPprData: PlannedWorkWithCorrections = { ...pprData };

      newPprData[field] = {
        ...pprData[field],
        original: value,
        final: value,
      };

      newPprData.year_plan_work.final = newPprData.year_plan_work.original = 0;

      for (const periodField of PLAN_WORK_FIELDS) {
        newPprData.year_plan_work.original += newPprData[periodField].original;
        newPprData.year_plan_work.final += newPprData[periodField].final;
      }

      newPprData.year_plan_work.original = roundToFixed(newPprData.year_plan_work.original);
      newPprData.year_plan_work.final = roundToFixed(newPprData.year_plan_work.final);

      const planTimeField = PprField.getPlanTimeFieldByPlanWorkField(field);

      newPprData[planTimeField].final = newPprData[planTimeField].original = roundToFixed(
        newPprData.norm_of_time * newPprData[field].original
      );
      newPprData.year_plan_time.final = newPprData.year_plan_time.original = roundToFixed(
        newPprData.norm_of_time * newPprData.year_plan_work.original
      );

      return newPprData;
    });
  },

  /**
   * Обновить фактический объём работ.
   * Пересчитывает годовой итог и факт-норм-время.
   */
  updateFactWork(
    data: PlannedWorkWithCorrections[],
    id: PlannedWorkId,
    field: FactValueField,
    value: number
  ): PlannedWorkWithCorrections[] {
    return data.map((pprData) => {
      if (pprData.id !== id) {
        return pprData;
      }

      const newPprData: PlannedWorkWithCorrections = { ...pprData };
      newPprData[field] = value;
      newPprData.year_fact_work = 0;

      for (const periodField of FACT_WORK_FIELDS) {
        newPprData.year_fact_work += newPprData[periodField];
      }

      newPprData.year_fact_work = roundToFixed(newPprData.year_fact_work);

      const factNormTimeField = PprField.getFactTimeFieldByFactWorkField(field);
      newPprData[factNormTimeField] = roundToFixed(newPprData.norm_of_time * newPprData[field]);
      newPprData.year_fact_norm_time = roundToFixed(
        newPprData.year_fact_work * newPprData.norm_of_time
      );

      return newPprData;
    });
  },

  /**
   * Обновить фактическое время работы.
   * Пересчитывает годовой итог.
   */
  updateFactWorkTime(
    data: PlannedWorkWithCorrections[],
    id: PlannedWorkId,
    field: FactTimeField,
    value: number
  ): PlannedWorkWithCorrections[] {
    return data.map((pprData) => {
      if (pprData.id !== id) {
        return pprData;
      }

      const newPprData: PlannedWorkWithCorrections = { ...pprData };
      newPprData[field] = value;
      newPprData.year_fact_time = 0;

      for (const periodField of FACT_TIME_FIELDS) {
        newPprData.year_fact_time += newPprData[periodField];
      }

      newPprData.year_fact_time = roundToFixed(newPprData.year_fact_time);

      return newPprData;
    });
  },

  /**
   * Обновить план работ вручную (при корректировке).
   * Сохраняет handCorrection и пересчитывает итоги.
   */
  updatePlanWorkValueByUser(
    data: PlannedWorkWithCorrections[],
    id: PlannedWorkId,
    field: PlanValueField,
    value: number
  ): PlannedWorkWithCorrections[] {
    return data.map((pprData) => {
      if (pprData.id !== id) {
        return pprData;
      }

      const newPprData: PlannedWorkWithCorrections = { ...pprData };

      newPprData[field] = {
        ...pprData[field],
        handCorrection: value,
        final: value,
      };

      newPprData.year_plan_work.final = 0;

      for (const periodField of PLAN_WORK_FIELDS) {
        newPprData.year_plan_work.final += newPprData[periodField].final;
      }

      newPprData.year_plan_work.final = roundToFixed(newPprData.year_plan_work.final);

      const planTimeField = PprField.getPlanTimeFieldByPlanWorkField(field);

      newPprData[planTimeField].final = roundToFixed(
        newPprData.norm_of_time * newPprData[field].final
      );
      newPprData.year_plan_time.final = roundToFixed(
        newPprData.norm_of_time * newPprData.year_plan_work.final
      );

      return newPprData;
    });
  },

  /**
   * Обновить простые данные работы (строки, числа).
   * Не подходит для обновления plan_work полей.
   */
  updatePprData(
    data: PlannedWorkWithCorrections[],
    id: PlannedWorkId,
    field: keyof PlannedWorkWithCorrections,
    value: string | number
  ): PlannedWorkWithCorrections[] {
    return data.map((pprData) => {
      let newValue: PlanValueWithCorrection | string | number = value;

      if (PprField.isPlanWork(field) || pprData.id !== id) {
        return pprData;
      }

      return {
        ...pprData,
        [field]: newValue,
      };
    });
  },

  /**
   * Обновить переносы работ между месяцами.
   * Пересчитывает final значения с учётом всех коррекций.
   */
  updateTransfers(
    data: PlannedWorkWithCorrections[],
    id: PlannedWorkId,
    field: PlanValueField,
    newTransfers: WorkTransfer[] | null,
    type: "plan" | "undone"
  ): PlannedWorkWithCorrections[] {
    return data.map((pprData) => {
      if (pprData.id !== id) {
        return pprData;
      }

      const newPprData: PlannedWorkWithCorrections = { ...pprData };

      const outsideCorrectionsSumByField: { [field in PlanValueField]?: number } = {};

      function handleTransfer(transfers: WorkTransfer[] | null): number {
        let sum = 0;
        transfers?.forEach((transfer) => {
          if (outsideCorrectionsSumByField[transfer.fieldTo]) {
            outsideCorrectionsSumByField[transfer.fieldTo]! += transfer.value;
          } else {
            outsideCorrectionsSumByField[transfer.fieldTo] = transfer.value;
          }
          sum += transfer.value;
        });
        return sum;
      }

      const transferType = type === "plan" ? "planTransfers" : "undoneTransfers";
      const transferSumType = type === "plan" ? "planTransfersSum" : "undoneTransfersSum";

      newPprData[field][transferType] = newTransfers;
      newPprData[field][transferSumType] =
        newTransfers?.reduce((sum, val) => sum + val.value, 0) || 0;

      for (const planWorkField of PLAN_WORK_FIELDS) {
        if (planWorkField === "year_plan_work") {
          newPprData.year_plan_work.final = 0;
          continue;
        }

        const planField = newPprData[planWorkField];

        handleTransfer(planField.planTransfers);
        handleTransfer(planField.undoneTransfers);

        planField.outsideCorrectionsSum = outsideCorrectionsSumByField[planWorkField] || 0;

        if (planField.handCorrection !== null) {
          planField.final = planField.handCorrection! - planField.undoneTransfersSum;
        } else {
          planField.final =
            planField.original +
            planField.outsideCorrectionsSum +
            planField.planTransfersSum -
            planField.undoneTransfersSum;
        }

        const planTimeField = PprField.getPlanTimeFieldByPlanWorkField(planWorkField);
        newPprData[planTimeField].final = roundToFixed(newPprData.norm_of_time * planField.final);
        newPprData.year_plan_work.final += planField.final;
      }

      newPprData.year_plan_time.final = roundToFixed(
        newPprData.norm_of_time * newPprData.year_plan_work.final
      );

      return newPprData;
    });
  },

  /**
   * Копировать нормативное время в фактическое для указанного месяца.
   * mode: "EVERY" - для всех работ, "NOT_FILLED" - только где факт пустой.
   */
  copyFactNormTimeToFactTime(
    data: PlannedWorkWithCorrections[],
    mode: "EVERY" | "NOT_FILLED",
    month: Month
  ): PlannedWorkWithCorrections[] {
    return data.map((pprData) => {
      const newPprData: PlannedWorkWithCorrections = { ...pprData };

      const factNormTimePeriod = PprField.getFactNormTimeFieldByTimePeriod(month);
      const factTimePeriod = PprField.getFactTimeFieldByTimePeriod(month);

      if (mode === "EVERY" || (mode === "NOT_FILLED" && !pprData[factTimePeriod])) {
        newPprData[factTimePeriod] = newPprData[factNormTimePeriod];

        newPprData.year_fact_time = 0;

        for (const periodField of FACT_TIME_FIELDS) {
          newPprData.year_fact_time += newPprData[periodField];
        }

        newPprData.year_fact_time = roundToFixed(newPprData.year_fact_time);
      }

      return newPprData;
    });
  },

  /**
   * Установить одно подразделение (unity) во всех работах.
   */
  setOneUnityInAllWorks(
    data: PlannedWorkWithCorrections[],
    unity: string
  ): PlannedWorkWithCorrections[] {
    return data.map((work) => ({ ...work, unity }));
  },

  /**
   * Переместить работу вниз (увеличить позицию).
   */
  increaseWorkPosition(
    data: PlannedWorkWithCorrections[],
    id: PlannedWorkId
  ): PlannedWorkWithCorrections[] {
    const workIndex = data.findIndex((pprData) => pprData.id === id);

    if (workIndex === -1 || workIndex === data.length - 1) {
      return data;
    }

    return data
      .slice(0, workIndex)
      .concat(data[workIndex + 1])
      .concat(data[workIndex])
      .concat(data.slice(workIndex + 2));
  },

  /**
   * Переместить работу вверх (уменьшить позицию).
   */
  decreaseWorkPosition(
    data: PlannedWorkWithCorrections[],
    id: PlannedWorkId
  ): PlannedWorkWithCorrections[] {
    const workIndex = data.findIndex((pprData) => pprData.id === id);

    if (workIndex === -1 || workIndex === 0) {
      return data;
    }

    return data
      .slice(0, workIndex - 1)
      .concat(data[workIndex])
      .concat(data[workIndex - 1])
      .concat(data.slice(workIndex + 1));
  },

  /**
   * Обновить подраздел (subbranch) для набора работ.
   */
  updateSubbranch(
    data: PlannedWorkWithCorrections[],
    newSubbranch: string,
    workIdsSet: Set<PlannedWorkId>
  ): PlannedWorkWithCorrections[] {
    return data.map((pprData) => {
      if (!workIdsSet.has(pprData.id)) {
        return pprData;
      }
      return { ...pprData, subbranch: newSubbranch };
    });
  },
};
