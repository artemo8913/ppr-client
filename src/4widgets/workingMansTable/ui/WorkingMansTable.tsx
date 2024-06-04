"use client";
import { FC } from "react";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { tymePeriodIntlRu, pprTimePeriods } from "@/1shared/lib/date";
import { usePpr } from "@/1shared/providers/pprProvider";
import { setBgColor } from "@/1shared/lib/setBgColor";
import { TableCell } from "@/1shared/ui/table";
import { IWorkingManYearPlan, TYearPprStatus } from "@/2entities/ppr";
import { WorkingManDelete } from "@/3features/pprWorkingMans/delete";
import { getColumnSettings } from "../lib/workingMansTableSettings";

const columnHelper = createColumnHelper<IWorkingManYearPlan>();

const columns = (status?: TYearPprStatus) => [
  columnHelper.group({
    header: "Данные о работнике",
    columns: [
      columnHelper.accessor("full_name", {
        header: "фамилия, имя, отчество",
        cell: (props) => <TableCell {...getColumnSettings(status)[`full_name`]} value={props.getValue()} />,
      }),
      columnHelper.accessor("work_position", {
        header: "должность",
        cell: (props) => <TableCell {...getColumnSettings(status)[`work_position`]} value={props.getValue()} />,
      }),
      columnHelper.accessor("participation", {
        header: "доля участия",
        footer: "Итого",
        cell: (props) => <TableCell {...getColumnSettings(status)[`participation`]} value={props.getValue()} />,
      }),
    ],
  }),
  ...pprTimePeriods.map((time) =>
    columnHelper.group({
      header: tymePeriodIntlRu[time],
      columns: [
        columnHelper.accessor(`${time}_plan_time`, {
          header: "план",
          cell: (props) => (
            <TableCell
              value={props.getValue()}
              handleBlur={(value: string) =>
                props.table.options.meta?.updateData(props.row.index, props.column.id, value)
              }
              {...getColumnSettings(status)[`${time}_plan_time`]}
            />
          ),
          footer: (props) =>
            props.table
              .getRowModel()
              .rows.reduce((acc, val) => acc + Number(val.original[`${time}_plan_time`] || 0), 0),
        }),
        columnHelper.accessor(`${time}_fact_time`, {
          header: "факт",
          cell: (props) => (
            <TableCell
              value={props.getValue()}
              handleBlur={(value: string) =>
                props.table.options.meta?.updateData(props.row.index, props.column.id, value)
              }
              {...getColumnSettings(status)[`${time}_fact_time`]}
            />
          ),
          footer: (props) =>
            props.table
              .getRowModel()
              .rows.reduce((acc, val) => acc + Number(val.original[`${time}_fact_time`] || 0), 0),
        }),
      ],
    })
  ),
];

interface IWorkingMansTableProps {}

export const WorkingMansTable: FC<IWorkingMansTableProps> = () => {
  const { ppr, updateWorkingMan } = usePpr();
  const table = useReactTable({
    data: ppr?.peoples || [],
    columns: [
      ...columns(ppr?.status),
      columnHelper.display({
        header: "Опер-ии",
        cell: (props) => <WorkingManDelete id={props.row.original.id} />,
      }),
    ],
    meta: {
      updateData: updateWorkingMan,
    },
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="overflow-auto">
      <table className="shadow-lg">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th className="border" key={header.id} colSpan={header.colSpan}>
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
                <td className="border" key={cell.id} style={{ backgroundColor: setBgColor(cell.column.id) }}>
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
                <td
                  className="font-bold "
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{ backgroundColor: setBgColor(header.column.id) }}
                >
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
