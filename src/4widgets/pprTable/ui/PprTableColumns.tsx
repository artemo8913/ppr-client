import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { tymePeriodIntlRu } from "@/1shared/lib/date";
import { usePprTableData, usePprTableViewSettings } from "@/1shared/providers/pprTableProvider";
import { IPprData, TAllMonthStatuses, TYearPprStatus, IPlanWorkPeriods } from "@/2entities/ppr";
import {
  columnsDefault,
  getColumnTitle,
  findPlanFactTitle,
  getColumnSettings,
  getPlanFactColumns,
  getTimePeriodsColumns,
} from "../lib/pprTableColumnsHelper";
import { PprTableCell } from "./PprTableCell";

export const useCreateColumns = (
  pprYearStatus: TYearPprStatus,
  pprMonthsStatuses?: TAllMonthStatuses
): ColumnDef<IPprData, any>[] => {
  const { filterColumns, currentTimePeriod, correctionView } = usePprTableViewSettings();
  const { getCorrectionValue } = usePprTableData();
  const columnHelper = createColumnHelper<IPprData>();

  return [
    // Часть таблицы до времени
    ...columnsDefault.map((column) => {
      return columnHelper.accessor(column, {
        header: (info) => (
          <PprTableCell
            isWithWorkControl={info.column.id === "name"}
            isVertical
            value={getColumnTitle(info.header.id)}
          />
        ),
        cell: (info) => (
          <PprTableCell
            id={info.row.original.id}
            value={info.getValue()}
            handleBlur={(value: string) => info.table.options.meta?.updateData(info.row.index, info.column.id, value)}
            isWithWorkControl={info.column.id === "name"}
            {...getColumnSettings(info.column.id, pprYearStatus, currentTimePeriod, pprMonthsStatuses)}
          />
        ),
      });
    }),
    // Часть таблицы с данными объемов и чел.-ч по году и месяцами
    ...getTimePeriodsColumns(currentTimePeriod, filterColumns.months).map((month) => {
      return columnHelper.group({
        header: tymePeriodIntlRu[month],
        columns: [
          ...getPlanFactColumns(month, filterColumns.planFact).map<ColumnDef<IPprData, any>>((field) => {
            return columnHelper.accessor(field, {
              header: (info) => <PprTableCell isVertical value={findPlanFactTitle(info.header.id)} />,
              cell: (info) => {
                const value =
                  Number(info.getValue()) +
                  (correctionView === "CORRECTED_PLAN" || correctionView === "CORRECTED_PLAN_WITH_ARROWS"
                    ? getCorrectionValue(info.row.original.id, info.column.id)
                    : 0);

                return (
                  <PprTableCell
                    isVertical
                    value={value}
                    handleBlur={(value: string) => {
                      // Если изменяемая ячейка не план работ или же работа ещё не утверждена,
                      // то просто изменяется содержимое ППРа
                      if (!info.cell.column.id.endsWith("_plan_work") || !info.row.original.is_work_aproved) {
                        info.table.options.meta?.updateData(info.row.index, info.column.id, value);
                        // иначе создаётся корректировка
                      } else {
                        info.table.options.meta?.correctPlan &&
                          info.table.options.meta?.correctPlan(
                            info.row.original.id,
                            info.column.id as keyof IPlanWorkPeriods,
                            Number(value),
                            Number(info.row.original[info.column.id as keyof IPprData])
                          );
                      }
                    }}
                    {...getColumnSettings(info.column.id, pprYearStatus, currentTimePeriod, pprMonthsStatuses)}
                  />
                );
              },
            });
          }),
        ],
      });
    }),
  ];
};
