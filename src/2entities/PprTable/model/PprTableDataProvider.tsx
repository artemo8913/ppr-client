"use client";
import { Dispatch, FC, PropsWithChildren, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { IPpr } from "@/1shared/api/pprTable";

interface IPprTableDataContextProps {
  pprData: IPpr;
  setPprData: Dispatch<SetStateAction<IPpr>>;
}

const defaultValue: IPpr = { created_at: "", data: [], id: "", status: "none" };

const PprTableDataContext = createContext<IPprTableDataContextProps>({
  pprData: defaultValue,
  setPprData: () => {},
});

export const usePprTableData = () => useContext(PprTableDataContext);

interface IPprTableDataProviderProps extends PropsWithChildren {
    ppr: IPpr
}

export const PprTableDataProvider: FC<IPprTableDataProviderProps> = ({ children, ppr }) => {
  const [pprData, setPprData] = useState(defaultValue);
  useEffect(() => {
    setPprData({ ...ppr });
  }, [setPprData, ppr]);
  return <PprTableDataContext.Provider value={{ pprData, setPprData }}>{children}</PprTableDataContext.Provider>;
};
