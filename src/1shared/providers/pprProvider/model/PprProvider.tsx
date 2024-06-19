"use client";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  IPlanWorkPeriods,
  IPpr,
  IPprData,
  IPprDataWithRowSpan,
  TTransfer,
  factWorkFields,
  getFactTimeFieldByFactWorkField,
  getPlanTimeFieldByPlanWorkField,
  planWorkFields,
  IFactWorkPeriods,
  IFactTimePeriods,
  TWorkCorrection,
  checkIsPlanWorkField,
  factTimeFields,
  getPlanWorkFieldByFactWorkField,
  IWorkingManYearPlan,
} from "@/2entities/ppr";
import { createNewPprWorkInstance } from "../lib/createNewPprWorkInstance";
import { createNewWorkingManInstance } from "../lib/createNewWorkingManInstance";
import { IPlanNormTimePeriods, IPlanTabelTimePeriods } from "@/2entities/ppr/model/ppr.schema";
import {
  getPlanTimeFieldByPlanTabelTimeField,
  planNormTimeFields,
  planTabelTimeFields,
} from "@/2entities/ppr/lib/constFields";

export interface IPprContextProps {
  ppr: IPpr | null;
  addWork: (newWork: Partial<IPprData>, indexToPlace?: number) => void;
  copyWork: (rowIndex: number) => void;
  deleteWork: (rowIndex: number) => void;
  updateNormOfTime: (rowIndex: number, value: number) => void;
  updatePlanWork: (rowIndex: number, field: keyof IPlanWorkPeriods, value: number) => void;
  updateFactWork: (rowIndex: number, field: keyof IFactWorkPeriods, value: number) => void;
  updateFactWorkTime: (rowIndex: number, field: keyof IFactTimePeriods, value: number) => void;
  updatePprData: (rowIndex: number, field: keyof IPprData, value: unknown) => void;
  updatePlanWorkValueByUser: (rowIndex: number, field: keyof IPlanWorkPeriods, newValue: number) => void;
  updateWorkTransfers: (
    transferType: "plan" | "undone",
    rowIndex: number,
    fieldFrom: keyof IPlanWorkPeriods,
    transfers: TTransfer<IPlanWorkPeriods>[] | null
  ) => void;
  getWorkCorrection: (rowIndex: number, field: keyof IPlanWorkPeriods) => TWorkCorrection<IPlanWorkPeriods> | undefined;
  getWorkTransfers: (
    transferType: "plan" | "undone",
    field: string,
    fieldFrom: keyof IPlanWorkPeriods
  ) => TTransfer<IPlanWorkPeriods>[] | null;
  setOneUnityInAllWorks: (unity: string) => void;
  getPprDataWithRowSpan: (data: IPprData[]) => IPprDataWithRowSpan[];
  addWorkingMan: () => void;
  deleteWorkingMan: (id: string) => void;
  getWorkingManCorrection: (
    rowIndex: number,
    field: keyof (IPlanNormTimePeriods | IPlanTabelTimePeriods)
  ) => number | undefined;
  setWorkingManCorrection: (rowIndex: number, field: keyof IWorkingManYearPlan, value: number) => void;
  updateWorkingMan: (rowIndex: number, field: keyof IWorkingManYearPlan, value: unknown) => void;
  updateWorkingManPlanNormTime: (rowIndex: number, field: keyof IPlanNormTimePeriods, value: number) => void;
  updateWorkingManPlanTabelTime: (rowIndex: number, field: keyof IPlanTabelTimePeriods, value: number) => void;
  updateWorkingManFactTime: (rowIndex: number, field: keyof IFactTimePeriods, value: number) => void;
  updateWorkingManParticipation: (rowIndex: number, value: number) => void;
}

const PprContext = createContext<IPprContextProps>({
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
  updateWorkTransfers: () => {},
  getWorkCorrection: () => undefined,
  getWorkTransfers: () => null,
  addWorkingMan: () => {},
  updateWorkingMan: () => {},
  deleteWorkingMan: () => {},
  getWorkingManCorrection: () => undefined,
  setWorkingManCorrection: () => {},
  updateWorkingManPlanNormTime: () => {},
  updateWorkingManPlanTabelTime: () => {},
  updateWorkingManFactTime: () => {},
  setOneUnityInAllWorks: () => {},
  getPprDataWithRowSpan: () => [],
  updateWorkingManParticipation: () => [],
});

export const usePpr = () => useContext(PprContext);

interface IPprProviderProps extends PropsWithChildren {
  pprFromResponce: IPpr;
}

export const PprProvider: FC<IPprProviderProps> = ({ children, pprFromResponce }) => {
  //Данные ППРа
  const [ppr, setPpr] = useState<IPpr | null>(null);

  /**Добавить работу в ППР */
  const addWork = useCallback((newWork: Partial<IPprData>, indexToPlace?: number) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        data:
          indexToPlace !== undefined
            ? prev.data
                .slice(0, indexToPlace + 1)
                .concat(createNewPprWorkInstance(newWork))
                .concat(prev.data.slice(indexToPlace + 1))
            : prev.data.concat(createNewPprWorkInstance(newWork)),
      };
    });
  }, []);

  const copyWork = useCallback((rowIndex: number) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      const pprData = prev.data[rowIndex];
      const newWork = {
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
      return {
        ...prev,
        data: prev.data
          .slice(0, rowIndex + 1)
          .concat(createNewPprWorkInstance(newWork))
          .concat(prev.data.slice(rowIndex + 1)),
      };
    });
  }, []);

  /**Убрать работу из ППР */
  const deleteWork = useCallback((rowIndex: number) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      return { ...prev, data: prev.data.filter((_, index) => index !== rowIndex) };
    });
  }, []);

  const getWorkCorrection = useCallback(
    (rowIndex: number, field: keyof IPlanWorkPeriods): TWorkCorrection<IPlanWorkPeriods> | undefined => {
      if (!ppr?.data) {
        return undefined;
      }
      const workId = ppr.data[rowIndex].id;
      const correction: TWorkCorrection<IPlanWorkPeriods> | undefined =
        ppr.corrections.works[workId] && ppr.corrections.works[workId]![field];
      if (!correction) {
        return undefined;
      }
      return correction;
    },
    [ppr?.data, ppr?.corrections.works]
  );

  /**Обновить значение нормы времени */
  const updateNormOfTime = useCallback((rowIndex: number, value: unknown) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      const pprData: IPprData = {
        ...prev.data[rowIndex],
      };
      pprData.norm_of_time = Number(value);
      for (const planWorkPeriodField of planWorkFields) {
        const planTimeField = getPlanTimeFieldByPlanWorkField(planWorkPeriodField);
        pprData[planTimeField] = Number((pprData.norm_of_time * pprData[planWorkPeriodField]).toFixed(2));
      }
      return prev;
    });
  }, []);

  /**Обновить значение запланированного объема работ  */
  const updatePlanWork = useCallback((rowIndex: number, field: keyof IPlanWorkPeriods, value: number) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      const pprData: IPprData = {
        ...prev.data[rowIndex],
      };
      pprData[field] = Number(value || 0);
      pprData.year_plan_work = 0;
      for (const periodField of planWorkFields) {
        pprData.year_plan_work += Number(pprData[periodField]);
      }
      pprData.year_plan_time = Number((pprData.year_plan_work * pprData.norm_of_time).toFixed(2));
      const planTimeField = getPlanTimeFieldByPlanWorkField(field);
      pprData[planTimeField] = Number((pprData.norm_of_time * pprData[field]).toFixed(2));
      return {
        ...prev,
        data: prev.data.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...pprData,
            };
          }
          return row;
        }),
      };
    });
  }, []);

  const updateFactWork = useCallback((rowIndex: number, field: keyof IFactWorkPeriods, value: number) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      const pprData: IPprData = {
        ...prev.data[rowIndex],
      };
      const objectId = pprData.id;
      const planField = getPlanWorkFieldByFactWorkField(field);
      const correction = prev.corrections.works[objectId] && prev.corrections.works[objectId]![planField];
      pprData[field] = Number(value || 0);
      pprData.year_fact_work = 0;
      for (const periodField of factWorkFields) {
        pprData.year_fact_work += Number(pprData[periodField]);
      }
      pprData.year_fact_norm_time = Number((pprData.year_fact_work * pprData.norm_of_time).toFixed(2));
      const factNormTimeField = getFactTimeFieldByFactWorkField(field);
      pprData[factNormTimeField] = Number((pprData.norm_of_time * pprData[field]).toFixed(2));

      if (correction) {
        correction.undoneTransfers = null;
        correction.undoneTransfersSum = 0;
      }

      return {
        ...prev,
        data: prev.data.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...pprData,
            };
          }
          return row;
        }),
        corrections: {
          ...prev.corrections,
          works: {
            ...prev.corrections.works,
            ...(correction
              ? {
                  [objectId]: {
                    ...prev.corrections.works[objectId],
                    [planField]: {
                      ...correction,
                    },
                  },
                }
              : {}),
          },
        },
      };
    });
  }, []);

  const updateFactWorkTime = useCallback((rowIndex: number, field: keyof IFactTimePeriods, value: number) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      const pprData: IPprData = {
        ...prev.data[rowIndex],
      };
      pprData[field] = Number(value);
      pprData.year_fact_time = 0;
      for (const periodField of factTimeFields) {
        pprData.year_fact_time += Number(pprData[periodField]);
      }
      return {
        ...prev,
        data: prev.data.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...pprData,
            };
          }
          return row;
        }),
      };
    });
  }, []);

  /**Обновить данные ППРа */
  const updatePprData = useCallback((rowIndex: number, field: keyof IPprData, value: unknown) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        data: prev.data.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...prev.data[rowIndex],
              [field]: value,
            };
          }
          return row;
        }),
      };
    });
  }, []);

  /**Задать вручную новое значение в плане ППРа */
  const updatePlanWorkValueByUser = useCallback((rowIndex: number, field: keyof IPlanWorkPeriods, newValue: number) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      const objectId = prev.data[rowIndex].id;
      const correction: TWorkCorrection<IPlanWorkPeriods> | undefined =
        prev.corrections.works[objectId] &&
        prev.corrections.works[objectId]![field] &&
        prev.corrections.works[objectId]![field]!;
      if (correction && correction.planValueAfterCorrection === newValue) {
        return prev;
      }
      const newCorrection: TWorkCorrection<IPlanWorkPeriods> = {
        isHandCorrected: true,
        basicValue: prev.data[rowIndex][field],
        outsideCorrectionsSum: correction?.outsideCorrectionsSum || 0,
        planValueAfterCorrection: newValue,
        finalCorrection: newValue + (correction?.undoneTransfersSum || 0),
        planTransfers: correction?.planTransfers || null,
        planTransfersSum: correction?.planTransfersSum || 0,
        undoneTransfers: correction?.undoneTransfers || null,
        undoneTransfersSum: correction?.undoneTransfersSum || 0,
      };

      let yearPlanAfterCorrection = newValue;
      let yearFinalCorrection = newValue;
      for (const planWorkField of planWorkFields) {
        if (!checkIsPlanWorkField(planWorkField) || planWorkField === "year_plan_work" || field === planWorkField) {
          continue;
        }
        yearPlanAfterCorrection +=
          (prev.corrections.works[objectId] &&
            prev.corrections.works[objectId]![planWorkField]?.planValueAfterCorrection) ||
          prev.data[rowIndex][planWorkField];
        yearFinalCorrection +=
          (prev.corrections.works[objectId] && prev.corrections.works[objectId]![planWorkField]?.finalCorrection) ||
          prev.data[rowIndex][planWorkField];
      }

      const yearCorrection: TWorkCorrection<IPlanWorkPeriods> = {
        basicValue: prev.data[rowIndex].year_plan_work,
        planValueAfterCorrection: yearPlanAfterCorrection,
        isHandCorrected: false,
        outsideCorrectionsSum: 0,
        finalCorrection: yearFinalCorrection,
        planTransfers: null,
        planTransfersSum: 0,
        undoneTransfers: null,
        undoneTransfersSum: 0,
      };

      return {
        ...prev,
        corrections: {
          ...prev.corrections,
          works: {
            ...prev.corrections.works,
            [objectId]: {
              ...prev.corrections.works[objectId],
              year_plan_work: yearCorrection,
              [field]: { ...newCorrection },
            },
          },
        },
      };
    });
  }, []);

  /**Обновить переносы*/
  const updateWorkTransfers = useCallback(
    (
      transferType: "plan" | "undone",
      rowIndex: number,
      field: keyof IPlanWorkPeriods,
      newTransfers: TTransfer<IPlanWorkPeriods>[] | null
    ) => {
      setPpr((prev) => {
        if (!prev) {
          return prev;
        }

        function handleTransfer(transfers: TTransfer<IPlanWorkPeriods>[] | null | undefined): number {
          let sum = 0;
          transfers?.forEach((transfer) => {
            if (correctionsSumByField[transfer.fieldTo]) {
              correctionsSumByField[transfer.fieldTo]! += transfer.value;
            } else {
              correctionsSumByField[transfer.fieldTo] = transfer.value;
            }
            sum += transfer.value;
          });
          return sum;
        }

        const objectId = prev.data[rowIndex].id;
        const allCorrections = prev.corrections.works[objectId];
        const correctionsSumByField: { [field in keyof IPlanWorkPeriods]?: number } = {};
        const newAllCorrections: { [field in keyof IPlanWorkPeriods]?: TWorkCorrection<IPlanWorkPeriods> } = {};

        let yearFinalCorrection = 0;
        let yearPlanValueAfterCorrections = 0;

        for (const planWorkField of planWorkFields) {
          if (!checkIsPlanWorkField(planWorkField) || planWorkField === "year_plan_work") {
            continue;
          }
          const correction = allCorrections && allCorrections[planWorkField];
          const planTransfers =
            transferType === "plan" && field === planWorkField ? newTransfers : correction?.planTransfers || null;
          const undoneTransfers =
            transferType === "undone" && field === planWorkField ? newTransfers : correction?.undoneTransfers || null;
          const planTransfersSum = handleTransfer(planTransfers);
          const undoneTransfersSum = handleTransfer(undoneTransfers);
          const basicValue = correction?.basicValue || prev.data[rowIndex][planWorkField];
          const isHandCorrected = correction?.isHandCorrected || false;
          const outsideCorrectionsSum = correctionsSumByField[planWorkField] || 0;
          const planValueAfterCorrection =
            isHandCorrected && correction?.planValueAfterCorrection !== undefined
              ? correction?.planValueAfterCorrection
              : basicValue + outsideCorrectionsSum;
          const finalCorrection = planValueAfterCorrection - undoneTransfersSum;
          const newCorrection: TWorkCorrection<IPlanWorkPeriods> = {
            basicValue,
            isHandCorrected,
            outsideCorrectionsSum,
            planTransfersSum,
            undoneTransfersSum,
            planValueAfterCorrection,
            planTransfers,
            undoneTransfers,
            finalCorrection,
          };
          yearPlanValueAfterCorrections += planValueAfterCorrection;
          yearFinalCorrection += finalCorrection;
          newAllCorrections[planWorkField] = newCorrection;
        }

        newAllCorrections.year_plan_work = {
          basicValue: prev.data[rowIndex].year_plan_work,
          planValueAfterCorrection: yearPlanValueAfterCorrections,
          isHandCorrected: false,
          outsideCorrectionsSum: 0,
          planTransfers: null,
          planTransfersSum: 0,
          undoneTransfers: null,
          undoneTransfersSum: 0,
          finalCorrection: yearFinalCorrection,
        };

        return {
          ...prev,
          corrections: {
            ...prev.corrections,
            works: {
              ...prev.corrections.works,
              [objectId]: {
                ...newAllCorrections,
              },
            },
          },
        };
      });
    },
    []
  );

  /**Получить переносы*/
  const getWorkTransfers = useCallback(
    (transferType: "plan" | "undone", objectId: string, fieldFrom: keyof IPlanWorkPeriods) => {
      const isHaveCorrections =
        ppr?.corrections.works &&
        objectId in ppr?.corrections.works &&
        ppr?.corrections.works[objectId] &&
        fieldFrom in ppr?.corrections.works[objectId]! &&
        ppr?.corrections.works[objectId]![fieldFrom];

      if (!isHaveCorrections) {
        return null;
      }
      if (transferType === "plan") {
        return ppr?.corrections.works[objectId]![fieldFrom]!.planTransfers;
      }
      return ppr?.corrections.works[objectId]![fieldFrom]!.undoneTransfers;
    },
    [ppr?.corrections]
  );

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

  const updateWorkingManPlanNormTime = useCallback(
    (rowIndex: number, field: keyof IPlanNormTimePeriods, value: number) => {
      setPpr((prev) => {
        if (!prev) {
          return prev;
        }
        const correctedWorkingMan = { ...prev.peoples[rowIndex] };
        correctedWorkingMan[field] = value;
        correctedWorkingMan.year_plan_norm_time = 0;
        for (const planNormPeriod of planNormTimeFields) {
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
    },
    []
  );

  const updateWorkingManPlanTabelTime = useCallback(
    (rowIndex: number, field: keyof IPlanTabelTimePeriods, value: number) => {
      setPpr((prev) => {
        if (!prev) {
          return prev;
        }
        const correctedWorkingMan = { ...prev.peoples[rowIndex] };
        correctedWorkingMan[field] = value;
        correctedWorkingMan.year_plan_tabel_time = 0;
        for (const planTabelPeriod of planTabelTimeFields) {
          if (planTabelPeriod === "year_plan_tabel_time") {
            continue;
          }
          correctedWorkingMan.year_plan_tabel_time += correctedWorkingMan[planTabelPeriod];
          const planTimePeriod = getPlanTimeFieldByPlanTabelTimeField(planTabelPeriod);
          correctedWorkingMan[planTimePeriod] =
            correctedWorkingMan.participation * correctedWorkingMan[planTabelPeriod];
        }
        correctedWorkingMan.year_plan_time =
          correctedWorkingMan.participation * correctedWorkingMan.year_plan_tabel_time;

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
    },
    []
  );

  const updateWorkingManFactTime = useCallback((rowIndex: number, field: keyof IFactTimePeriods, value: number) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      const correctedWorkinMan = { ...prev.peoples[rowIndex] };
      correctedWorkinMan[field] = value;
      correctedWorkinMan.year_fact_time = 0;
      for (const factPeriod of factTimeFields) {
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

      for (const planTabelPeriod of planTabelTimeFields) {
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

  const getWorkingManCorrection = useCallback(
    (rowIndex: number, field: keyof (IPlanNormTimePeriods | IPlanTabelTimePeriods)) => {
      const workingManId = ppr?.peoples[rowIndex].id;
      if (!workingManId || !ppr?.corrections.peoples[workingManId]) {
        return undefined;
      }
      return ppr?.corrections.peoples[workingManId]![field];
    },
    [ppr?.corrections.peoples, ppr?.peoples]
  );
  const setWorkingManCorrection = useCallback((rowIndex: number, field: keyof IWorkingManYearPlan, value: number) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      const workingManId = prev.peoples[rowIndex].id;
      const corrections = prev.corrections.peoples[workingManId];
      const newCorrections = { ...corrections, [field]: value };
      return {
        ...prev,
        corrections: { ...prev.corrections, peoples: { ...prev.corrections.peoples, [workingManId]: newCorrections } },
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

  // Если ППР не хранится в контексте, то записать его
  useEffect(() => {
    setPpr({ ...pprFromResponce });
  }, [pprFromResponce]);

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
        getWorkTransfers,
        updateWorkTransfers,
        getWorkCorrection,
        addWorkingMan,
        setOneUnityInAllWorks,
        getPprDataWithRowSpan,
        getWorkingManCorrection,
        setWorkingManCorrection,
        updateWorkingMan,
        deleteWorkingMan,
        updateWorkingManPlanNormTime,
        updateWorkingManPlanTabelTime,
        updateWorkingManFactTime,
        updateWorkingManParticipation,
      }}
    >
      {children}
    </PprContext.Provider>
  );
};
