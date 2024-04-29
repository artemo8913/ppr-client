"use client";
import { FC } from "react";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { IWorkingManYearPlan } from "@/2entities/pprTable";
import { monthsIntlRu, pprTimePeriods } from "@/1shared/types/date";
import { setBgColor } from "@/1shared/lib/setBgColor";
import { TableCell } from "@/1shared/ui/table";
import { WorkingManDelete } from "@/3features/workingManDelete";
import { usePprTableData } from "@/1shared/providers/pprTableProvider";

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
        footer: "Итого",
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
          cell: (props) => (
            <TableCell
              value={props.getValue()}
              handleBlur={(value: string) =>
                props.table.options.meta?.updateData(props.row.index, props.column.id, value)
              }
              cellType="input"
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
              cellType="input"
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

interface IPeoplesTableProps {}

export const PeoplesTable: FC<IPeoplesTableProps> = () => {
  const { pprData, setPprData } = usePprTableData();
  const table = useReactTable({
    data: pprData?.peoples || [],
    columns: [
      ...columns,
      columnHelper.display({
        header: "Опер-ии",
        cell: (props) => <WorkingManDelete id={props.row.original.id} />,
      }),
    ],
    meta: {
      updateData(rowIndex: number, columnId: keyof IWorkingManYearPlan | string, value: unknown) {
        setPprData((prev) => {
          if (!prev) {
            return prev;
          }
          return {
            ...prev,
            peoples: prev.peoples.map((man, arrayIndex) => {
              if (arrayIndex === rowIndex) {
                return {
                  ...man,
                  [columnId]: value,
                };
              }
              return man;
            }),
          };
        });
      },
    },
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
                <td className="font-bold border-t border-r" key={header.id} colSpan={header.colSpan} style={{ backgroundColor: setBgColor(header.column.id) }}>
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
