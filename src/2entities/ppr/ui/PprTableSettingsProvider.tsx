"use client";
import { FC, PropsWithChildren, createContext, useCallback, useContext, useState } from "react";

import { TimePeriod } from "@/1shared/lib/date";

export type TFilterTimePeriodOption = "SHOW_ALL" | "SHOW_ONLY_CURRENT_MONTH" | "SHOW_CURRENT_QUARTAL";
export type TFilterPlanFactOption = "SHOW_ALL" | "SHOW_ONLY_PLAN" | "SHOW_ONLY_FACT" | "SHOW_ONLY_VALUES";
export type TPprView = "INITIAL_PLAN" | "INITIAL_PLAN_WITH_ARROWS" | "CORRECTED_PLAN" | "CORRECTED_PLAN_WITH_ARROWS";
interface TFilterColumns {
  months: TFilterTimePeriodOption;
  planFact: TFilterPlanFactOption;
}

interface IPprTableSettings {
  filterColumns: TFilterColumns;
  currentTimePeriod: TimePeriod;
  pprView: TPprView;
  tableWidthPercent: number;
  fontSizePx: number;
  headerHeightPx: number;
  isUniteSameWorks: boolean;
  isBacklightNotCommonWork: boolean;
  isBacklightNotApprovedWork: boolean;
  isBacklightRowAndCellOnHover: boolean;
}

export interface IPprTableSettingsContext extends IPprTableSettings {
  setFilterMonths: (state: TFilterTimePeriodOption) => void;
  setFilterPlanFact: (state: TFilterPlanFactOption) => void;
  setTimePeriod: (timePeriod: TimePeriod) => void;
  setPprView: (correctionView: TPprView) => void;
  setTableWidthPercent: (tableWidthPercent: number) => void;
  setFontSizePx: (fontSize: number) => void;
  setHeaderHeightPx: (headerHeightPx: number) => void;
  setIsUniteSameWorks: (isUniteSameWorks: boolean) => void;
  setIsBacklightNotCommonWork: (isBacklightNotCommonWork: boolean) => void;
  setIsBacklightNotApprovedWork: (isBacklightNotApprovedWork: boolean) => void;
  setIsBacklightRowAndCellOnHover: (isBacklightRowAndCellOnHover: boolean) => void;
}

const INIT_SETTINGS: IPprTableSettings = {
  filterColumns: {
    months: "SHOW_ALL",
    planFact: "SHOW_ALL",
  },
  currentTimePeriod: "year",
  pprView: "CORRECTED_PLAN_WITH_ARROWS",
  tableWidthPercent: 100,
  fontSizePx: 12,
  headerHeightPx: 350,
  isUniteSameWorks: true,
  isBacklightNotCommonWork: false,
  isBacklightNotApprovedWork: false,
  isBacklightRowAndCellOnHover: true,
};

const INIT_CONTEXT: IPprTableSettingsContext = {
  ...INIT_SETTINGS,
  setFilterMonths: () => {},
  setFilterPlanFact: () => {},
  setTimePeriod: () => {},
  setPprView: () => {},
  setTableWidthPercent: () => {},
  setFontSizePx: () => {},
  setHeaderHeightPx: () => {},
  setIsUniteSameWorks: () => {},
  setIsBacklightNotCommonWork: () => {},
  setIsBacklightNotApprovedWork: () => {},
  setIsBacklightRowAndCellOnHover: () => {},
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
    (timePeriod: TimePeriod) =>
      setPprTableSettings((prev) => ({
        ...prev,
        currentTimePeriod: timePeriod,
      })),
    []
  );

  const setPprView = useCallback(
    (correctionView: TPprView) =>
      setPprTableSettings((prev) => ({
        ...prev,
        pprView: correctionView,
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

  const setIsBacklightNotCommonWork = useCallback((isBacklightNotCommonWork: boolean) => {
    setPprTableSettings((prev) => ({ ...prev, isBacklightNotCommonWork }));
  }, []);

  const setIsBacklightNotApprovedWork = useCallback((isBacklightNotApprovedWork: boolean) => {
    setPprTableSettings((prev) => ({ ...prev, isBacklightNotApprovedWork }));
  }, []);

  const setIsBacklightRowAndCellOnHover = useCallback((isBacklightRowAndCellOnHover: boolean) => {
    setPprTableSettings((prev) => ({ ...prev, isBacklightRowAndCellOnHover }));
  }, []);

  return (
    <PprTableSettingsContext.Provider
      value={{
        ...pprTableSettings,
        setPprView,
        setFilterMonths,
        setFilterPlanFact,
        setTimePeriod,
        setTableWidthPercent,
        setFontSizePx,
        setHeaderHeightPx,
        setIsUniteSameWorks,
        setIsBacklightNotCommonWork,
        setIsBacklightNotApprovedWork,
        setIsBacklightRowAndCellOnHover,
      }}
    >
      {children}
    </PprTableSettingsContext.Provider>
  );
};
