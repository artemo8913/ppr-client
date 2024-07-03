"use client";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  IPlanWorkPeriods,
  IPpr,
  IPprData,
  TTotalFieldsValues,
  IPprDataWithRowSpan,
  IPlanNormTimePeriods,
  IPlanTabelTimePeriods,
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
import {
  factNormTimeFields,
  getPlanTimeFieldByPlanTabelTimeField,
  planNormTimeFields,
  planTabelTimeFields,
  planTimeFields,
} from "@/2entities/ppr/lib/constFields";
import { TPprDataFieldsTotalValues, TWorkingManFieldsTotalValues } from "@/2entities/ppr/model/ppr.schema";

export interface IPprContext {
  ppr: IPpr | null;
  addWork: (newWork: Partial<IPprData>, nearWorkId?: string) => void;
  copyWork: (id: string) => void;
  deleteWork: (id: string) => void;
  updateNormOfTime: (id: string, value: number) => void;
  updatePlanWork: (id: string, field: keyof IPlanWorkPeriods, value: number) => void;
  updateFactWork: (id: string, field: keyof IFactWorkPeriods, value: number) => void;
  updateFactWorkTime: (id: string, field: keyof IFactTimePeriods, value: number) => void;
  updatePprData: (id: string, field: keyof IPprData, value: unknown) => void;
  updatePlanWorkValueByUser: (id: string, field: keyof IPlanWorkPeriods, newValue: number) => void;
  updateWorkTransfers: (
    transferType: "plan" | "undone",
    rowIndex: number,
    fieldFrom: keyof IPlanWorkPeriods,
    transfers: TTransfer<IPlanWorkPeriods>[] | null
  ) => void;
  getWorkCorrection: (id: string, field: keyof IPlanWorkPeriods) => TWorkCorrection<IPlanWorkPeriods> | undefined;
  setOneUnityInAllWorks: (unity: string) => void;
  getPprDataWithRowSpan: (data: IPprData[]) => IPprDataWithRowSpan[];
  addWorkingMan: () => void;
  deleteWorkingMan: (id: string) => void;
  updateWorkingMan: (rowIndex: number, field: keyof IWorkingManYearPlan, value: unknown) => void;
  updateWorkingManPlanNormTime: (rowIndex: number, field: keyof IPlanNormTimePeriods, value: number) => void;
  updateWorkingManPlanTabelTime: (rowIndex: number, field: keyof IPlanTabelTimePeriods, value: number) => void;
  updateWorkingManFactTime: (rowIndex: number, field: keyof IFactTimePeriods, value: number) => void;
  updateWorkingManParticipation: (rowIndex: number, value: number) => void;
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
  updateWorkTransfers: () => {},
  getWorkCorrection: () => undefined,
  addWorkingMan: () => {},
  updateWorkingMan: () => {},
  deleteWorkingMan: () => {},
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
  const addWork = useCallback((newWork: Partial<IPprData>, nearWorkId?: string) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      let indexToPlace: number | undefined;

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
          indexToPlace !== undefined
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
      return { ...prev, data: prev.data.filter((pprData) => pprData.id !== id) };
    });
  }, []);

  const getWorkCorrection = useCallback(
    (id: string, field: keyof IPlanWorkPeriods): TWorkCorrection<IPlanWorkPeriods> | undefined => {
      if (!ppr?.data) {
        return undefined;
      }
      const correction: TWorkCorrection<IPlanWorkPeriods> | undefined =
        ppr.corrections.works[id] && ppr.corrections.works[id]![field];
      if (!correction) {
        return undefined;
      }
      return correction;
    },
    [ppr?.data, ppr?.corrections.works]
  );

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
          const newPprData: IPprData = {
            ...pprData,
          };
          newPprData.norm_of_time = Number(value);
          for (const planWorkField of planWorkFields) {
            const planTimeField = getPlanTimeFieldByPlanWorkField(planWorkField);
            newPprData[planTimeField] = Number((newPprData.norm_of_time * newPprData[planWorkField]).toFixed(2));
          }
          for (const factWorkField of factWorkFields) {
            const factTimeField = getFactTimeFieldByFactWorkField(factWorkField);
            newPprData[factTimeField] = Number((newPprData.norm_of_time * newPprData[factWorkField]).toFixed(2));
          }
          return newPprData;
        }),
      };
    });
  }, []);

  /**Обновить значение запланированного объема работ  */
  const updatePlanWork = useCallback((id: string, field: keyof IPlanWorkPeriods, value: number) => {
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
          const newPprData: IPprData = {
            ...pprData,
          };

          newPprData[field] = Number(value || 0);
          newPprData.year_plan_work = 0;

          for (const periodField of planWorkFields) {
            newPprData.year_plan_work += Number(newPprData[periodField]);
          }

          newPprData.year_plan_time = Number((newPprData.year_plan_work * newPprData.norm_of_time).toFixed(2));

          const planTimeField = getPlanTimeFieldByPlanWorkField(field);
          newPprData[planTimeField] = Number((newPprData.norm_of_time * newPprData[field]).toFixed(2));

          return newPprData;
        }),
      };
    });
  }, []);

  const updateFactWork = useCallback((id: string, field: keyof IFactWorkPeriods, value: number) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      const planField = getPlanWorkFieldByFactWorkField(field);
      const correction = prev.corrections.works[id] && prev.corrections.works[id]![planField];
      if (correction) {
        correction.undoneTransfers = null;
        correction.undoneTransfersSum = 0;
      }

      return {
        ...prev,
        data: prev.data.map((pprData) => {
          if (pprData.id !== id) {
            return pprData;
          }
          const newPprData: IPprData = {
            ...pprData,
          };
          newPprData[field] = Number(value || 0);
          newPprData.year_fact_work = 0;
          for (const periodField of factWorkFields) {
            newPprData.year_fact_work += Number(newPprData[periodField]);
          }
          newPprData.year_fact_norm_time = Number((newPprData.year_fact_work * newPprData.norm_of_time).toFixed(2));
          const factNormTimeField = getFactTimeFieldByFactWorkField(field);
          newPprData[factNormTimeField] = Number((newPprData.norm_of_time * newPprData[field]).toFixed(2));
          return newPprData;
        }),
        corrections: {
          ...prev.corrections,
          works: {
            ...prev.corrections.works,
            ...(correction
              ? {
                  [id]: {
                    ...prev.corrections.works[id],
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

  const updateFactWorkTime = useCallback((id: string, field: keyof IFactTimePeriods, value: number) => {
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
          const newPprData: IPprData = {
            ...pprData,
          };

          newPprData[field] = Number(value);
          newPprData.year_fact_time = 0;

          for (const periodField of factTimeFields) {
            newPprData.year_fact_time += Number(newPprData[periodField]);
          }

          return newPprData;
        }),
      };
    });
  }, []);

  /**Обновить данные ППРа */
  const updatePprData = useCallback((id: string, field: keyof IPprData, value: unknown) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        data: prev.data.map((pprData) => {
          if (pprData.id === id) {
            return {
              ...pprData,
              [field]: value,
            };
          }
          return pprData;
        }),
      };
    });
  }, []);

  /**Задать вручную новое значение в плане ППРа */
  const updatePlanWorkValueByUser = useCallback((id: string, field: keyof IPlanWorkPeriods, newValue: number) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      const correction: TWorkCorrection<IPlanWorkPeriods> | undefined =
        prev.corrections.works[id] && prev.corrections.works[id]![field] && prev.corrections.works[id]![field]!;

      const pprData = prev.data.find((data) => data.id === id);

      if ((correction && correction.planValueAfterCorrection === newValue) || !pprData) {
        return prev;
      }

      const newCorrection: TWorkCorrection<IPlanWorkPeriods> = {
        isHandCorrected: true,
        basicValue: pprData[field],
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

        let planValueAfterCorrection = pprData[planWorkField];
        let finalCorrection = pprData[planWorkField];

        if (prev.corrections.works[id] && prev.corrections.works[id]![planWorkField]) {
          planValueAfterCorrection = prev.corrections.works[id]![planWorkField]!.planValueAfterCorrection;
          finalCorrection = prev.corrections.works[id]![planWorkField]!.finalCorrection;
        }

        yearFinalCorrection += finalCorrection;
        yearPlanAfterCorrection += planValueAfterCorrection;
      }

      const yearCorrection: TWorkCorrection<IPlanWorkPeriods> = {
        basicValue: pprData.year_plan_work,
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
            [id]: {
              ...prev.corrections.works[id],
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

  //Расчитать и сохранить значения в итоговые значения.
  //Скорее всего было бы лучше сделать не useEffect, а при вызове функций изменения ячеек сразу же считать сумму по столбцам/
  //Ибо сейчас скорее всего получится, что я делаю перерендеринг из-за перерасчета, из-за useEffect
  useEffect(() => {
    const totalFieldsValues: TTotalFieldsValues = { works: {}, peoples: {} };

    function handleWorkPeriod(pprData: IPprData, period: keyof TPprDataFieldsTotalValues) {
      if (totalFieldsValues.works[period] !== undefined) {
        totalFieldsValues.works[period]! += pprData[period];
      } else {
        totalFieldsValues.works[period] = pprData[period];
      }
    }

    function handleWorkingMansPeriod(peoples: IWorkingManYearPlan, period: keyof TWorkingManFieldsTotalValues) {
      if (totalFieldsValues.peoples[period] !== undefined) {
        totalFieldsValues.peoples[period]! += peoples[period];
      } else {
        totalFieldsValues.peoples[period] = peoples[period];
      }
    }

    ppr?.data.forEach((pprData) => {
      planTimeFields.forEach((period) => handleWorkPeriod(pprData, period));
      factNormTimeFields.forEach((period) => handleWorkPeriod(pprData, period));
      factTimeFields.forEach((period) => handleWorkPeriod(pprData, period));
    });

    ppr?.peoples.forEach((workingMan) => {
      planNormTimeFields.forEach((period) => handleWorkingMansPeriod(workingMan, period));
      planTabelTimeFields.forEach((period) => handleWorkingMansPeriod(workingMan, period));
      planTimeFields.forEach((period) => handleWorkingMansPeriod(workingMan, period));
      factTimeFields.forEach((period) => handleWorkingMansPeriod(workingMan, period));
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
        updateWorkTransfers,
        getWorkCorrection,
        addWorkingMan,
        setOneUnityInAllWorks,
        getPprDataWithRowSpan,
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
