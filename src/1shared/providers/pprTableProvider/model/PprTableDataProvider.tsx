"use client";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from "react";
import { IWork } from "@/2entities/work";
import {
  IPlanWorkPeriods,
  IPpr,
  IPprData,
  TCorrectionTransfer,
  TPprDataCorrection,
  TWorkPlanCorrection,
  planWorkPeriods,
  planWorkPeriodsSet,
} from "@/2entities/pprTable";
import { createNewPprWorkInstance } from "../lib/createNewPprWorkInstance";
import { createNewWorkingManInstance } from "../lib/createNewWorkingManInstance";

type TWorkBasicInfo = { [id: string]: Omit<IWork, "periodicity_normal_data"> };

interface IPprTableDataContextProps {
  pprData: IPpr | null;
  workPlanCorrections: TWorkPlanCorrection;
  workBasicInfo: TWorkBasicInfo;
  addWork: (newWork: Partial<IPprData>) => void;
  updatePprData: (rowIndex: number, columnId: keyof IPprData | string, value: unknown) => void;
  updateNewValueInCorrection: (
    objectId: string,
    fieldName: keyof IPlanWorkPeriods,
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
}

const PprTableDataContext = createContext<IPprTableDataContextProps>({
  pprData: null,
  workPlanCorrections: {},
  workBasicInfo: {},
  addWork: () => {},
  updatePprData: () => {},
  updateNewValueInCorrection: () => {},
  updateTransfers: () => {},
  getCorrectionValue: () => 0,
  getTransfers: () => null,
  addWorkingMan: () => {},
  updateWorkingMan: () => {},
  deleteWorkingMan: () => {},
});

export const usePprTableData = () => useContext(PprTableDataContext);

interface IPprTableDataProviderProps extends PropsWithChildren {
  ppr: IPpr;
}

export const PprTableDataProvider: FC<IPprTableDataProviderProps> = ({ children, ppr }) => {
  //Данные ППРа
  const [pprData, setPprData] = useState<IPpr | null>(null);
  //Корректировки запланированных объемов работ ППРа в формате данных "объекта" (не в массиве)
  const [workPlanCorrections, setWorkPlanCorrections] = useState<TWorkPlanCorrection>({});
  //Данные о работах, применяемых в этом ППРе
  const [workBasicInfo, setWorksDataInPpr] = useState<TWorkBasicInfo>({});

  const handleCorrections = useCallback(() => {
    if (!pprData) {
      return;
    }

    const corrections: TWorkPlanCorrection = {};

    for (const id in pprData.corrections.works) {
      const workCorrection = pprData.corrections.works[id];

      planWorkPeriods.forEach((planPeriod) => {
        if (workCorrection && planPeriod in workCorrection) {
          const existValue = id in corrections ? corrections[id]![planPeriod] || 0 : 0;
          const additionalValue = workCorrection[planPeriod]?.diff || 0;

          corrections[id] = { ...corrections[id], [planPeriod]: existValue + additionalValue };

          workCorrection[planPeriod]?.transfers?.forEach((field) => {
            const existValue = id in corrections ? corrections[id]![field.fieldTo] || 0 : 0;
            const additionalValue = field.value;
            corrections[id] = { ...corrections[id], [field.fieldTo]: existValue + additionalValue };
          });
        }
      });
    }
    setWorkPlanCorrections(corrections);
  }, [pprData]);

  const handleWorksDataInPpr = useCallback(() => {
    if (!pprData) {
      return;
    }
    const worksData: TWorkBasicInfo = {};
    pprData.data.forEach((work) => (worksData[work.id] = { ...work }));
    setWorksDataInPpr(worksData);
  }, [pprData]);

  /**Добавить работу в ППР */
  const addWork = useCallback((newWork: Partial<IPprData>) => {
    setPprData((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        data: prev.data.concat(createNewPprWorkInstance(newWork)),
      };
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
  const updatePprData = useCallback((rowIndex: number, columnId: keyof IPprData | string, value: unknown) => {
    setPprData((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        data: prev.data.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...prev.data[rowIndex]!,
              [columnId]: value,
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
      setPprData((prev) => {
        if (!prev) {
          return prev;
        }
        if (!planWorkPeriodsSet.has(fieldName)) {
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
      setPprData((prev) => {
        if (!prev || !planWorkPeriodsSet.has(fieldFrom)) {
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
                  transfers: transfers === null ? null : transfers.filter((field) => field.value !== 0),
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
        pprData?.corrections.works &&
        objectId in pprData?.corrections.works &&
        pprData?.corrections.works[objectId] &&
        fieldFrom in pprData?.corrections.works[objectId]! &&
        pprData?.corrections.works[objectId]![fieldFrom as keyof IPlanWorkPeriods];

      if (!isHaveCorrection) {
        return [];
      }
      return pprData?.corrections.works[objectId]![fieldFrom as keyof IPlanWorkPeriods]!.transfers;
    },
    [pprData?.corrections]
  );

  /**Добавить рабочего в список людей ППР */
  const addWorkingMan = useCallback(() => {
    setPprData((prev) => {
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
    setPprData((prev) => {
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
    setPprData((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        peoples: prev.peoples.filter((man) => man.id !== id),
      };
    });
  }, []);

  // Если ППР не хранится в контексте, то записать его
  useEffect(() => {
    setPprData({ ...ppr });
  }, [ppr]);

  useEffect(() => {
    handleCorrections();
  }, [pprData?.corrections, handleCorrections]);

  useEffect(() => {
    handleWorksDataInPpr();
  }, [pprData?.data, handleWorksDataInPpr]);

  return (
    <PprTableDataContext.Provider
      value={{
        pprData,
        workPlanCorrections,
        workBasicInfo,
        addWork,
        updatePprData,
        updateNewValueInCorrection,
        updateTransfers,
        getTransfers,
        getCorrectionValue,
        addWorkingMan,
        updateWorkingMan,
        deleteWorkingMan,
      }}
    >
      {children}
    </PprTableDataContext.Provider>
  );
};
