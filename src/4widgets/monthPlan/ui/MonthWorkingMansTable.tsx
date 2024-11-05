"use client";
import { FC } from "react";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { TTimePeriod } from "@/1shared/const/date";
import { usePpr } from "@/1shared/providers/pprProvider";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { IWorkingManYearPlan } from "@/2entities/ppr";

const columnHelper = createColumnHelper<
  IWorkingManYearPlan & { expl_plan?: string; expl_fact?: string; expl_per?: string; all_per?: string }
>();

const columns = (timePeriod: TTimePeriod) => [
  columnHelper.group({
    header: "Данные о работнике",
    columns: [
      columnHelper.accessor("full_name", {
        header: "фамилия, имя, отчество",
      }),
      columnHelper.accessor("work_position", {
        header: "должность, профессия, разряд рабочих, совмещаемые профессии",
      }),
      columnHelper.accessor("participation", {
        header: "доля участия",
      }),
    ],
  }),
  columnHelper.group({
    header: "настой часов, чел.-ч",
    columns: [
      columnHelper.accessor(`${timePeriod}_plan_norm_time`, {
        header: "по норме",
        footer: "XXX",
      }),
      columnHelper.accessor(`${timePeriod}_plan_tabel_time`, {
        header: "по табелю",
        footer: "XXX",
      }),
      columnHelper.accessor(`${timePeriod}_plan_time`, {
        header: "нормированное задание",
        footer: "XXX",
      }),
    ],
  }),
  columnHelper.accessor("expl_plan", {
    header: "Заданно по эксплуатационному плану, чел.-ч",
    footer: "Итого: - ",
  }),
  columnHelper.group({
    header: "Выполнение эксплуатационного плана",
    columns: [
      columnHelper.accessor("expl_fact", {
        header: "чел.-ч",
        footer: "Итого: - ",
      }),
      columnHelper.accessor("expl_per", {
        header: "%",
        footer: "5%",
      }),
    ],
  }),
  columnHelper.group({
    header: "Выполнение эксплуатационного плана с учетом всех выполненных работ",
    columns: [
      columnHelper.accessor(`${timePeriod}_fact_time`, {
        header: "факт, чел.-ч",
        footer: "Итого: - ",
      }),
      columnHelper.accessor("all_per", {
        header: "%",
        footer: "100%",
      }),
    ],
  }),
];

interface IMonthWorkingMansTableProps {}

export const MonthWorkingMansTable: FC<IMonthWorkingMansTableProps> = () => {
  const { ppr } = usePpr();
  const { currentTimePeriod } = usePprTableSettings();

  const table = useReactTable({
    data: ppr?.workingMans || [],
    columns: columns(currentTimePeriod),
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="overflow-auto">
      <table className="shadow-lg">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th className="border border-black text-center" key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td className="border border-black text-center" key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <td className="font-bold text-center" key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
};
