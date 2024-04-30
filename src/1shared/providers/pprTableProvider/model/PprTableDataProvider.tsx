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
import { IPpr, IPprData } from "@/2entities/pprTable";
import { createNewPprWorkInstance } from "../lib/createNewPprWorkInstance";
import { TMonths } from "@/1shared/types/date";

interface IPprTableDataContextProps {
  pprData: IPpr | null;
  currentMonth: TMonths | null;
  setPprData: Dispatch<SetStateAction<IPpr | null>>;
  setCurrentMonth: Dispatch<SetStateAction<TMonths | null>>;
  addWork: (newWork: Partial<IPprData>) => void;
  addWorkingMan: () => void;
  deleteWorkingMan: (id: string) => void;
}

const PprTableDataContext = createContext<IPprTableDataContextProps>({
  pprData: null,
  currentMonth: null,
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
  const [pprData, setPprData] = useState<IPpr | null>(null);
  const [currentMonth, setCurrentMonth] = useState<TMonths | null>(null);

  // Если ППР не хранится в контексте, то записать его
  useEffect(() => {
    setPprData({ ...ppr });
  }, [ppr]);

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
  return (
    <PprTableDataContext.Provider
      value={{ pprData, setPprData, currentMonth, setCurrentMonth, addWork, addWorkingMan, deleteWorkingMan }}
    >
      {children}
    </PprTableDataContext.Provider>
  );
};
