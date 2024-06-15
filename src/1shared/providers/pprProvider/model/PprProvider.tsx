"use client";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from "react";
import { IWork } from "@/2entities/work";
import {
  IPlanWorkPeriods,
  IPpr,
  IPprData,
  IPprDataWithRowSpan,
  TTransfer,
  TWorkPlanCorrectionsResult,
  factWorkFields,
  getFactTimeFieldPair,
  getPlanTimeFieldPair,
  planWorkFields,
  IFactWorkPeriods,
  IFactTimePeriods,
  TCorrection,
  checkIsPlanTimeField,
  checkIsPlanWorkField,
} from "@/2entities/ppr";
import { createNewPprWorkInstance } from "../lib/createNewPprWorkInstance";
import { createNewWorkingManInstance } from "../lib/createNewWorkingManInstance";

type TWorkBasicInfo = { [id: string]: Omit<IWork, "periodicity_normal_data"> };

export interface IPprContextProps {
  ppr: IPpr | null;
  workBasicInfo: TWorkBasicInfo;
  addWork: (newWork: Partial<IPprData>, indexToPlace?: number) => void;
  deleteWork: (workId: string) => void;
  updateNormOfTime: (rowIndex: number, value: unknown) => void;
  updatePlanWork: (rowIndex: number, field: keyof IPlanWorkPeriods, value: unknown) => void;
  updateFactWork: (rowIndex: number, field: keyof IFactWorkPeriods, value: unknown) => void;
  updateFactTime: (rowIndex: number, field: keyof IFactTimePeriods, value: unknown) => void;
  updatePprData: (rowIndex: number, columnId: keyof IPprData, value: unknown) => void;
  updateNewValueInCorrection: (rowIndex: number, field: keyof IPlanWorkPeriods, newValue: number) => void;
  updateTransfers: (
    transferType: "plan" | "undone",
    objectId: string,
    fieldFrom: keyof IPlanWorkPeriods,
    transfers: TTransfer<IPlanWorkPeriods>[] | null
  ) => void;
  getWorkCorrection: (rowIndex: number, field: keyof IPlanWorkPeriods) => TCorrection<IPlanWorkPeriods> | undefined;
  getTransfers: (
    transferType: "plan" | "undone",
    objectId: string,
    fieldFrom: keyof IPlanWorkPeriods
  ) => TTransfer<IPlanWorkPeriods>[] | null;
  addWorkingMan: () => void;
  updateWorkingMan: (rowIndex: number, columnId: keyof IPprData, value: unknown) => void;
  deleteWorkingMan: (id: string) => void;
  setOneUnityInAllWorks: (unity: string) => void;
  getPprDataWithRowSpan: (data: IPprData[]) => IPprDataWithRowSpan[];
}

const PprContext = createContext<IPprContextProps>({
  ppr: null,
  workBasicInfo: {},
  addWork: () => {},
  deleteWork: () => {},
  updatePprData: () => {},
  updateNormOfTime: () => {},
  updatePlanWork: () => {},
  updateFactWork: () => {},
  updateFactTime: () => {},
  updateNewValueInCorrection: () => {},
  updateTransfers: () => {},
  getWorkCorrection: () => undefined,
  getTransfers: () => null,
  addWorkingMan: () => {},
  updateWorkingMan: () => {},
  deleteWorkingMan: () => {},
  setOneUnityInAllWorks: () => {},
  getPprDataWithRowSpan: () => [],
});

export const usePpr = () => useContext(PprContext);

interface IPprProviderProps extends PropsWithChildren {
  pprFromResponce: IPpr;
}

export const PprProvider: FC<IPprProviderProps> = ({ children, pprFromResponce }) => {
  //Данные ППРа
  const [ppr, setPpr] = useState<IPpr | null>(null);
  //Данные о работах, применяемых в этом ППРе
  const [workBasicInfo, setWorksDataInPpr] = useState<TWorkBasicInfo>({});

  const handleWorksDataInPpr = useCallback((pprData: IPprData[]) => {
    const worksData: TWorkBasicInfo = {};
    pprData.forEach((work) => (worksData[work.id] = { ...work }));
    setWorksDataInPpr(worksData);
  }, []);

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

  /**Убрать работу из ППР */
  const deleteWork = useCallback((workId: string) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      return { ...prev, data: prev.data.filter((work) => work.id !== workId) };
    });
  }, []);

  const getWorkCorrection = useCallback(
    (rowIndex: number, field: keyof IPlanWorkPeriods): TCorrection<IPlanWorkPeriods> | undefined => {
      if (!ppr?.data) {
        return undefined;
      }
      const workId = ppr.data[rowIndex].id;
      const value = ppr.data[rowIndex][field];
      const correction: TCorrection<IPlanWorkPeriods> | undefined =
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
        const planTimeField = getPlanTimeFieldPair(planWorkPeriodField);
        pprData[planTimeField] = Number((pprData.norm_of_time * pprData[planWorkPeriodField]).toFixed(2));
      }
      return prev;
    });
  }, []);

  /**Обновить значение запланированного объема работ  */
  const updatePlanWork = useCallback((rowIndex: number, field: keyof IPlanWorkPeriods, value: unknown) => {
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
      const planTimeField = getPlanTimeFieldPair(field);
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

  const updateFactWork = useCallback((rowIndex: number, field: keyof IFactWorkPeriods, value: unknown) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      const pprData: IPprData = {
        ...prev.data[rowIndex],
      };
      pprData[field] = Number(value || 0);
      pprData.year_fact_work = 0;
      for (const periodField of factWorkFields) {
        pprData.year_fact_work += Number(pprData[periodField]);
      }
      pprData.year_fact_norm_time = Number((pprData.year_fact_work * pprData.norm_of_time).toFixed(2));
      const factNormTimeField = getFactTimeFieldPair(field);
      pprData[factNormTimeField] = Number((pprData.norm_of_time * pprData[field]).toFixed(2));
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

  const updateFactTime = useCallback((rowIndex: number, field: keyof IFactTimePeriods, value: unknown) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      const pprData: IPprData = {
        ...prev.data[rowIndex],
      };
      pprData[field] = Number(value || 0);
      pprData.year_fact_time = 0;
      for (const periodField of factWorkFields) {
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
  const updatePlanValueByUser = useCallback((rowIndex: number, field: keyof IPlanWorkPeriods, newValue: number) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }
      const objectId = prev.data[rowIndex].id;
      const correction: TCorrection<IPlanWorkPeriods> | undefined =
        prev.corrections.works[objectId] &&
        prev.corrections.works[objectId]![field] &&
        prev.corrections.works[objectId]![field]!;
      if (correction && correction.correctedValue === newValue) {
        return prev;
      }
      const newCorrection: TCorrection<IPlanWorkPeriods> = {
        isHandCorrected: true,
        basicValue: prev.data[rowIndex][field],
        outsideCorrectionsSum: correction?.outsideCorrectionsSum || 0,
        correctedValue: newValue,
        planTransfers: correction?.planTransfers || null,
        planTransfersSum: correction?.planTransfersSum || 0,
        undoneTransfers: correction?.undoneTransfers || null,
        undoneTransfersSum: correction?.undoneTransfersSum || 0,
      };

      let allCorrectedValues = newValue;
      for (const planWorkField of planWorkFields) {
        if (!checkIsPlanWorkField(planWorkField) || planWorkField === "year_plan_work" || field === planWorkField) {
          continue;
        }
        allCorrectedValues +=
          (prev.corrections.works[objectId] && prev.corrections.works[objectId]![planWorkField]?.correctedValue) ||
          prev.data[rowIndex][planWorkField];
      }

      const yearCorrections: TCorrection<IPlanWorkPeriods> = {
        basicValue: prev.data[rowIndex].year_plan_work,
        correctedValue: allCorrectedValues,
        isHandCorrected: false,
        outsideCorrectionsSum: 0,
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
              year_plan_work: yearCorrections,
              [field]: { ...newCorrection },
            },
          },
        },
      };
    });
  }, []);

  /**Обновить переносы*/
  const updateTransfers = useCallback(
    (
      transferType: "plan" | "undone",
      objectId: string,
      fieldFrom: keyof IPlanWorkPeriods,
      transfers: TTransfer<IPlanWorkPeriods>[] | null
    ) => {
      setPpr((prev) => {
        if (!prev) {
          return prev;
        }

        return {
          ...prev,
          corrections: {
            ...prev.corrections,
            works: {
              ...prev.corrections.works,
              [objectId]: {
                ...prev.corrections.works[objectId],
                [fieldFrom]: {
                  ...(prev.corrections.works[objectId] && prev.corrections.works[objectId]![fieldFrom]),
                  ...(transferType === "plan" ? { planTransfers: transfers } : { undoneTransfers: transfers }),
                },
              },
            },
          },
        };
      });
    },
    []
  );

  /**Получить переносы*/
  const getTransfers = useCallback(
    (transferType: "plan" | "undone", objectId: string, fieldFrom: keyof IPlanWorkPeriods) => {
      const isHaveCorrections =
        ppr?.corrections.works &&
        objectId in ppr?.corrections.works &&
        ppr?.corrections.works[objectId] &&
        fieldFrom in ppr?.corrections.works[objectId]! &&
        ppr?.corrections.works[objectId]![fieldFrom];

      if (!isHaveCorrections) {
        return [];
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
  const updateWorkingMan = useCallback((rowIndex: number, columnId: keyof IPprData, value: unknown) => {
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
              [columnId]: value,
            };
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

  useEffect(() => {
    if (ppr?.data) {
      handleWorksDataInPpr(ppr.data);
    }
  }, [ppr?.data, handleWorksDataInPpr]);

  return (
    <PprContext.Provider
      value={{
        ppr,
        workBasicInfo,
        deleteWork,
        addWork,
        updatePprData,
        updateNormOfTime,
        updatePlanWork,
        updateFactWork,
        updateFactTime,
        updateNewValueInCorrection: updatePlanValueByUser,
        getTransfers,
        updateTransfers,
        getWorkCorrection,
        addWorkingMan,
        updateWorkingMan,
        deleteWorkingMan,
        setOneUnityInAllWorks,
        getPprDataWithRowSpan,
      }}
    >
      {children}
    </PprContext.Provider>
  );
};
