"use client";
import { FC } from "react";
import { usePprTableData } from "..";
import { Table, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { IPprData } from "@/1shared/api/pprTable";
import { createDefaultColumns, getTdStyle, getThStyle } from "../lib/pprTableSettings";
import { TMonths, months } from "@/1shared/types/date";
import { TPprStatus } from "@/1shared/types/ppr";

interface IPprTableProps {}

export const PprTable: FC<IPprTableProps> = ({}) => {
  const { pprData, setPprData } = usePprTableData();
  const status: TPprStatus = "creating";
  const currentMonth: TMonths = "year";
  const table: Table<IPprData> = useReactTable({
    data: pprData.data,
    columns: createDefaultColumns(status, months, currentMonth),
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex: number, columnId: keyof IPprData | string, value: unknown) => {
        // Skip page index reset until after next rerender
        setPprData((prev) => ({
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
        }));
      },
    },
  });

  return (
    <table className="table-fixed w-full [font-size:10px]">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                className="border border-black max-h-[250px]"
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
              <td className="border border-black" key={cell.id} style={getTdStyle(cell.column.id as keyof IPprData)}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
