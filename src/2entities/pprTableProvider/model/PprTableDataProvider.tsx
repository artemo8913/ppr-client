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
import { IPpr, IPprData } from "@/1shared/api/pprTable";
import { createNewPprWorkInstance } from "../lib/createNewPprWorkInstance";

interface IPprTableDataContextProps {
  pprData: IPpr | null;
  setPprData: Dispatch<SetStateAction<IPpr | null>>;
  addWork: (newWork: Partial<IPprData>) => void;
}

const defaultValue = null;

const PprTableDataContext = createContext<IPprTableDataContextProps>({
  pprData: defaultValue,
  setPprData: () => {},
  addWork: () => {},
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
  return (
    <PprTableDataContext.Provider value={{ pprData, setPprData, addWork }}>{children}</PprTableDataContext.Provider>
  );
};
