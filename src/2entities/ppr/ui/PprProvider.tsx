"use client";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from "react";

import { TMonth } from "@/1shared/lib/date";
import { roundToFixed } from "@/1shared/lib/math/roundToFixed";

import {
  IPlanWorkValues,
  IPpr,
  IPprBasicData,
  IPprData,
  IPprDataWithRowSpan,
  IWorkingManYearPlan,
  TFactTimePeriods,
  TFactWorkPeriods,
  TPlanNormTimePeriods,
  TPlanTabelTimePeriods,
  TPlanWorkPeriods,
  TPprDataWorkId,
  TTransfer,
  TWorkingManId,
} from "../model/ppr.types";
import { createNewPprWorkInstance } from "../lib/createNewPprWorkInstance";
import { createNewWorkingManInstance } from "../lib/createNewWorkingManInstance";
import { createPprMeta, IPprMeta } from "../lib/createPprMeta";
import {
  FACT_TIME_FIELDS,
  FACT_WORK_FIELDS,
  getFactNormTimeFieldByTimePeriod,
  getFactTimeFieldByFactWorkField,
  getFactTimeFieldByTimePeriod,
  getPlanTabelTimeFieldByPlanNormTimeField,
  getPlanTimeFieldByPlanTabelTimeField,
  getPlanTimeFieldByPlanWorkField,
  PLAN_NORM_TIME_FIELDS,
  PLAN_TABEL_TIME_FIELDS,
  PLAN_WORK_FIELDS,
} from "../model/ppr.const";
import { checkIsFactTimeField, checkIsFactWorkField, checkIsPlanWorkField } from "../lib/validateTypes";

interface IPprContext {
  ppr: IPpr | null;
  addWork: (newWork: Partial<IPprData>, nearWorkId?: TPprDataWorkId) => void;
  copyWork: (id: TPprDataWorkId) => void;
  deleteWork: (id: TPprDataWorkId) => void;
  editWork: (workData: Partial<IPprBasicData>) => void;
  updateNormOfTime: (id: TPprDataWorkId, value: number) => void;
  updatePlanWork: (id: TPprDataWorkId, field: TPlanWorkPeriods, value: number) => void;
  updateFactWork: (id: TPprDataWorkId, field: TFactWorkPeriods, value: number) => void;
  updateFactWorkTime: (id: TPprDataWorkId, field: TFactTimePeriods, value: number) => void;
  copyFactNormTimeToFactTime: (mode: "EVERY" | "NOT_FILLED", month: TMonth) => void;
  updatePprData: (id: TPprDataWorkId, field: keyof IPprData, value: string | number) => void;
  updatePlanWorkValueByUser: (id: TPprDataWorkId, field: TPlanWorkPeriods, newValue: number) => void;
  updatePprTableCell: (id: TPprDataWorkId, field: keyof IPprData, value: string, isWorkAproved?: boolean) => void;
  updateTransfers: (
    id: TPprDataWorkId,
    field: TPlanWorkPeriods,
    newTransfers: TTransfer[] | null,
    type: "plan" | "undone"
  ) => void;
  setOneUnityInAllWorks: (unity: string) => void;
  increaseWorkPosition: (id: TPprDataWorkId) => void;
  decreaseWorkPosition: (id: TPprDataWorkId) => void;
  updateSubbranch: (newSubbranch: string, workIdsSet: Set<TPprDataWorkId>) => void;
  addWorkingMan: (nearWorkingManId?: TWorkingManId) => void;
  deleteWorkingMan: (id: TWorkingManId) => void;
  updateWorkingMan: (rowIndex: number, field: keyof IWorkingManYearPlan, value: unknown) => void;
  updateWorkingManPlanNormTime: (rowIndex: number, field: TPlanNormTimePeriods, value: number) => void;
  updateWorkingManPlanTabelTime: (rowIndex: number, field: TPlanTabelTimePeriods, value: number) => void;
  updateWorkingManFactTime: (rowIndex: number, field: TFactTimePeriods, value: number) => void;
  updateWorkingManParticipation: (rowIndex: number, value: number) => void;
  getPprDataWithRowSpan: (data: IPprData[]) => IPprDataWithRowSpan[];
  fillWorkingManPlanTime: (mode: "EVERY" | "NOT_FILLED", value: number) => void;
  updateRaportNote: (note: string, month: TMonth) => void;
  pprMeta: IPprMeta;
}

const PprContext = createContext<IPprContext>({
  ppr: null,
  addWork: () => {},
  copyWork: () => {},
  deleteWork: () => {},
  editWork: () => {},
  updatePprData: () => {},
  updateNormOfTime: () => {},
  updatePlanWork: () => {},
  updateFactWork: () => {},
  updateFactWorkTime: () => {},
  copyFactNormTimeToFactTime: () => {},
  updatePlanWorkValueByUser: () => {},
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
  getPprDataWithRowSpan: () => [],
  fillWorkingManPlanTime: () => {},
  updateWorkingManParticipation: () => [],
  updateRaportNote: () => {},
  pprMeta: {
    worksRowSpan: [],
    branchesMeta: [],
    subbranchesList: [],
    worksOrderForRowSpan: {},
    branchesAndSubbrunchesOrder: {},
    totalValues: { final: { peoples: {}, works: {} }, original: { peoples: {}, works: {} } },
  },
});

export const usePpr = () => useContext(PprContext);

interface IPprProviderProps extends PropsWithChildren {
  pprFromResponce: IPpr;
}

export const PprProvider: FC<IPprProviderProps> = ({ children, pprFromResponce }) => {
  //Данные ППРа
  const [ppr, setPpr] = useState<IPpr | null>(null);

  /**Добавить работу в ППР */
  const addWork = useCallback((newWork: Partial<IPprData>, nearWorkId?: TPprDataWorkId) => {
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

  const copyWork = useCallback((id: TPprDataWorkId) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      let newWork: Partial<IPprData> = {};
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

  const editWork = useCallback((workData: Partial<IPprBasicData>) => {
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
            const planTimeField = getPlanTimeFieldByPlanWorkField(planWorkField);
            newPprData[planTimeField].original = roundToFixed(
              newPprData.norm_of_time * newPprData[planWorkField].original
            );
            newPprData[planTimeField].final = roundToFixed(newPprData.norm_of_time * newPprData[planWorkField].final);
          }

          for (const factWorkField of FACT_WORK_FIELDS) {
            const factTimeField = getFactTimeFieldByFactWorkField(factWorkField);
            newPprData[factTimeField] = roundToFixed(newPprData.norm_of_time * newPprData[factWorkField]);
          }

          return newPprData;
        }),
      };
    });
  }, []);

  /**Убрать работу из ППР */
  const deleteWork = useCallback((id: TPprDataWorkId) => {
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
  const updateNormOfTime = useCallback((id: TPprDataWorkId, value: unknown) => {
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

          const newPprData: IPprData = { ...pprData };

          newPprData.norm_of_time = Number(value);

          for (const planWorkField of PLAN_WORK_FIELDS) {
            const planTimeField = getPlanTimeFieldByPlanWorkField(planWorkField);
            newPprData[planTimeField].original = roundToFixed(
              newPprData.norm_of_time * newPprData[planWorkField].original
            );
            newPprData[planTimeField].final = roundToFixed(newPprData.norm_of_time * newPprData[planWorkField].final);
          }

          for (const factWorkField of FACT_WORK_FIELDS) {
            const factTimeField = getFactTimeFieldByFactWorkField(factWorkField);
            newPprData[factTimeField] = roundToFixed(newPprData.norm_of_time * newPprData[factWorkField]);
          }

          return newPprData;
        }),
      };
    });
  }, []);

  /**Обновить значение запланированного объема работ. Функция должна использоваться при создании годового плана или же добавлении новой работы при месячном планировании  */
  const updatePlanWork = useCallback((id: TPprDataWorkId, field: TPlanWorkPeriods, value: number) => {
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
          const newPprData: IPprData = { ...pprData };

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

          const planTimeField = getPlanTimeFieldByPlanWorkField(field);

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

  const updateFactWork = useCallback((id: TPprDataWorkId, field: TFactWorkPeriods, value: number) => {
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

          const newPprData: IPprData = { ...pprData };

          newPprData[field] = value;

          newPprData.year_fact_work = 0;

          for (const periodField of FACT_WORK_FIELDS) {
            newPprData.year_fact_work += newPprData[periodField];
          }

          newPprData.year_fact_work = roundToFixed(newPprData.year_fact_work);

          const factNormTimeField = getFactTimeFieldByFactWorkField(field);
          newPprData[factNormTimeField] = roundToFixed(newPprData.norm_of_time * newPprData[field]);
          newPprData.year_fact_norm_time = roundToFixed(newPprData.year_fact_work * newPprData.norm_of_time);

          return newPprData;
        }),
      };
    });
  }, []);

  const updateFactWorkTime = useCallback((id: TPprDataWorkId, field: TFactTimePeriods, value: number) => {
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

          const newPprData: IPprData = { ...pprData };

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

  const copyFactNormTimeToFactTime = useCallback((mode: "EVERY" | "NOT_FILLED", month: TMonth) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        data: prev.data.map((pprData) => {
          const newPprData: IPprData = { ...pprData };

          const factNormTimePeriod = getFactNormTimeFieldByTimePeriod(month);
          const factTimePeriod = getFactTimeFieldByTimePeriod(month);

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
  const updatePprData = useCallback((id: TPprDataWorkId, field: keyof IPprData, value: string | number) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        data: prev.data.map((pprData) => {
          let newValue: IPlanWorkValues | string | number = value;

          if (checkIsPlanWorkField(field) || pprData.id !== id) {
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
  const updatePlanWorkValueByUser = useCallback((id: TPprDataWorkId, field: TPlanWorkPeriods, value: number) => {
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

          const newPprData: IPprData = { ...pprData };

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

          const planTimeField = getPlanTimeFieldByPlanWorkField(field);

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
    (id: TPprDataWorkId, field: TPlanWorkPeriods, newTransfers: TTransfer[] | null, type: "plan" | "undone") => {
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

            const newPprData: IPprData = { ...pprData };

            const outsideCorrectionsSumByField: { [field in TPlanWorkPeriods]?: number } = {};
            function handleTransfer(transfers: TTransfer[] | null): number {
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

            const transferType: keyof IPlanWorkValues = type === "plan" ? "planTransfers" : "undoneTransfers";
            const transferSumType: keyof IPlanWorkValues = type === "plan" ? "planTransfersSum" : "undoneTransfersSum";

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

              const planTimeField = getPlanTimeFieldByPlanWorkField(planWorkField);
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
    (id: TPprDataWorkId, field: keyof IPprData, value: string, isWorkAproved?: boolean) => {
      if (field === "norm_of_time") {
        updateNormOfTime(id, Number(value));
      } else if (checkIsFactWorkField(field)) {
        updateFactWork(id, field, Number(value));
      } else if (checkIsFactTimeField(field)) {
        updateFactWorkTime(id, field, Number(value));
      } else if (!isWorkAproved && checkIsPlanWorkField(field)) {
        updatePlanWork(id, field, Number(value));
      } else if (isWorkAproved && checkIsPlanWorkField(field)) {
        updatePlanWorkValueByUser(id, field, Number(value));
      } else {
        updatePprData(id, field, value);
      }
    },
    [updateFactWork, updateFactWorkTime, updateNormOfTime, updatePlanWork, updatePlanWorkValueByUser, updatePprData]
  );

  const updateSubbranch = useCallback((newSubbranch: string, workIdsSet: Set<TPprDataWorkId>) => {
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
  const addWorkingMan = useCallback((nearWorkingManId?: TWorkingManId) => {
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
  const updateWorkingMan = useCallback((rowIndex: number, field: keyof IWorkingManYearPlan, value: unknown) => {
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

  const updateWorkingManPlanNormTime = useCallback((rowIndex: number, field: TPlanNormTimePeriods, value: number) => {
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

  const updateWorkingManPlanTabelTime = useCallback((rowIndex: number, field: TPlanTabelTimePeriods, value: number) => {
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

        const planTimePeriod = getPlanTimeFieldByPlanTabelTimeField(planTabelPeriod);

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

  const updateWorkingManFactTime = useCallback((rowIndex: number, field: TFactTimePeriods, value: number) => {
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
        const planTimePeriod = getPlanTimeFieldByPlanTabelTimeField(planTabelPeriod);
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
  const deleteWorkingMan = useCallback((id: TWorkingManId) => {
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

  const getPprDataWithRowSpan = useCallback((data: IPprData[]): IPprDataWithRowSpan[] => {
    let prevWorkId: TPprDataWorkId = "";
    let prevWorkName: string = "";
    let prevWorkIndex: number = 0;

    const rowSpanData: { [id: string]: number } = {};

    for (let i = 0; i < data.length; i++) {
      const work = data[i];
      if (i === 0) {
        prevWorkId = work.id;
        prevWorkName = work.name;
      }
      const diff = i - prevWorkIndex;
      if (prevWorkName === work.name && diff >= 1) {
        rowSpanData[work.id] = 0;
        if (i === data.length - 1) {
          rowSpanData[prevWorkId] = diff + 1;
        }
        continue;
      } else if (prevWorkName !== work.name) {
        rowSpanData[prevWorkId] = diff;
        prevWorkId = work.id;
        prevWorkName = work.name;
        prevWorkIndex = i;
        continue;
      }
    }

    return data.map((datum) => {
      return { ...datum, rowSpan: rowSpanData[datum.id] };
    });
  }, []);

  /**Массово заполнить планируемый настой часов (по норме и по табелю) по всем работникам на каждый месяц */
  const fillWorkingManPlanTime = useCallback((mode: "EVERY" | "NOT_FILLED", value: number) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        workingMans: prev.workingMans.map((workingMan) => {
          const correctedWorkingMan: IWorkingManYearPlan = { ...workingMan };

          correctedWorkingMan.year_plan_norm_time = 0;
          correctedWorkingMan.year_plan_tabel_time = 0;
          correctedWorkingMan.year_plan_time = 0;

          PLAN_NORM_TIME_FIELDS.forEach((planNormTimeField) => {
            const planTabelTimeField = getPlanTabelTimeFieldByPlanNormTimeField(planNormTimeField);
            const planTimeField = getPlanTimeFieldByPlanTabelTimeField(planTabelTimeField);

            if (mode === "EVERY" || (mode === "NOT_FILLED" && !correctedWorkingMan[planNormTimeField])) {
              correctedWorkingMan[planNormTimeField] = value;
              correctedWorkingMan[planTabelTimeField] = value;
              correctedWorkingMan[planTimeField] = roundToFixed(value * correctedWorkingMan.participation);
            }

            correctedWorkingMan.year_plan_norm_time += correctedWorkingMan[planNormTimeField];
            correctedWorkingMan.year_plan_tabel_time += correctedWorkingMan[planTabelTimeField];
            correctedWorkingMan.year_plan_time += correctedWorkingMan[planTimeField];
          });

          return correctedWorkingMan;
        }),
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

  const increaseWorkPosition = useCallback((id: TPprDataWorkId) => {
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

  const decreaseWorkPosition = useCallback((id: TPprDataWorkId) => {
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

  const updateRaportNote = useCallback((note: string, month: TMonth) => {
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
   * Получить информацию о месте размещения строк категорий. Для этого перебирается массив pprData.data
   * с запланированными работами и последовательно составляется список из категорий и подкатегорий работ
   */
  let pprMeta: IPprMeta = {
    branchesMeta: [],
    worksRowSpan: [],
    subbranchesList: [],
    worksOrderForRowSpan: {},
    branchesAndSubbrunchesOrder: {},
    totalValues: { final: { peoples: {}, works: {} }, original: { peoples: {}, works: {} } },
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
        updatePprData,
        updateNormOfTime,
        updatePlanWork,
        updateFactWork,
        updateFactWorkTime,
        copyFactNormTimeToFactTime,
        updatePlanWorkValueByUser,
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
        getPprDataWithRowSpan,
        fillWorkingManPlanTime,
        updateRaportNote,
        pprMeta,
      }}
    >
      {children}
    </PprContext.Provider>
  );
};
