"use client";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from "react";
import { IWork } from "@/2entities/work";
import {
  IPlanWorkPeriods,
  IPpr,
  IPprData,
  TPprDataCorrection,
  TWorkPlanCorrection,
  planWorkPeriods,
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
  updatePprDataCorrections: (
    objectId: string,
    fieldName: keyof IPlanWorkPeriods,
    newValue: number,
    oldValue: number
  ) => void;
  getCorrectionValue: (workId: string, fieldName: keyof IPlanWorkPeriods | string) => number;
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
  updatePprDataCorrections: () => {},
  getCorrectionValue: () => 0,
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

          workCorrection[planPeriod]?.fieldsTo?.forEach((field) => {
            const existValue = id in corrections ? corrections[id]![field.fieldNameTo] || 0 : 0;
            const additionalValue = field.value;
            corrections[id] = { ...corrections[id], [field.fieldNameTo]: existValue + additionalValue };
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

  /**Обновить данные о корректировке ППРа */
  const updatePprDataCorrections = useCallback(
    (objectId: string, fieldName: keyof IPlanWorkPeriods, newValue: number, oldValue: number) => {
      setPprData((prev) => {
        if (!prev) {
          return prev;
        }
        const newDiff = newValue - oldValue;
        const prevFieldsTo = prev.corrections.works[objectId]
          ? prev.corrections.works[objectId]![fieldName]?.fieldsTo
          : undefined;
        const newCorrection: TPprDataCorrection<IPlanWorkPeriods> = {
          ...prev.corrections.works[objectId],
          [fieldName]: {
            newValue,
            diff: newDiff,
            fieldsTo: prevFieldsTo,
          },
        };
        return {
          ...prev,
          corrections: {
            ...prev.corrections,
            works: {
              ...prev.corrections.works,
              [objectId]: {
                ...newCorrection,
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
        updatePprDataCorrections,
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
