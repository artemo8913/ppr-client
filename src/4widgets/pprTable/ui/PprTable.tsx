"use client";
import { FC } from "react";
import { Table, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { getTdStyle, getThStyle } from "../lib/pprTableHelpers";
import { useCreateDefaultColumns } from "./PprTableColumns";
import { usePprTableData } from "@/1shared/providers/pprTableProvider";
import { IPprData, TAllMonthStatuses } from "@/2entities/pprTable";
import { TYearPprStatus } from "@/2entities/pprTable";

interface IPprTableProps {}

export const PprTable: FC<IPprTableProps> = ({}) => {
  const { pprData, setPprData } = usePprTableData();

  const status: TYearPprStatus = pprData?.status || "done";
  const pprMonthsStatuses: TAllMonthStatuses | undefined = pprData?.months_statuses || undefined;

  const table: Table<IPprData> = useReactTable({
    data: pprData ? pprData.data : [],
    columns: useCreateDefaultColumns(status, pprMonthsStatuses),
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex: number, columnId: keyof IPprData | string, value: unknown) => {
        // Skip page index reset until after next rerender
        setPprData((prev) => {
          if (!prev) {
            return prev;
          }
          return {
            ...prev,
            data: prev.data.map((row, index) => {
              if (index === rowIndex) {
                return {
                  ...prev.data[rowIndex]!,
                  [columnId]: value,
                };
              }
              return row;
            }),
          };
        });
      },
    },
  });

  return (
    <table className="table-fixed w-[100%] [font-size:12px]">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                className="border border-black max-h-[300px] relative"
                style={getThStyle(header.column.id as keyof IPprData)}
                key={header.id}
                colSpan={header.colSpan}
              >
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
              <td
                className="border border-black relative"
                key={cell.id}
                style={getTdStyle(cell.column.id as keyof IPprData)}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
