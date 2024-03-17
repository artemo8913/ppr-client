"use client";
import { Dispatch, FC, PropsWithChildren, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { IWork } from "@/1shared/api/work";

interface IWorkDataContextProps {
  workData: IWork[];
}

const defaultValue: IWork[] = [];

const WorkDataContext = createContext<IWorkDataContextProps>({
  workData: defaultValue,
});

interface IPprTableDataProviderProps extends PropsWithChildren {
  works: IWork[];
}

export const PprTableDataProvider: FC<IPprTableDataProviderProps> = ({ children, works }) => {
  const [workData, setWorkData] = useState(defaultValue);
  useEffect(() => {
    setWorkData(works);
  }, []);
  return <WorkDataContext.Provider value={{ workData }}>{children}</WorkDataContext.Provider>;
};

export const useWorkData = () => useContext(WorkDataContext);
