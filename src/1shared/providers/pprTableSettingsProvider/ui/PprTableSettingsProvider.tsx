"use client";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useState } from "react";

import { TTimePeriod } from "@/1shared/const/date";

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
  currentTimePeriod: TTimePeriod;
  correctionView: TCorrectionView;
  tableWidthPercent: number;
  fontSizePx: number;
  headerHeightPx: number;
  isUniteSameWorks: boolean;
  isBacklightCommonWork: boolean;
}

export interface IPprTableSettingsContext extends IPprTableSettings {
  setFilterMonths: (state: TFilterTimePeriodOption) => void;
  setFilterPlanFact: (state: TFilterPlanFactOption) => void;
  setTimePeriod: (timePeriod: TTimePeriod) => void;
  setCorrectionView: (correctionView: TCorrectionView) => void;
  setTableWidthPercent: (tableWidthPercent: number) => void;
  setFontSizePx: (fontSize: number) => void;
  setHeaderHeightPx: (headerHeightPx: number) => void;
  setIsUniteSameWorks: (isUniteSameWorks: boolean) => void;
  setIsBacklightCommonWork: (isBacklightCommonWork: boolean) => void;
}

const INIT_SETTINGS: IPprTableSettings = {
  filterColumns: {
    months: "SHOW_ALL",
    planFact: "SHOW_ALL",
  },
  currentTimePeriod: "year",
  correctionView: "CORRECTED_PLAN_WITH_ARROWS",
  tableWidthPercent: 100,
  fontSizePx: 12,
  headerHeightPx: 350,
  isUniteSameWorks: true,
  isBacklightCommonWork: false,
};

const INIT_CONTEXT: IPprTableSettingsContext = {
  ...INIT_SETTINGS,
  setFilterMonths: () => {},
  setFilterPlanFact: () => {},
  setTimePeriod: () => {},
  setCorrectionView: () => {},
  setTableWidthPercent: () => {},
  setFontSizePx: () => {},
  setHeaderHeightPx: () => {},
  setIsUniteSameWorks: () => {},
  setIsBacklightCommonWork: () => {},
};

const PprTableSettingsContext = createContext<IPprTableSettingsContext>(INIT_CONTEXT);

export const usePprTableSettings = () => useContext(PprTableSettingsContext);

export const PprTableSettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [pprTableSettings, setPprTableSettings] = useState<IPprTableSettings>(INIT_SETTINGS);

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
    (timePeriod: TTimePeriod) =>
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

  const setIsUniteSameWorks = useCallback((isUniteSameWorks: boolean) => {
    setPprTableSettings((prev) => ({ ...prev, isUniteSameWorks }));
  }, []);

  const setIsBacklightCommonWork = useCallback((isBacklightCommonWork: boolean) => {
    setPprTableSettings((prev) => ({ ...prev, isBacklightCommonWork }));
  }, []);

  return (
    <PprTableSettingsContext.Provider
      value={{
        ...pprTableSettings,
        setCorrectionView,
        setFilterMonths,
        setFilterPlanFact,
        setTimePeriod,
        setTableWidthPercent,
        setFontSizePx,
        setHeaderHeightPx,
        setIsUniteSameWorks,
        setIsBacklightCommonWork,
      }}
    >
      {children}
    </PprTableSettingsContext.Provider>
  );
};
