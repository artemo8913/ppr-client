"use client";
import {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { TMonths } from "@/1shared/types/date";
import { IPpr, IPprData, TWorkPlanCorrection, planWorkPeriods } from "@/2entities/pprTable";
import { createNewPprWorkInstance } from "../lib/createNewPprWorkInstance";

interface IPprTableDataContextProps {
  pprData: IPpr | null;
  currentMonth: TMonths | null;
  workCorrections: TWorkPlanCorrection;
  setPprData: Dispatch<SetStateAction<IPpr | null>>;
  setCurrentMonth: Dispatch<SetStateAction<TMonths | null>>;
  addWork: (newWork: Partial<IPprData>) => void;
  addWorkingMan: () => void;
  deleteWorkingMan: (id: string) => void;
}

const PprTableDataContext = createContext<IPprTableDataContextProps>({
  pprData: null,
  currentMonth: null,
  workCorrections: {},
  setPprData: () => {},
  setCurrentMonth: () => {},
  addWork: () => {},
  addWorkingMan: () => {},
  deleteWorkingMan: () => {},
});

export const usePprTableData = () => useContext(PprTableDataContext);

interface IPprTableDataProviderProps extends PropsWithChildren {
  ppr: IPpr;
}

export const PprTableDataProvider: FC<IPprTableDataProviderProps> = ({ children, ppr }) => {
  //Данные ППРа
  const [pprData, setPprData] = useState<IPpr | null>(null);
  //Выбранный месяц в качестве текущего
  const [currentMonth, setCurrentMonth] = useState<TMonths | null>(null);
  //Изменения планов ППРа
  const [workCorrections, setWorkCorrections] = useState<TWorkPlanCorrection>({});

  const handleWorkCorrections = useCallback(() => {
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
    setWorkCorrections(corrections);
  }, [pprData, setWorkCorrections]);

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

  /**Добавить рабочего в список людей ППР */
  const addWorkingMan = useCallback(() => {
    setPprData((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        peoples: [
          ...prev.peoples,
          {
            id: String(new Date().toString() + Math.random()),
            full_name: "Иванов И.И.",
            work_position: "мкс",
            participation: 1,
          },
        ],
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
    handleWorkCorrections();
  }, [pprData?.corrections, handleWorkCorrections]);

  return (
    <PprTableDataContext.Provider
      value={{
        pprData,
        workCorrections,
        currentMonth,
        setPprData,
        setCurrentMonth,
        addWork,
        addWorkingMan,
        deleteWorkingMan,
      }}
    >
      {children}
    </PprTableDataContext.Provider>
  );
};
