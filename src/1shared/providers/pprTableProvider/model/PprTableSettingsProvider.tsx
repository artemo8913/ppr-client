"use client";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useState } from "react";

export type TFilterMonthsOption = "SHOW_ALL" | "SHOW_ONLY_CURRENT_MONTH" | "SHOW_CURRENT_QUARTAL";
export type TFilterPlanFactOption = "SHOW_ALL" | "SHOW_ONLY_PLAN" | "SHOW_ONLY_FACT" | "SHOW_ONLY_VALUES";

interface IPprTableSettingsProps {
  filterColumns: { months: TFilterMonthsOption; planFact: TFilterPlanFactOption };
  filterMonths: (state: TFilterMonthsOption) => void;
  filterPlanFact: (state: TFilterPlanFactOption) => void;
}

const initialSetting: IPprTableSettingsProps = {
  filterColumns: {
    months: "SHOW_ALL",
    planFact: "SHOW_ALL",
  },
  filterMonths: () => {},
  filterPlanFact: () => {},
};

const PprTableSettingsContext = createContext<IPprTableSettingsProps>(initialSetting);
export const usePprTableSettings = () => useContext(PprTableSettingsContext);

export const PprTableSettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [pprTableSettings, setPprTableSettings] = useState(initialSetting);

  const filterMonths = useCallback(
    (state: TFilterMonthsOption) =>
      setPprTableSettings((prev) => ({
        ...prev,
        filterColumns: {
          ...prev.filterColumns,
          months: state,
        },
      })),
    []
  );

  const filterPlanFact = useCallback(
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

  return (
    <PprTableSettingsContext.Provider value={{ ...pprTableSettings, filterMonths, filterPlanFact }}>
      {children}
    </PprTableSettingsContext.Provider>
  );
};
