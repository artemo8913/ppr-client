"use client";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from "react";
import { IWork } from "@/2entities/work";
import {
  IPlanWorkPeriods,
  IPpr,
  IPprData,
  IPprDataWithRowSpan,
  TCorrectionTransfer,
  TPprCorrections,
  TWorkPlanCorrection,
  checkIsPlanWorkPeriodField,
  getPlanFieldPair,
  planWorkPeriods,
} from "@/2entities/ppr";
import { createNewPprWorkInstance } from "../lib/createNewPprWorkInstance";
import { createNewWorkingManInstance } from "../lib/createNewWorkingManInstance";

type TWorkBasicInfo = { [id: string]: Omit<IWork, "periodicity_normal_data"> };

interface IPprContextProps {
  ppr: IPpr | null;
  workPlanCorrections: TWorkPlanCorrection;
  workBasicInfo: TWorkBasicInfo;
  addWork: (newWork: Partial<IPprData>, indexToPlace?: number) => void;
  deleteWork: (workId: string) => void;
  updatePprData: (rowIndex: number, columnId: keyof IPprData | string, value: unknown) => void;
  updateNewValueInCorrection: (
    objectId: string,
    fieldName: keyof IPlanWorkPeriods | string,
    newValue: number,
    oldValue: number
  ) => void;
  updateTransfers: (
    objectId: string,
    fieldFrom: keyof IPlanWorkPeriods | string,
    transfers: TCorrectionTransfer<IPlanWorkPeriods>[] | null
  ) => void;
  getCorrectionValue: (workId: string, fieldName: keyof IPlanWorkPeriods | string) => number;
  getTransfers: (
    objectId: string,
    fieldFrom: keyof IPlanWorkPeriods | string
  ) => TCorrectionTransfer<IPlanWorkPeriods>[] | null;
  addWorkingMan: () => void;
  updateWorkingMan: (rowIndex: number, columnId: keyof IPprData | string, value: unknown) => void;
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
  const [workPlanCorrections, setWorkPlanCorrections] = useState<TWorkPlanCorrection>({});
  //Данные о работах, применяемых в этом ППРе
  const [workBasicInfo, setWorksDataInPpr] = useState<TWorkBasicInfo>({});

  const handleCorrections = useCallback((corrections: TPprCorrections) => {
    const workPlanCorrections: TWorkPlanCorrection = {};

    for (const id in corrections.works) {
      const workCorrection = corrections.works[id];

      planWorkPeriods.forEach((planPeriod) => {
        if (workCorrection && planPeriod in workCorrection) {
          const existValue = id in workPlanCorrections ? workPlanCorrections[id]![planPeriod] || 0 : 0;
          const additionalValue = workCorrection[planPeriod]?.diff || 0;

          workPlanCorrections[id] = { ...workPlanCorrections[id], [planPeriod]: existValue + additionalValue };

          workCorrection[planPeriod]?.transfers?.forEach((field) => {
            const existValue = id in workPlanCorrections ? workPlanCorrections[id]![field.fieldTo] || 0 : 0;
            const additionalValue = field.value;
            workPlanCorrections[id] = { ...workPlanCorrections[id], [field.fieldTo]: existValue + additionalValue };
          });
        }
      });
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

  const getCorrectionValue = useCallback(
    (workId: string, fieldName: keyof IPlanWorkPeriods | string): number => {
      if (
        workId in workPlanCorrections &&
        fieldName in workPlanCorrections[workId]! &&
        Object.hasOwn(workPlanCorrections[workId]!, fieldName)
      ) {
        return Number(workPlanCorrections[workId]![fieldName as keyof IPlanWorkPeriods]);
      }
      return 0;
    },
    [workPlanCorrections]
  );

  /**Обновить данные ППРа */
  const updatePprData = useCallback((rowIndex: number, columnName: keyof IPprData | string, value: unknown) => {
    setPpr((prev) => {
      if (!prev) {
        return prev;
      }

      const pprData: IPprData = {
        ...prev.data[rowIndex],
      };

      if (columnName === "norm_of_time") {
        pprData.norm_of_time = Number(value);
        for (const planWorkPeriodField of planWorkPeriods) {
          const planTimeField = getPlanFieldPair(planWorkPeriodField);
          if (!planTimeField) {
            continue;
          }
          pprData[planTimeField] = pprData.norm_of_time * pprData[planWorkPeriodField];
        }
      } else if (checkIsPlanWorkPeriodField(columnName)) {
        pprData[columnName] = Number(value || 0);
        const planTimeField = getPlanFieldPair(columnName);
        pprData.year_plan_work = 0;
        for (const periodField of planWorkPeriods) {
          if (periodField === "year_plan_work") {
            continue;
          } else if (periodField === columnName) {
            pprData.year_plan_work += Number(value || 0);
            continue;
          }
          pprData.year_plan_work += Number(pprData[periodField]);
        }
        pprData.year_plan_time = Number((pprData.year_plan_work * pprData.norm_of_time).toFixed(2));
        if (planTimeField) {
          pprData[planTimeField] = Number((pprData.norm_of_time * pprData[columnName]).toFixed(2));
        }
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

  /**Обновить новое значение в корректировке ППРа (разницу между первоначальным состоянием и новым) */
  const updateNewValueInCorrection = useCallback(
    (objectId: string, fieldName: keyof IPlanWorkPeriods | string, newValue: number, oldValue: number) => {
      setPpr((prev) => {
        if (!prev) {
          return prev;
        }
        if (!checkIsPlanWorkPeriodField(fieldName)) {
          return prev;
        }
        const newDiff = newValue - oldValue;
        const newCorrection = {
          ...prev.corrections.works[objectId]![fieldName as keyof IPlanWorkPeriods],
          newValue,
          diff: newDiff,
        };
        const newCorrections = { ...prev.corrections.works[objectId], [fieldName]: { ...newCorrection } };
        if (!newDiff) {
          delete newCorrections[fieldName as keyof IPlanWorkPeriods];
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
    (
      objectId: string,
      fieldFrom: keyof IPlanWorkPeriods | string,
      transfers: TCorrectionTransfer<IPlanWorkPeriods>[] | null
    ) => {
      setPpr((prev) => {
        if (!prev || !checkIsPlanWorkPeriodField(fieldFrom)) {
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
    (objectId: string, fieldFrom: keyof IPlanWorkPeriods | string) => {
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
  const updateWorkingMan = useCallback((rowIndex: number, columnId: keyof IPprData | string, value: unknown) => {
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
