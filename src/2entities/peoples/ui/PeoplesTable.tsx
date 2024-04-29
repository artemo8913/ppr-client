"use client";
import { FC, useState } from "react";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { IWorkingManYearPlan } from "@/1shared/api/pprTable";
import { monthsIntlRu, pprTimePeriods } from "@/1shared/types/date";
import { setBgColor } from "@/1shared/lib/setBgColor";
import { TableCell } from "@/1shared/ui/table";

const defaultData: IWorkingManYearPlan[] = [
  {
    id: "1",
    full_name: "Спиряев Артем Сергеевич",
    work_position: "инженер",
    participation: 0.5,
    year_plan_time: 100,
    year_fact_time: 100,
  },
];

const columnHelper = createColumnHelper<IWorkingManYearPlan>();

const columns = [
  columnHelper.group({
    header: "Данные о работнике",
    columns: [
      columnHelper.accessor("full_name", {
        header: "фамилия, имя, отчество",
        cell: (props) => props.getValue(),
      }),
      columnHelper.accessor("work_position", {
        header: "должность",
        cell: (props) => props.getValue(),
      }),
      columnHelper.accessor("participation", {
        header: "доля участия",
        cell: (props) => props.getValue(),
      }),
    ],
  }),
  ...pprTimePeriods.map((time) =>
    columnHelper.group({
      header: monthsIntlRu[time],
      columns: [
        columnHelper.accessor(`${time}_plan_time`, {
          header: "план",
          cell: (props) => <TableCell value={props.getValue()} cellType="input" />,
        }),
        columnHelper.accessor(`${time}_fact_time`, {
          header: "факт",
          cell: (props) => <TableCell value={props.getValue()} cellType="input" />,
        }),
      ],
    })
  ),
];

interface IPeoplesTableProps {}

export const PeoplesTable: FC<IPeoplesTableProps> = ({}) => {
  const [data, setData] = useState(() => [...defaultData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-auto">
      <table className="shadow-lg block rounded-md border ">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th className="border-b border-r " key={header.id} colSpan={header.colSpan}>
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
                <td className="border-t border-r" key={cell.id} style={{ backgroundColor: setBgColor(cell.column.id) }}>
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
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="h-4" />
    </div>
  );
};
