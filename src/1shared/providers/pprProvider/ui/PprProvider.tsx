"use client";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  IPpr,
  IPprData,
  TTotalFieldsValues,
  TPlanTabelTimePeriods,
  IPprDataWithRowSpan,
  TPprDataFieldsTotalValues,
  TWorkingManFieldsTotalValues,
  TTransfer,
  IPlanWorkValues,
  IWorkingManYearPlan,
  TPlanWorkPeriods,
  TFactWorkPeriods,
  TFactTimePeriods,
  TPlanNormTimePeriods,
  PLAN_WORK_FIELDS,
  FACT_TIME_FIELDS,
  FACT_WORK_FIELDS,
  FACT_NORM_TIME_FIELDS,
  PLAN_NORM_TIME_FIELDS,
  PLAN_TABEL_TIME_FIELDS,
  PLAN_TIME_FIELDS,
  checkIsPlanWorkField,
  getPlanTimeFieldByPlanWorkField,
  getPlanTimeFieldByPlanTabelTimeField,
  getFactTimeFieldByFactWorkField,
  getPlanWorkFieldByPlanTimeField,
  checkIsFactWorkField,
  checkIsFactTimeField,
  TWorkBranch,
} from "@/2entities/ppr";

import { createNewPprWorkInstance } from "../lib/createNewPprWorkInstance";
import { createNewWorkingManInstance } from "../lib/createNewWorkingManInstance";

export interface IBranchDefaultMeta {
  workIds: Set<string>;
  name: string;
  orderIndex: string;
  indexToPlaceTitle: number;
  type: "branch" | "subbranch";
}

export interface IBranchMeta extends IBranchDefaultMeta {
  subbranches: IBranchDefaultMeta[];
}

export interface IPprContext {
  ppr: IPpr | null;
  addWork: (newWork: Partial<IPprData>, nearWorkId?: string | null) => void;
  copyWork: (id: string) => void;
  deleteWork: (id: string) => void;
  updateNormOfTime: (id: string, value: number) => void;
  updatePlanWork: (id: string, field: TPlanWorkPeriods, value: number) => void;
  updateFactWork: (id: string, field: TFactWorkPeriods, value: number) => void;
  updateFactWorkTime: (id: string, field: TFactTimePeriods, value: number) => void;
  updatePprData: (id: string, field: keyof IPprData, value: string | number) => void;
  updatePlanWorkValueByUser: (id: string, field: TPlanWorkPeriods, newValue: number) => void;
  updatePprTableCell: (id: string, field: keyof IPprData, value: string, isWorkAproved?: boolean) => void;
  updateTransfers: (
    id: string,
    field: TPlanWorkPeriods,
    newTransfers: TTransfer[] | null,
    type: "plan" | "undone"
  ) => void;
  setOneUnityInAllWorks: (unity: string) => void;
  updateSubbranch: (newSubbranch: string, workIdsSet: Set<string>) => void;
  getPprDataWithRowSpan: (data: IPprData[]) => IPprDataWithRowSpan[];
  addWorkingMan: () => void;
  deleteWorkingMan: (id: string) => void;
  updateWorkingMan: (rowIndex: number, field: keyof IWorkingManYearPlan, value: unknown) => void;
  updateWorkingManPlanNormTime: (rowIndex: number, field: TPlanNormTimePeriods, value: number) => void;
  updateWorkingManPlanTabelTime: (rowIndex: number, field: TPlanTabelTimePeriods, value: number) => void;
  updateWorkingManFactTime: (rowIndex: number, field: TFactTimePeriods, value: number) => void;
  updateWorkingManParticipation: (rowIndex: number, value: number) => void;
  getBranchesMeta: () => {
    branchesMeta: IBranchMeta[];
    branchesAndSubbrunchesOrder: {
      [indexToPlace: number]: IBranchDefaultMeta[];
    };
    subbranchesList: string[];
  };
}

const PprContext = createContext<IPprContext>({
  ppr: null,
  addWork: () => {},
  copyWork: () => {},
  deleteWork: () => {},
  updatePprData: () => {},
  updateNormOfTime: () => {},
  updatePlanWork: () => {},
  updateFactWork: () => {},
  updateFactWorkTime: () => {},
  updatePlanWorkValueByUser: () => {},
  updatePprTableCell: () => {},
  updateTransfers: () => {},
  updateSubbranch: () => {},
  addWorkingMan: () => {},
  updateWorkingMan: () => {},
  deleteWorkingMan: () => {},
  updateWorkingManPlanNormTime: () => {},
  updateWorkingManPlanTabelTime: () => {},
  updateWorkingManFactTime: () => {},
  setOneUnityInAllWorks: () => {},
  getPprDataWithRowSpan: () => [],
  updateWorkingManParticipation: () => [],
  getBranchesMeta: () => ({ branchesMeta: [], branchesAndSubbrunchesOrder: {}, subbranchesList: [] }),
});

export const usePpr = () => useContext(PprContext);

interface IPprProviderProps extends PropsWithChildren {
  pprFromResponce: IPpr;
}

export const PprProvider: FC<IPprProviderProps> = ({ children, pprFromResponce }) => {
  //Данные ППРа
  const [ppr, setPpr] = useState<IPpr | null>(null);

  /**Добавить работу в ППР */
  const addWork = useCallback((newWork: Partial<IPprData>, nearWorkId?: string | null) => {
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

  const copyWork = useCallback((id: string) => {
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
              workId: pprData?.workId,
              branch: pprData?.branch,
              subbranch: pprData?.subbranch,
              measure: pprData?.measure,
              periodicity_normal: pprData?.periodicity_normal,
              periodicity_fact: pprData?.periodicity_fact,
              norm_of_time: pprData?.norm_of_time,
              norm_of_time_document: pprData?.norm_of_time_document,
              unity: pprData?.unity,
            };
            return pprData;
          })
          .slice(0, rowIndex + 1)
          .concat(createNewPprWorkInstance(newWork))
          .concat(prev.data.slice(rowIndex + 1)),
      };
    });
  }, []);

  /**Убрать работу из ППР */
  const deleteWork = useCallback((id: string) => {
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
  const updateNormOfTime = useCallback((id: string, value: unknown) => {
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
            newPprData[planTimeField].original = Number(
              (newPprData.norm_of_time * newPprData[planWorkField].original).toFixed(2)
            );
            newPprData[planTimeField].final = Number(
              (newPprData.norm_of_time * newPprData[planWorkField].final).toFixed(2)
            );
          }

          for (const factWorkField of FACT_WORK_FIELDS) {
            const factTimeField = getFactTimeFieldByFactWorkField(factWorkField);
            newPprData[factTimeField] = Number((newPprData.norm_of_time * newPprData[factWorkField]).toFixed(2));
          }

          return newPprData;
        }),
      };
    });
  }, []);

  /**Обновить значение запланированного объема работ. Функция должна использоваться при создании годового плана или же добавлении новой работы при месячном планировании  */
  const updatePlanWork = useCallback((id: string, field: TPlanWorkPeriods, value: number) => {
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

          const planTimeField = getPlanTimeFieldByPlanWorkField(field);

          newPprData[planTimeField].final = newPprData[planTimeField].original = Number(
            (newPprData.norm_of_time * newPprData[field].original).toFixed(2)
          );
          newPprData.year_plan_time.final = newPprData.year_plan_time.original = Number(
            (newPprData.norm_of_time * newPprData.year_plan_work.original).toFixed(2)
          );

          return newPprData;
        }),
      };
    });
  }, []);

  const updateFactWork = useCallback((id: string, field: TFactWorkPeriods, value: number) => {
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

          const factNormTimeField = getFactTimeFieldByFactWorkField(field);
          newPprData[factNormTimeField] = Number((newPprData.norm_of_time * newPprData[field]).toFixed(2));
          newPprData.year_fact_norm_time = Number((newPprData.year_fact_work * newPprData.norm_of_time).toFixed(2));

          return newPprData;
        }),
      };
    });
  }, []);

  const updateFactWorkTime = useCallback((id: string, field: TFactTimePeriods, value: number) => {
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
            newPprData.year_fact_time += Number(newPprData[periodField]);
          }

          return newPprData;
        }),
      };
    });
  }, []);

  /**Обновить данные ППРа. Функция используется для обновления ячеек с простыми типами данных (строки, числа). Функция не подходит для обновления данных планов ППРа*/
  const updatePprData = useCallback((id: string, field: keyof IPprData, value: string | number) => {
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
  const updatePlanWorkValueByUser = useCallback((id: string, field: TPlanWorkPeriods, value: number) => {
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

          for (const periodField of PLAN_WORK_FIELDS) {
            newPprData.year_plan_work.final += newPprData[periodField].final;
          }

          const planTimeField = getPlanTimeFieldByPlanWorkField(field);

          newPprData[planTimeField].final = Number((newPprData.norm_of_time * newPprData[field].final).toFixed(2));
          newPprData.year_plan_time.final = Number(
            (newPprData.norm_of_time * newPprData.year_plan_work.final).toFixed(2)
          );

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
    (id: string, field: TPlanWorkPeriods, newTransfers: TTransfer[] | null, type: "plan" | "undone") => {
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
              newPprData[planTimeField].final = Number((newPprData.norm_of_time * planField.final).toFixed(2));
              newPprData.year_plan_work.final += planField.final;
            }
            newPprData.year_plan_time.final = Number(
              (newPprData.norm_of_time * newPprData.year_plan_work.final).toFixed(2)
            );

            return newPprData;
          }),
        };
      });
    },
    []
  );

  const updatePprTableCell = useCallback(
    (id: string, field: keyof IPprData, value: string, isWorkAproved?: boolean) => {
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

  const updateSubbranch = useCallback((newSubbranch: string, workIdsSet: Set<string>) => {
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
  const addWorkingMan = useCallback(() => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        peoples: prev.peoples.concat(createNewWorkingManInstance()),
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
        peoples: prev.peoples.map((man, arrayIndex) => {
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
      const correctedWorkingMan = { ...prev.peoples[rowIndex] };
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
        peoples: prev.peoples.map((man, index) => {
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
      const correctedWorkingMan = { ...prev.peoples[rowIndex] };
      correctedWorkingMan[field] = value;
      correctedWorkingMan.year_plan_tabel_time = 0;
      for (const planTabelPeriod of PLAN_TABEL_TIME_FIELDS) {
        if (planTabelPeriod === "year_plan_tabel_time") {
          continue;
        }
        correctedWorkingMan.year_plan_tabel_time += correctedWorkingMan[planTabelPeriod];
        const planTimePeriod = getPlanTimeFieldByPlanTabelTimeField(planTabelPeriod);
        correctedWorkingMan[planTimePeriod] = correctedWorkingMan.participation * correctedWorkingMan[planTabelPeriod];
      }
      correctedWorkingMan.year_plan_time = correctedWorkingMan.participation * correctedWorkingMan.year_plan_tabel_time;

      return {
        ...prev,
        peoples: prev.peoples.map((man, index) => {
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
      const correctedWorkinMan = { ...prev.peoples[rowIndex] };
      correctedWorkinMan[field] = value;
      correctedWorkinMan.year_fact_time = 0;
      for (const factPeriod of FACT_TIME_FIELDS) {
        if (factPeriod === "year_fact_time") {
          continue;
        }
        correctedWorkinMan.year_fact_time += correctedWorkinMan[factPeriod];
      }
      return {
        ...prev,
        peoples: prev.peoples.map((man, index) => {
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
      const correctedWorkingMan = { ...prev.peoples[rowIndex] };
      correctedWorkingMan.participation = value;

      for (const planTabelPeriod of PLAN_TABEL_TIME_FIELDS) {
        const planTimePeriod = getPlanTimeFieldByPlanTabelTimeField(planTabelPeriod);
        correctedWorkingMan[planTimePeriod] = correctedWorkingMan.participation * correctedWorkingMan[planTabelPeriod];
      }

      return {
        ...prev,
        peoples: prev.peoples.map((man, index) => {
          if (rowIndex === index) {
            return { ...correctedWorkingMan };
          }
          return man;
        }),
      };
    });
  }, []);

  /**Убрать рабочего из списка людей ППР */
  const deleteWorkingMan = useCallback((id: string) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        peoples: prev.peoples.filter((man) => man.id !== id),
      };
    });
  }, []);

  const getPprDataWithRowSpan = useCallback((data: IPprData[]): IPprDataWithRowSpan[] => {
    let prevWorkId: string = "";
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

  /**Массово заполнить одно подразделение в перечне работ */
  const setOneUnityInAllWorks = useCallback((unity: string) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      return { ...prev, data: prev.data.map((work) => ({ ...work, unity })) };
    });
  }, []);

  /**
   * Получить информацию о месте размещения строк категорий. Для этого перебирается массив pprData.data
   * с запланированными работами и последовательно составляется список из категорий и подкатегорий работ
   */
  const getBranchesMeta = useCallback(() => {
    const branchesMeta: IBranchMeta[] = [];
    const branchesAndSubbrunchesOrder: { [indexToPlace: number]: IBranchDefaultMeta[] } = {};
    const subbranchesSet = new Set<string>();

    if (!ppr?.data) {
      return { branchesMeta, branchesAndSubbrunchesOrder, subbranchesList: [] };
    }

    let prevBranchMeta: IBranchMeta = {
      workIds: new Set(),
      indexToPlaceTitle: 0,
      name: "",
      subbranches: [],
      orderIndex: "",
      type: "branch",
    };

    let prevSubbranchMeta: IBranchDefaultMeta = {
      workIds: new Set(),
      indexToPlaceTitle: 0,
      name: "",
      orderIndex: "",
      type: "subbranch",
    };

    function initPrevBranchMeta(branchName: TWorkBranch, index: number) {
      prevBranchMeta = {
        workIds: new Set(),
        indexToPlaceTitle: index,
        name: branchName,
        subbranches: [],
        orderIndex: `${branchesMeta.length + 1}.`,
        type: "branch",
      };
    }

    function initPrevSubbranchMeta(subbranchName: string, index: number, isBranchChange?: boolean) {
      prevSubbranchMeta = {
        workIds: new Set(),
        indexToPlaceTitle: index,
        name: subbranchName,
        orderIndex: `${branchesMeta.length + (isBranchChange ? 1 : 0)}.${prevBranchMeta.subbranches.length + 1}.`,
        type: "subbranch",
      };
    }

    ppr.data.forEach((pprData, index) => {
      if (pprData.branch !== prevBranchMeta.name) {
        initPrevBranchMeta(pprData.branch, index);
        initPrevSubbranchMeta(pprData.subbranch, index, true);
        prevBranchMeta.subbranches.push(prevSubbranchMeta);
        branchesMeta.push(prevBranchMeta);
        subbranchesSet.add(prevSubbranchMeta.name);
        branchesAndSubbrunchesOrder[index] = [prevBranchMeta, prevSubbranchMeta];
      } else if (pprData.subbranch !== prevSubbranchMeta.name) {
        initPrevSubbranchMeta(pprData.subbranch, index);
        prevBranchMeta.subbranches.push(prevSubbranchMeta);
        subbranchesSet.add(prevSubbranchMeta.name);
        branchesAndSubbrunchesOrder[index] = [prevSubbranchMeta];
      }
      prevBranchMeta.workIds.add(pprData.id);
      prevSubbranchMeta.workIds.add(pprData.id);
    });

    return {
      branchesMeta,
      branchesAndSubbrunchesOrder,
      subbranchesList: Array.from(subbranchesSet),
    };
  }, [ppr?.data]);

  // Если ППР не хранится в контексте, то записать его
  useEffect(() => {
    setPpr({ ...pprFromResponce });
  }, [pprFromResponce]);

  //Расчитать и сохранить значения в итоговые значения.
  //Скорее всего было бы лучше сделать не useEffect, а при вызове функций изменения ячеек сразу же считать сумму по столбцам/
  //Ибо сейчас скорее всего получится, что я делаю перерендеринг из-за перерасчета, из-за useEffect
  useEffect(() => {
    const totalFieldsValues: TTotalFieldsValues = { works: {}, peoples: {} };

    function handleWorkPeriod(value: number, field: keyof TPprDataFieldsTotalValues) {
      if (totalFieldsValues.works[field] !== undefined) {
        totalFieldsValues.works[field]! += value;
      } else {
        totalFieldsValues.works[field] = value;
      }
    }

    function handleWorkingMansPeriod(value: number, field: keyof TWorkingManFieldsTotalValues) {
      if (totalFieldsValues.peoples[field] !== undefined) {
        totalFieldsValues.peoples[field]! += value;
      } else {
        totalFieldsValues.peoples[field] = value;
      }
    }

    ppr?.data.forEach((pprData) => {
      PLAN_TIME_FIELDS.forEach((field) => {
        const planWorkField = getPlanWorkFieldByPlanTimeField(field);
        const value = pprData[planWorkField].final * pprData.norm_of_time;
        handleWorkPeriod(value, field);
      });
      FACT_NORM_TIME_FIELDS.forEach((field) => handleWorkPeriod(pprData[field], field));
      FACT_TIME_FIELDS.forEach((field) => handleWorkPeriod(pprData[field], field));
    });

    ppr?.peoples.forEach((workingMan) => {
      PLAN_NORM_TIME_FIELDS.forEach((field) => handleWorkingMansPeriod(workingMan[field], field));
      PLAN_TABEL_TIME_FIELDS.forEach((field) => handleWorkingMansPeriod(workingMan[field], field));
      PLAN_TIME_FIELDS.forEach((field) => handleWorkingMansPeriod(workingMan[field], field));
      FACT_TIME_FIELDS.forEach((field) => handleWorkingMansPeriod(workingMan[field], field));
    });
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      return { ...prev, total_fields_value: totalFieldsValues };
    });
  }, [ppr?.data, ppr?.peoples]);

  return (
    <PprContext.Provider
      value={{
        ppr,
        deleteWork,
        addWork,
        copyWork,
        updatePprData,
        updateNormOfTime,
        updatePlanWork,
        updateFactWork,
        updateFactWorkTime,
        updatePlanWorkValueByUser,
        updatePprTableCell,
        updateTransfers,
        addWorkingMan,
        setOneUnityInAllWorks,
        updateSubbranch,
        getPprDataWithRowSpan,
        updateWorkingMan,
        deleteWorkingMan,
        updateWorkingManPlanNormTime,
        updateWorkingManPlanTabelTime,
        updateWorkingManFactTime,
        updateWorkingManParticipation,
        getBranchesMeta,
      }}
    >
      {children}
    </PprContext.Provider>
  );
};
