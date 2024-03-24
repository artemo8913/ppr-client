"use client";
import { Dispatch, FC, PropsWithChildren, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { IPpr } from "@/1shared/api/pprTable";

interface IPprTableDataContextProps {
  pprData: IPpr | null;
  setPprData: Dispatch<SetStateAction<IPpr | null>>;
}

const defaultValue = null;

const PprTableDataContext = createContext<IPprTableDataContextProps>({
  pprData: defaultValue,
  setPprData: () => {},
});

export const usePprTableData = () => useContext(PprTableDataContext);

interface IPprTableDataProviderProps extends PropsWithChildren {
  ppr: IPpr;
}

export const PprTableDataProvider: FC<IPprTableDataProviderProps> = ({ children, ppr }) => {
  const [pprData, setPprData] = useState<IPpr | null>(defaultValue);
  useEffect(() => {
    setPprData({ ...ppr });
  }, []);
  return <PprTableDataContext.Provider value={{ pprData, setPprData }}>{children}</PprTableDataContext.Provider>;
};
