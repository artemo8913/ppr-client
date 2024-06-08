import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { IPprData } from "@/2entities/ppr";
import { getPlanFactColumns, getTimePeriodsColumns } from "../lib/pprTableColumnsHelper";
import { TPprTimePeriod } from "@/1shared/lib/date";

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

export const useCreateColumns = (): {
  columnsDefault: (keyof IPprData)[];
  timePeriods: TPprTimePeriod[];
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
