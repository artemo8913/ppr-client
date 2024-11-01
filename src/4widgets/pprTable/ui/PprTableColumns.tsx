import {
  TFilterPlanFactOption,
  TFilterTimePeriodOption,
  usePprTableSettings,
} from "@/1shared/providers/pprTableSettingsProvider";
import { TTimePeriod, getQuartal, getMonthsByQuartal, TIME_PERIODS } from "@/1shared/const/date";
import { PPR_DATA_BASIC_FIELDS, IPprData } from "@/2entities/ppr";
import { useMemo } from "react";

function getTimePeriodsColumns(currentTimePeriod?: TTimePeriod, option?: TFilterTimePeriodOption): TTimePeriod[] {
  switch (option) {
    case "SHOW_ONLY_CURRENT_MONTH":
      return TIME_PERIODS.filter((timePeriod) => timePeriod === "year" || timePeriod === currentTimePeriod);
    case "SHOW_CURRENT_QUARTAL":
      const result: TTimePeriod[] = ["year"];
      return result.concat(getMonthsByQuartal(getQuartal(currentTimePeriod)));
    default:
      return TIME_PERIODS;
  }
}

function getPlanFactColumns(pprTimePeriod: TTimePeriod, option?: TFilterPlanFactOption): Array<keyof IPprData> {
  switch (option) {
    case "SHOW_ONLY_PLAN":
      return [`${pprTimePeriod}_plan_work`, `${pprTimePeriod}_plan_time`];
    case "SHOW_ONLY_FACT":
      return [`${pprTimePeriod}_fact_work`, `${pprTimePeriod}_fact_norm_time`, `${pprTimePeriod}_fact_time`];
    case "SHOW_ONLY_VALUES":
      return [`${pprTimePeriod}_plan_work`, `${pprTimePeriod}_fact_work`];
    default:
      return [
        `${pprTimePeriod}_plan_work`,
        `${pprTimePeriod}_plan_time`,
        `${pprTimePeriod}_fact_work`,
        `${pprTimePeriod}_fact_norm_time`,
        `${pprTimePeriod}_fact_time`,
      ];
  }
}

function getPlanFactColumnsCount(option?: TFilterPlanFactOption) {
  switch (option) {
    case "SHOW_ONLY_PLAN":
      return 2;
    case "SHOW_ONLY_FACT":
      return 3;
    case "SHOW_ONLY_VALUES":
      return 2;
    default:
      return 5;
  }
}

export const useCreateColumns = (): {
  basicFields: (keyof IPprData)[];
  timePeriods: TTimePeriod[];
  planFactFields: (keyof IPprData)[];
  allFields: (keyof IPprData)[];
  monthColSpan: number;
} => {
  const { filterColumns, currentTimePeriod } = usePprTableSettings();

  const timePeriods = useMemo(
    () => getTimePeriodsColumns(currentTimePeriod, filterColumns.months),
    [currentTimePeriod, filterColumns.months]
  );

  const planFactFields = useMemo(
    () =>
      getTimePeriodsColumns(currentTimePeriod, filterColumns.months)
        .map((month) => getPlanFactColumns(month, filterColumns.planFact))
        .flat(),
    [currentTimePeriod, filterColumns.months, filterColumns.planFact]
  );

  const allFields = useMemo(() => PPR_DATA_BASIC_FIELDS.concat(planFactFields), [planFactFields]);

  const monthColSpan = useMemo(() => getPlanFactColumnsCount(filterColumns.planFact), [filterColumns.planFact]);

  return {
    basicFields: PPR_DATA_BASIC_FIELDS,
    allFields,
    timePeriods,
    planFactFields,
    monthColSpan,
  };
};
