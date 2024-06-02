"use client";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useState } from "react";
import { TPprTimePeriod } from "@/1shared/lib/date";

export type TFilterTimePeriodOption = "SHOW_ALL" | "SHOW_ONLY_CURRENT_MONTH" | "SHOW_CURRENT_QUARTAL";
export type TFilterPlanFactOption = "SHOW_ALL" | "SHOW_ONLY_PLAN" | "SHOW_ONLY_FACT" | "SHOW_ONLY_VALUES";
export interface TFilterColumns {
  months: TFilterTimePeriodOption;
  planFact: TFilterPlanFactOption;
}
export type TCorrectionView =
  | "INITIAL_PLAN"
  | "INITIAL_PLAN_WITH_ARROWS"
  | "CORRECTED_PLAN"
  | "CORRECTED_PLAN_WITH_ARROWS";

interface IPprTableSettings {
  filterColumns: TFilterColumns;
  currentTimePeriod: TPprTimePeriod;
  correctionView: TCorrectionView;
  tableWidthPercent: number;
  fontSizePx: number;
  headerHeightPx: number;
}
interface IPprTableSettingsContext extends IPprTableSettings {
  setFilterMonths: (state: TFilterTimePeriodOption) => void;
  setFilterPlanFact: (state: TFilterPlanFactOption) => void;
  setTimePeriod: (timePeriod: TPprTimePeriod) => void;
  setCorrectionView: (correctionView: TCorrectionView) => void;
  setTableWidthPercent: (tableWidthPercent: number) => void;
  setFontSizePx: (fontSize: number) => void;
  setHeaderHeightPx: (headerHeightPx: number) => void;
}

const intitalSettings: IPprTableSettings = {
  filterColumns: {
    months: "SHOW_ALL",
    planFact: "SHOW_ALL",
  },
  currentTimePeriod: "year",
  correctionView: "CORRECTED_PLAN",
  tableWidthPercent: 100,
  fontSizePx: 12,
  headerHeightPx: 250,
};

const initialContext: IPprTableSettingsContext = {
  ...intitalSettings,
  setFilterMonths: () => {},
  setFilterPlanFact: () => {},
  setTimePeriod: () => {},
  setCorrectionView: () => {},
  setTableWidthPercent: () => {},
  setFontSizePx: () => {},
  setHeaderHeightPx: () => {},
};

const PprTableViewSettingsContext = createContext<IPprTableSettingsContext>(initialContext);

export const usePprTableViewSettings = () => useContext(PprTableViewSettingsContext);

export const PprTableViewSettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [pprTableSettings, setPprTableSettings] = useState<IPprTableSettings>(intitalSettings);

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

  const setCorrectionView = useCallback(
    (correctionView: TCorrectionView) =>
      setPprTableSettings((prev) => ({
        ...prev,
        correctionView,
      })),
    []
  );

  const setTableWidthPercent = useCallback((tableWidthPercent: number) => {
    setPprTableSettings((prev) => ({ ...prev, tableWidthPercent }));
  }, []);

  const setFontSizePx = useCallback((fontSizePx: number) => {
    setPprTableSettings((prev) => ({ ...prev, fontSizePx }));
  }, []);

  const setHeaderHeightPx = useCallback((headerHeightPx: number) => {
    setPprTableSettings((prev) => ({ ...prev, headerHeightPx }));
  }, []);

  return (
    <PprTableViewSettingsContext.Provider
      value={{
        ...pprTableSettings,
        setCorrectionView,
        setFilterMonths,
        setFilterPlanFact,
        setTimePeriod,
        setTableWidthPercent,
        setFontSizePx,
        setHeaderHeightPx,
      }}
    >
      {children}
    </PprTableViewSettingsContext.Provider>
  );
};
