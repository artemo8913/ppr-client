import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { IPprData } from "@/2entities/ppr";
import { columnsDefault, getPlanFactColumns, getTimePeriodsColumns } from "../lib/pprTableColumnsHelper";

export const useCreateColumns = (): (keyof IPprData)[] => {
  const { filterColumns, currentTimePeriod } = usePprTableSettings();
  return [
    // Часть таблицы до времени
    ...columnsDefault,
    // Часть таблицы с данными объемов и чел.-ч по году и месяцами
    ...getTimePeriodsColumns(currentTimePeriod, filterColumns.months)
      .map((month) => getPlanFactColumns(month, filterColumns.planFact))
      .flat(1),
  ];
};
