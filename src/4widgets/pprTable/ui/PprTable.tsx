"use client";
import { FC } from "react";
import { usePprTableData } from "..";
import { Table, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { IPprData } from "@/1shared/api/pprTable";
import { createDefaultColumns } from "../lib/pprTableSettings";

interface IPprTableProps {}

export const PprTable: FC<IPprTableProps> = ({}) => {
  const { pprData, setPprData } = usePprTableData();

  const verticalDiv = "[writing-mode:vertical-rl] rotate-180";

  const table: Table<IPprData> = useReactTable({
    data: pprData.data,
    columns: createDefaultColumns(),
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
    <table className="table-fixed [font-size:12px]">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} colSpan={header.colSpan}>
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
              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
