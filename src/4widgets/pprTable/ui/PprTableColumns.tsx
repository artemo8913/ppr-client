import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { TableCell } from "@/1shared/ui/table";
import { monthsIntlRu } from "@/1shared/types/date";
import { usePprTableData, usePprTableViewSettings } from "@/1shared/providers/pprTableProvider";
import { IPprData, TAllMonthStatuses, TYearPprStatus, IPlanWorkPeriods } from "@/2entities/pprTable";
import {
  columnsDefault,
  columnsTitles,
  findPlanFactTitle,
  getColumnSettings,
  getPlanFactColumns,
  getTimePeriodsColumns,
} from "../lib/pprTableHelpers";
import { TableCellWithAdd } from "@/3features/pprTableAddWork";

export const useCreateDefaultColumns = (): ColumnDef<IPprData, any>[] => {
  const { filterColumns, currentTimePeriod, correctionView } = usePprTableViewSettings();
  const { pprData, workPlanCorrections } = usePprTableData();

  const columnHelper = createColumnHelper<IPprData>();

  const pprYearStatus: TYearPprStatus = pprData?.status || "done";
  const pprMonthsStatuses: TAllMonthStatuses | undefined = pprData?.months_statuses || undefined;

  return [
    // Часть таблицы до времени
    ...columnsDefault.map((column) => {
      return columnHelper.accessor(column, {
        header: (info) => {
          if (info.column.id === "name") {
            return <TableCellWithAdd isVertical value={columnsTitles[info.header.id as keyof IPprData]} />;
          }
          return <TableCell isVertical value={columnsTitles[info.header.id as keyof IPprData]} />;
        },
        cell: (info) => {
          const props = {
            value: info.getValue(),
            handleBlur: (value: string) =>
              info.table.options.meta?.updateData(info.row.index, info.column.id, value),
            ...getColumnSettings(info.column.id as keyof IPprData, pprYearStatus, currentTimePeriod, pprMonthsStatuses),
          };
          if (info.column.id === "name") {
            return <TableCellWithAdd {...props} />;
          }
          return <TableCell {...props} />;
        },
      });
    }),
    // Часть таблицы с данными объемов и чел.-ч по году и месяцами
    ...getTimePeriodsColumns(currentTimePeriod, filterColumns.months).map((month) => {
      return columnHelper.group({
        header: monthsIntlRu[month],
        columns: [
          ...getPlanFactColumns(month, filterColumns.planFact).map<ColumnDef<IPprData, any>>((field) => {
            return columnHelper.accessor(field, {
              header: (info) => <TableCell isVertical value={findPlanFactTitle(info.header.id)} />,
              cell: (info) => {
                const value =
                  Number(info.getValue()) +
                  (info.row.original.id in workPlanCorrections &&
                  (correctionView === "CORRECTED_PLAN" || correctionView === "CORRECTED_PLAN_WITH_ARROWS") &&
                  info.column.id in workPlanCorrections[info.row.original.id]!
                    ? Number(workPlanCorrections[info.row.original.id]![info.column.id as keyof IPlanWorkPeriods])
                    : 0);
                return (
                  <TableCell
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
                    {...getColumnSettings(
                      info.column.id as keyof IPprData,
                      pprYearStatus,
                      currentTimePeriod,
                      pprMonthsStatuses
                    )}
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
