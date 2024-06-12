import {
  TFilterPlanFactOption,
  TFilterTimePeriodOption,
  usePprTableSettings,
} from "@/1shared/providers/pprTableSettingsProvider";
import { IPprData } from "@/2entities/ppr";
import { TTimePeriod, getCurrentQuartal, getQuartalMonths, timePeriods } from "@/1shared/lib/date";

const columnsDefault: Array<keyof IPprData> = [
  "name",
  "location",
  "line_class",
  "total_count",
  "entry_year",
  "periodicity_normal",
  "periodicity_fact",
  "last_maintenance_year",
  "norm_of_time",
  "norm_of_time_document",
  "measure",
  "unity",
] as const;

function getTimePeriodsColumns(currentTimePeriod?: TTimePeriod, option?: TFilterTimePeriodOption): TTimePeriod[] {
  switch (option) {
    case "SHOW_ONLY_CURRENT_MONTH":
      return timePeriods.filter((timePeriod) => timePeriod === "year" || timePeriod === currentTimePeriod);
    case "SHOW_CURRENT_QUARTAL":
      const result: TTimePeriod[] = ["year"];
      return result.concat(getQuartalMonths(getCurrentQuartal(currentTimePeriod)));
    default:
      return timePeriods;
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

export const useCreateColumns = (): {
  columnsDefault: (keyof IPprData)[];
  timePeriods: TTimePeriod[];
  timePeriodsColums: (keyof IPprData)[][];
} => {
  const { filterColumns, currentTimePeriod } = usePprTableSettings();
  return {
    columnsDefault,
    timePeriods: getTimePeriodsColumns(currentTimePeriod, filterColumns.months),
    timePeriodsColums: getTimePeriodsColumns(currentTimePeriod, filterColumns.months).map((month) =>
      getPlanFactColumns(month, filterColumns.planFact)
    ),
  };
};
