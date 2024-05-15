"use client";
import { TPprTimePeriod } from "@/1shared/types/date";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePprTableData } from "./PprTableDataProvider";
import { findPossibleCurrentPprPeriod } from "../lib/findPossibleCurrentPprPeriod";

export type TFilterTimePeriodOption = "SHOW_ALL" | "SHOW_ONLY_CURRENT_MONTH" | "SHOW_CURRENT_QUARTAL";
export type TFilterPlanFactOption = "SHOW_ALL" | "SHOW_ONLY_PLAN" | "SHOW_ONLY_FACT" | "SHOW_ONLY_VALUES";

interface IPprTableSettings {
  filterColumns: { months: TFilterTimePeriodOption; planFact: TFilterPlanFactOption };
  currentTimePeriod: TPprTimePeriod;
}
interface IPprTableSettingsContext extends IPprTableSettings {
  setFilterMonths: (state: TFilterTimePeriodOption) => void;
  setFilterPlanFact: (state: TFilterPlanFactOption) => void;
  setTimePeriod: (timePeriod: TPprTimePeriod) => void;
}

const intitalSettings: IPprTableSettings = {
  filterColumns: {
    months: "SHOW_ALL",
    planFact: "SHOW_ALL",
  },
  currentTimePeriod: "year",
};

const initialContext: IPprTableSettingsContext = {
  ...intitalSettings,
  setFilterMonths: () => {},
  setFilterPlanFact: () => {},
  setTimePeriod: () => {},
};

const PprTableSettingsContext = createContext<IPprTableSettingsContext>(initialContext);
export const usePprTableSettings = () => useContext(PprTableSettingsContext);

export const PprTableSettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [pprTableSettings, setPprTableSettings] = useState<IPprTableSettings>(intitalSettings);
  const { pprData } = usePprTableData();

  const setFilterMonths = useCallback(
    (state: TFilterTimePeriodOption) =>
      setPprTableSettings((prev) => ({
        ...prev,
        filterColumns: {
          ...prev.filterColumns,
          months: state,
        },
      })),
    []
  );

  const setFilterPlanFact = useCallback(
    (state: TFilterPlanFactOption) =>
      setPprTableSettings((prev) => ({
        ...prev,
        filterColumns: {
          ...prev.filterColumns,
          planFact: state,
        },
      })),
    []
  );

  const setTimePeriod = useCallback(
    (timePeriod: TPprTimePeriod) =>
      setPprTableSettings((prev) => ({
        ...prev,
        currentTimePeriod: timePeriod,
      })),
    []
  );

  useEffect(() => {
    setTimePeriod(findPossibleCurrentPprPeriod(pprData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pprData?.months_statuses]);
  return (
    <PprTableSettingsContext.Provider
      value={{ ...pprTableSettings, setFilterMonths, setFilterPlanFact, setTimePeriod }}
    >
      {children}
    </PprTableSettingsContext.Provider>
  );
};
