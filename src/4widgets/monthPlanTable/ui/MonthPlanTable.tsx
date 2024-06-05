"use client";
import { FC } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { TPprTimePeriod } from "@/1shared/lib/date";
import { usePpr } from "@/1shared/providers/pprProvider";
import { IPprData } from "@/2entities/ppr";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";

type TMonthPlanColumns = IPprData;

const columnHelper = createColumnHelper<TMonthPlanColumns>();

const columns = (timePeriod: TPprTimePeriod) => [
  columnHelper.group({
    header: "Работа",
    columns: [
      columnHelper.accessor("name", {
        header: "Наименование работ",
        size: 800,
      }),
      columnHelper.accessor("measure", {
        header: "Измеритель",
      }),
    ],
  }),
  columnHelper.group({
    header: "План",
    size: 100,
    columns: [
      columnHelper.accessor(`${timePeriod}_plan_work`, {
        header: "Количество",
      }),
      columnHelper.accessor(`norm_of_time`, {
        header: "Норма времени на измеритель, чел.-ч",
      }),
      {
        accessorKey: `${timePeriod}_plan_time`,
        header: "Всего количество требуемое по норме",
      },
    ],
  }),
  columnHelper.group({
    header: "Выполнение",
    size: 100,
    columns: [
      columnHelper.accessor(`${timePeriod}_fact_work`, {
        header: "Количество",
        size: 50,
      }),
      columnHelper.accessor(`${timePeriod}_fact_time`, {
        header: "Фактически затрачено чел.-ч",
        size: 50,
      }),
    ],
  }),
];

interface IMonthPlanTableProps {}

export const MonthPlanTable: FC<IMonthPlanTableProps> = () => {
  const { ppr } = usePpr();
  const { currentTimePeriod } = usePprTableSettings();
  const table = useReactTable({
    data: ppr?.data || [],
    columns: columns(currentTimePeriod),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  return (
    <div className="overflow-auto">
      <table className="shadow-lg">
        <thead>
          {table.getHeaderGroups().map((headerGroup, rowIndex) => (
            <tr key={headerGroup.id}>
              {rowIndex === 0 && (
                <th className="border border-black" rowSpan={2}>
                  № п.п.
                </th>
              )}
              {headerGroup.headers.map((header) => {
                return (
                  <>
                    <th
                      className="border border-black"
                      key={header.id}
                      style={{ width: header.getSize() }}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  </>
                );
              })}
              {rowIndex === 0 && (
                <th className="border border-black" rowSpan={2}>
                  Примечание
                </th>
              )}
            </tr>
          ))}
        </thead>
        <tbody>
          {table
            .getRowModel()
            .rows.filter(
              (row) =>
                Boolean(Number(row.original[`${currentTimePeriod}_fact_work`])) ||
                Boolean(Number(row.original[`${currentTimePeriod}_plan_work`]))
            )
            .map((row, rowIndex) => (
              <tr key={row.id}>
                <td className="border border-black text-center">{rowIndex + 1}</td>
                {row.getVisibleCells().map((cell) => (
                  <td className="border border-black text-center" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td className="border border-black text-center"></td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
