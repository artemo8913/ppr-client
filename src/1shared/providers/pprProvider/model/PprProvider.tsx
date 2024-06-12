"use client";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from "react";
import { IWork } from "@/2entities/work";
import {
  IPlanWorkPeriods,
  IPpr,
  IPprData,
  IPprDataWithRowSpan,
  TTransfer,
  TPprCorrections,
  TWorkPlanCorrectionsResult,
  checkIsPlanWorkField,
  factWorkFields,
  getFactTimeFieldPair,
  getPlanTimeFieldPair,
  planWorkFields,
  IFactWorkPeriods,
  IFactTimePeriods,
} from "@/2entities/ppr";
import { createNewPprWorkInstance } from "../lib/createNewPprWorkInstance";
import { createNewWorkingManInstance } from "../lib/createNewWorkingManInstance";

type TWorkBasicInfo = { [id: string]: Omit<IWork, "periodicity_normal_data"> };

export interface IPprContextProps {
  ppr: IPpr | null;
  workPlanCorrections: TWorkPlanCorrectionsResult;
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
    objectId: string,
    fieldFrom: keyof IPlanWorkPeriods,
    transfers: TTransfer<IPlanWorkPeriods>[] | null
  ) => void;
  getCorrectionValue: (workId: string, field: keyof IPlanWorkPeriods) => number;
  getTransfers: (objectId: string, fieldFrom: keyof IPlanWorkPeriods) => TTransfer<IPlanWorkPeriods>[] | null;
  addWorkingMan: () => void;
  updateWorkingMan: (rowIndex: number, columnId: keyof IPprData, value: unknown) => void;
  deleteWorkingMan: (id: string) => void;
  setOneUnityInAllWorks: (unity: string) => void;
  getPprDataWithRowSpan: (data: IPprData[]) => IPprDataWithRowSpan[];
}

const PprContext = createContext<IPprContextProps>({
  ppr: null,
  workPlanCorrections: {},
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
  getCorrectionValue: () => 0,
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
  //Корректировки запланированных объемов работ ППРа в формате данных "объекта" (не в массиве)
  const [workPlanCorrections, setWorkPlanCorrections] = useState<TWorkPlanCorrectionsResult>({});
  //Данные о работах, применяемых в этом ППРе
  const [workBasicInfo, setWorksDataInPpr] = useState<TWorkBasicInfo>({});

  const handleCorrections = useCallback((corrections: TPprCorrections) => {
    const workPlanCorrections: TWorkPlanCorrectionsResult = {};

    for (const id in corrections.works) {
      let yearCorrection = 0;
      const workCorrection = corrections.works[id];
      planWorkFields.forEach((planPeriod) => {
        if (workCorrection && planPeriod in workCorrection) {
          const existValue = id in workPlanCorrections ? workPlanCorrections[id]![planPeriod] || 0 : 0;
          const additionalValue = workCorrection[planPeriod]?.diff || 0;
          const newValue = existValue + additionalValue;
          workPlanCorrections[id] = { ...workPlanCorrections[id], [planPeriod]: newValue };
          yearCorrection += additionalValue;
          workCorrection[planPeriod]?.transfers?.forEach((field) => {
            const existValue = id in workPlanCorrections ? workPlanCorrections[id]![field.fieldTo] || 0 : 0;
            const additionalValue = field.value;
            yearCorrection += additionalValue;
            workPlanCorrections[id] = { ...workPlanCorrections[id], [field.fieldTo]: existValue + additionalValue };
          });
        }
      });
      if (yearCorrection !== 0 && id in workPlanCorrections) {
        workPlanCorrections[id]!.year_plan_work = yearCorrection;
      }
    }
    setWorkPlanCorrections(workPlanCorrections);
  }, []);

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
  /**Получить значение корректировки по значению поля и объекта */
  const getCorrectionValue = useCallback(
    (workId: string, field: keyof IPlanWorkPeriods): number => {
      if (!(workId in workPlanCorrections)) {
        return 0;
      } else if (checkIsPlanWorkField(field)) {
        return workPlanCorrections[workId]![field] || 0;
      }
      return 0;
    },
    [workPlanCorrections]
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

  /**Обновить новое значение в корректировке ППРа (разницу между первоначальным состоянием и новым) */
  const updateNewValueInCorrection = useCallback(
    (rowIndex: number, field: keyof IPlanWorkPeriods, newValue: number) => {
      setPpr((prev) => {
        if (!prev) {
          return prev;
        }
        const objectId = prev.data[rowIndex].id;
        const oldValue = prev.data[rowIndex][field];
        const newDiff = newValue - oldValue;
        const newCorrection = {
          ...(prev.corrections.works[objectId] && prev.corrections.works[objectId]![field]),
          newValue,
          diff: newDiff,
        };
        const newCorrections = { ...prev.corrections.works[objectId], [field]: { ...newCorrection } };
        if (!newDiff) {
          delete newCorrections[field];
        }
        return {
          ...prev,
          corrections: {
            ...prev.corrections,
            works: {
              ...prev.corrections.works,
              [objectId]: {
                ...newCorrections,
              },
            },
          },
        };
      });
    },
    []
  );

  /**Обновить переносы*/
  const updateTransfers = useCallback(
    (objectId: string, fieldFrom: keyof IPlanWorkPeriods, transfers: TTransfer<IPlanWorkPeriods>[] | null) => {
      setPpr((prev) => {
        if (!prev || !checkIsPlanWorkField(fieldFrom)) {
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
                  ...prev.corrections.works[objectId]![fieldFrom as keyof IPlanWorkPeriods],
                  transfers: transfers === null ? null : transfers,
                },
              },
            },
          },
        };
      });
    },
    []
  );

  /**Получить массив переносов*/
  const getTransfers = useCallback(
    (objectId: string, fieldFrom: keyof IPlanWorkPeriods) => {
      const isHaveCorrection =
        ppr?.corrections.works &&
        objectId in ppr?.corrections.works &&
        ppr?.corrections.works[objectId] &&
        fieldFrom in ppr?.corrections.works[objectId]! &&
        ppr?.corrections.works[objectId]![fieldFrom as keyof IPlanWorkPeriods];

      if (!isHaveCorrection) {
        return [];
      }
      return ppr?.corrections.works[objectId]![fieldFrom as keyof IPlanWorkPeriods]!.transfers;
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
    handleCorrections(pprFromResponce.corrections);
  }, [pprFromResponce, handleCorrections]);

  useEffect(() => {
    if (ppr?.corrections) {
      handleCorrections(ppr.corrections);
    }
  }, [ppr?.corrections, handleCorrections]);

  useEffect(() => {
    if (ppr?.data) {
      handleWorksDataInPpr(ppr.data);
    }
  }, [ppr?.data, handleWorksDataInPpr]);

  return (
    <PprContext.Provider
      value={{
        ppr,
        workPlanCorrections,
        workBasicInfo,
        deleteWork,
        addWork,
        updatePprData,
        updateNormOfTime,
        updatePlanWork,
        updateFactWork,
        updateFactTime,
        updateNewValueInCorrection,
        updateTransfers,
        getTransfers,
        getCorrectionValue,
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
