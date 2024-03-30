import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { IPprData } from "@/1shared/api/pprTable";
import { TPprTimePeriod, monthsIntlRu } from "@/1shared/types/date";
import { TYearPprStatus } from "@/1shared/api/pprTable";
import { TableCell } from "@/1shared/ui/table";
import { TableCellWithAdd } from "@/3features/pprTableAddWork";
import {
  columnsDefault,
  columnsTitles,
  findPlanFactTitle,
  getColumnSettings,
  getPlanTimeColumnsNames,
} from "../lib/pprTableSettings";

export const createDefaultColumns = (
  status: TYearPprStatus,
  months: TPprTimePeriod[],
  currentMonth: TPprTimePeriod
): ColumnDef<IPprData, any>[] => {
  const columnHelper = createColumnHelper<IPprData>();
  return [
    // Часть таблицы до времени
    ...columnsDefault.map((column) => {
      return columnHelper.accessor(column, {
        header: (info) => {
          if (info.column.id === "name") {
            return <TableCellWithAdd isVertical value={columnsTitles[info.header.id as keyof IPprData]}  />;
          }
          return <TableCell isVertical value={columnsTitles[info.header.id as keyof IPprData]} />;
        },
        cell: (info) => {
          const props = {
            value: info.getValue(),
            handleBlur: (value: string) => info.table.options.meta?.updateData(info.row.index, info.column.id, value),
            ...getColumnSettings(status, currentMonth)[info.column.id as keyof IPprData],
          };
          if (info.column.id === "name") {
            return <TableCellWithAdd {...props} />;
          }
          return <TableCell {...props} />;
        },
      });
    }),
    // Часть таблицы с данными объемов и чел.-ч по году и месяцами
    ...months.map((month) => {
      return columnHelper.group({
        header: monthsIntlRu[month],
        columns: [
          ...getPlanTimeColumnsNames(month).map<ColumnDef<IPprData, any>>((field) => {
            return columnHelper.accessor(field, {
              header: (info) => <TableCell isVertical value={findPlanFactTitle(info.header.id)} />,
              cell: (info) => (
                <TableCell
                  isVertical
                  value={info.getValue()}
                  handleBlur={(value) => info.table.options.meta?.updateData(info.row.index, info.column.id, value)}
                  {...getColumnSettings(status, currentMonth)[info.column.id as keyof IPprData]}
                />
              ),
            });
          }),
        ],
      });
    }),
  ];
};
