import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { usePprTableSettings } from "@/1shared/providers/pprTableProvider";
import { monthsIntlRu } from "@/1shared/types/date";
import { TableCell } from "@/1shared/ui/table";
import { IPprData, TAllMonthStatuses, TYearPprStatus } from "@/2entities/pprTable";
import { TableCellWithAdd } from "@/3features/pprTableAddWork";
import {
  columnsDefault,
  columnsTitles,
  findPlanFactTitle,
  getColumnSettings,
  getPlanFactColumns,
  getTimePeriodsColumns,
} from "../lib/pprTableHelpers";

export const useCreateDefaultColumns = (
  pprYearStatus: TYearPprStatus,
  pprMonthsStatuses?: TAllMonthStatuses
): ColumnDef<IPprData, any>[] => {
  const { filterColumns, currentTimePeriod } = usePprTableSettings();

  const columnHelper = createColumnHelper<IPprData>();

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
            handleBlur: (value: string) => info.table.options.meta?.updateData(info.row.index, info.column.id, value),
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
              cell: (info) => (
                <TableCell
                  isVertical
                  value={info.getValue()}
                  handleBlur={(value) => info.table.options.meta?.updateData(info.row.index, info.column.id, value)}
                  {...getColumnSettings(
                    info.column.id as keyof IPprData,
                    pprYearStatus,
                    currentTimePeriod,
                    pprMonthsStatuses
                  )}
                />
              ),
            });
          }),
        ],
      });
    }),
  ];
};
