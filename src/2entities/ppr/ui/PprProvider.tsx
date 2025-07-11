"use client";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from "react";

import { Month } from "@/1shared/lib/date";
import { roundToFixed } from "@/1shared/lib/math/roundToFixed";

import {
  YearPlan,
  PlannedWorkWithCorrections,
  PlanValueWithCorrection,
  WorkTransfer,
  FactTimeField,
  PlannedWorkId,
  PlannedWorkingManId,
  PlannedWorkBasicData,
  FactValueField,
  PlanValueField,
  PlanNormTimeField,
  PlanTabelTimeField,
  PlannedWorkingMans,
} from "../model/ppr.types";
import { createNewPprWorkInstance } from "../lib/createNewPprWorkInstance";
import { createNewWorkingManInstance } from "../lib/createNewWorkingManInstance";
import { createPprMeta, IPprMeta } from "../lib/createPprMeta";
import { PprField } from "../model/PprField";
import {
  FACT_TIME_FIELDS,
  FACT_WORK_FIELDS,
  PLAN_WORK_FIELDS,
  PLAN_NORM_TIME_FIELDS,
  PLAN_TABEL_TIME_FIELDS,
} from "../model/ppr.const";

interface IPprContext {
  ppr: YearPlan | null;
  addWork: (newWork: Partial<PlannedWorkWithCorrections>, nearWorkId?: PlannedWorkId) => void;
  copyWork: (id: PlannedWorkId) => void;
  deleteWork: (id: PlannedWorkId) => void;
  editWork: (workData: Partial<PlannedWorkBasicData>) => void;
  copyFactNormTimeToFactTime: (mode: "EVERY" | "NOT_FILLED", month: Month) => void;
  updatePprTableCell: (id: PlannedWorkId, field: keyof PlannedWorkWithCorrections, value: string, isWorkAproved?: boolean) => void;
  updateTransfers: (
    id: PlannedWorkId,
    field: PlanValueField,
    newTransfers: WorkTransfer[] | null,
    type: "plan" | "undone"
  ) => void;
  setOneUnityInAllWorks: (unity: string) => void;
  increaseWorkPosition: (id: PlannedWorkId) => void;
  decreaseWorkPosition: (id: PlannedWorkId) => void;
  updateSubbranch: (newSubbranch: string, workIdsSet: Set<PlannedWorkId>) => void;
  addWorkingMan: (nearWorkingManId?: PlannedWorkingManId) => void;
  deleteWorkingMan: (id: PlannedWorkingManId) => void;
  updateWorkingMan: (rowIndex: number, field: keyof PlannedWorkingMans, value: unknown) => void;
  updateWorkingManPlanNormTime: (rowIndex: number, field: PlanNormTimeField, value: number) => void;
  updateWorkingManPlanTabelTime: (rowIndex: number, field: PlanTabelTimeField, value: number) => void;
  updateWorkingManFactTime: (rowIndex: number, field: FactTimeField, value: number) => void;
  updateWorkingManParticipation: (rowIndex: number, value: number) => void;
  updateRaportNote: (note: string, month: Month) => void;
  pprMeta: IPprMeta;
}

const PprContext = createContext<IPprContext>({
  ppr: null,
  addWork: () => {},
  copyWork: () => {},
  deleteWork: () => {},
  editWork: () => {},
  copyFactNormTimeToFactTime: () => {},
  updatePprTableCell: () => {},
  updateTransfers: () => {},
  setOneUnityInAllWorks: () => {},
  increaseWorkPosition: () => {},
  decreaseWorkPosition: () => {},
  updateSubbranch: () => {},
  addWorkingMan: () => {},
  updateWorkingMan: () => {},
  deleteWorkingMan: () => {},
  updateWorkingManPlanNormTime: () => {},
  updateWorkingManPlanTabelTime: () => {},
  updateWorkingManFactTime: () => {},
  updateWorkingManParticipation: () => [],
  updateRaportNote: () => {},
  pprMeta: {
    worksRowSpan: [],
    branchesMeta: [],
    subbranchesList: [],
    worksOrder: {},
    branchesAndSubbrunchesOrder: {},
    totalValues: { final: { workingMans: {}, works: {} }, original: { workingMans: {}, works: {} } },
  },
});

export const usePpr = () => useContext(PprContext);

interface IPprProviderProps extends PropsWithChildren {
  pprFromResponce: YearPlan;
}

export const PprProvider: FC<IPprProviderProps> = ({ children, pprFromResponce }) => {
  //Данные ППРа
  const [ppr, setPpr] = useState<YearPlan | null>(null);

  /**Добавить работу в ППР */
  const addWork = useCallback((newWork: Partial<PlannedWorkWithCorrections>, nearWorkId?: PlannedWorkId) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      let indexToPlace: number | null = null;

      for (let i = 0; i < prev.data.length; i++) {
        if (prev.data[i].id !== nearWorkId) {
          continue;
        }
        indexToPlace = i;
        break;
      }

      return {
        ...prev,
        data:
          indexToPlace !== null
            ? prev.data
                .slice(0, indexToPlace + 1)
                .concat(createNewPprWorkInstance(newWork))
                .concat(prev.data.slice(indexToPlace + 1))
            : prev.data.concat(createNewPprWorkInstance(newWork)),
      };
    });
  }, []);

  const copyWork = useCallback((id: PlannedWorkId) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      let newWork: Partial<PlannedWorkWithCorrections> = {};
      let rowIndex: number = 0;
      return {
        ...prev,
        data: prev.data
          .map((pprData, index) => {
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
          })
          .slice(0, rowIndex + 1)
          .concat(createNewPprWorkInstance(newWork))
          .concat(prev.data.slice(rowIndex + 1)),
      };
    });
  }, []);

  const editWork = useCallback((workData: Partial<PlannedWorkBasicData>) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        data: prev.data.map((pprData) => {
          if (pprData.id !== workData?.id) {
            return pprData;
          }

          const newPprData = { ...pprData, ...workData };

          //TODO: вынести в отдельную функцию расчет чел.-ч
          for (const planWorkField of PLAN_WORK_FIELDS) {
            const planTimeField = PprField.getPlanTimeFieldByPlanWorkField(planWorkField);
            newPprData[planTimeField].original = roundToFixed(
              newPprData.norm_of_time * newPprData[planWorkField].original
            );
            newPprData[planTimeField].final = roundToFixed(newPprData.norm_of_time * newPprData[planWorkField].final);
          }

          for (const factWorkField of FACT_WORK_FIELDS) {
            const factTimeField = PprField.getFactTimeFieldByFactWorkField(factWorkField);
            newPprData[factTimeField] = roundToFixed(newPprData.norm_of_time * newPprData[factWorkField]);
          }

          return newPprData;
        }),
      };
    });
  }, []);

  /**Убрать работу из ППР */
  const deleteWork = useCallback((id: PlannedWorkId) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        data: prev.data.filter((pprData) => pprData.id !== id),
      };
    });
  }, []);

  /**Обновить значение нормы времени */
  const updateNormOfTime = useCallback((id: PlannedWorkId, value: unknown) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        data: prev.data.map((pprData) => {
          if (pprData.id !== id) {
            return pprData;
          }

          const newPprData: PlannedWorkWithCorrections = { ...pprData };

          newPprData.norm_of_time = Number(value);

          for (const planWorkField of PLAN_WORK_FIELDS) {
            const planTimeField = PprField.getPlanTimeFieldByPlanWorkField(planWorkField);
            newPprData[planTimeField].original = roundToFixed(
              newPprData.norm_of_time * newPprData[planWorkField].original
            );
            newPprData[planTimeField].final = roundToFixed(newPprData.norm_of_time * newPprData[planWorkField].final);
          }

          for (const factWorkField of FACT_WORK_FIELDS) {
            const factTimeField = PprField.getFactTimeFieldByFactWorkField(factWorkField);
            newPprData[factTimeField] = roundToFixed(newPprData.norm_of_time * newPprData[factWorkField]);
          }

          return newPprData;
        }),
      };
    });
  }, []);

  /**Обновить значение запланированного объема работ. Функция должна использоваться при создании годового плана или же добавлении новой работы при месячном планировании  */
  const updatePlanWork = useCallback((id: PlannedWorkId, field: PlanValueField, value: number) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        data: prev.data.map((pprData) => {
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
        }),
      };
    });
  }, []);

  const updateFactWork = useCallback((id: PlannedWorkId, field: FactValueField, value: number) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        data: prev.data.map((pprData) => {
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
          newPprData.year_fact_norm_time = roundToFixed(newPprData.year_fact_work * newPprData.norm_of_time);

          return newPprData;
        }),
      };
    });
  }, []);

  const updateFactWorkTime = useCallback((id: PlannedWorkId, field: FactTimeField, value: number) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        data: prev.data.map((pprData) => {
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
        }),
      };
    });
  }, []);

  //TODO: сделать единую функцию для перерасчета итоговых значений по годовым столбцам. Функция будет считать сразу и объемы, и чел.-ч
  //везде, где надо

  const copyFactNormTimeToFactTime = useCallback((mode: "EVERY" | "NOT_FILLED", month: Month) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        data: prev.data.map((pprData) => {
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
        }),
      };
    });
  }, []);

  /**Обновить данные ППРа. Функция используется для обновления ячеек с простыми типами данных (строки, числа). Функция не подходит для обновления данных планов ППРа*/
  const updatePprData = useCallback((id: PlannedWorkId, field: keyof PlannedWorkWithCorrections, value: string | number) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        data: prev.data.map((pprData) => {
          let newValue: PlanValueWithCorrection | string | number = value;

          if (PprField.isPlanWork(field) || pprData.id !== id) {
            return pprData;
          }

          return {
            ...pprData,
            [field]: newValue,
          };
        }),
      };
    });
  }, []);

  /**Задать вручную новое значение в плане ППРа. Данная функция должна использоваться только на этапе  */
  const updatePlanWorkValueByUser = useCallback((id: PlannedWorkId, field: PlanValueField, value: number) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        data: prev.data.map((pprData) => {
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
          // TODO: может попасться year_plan_work, если не будет первым! Вдруг итог по году перенести надо будет в конец таблицы?
          for (const periodField of PLAN_WORK_FIELDS) {
            newPprData.year_plan_work.final += newPprData[periodField].final;
          }

          newPprData.year_plan_work.final = roundToFixed(newPprData.year_plan_work.final);

          const planTimeField = PprField.getPlanTimeFieldByPlanWorkField(field);

          newPprData[planTimeField].final = roundToFixed(newPprData.norm_of_time * newPprData[field].final);
          newPprData.year_plan_time.final = roundToFixed(newPprData.norm_of_time * newPprData.year_plan_work.final);

          return newPprData;
        }),
      };
    });
  }, []);

  /**
   * Обновить переносы. Функция используется на этапе планирования месяца. Человек вручную меняет план месяца, а далее выбирает на какие месяца переносится разница
   *
   * ВАЖНО!
   * 1. Не должно быть переноса в прошлое, поэтому в outsideCorrectionsSumByField будет сформированное значение переносов из вне, когда цикл дойдет до нужного поля.
   * 2. Поскольку можно переносить работы только на будущие периоды и изменение откорректированных должна быть невозможна, то у
   */
  const updateTransfers = useCallback(
    (id: PlannedWorkId, field: PlanValueField, newTransfers: WorkTransfer[] | null, type: "plan" | "undone") => {
      setPpr((prev) => {
        if (!prev) {
          return prev;
        }
        return {
          ...prev,
          data: prev.data.map((pprData) => {
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
            newPprData[field][transferSumType] = newTransfers?.reduce((sum, val) => sum + val.value, 0) || 0;

            for (const planWorkField of PLAN_WORK_FIELDS) {
              //TODO: исправить. Если year_plan_work не будет первым, то всё обнулится. Вынести обнуление выше
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
            newPprData.year_plan_time.final = roundToFixed(newPprData.norm_of_time * newPprData.year_plan_work.final);

            return newPprData;
          }),
        };
      });
    },
    []
  );

  const updatePprTableCell = useCallback(
    (id: PlannedWorkId, field: keyof PlannedWorkWithCorrections, value: string, isWorkAproved?: boolean) => {
      if (field === "norm_of_time") {
        updateNormOfTime(id, Number(value));
      } else if (PprField.isFactWork(field)) {
        updateFactWork(id, field, Number(value));
      } else if (PprField.isFactTime(field)) {
        updateFactWorkTime(id, field, Number(value));
      } else if (!isWorkAproved && PprField.isPlanWork(field)) {
        updatePlanWork(id, field, Number(value));
      } else if (isWorkAproved && PprField.isPlanWork(field)) {
        updatePlanWorkValueByUser(id, field, Number(value));
      } else {
        updatePprData(id, field, value);
      }
    },
    [updateFactWork, updateFactWorkTime, updateNormOfTime, updatePlanWork, updatePlanWorkValueByUser, updatePprData]
  );

  const updateSubbranch = useCallback((newSubbranch: string, workIdsSet: Set<PlannedWorkId>) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        data: prev.data.map((pprData) => {
          if (!workIdsSet.has(pprData.id)) {
            return pprData;
          }
          return { ...pprData, subbranch: newSubbranch };
        }),
      };
    });
  }, []);

  /**Добавить рабочего в список людей ППР */
  const addWorkingMan = useCallback((nearWorkingManId?: PlannedWorkingManId) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      let indexToPlace: number | null = null;

      for (let i = 0; i < prev.workingMans.length; i++) {
        if (prev.workingMans[i].id !== nearWorkingManId) {
          continue;
        }
        indexToPlace = i;
        break;
      }

      return {
        ...prev,
        workingMans:
          indexToPlace !== null
            ? prev.workingMans
                .slice(0, indexToPlace + 1)
                .concat(createNewWorkingManInstance())
                .concat(prev.workingMans.slice(indexToPlace + 1))
            : prev.workingMans.concat(createNewWorkingManInstance()),
      };
    });
  }, []);

  /**Обновить данные рабочено из списка людей ППР */
  const updateWorkingMan = useCallback((rowIndex: number, field: keyof PlannedWorkingMans, value: unknown) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        workingMans: prev.workingMans.map((man, arrayIndex) => {
          if (arrayIndex === rowIndex) {
            return {
              ...man,
              [field]: value,
            };
          }
          return man;
        }),
      };
    });
  }, []);

  const updateWorkingManPlanNormTime = useCallback((rowIndex: number, field: PlanNormTimeField, value: number) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      const correctedWorkingMan = { ...prev.workingMans[rowIndex] };
      correctedWorkingMan[field] = value;
      correctedWorkingMan.year_plan_norm_time = 0;
      for (const planNormPeriod of PLAN_NORM_TIME_FIELDS) {
        if (planNormPeriod === "year_plan_norm_time") {
          continue;
        }
        correctedWorkingMan.year_plan_norm_time += correctedWorkingMan[planNormPeriod];
      }
      return {
        ...prev,
        workingMans: prev.workingMans.map((man, index) => {
          if (rowIndex === index) {
            return { ...correctedWorkingMan };
          }
          return man;
        }),
      };
    });
  }, []);

  const updateWorkingManPlanTabelTime = useCallback((rowIndex: number, field: PlanTabelTimeField, value: number) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      const correctedWorkingMan = { ...prev.workingMans[rowIndex] };
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

      return {
        ...prev,
        workingMans: prev.workingMans.map((man, index) => {
          if (rowIndex === index) {
            return { ...correctedWorkingMan };
          }
          return man;
        }),
      };
    });
  }, []);

  const updateWorkingManFactTime = useCallback((rowIndex: number, field: FactTimeField, value: number) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      const correctedWorkinMan = { ...prev.workingMans[rowIndex] };
      correctedWorkinMan[field] = value;
      correctedWorkinMan.year_fact_time = 0;
      //TODO: проверить везде пропуск годового поля, ноль где-то прибавляю - тоже не верно это
      for (const factPeriod of FACT_TIME_FIELDS) {
        if (factPeriod === "year_fact_time") {
          continue;
        }
        correctedWorkinMan.year_fact_time += correctedWorkinMan[factPeriod];
      }
      return {
        ...prev,
        workingMans: prev.workingMans.map((man, index) => {
          if (rowIndex === index) {
            return { ...correctedWorkinMan };
          }
          return man;
        }),
      };
    });
  }, []);

  const updateWorkingManParticipation = useCallback((rowIndex: number, value: number) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      const correctedWorkingMan = { ...prev.workingMans[rowIndex] };
      correctedWorkingMan.participation = value;

      for (const planTabelPeriod of PLAN_TABEL_TIME_FIELDS) {
        const planTimePeriod = PprField.getPlanTimeFieldByPlanTabelTimeField(planTabelPeriod);
        correctedWorkingMan[planTimePeriod] = roundToFixed(
          correctedWorkingMan.participation * correctedWorkingMan[planTabelPeriod]
        );
      }

      return {
        ...prev,
        workingMans: prev.workingMans.map((man, index) => {
          if (rowIndex === index) {
            return { ...correctedWorkingMan };
          }
          return man;
        }),
      };
    });
  }, []);

  /**Убрать рабочего из списка людей ППР */
  const deleteWorkingMan = useCallback((id: PlannedWorkingManId) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        workingMans: prev.workingMans.filter((man) => man.id !== id),
      };
    });
  }, []);

  /**Массово заполнить одно подразделение в перечне работ */
  const setOneUnityInAllWorks = useCallback((unity: string) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      return { ...prev, data: prev.data.map((work) => ({ ...work, unity })) };
    });
  }, []);

  const increaseWorkPosition = useCallback((id: PlannedWorkId) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }

      const workIndex = prev.data.findIndex((pprData) => pprData.id === id);

      if (workIndex === -1 || workIndex === prev.data.length - 1) {
        return prev;
      }

      return {
        ...prev,
        data: prev.data
          .slice(0, workIndex)
          .concat(prev.data[workIndex + 1])
          .concat(prev.data[workIndex])
          .concat(prev.data.slice(workIndex + 2)),
      };
    });
  }, []);

  const decreaseWorkPosition = useCallback((id: PlannedWorkId) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }

      const workIndex = prev.data.findIndex((pprData) => pprData.id === id);

      if (workIndex === -1 || workIndex === 0) {
        return prev;
      }

      return {
        ...prev,
        data: prev.data
          .slice(0, workIndex - 1)
          .concat(prev.data[workIndex])
          .concat(prev.data[workIndex - 1])
          .concat(prev.data.slice(workIndex + 1)),
      };
    });
  }, []);

  const updateRaportNote = useCallback((note: string, month: Month) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        raports_notes: {
          ...prev.raports_notes,
          [month]: note,
        },
      };
    });
  }, []);

  /**
   * Получить информацию о месте размещения строк разделов. Для этого перебирается массив pprData.data
   * с запланированными работами и последовательно составляется список из разделов и подразделов работ
   */
  let pprMeta: IPprMeta = {
    branchesMeta: [],
    worksRowSpan: [],
    subbranchesList: [],
    worksOrder: {},
    branchesAndSubbrunchesOrder: {},
    totalValues: { final: { workingMans: {}, works: {} }, original: { workingMans: {}, works: {} } },
  };

  if (ppr) {
    pprMeta = createPprMeta({ pprData: ppr.data, workingMansData: ppr.workingMans });
  }

  // Если ППР не хранится в контексте, то записать его
  useEffect(() => {
    setPpr({ ...pprFromResponce });
  }, [pprFromResponce]);

  return (
    <PprContext.Provider
      value={{
        ppr,
        addWork,
        copyWork,
        deleteWork,
        editWork,
        copyFactNormTimeToFactTime,
        updatePprTableCell,
        updateTransfers,
        setOneUnityInAllWorks,
        increaseWorkPosition,
        decreaseWorkPosition,
        addWorkingMan,
        updateSubbranch,
        updateWorkingMan,
        deleteWorkingMan,
        updateWorkingManPlanNormTime,
        updateWorkingManPlanTabelTime,
        updateWorkingManFactTime,
        updateWorkingManParticipation,
        updateRaportNote,
        pprMeta,
      }}
    >
      {children}
    </PprContext.Provider>
  );
};
