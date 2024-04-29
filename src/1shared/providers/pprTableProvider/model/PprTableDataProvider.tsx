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

interface IPprTableDataContextProps {
  pprData: IPpr | null;
  setPprData: Dispatch<SetStateAction<IPpr | null>>;
  addWork: (newWork: Partial<IPprData>) => void;
  addWorkingMan: () => void;
  deleteWorkingMan: (id: string) => void;
}

const defaultValue = null;

const PprTableDataContext = createContext<IPprTableDataContextProps>({
  pprData: defaultValue,
  setPprData: () => {},
  addWork: () => {},
  addWorkingMan: () => {},
  deleteWorkingMan: (id: string) => {},
});

export const usePprTableData = () => useContext(PprTableDataContext);

interface IPprTableDataProviderProps extends PropsWithChildren {
  ppr: IPpr;
}

export const PprTableDataProvider: FC<IPprTableDataProviderProps> = ({ children, ppr }) => {
  const [pprData, setPprData] = useState<IPpr | null>(defaultValue);

  useEffect(() => {
    setPprData({ ...ppr });
  }, [ppr]);

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
    <PprTableDataContext.Provider value={{ pprData, setPprData, addWork, addWorkingMan, deleteWorkingMan }}>
      {children}
    </PprTableDataContext.Provider>
  );
};
