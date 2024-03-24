"use client";
import { Dispatch, FC, PropsWithChildren, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { IPpr } from "@/1shared/api/pprTable";

interface IPprTableDataContextProps {
  pprData: IPpr;
  setPprData: Dispatch<SetStateAction<IPpr>>;
}

const defaultValue: IPpr = {
  created_at: "",
  data: [],
  id_direction: 0,
  id_distance: 0,
  id_subdivision: 0,
  name: "",
  year: 0,
  id: "",
  status: "none",
  created_by: { id: "", id_direction: 0, id_distance: 0, id_subdivision: 0, role: "subdivision" },
  monthsStatus: {
    apr: "none",
    aug: "none",
    dec: "none",
    feb: "none",
    jan: "none",
    july: "none",
    june: "none",
    mar: "none",
    may: "none",
    nov: "none",
    oct: "none",
    sept: "none",
  },
};

const PprTableDataContext = createContext<IPprTableDataContextProps>({
  pprData: defaultValue,
  setPprData: () => {},
});

export const usePprTableData = () => useContext(PprTableDataContext);

interface IPprTableDataProviderProps extends PropsWithChildren {
  ppr: IPpr;
}

export const PprTableDataProvider: FC<IPprTableDataProviderProps> = ({ children, ppr }) => {
  const [pprData, setPprData] = useState(defaultValue);
  useEffect(() => {
    setPprData({ ...ppr });
  }, []);
  return <PprTableDataContext.Provider value={{ pprData, setPprData }}>{children}</PprTableDataContext.Provider>;
};
