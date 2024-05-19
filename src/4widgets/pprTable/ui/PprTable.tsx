"use client";
import { FC, useEffect, useRef, useState } from "react";
import { Table, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Arrow } from "@/1shared/ui/arrow";
import { usePprTableData, usePprTableViewSettings } from "@/1shared/providers/pprTableProvider";
import { IPprData, planWorkPeriods } from "@/2entities/pprTable";
import { IPlanWorkPeriods } from "@/2entities/pprTable";
import { getTdStyle, getThStyle } from "../lib/pprTableStylesHepler";
import { useCreateDefaultColumns } from "./PprTableColumns";

interface IPprTableProps {}

export const PprTable: FC<IPprTableProps> = ({}) => {
  const { pprData, updatePprData, updatePprDataCorrections } = usePprTableData();
  const { filterColumns, correctionView } = usePprTableViewSettings();
  const planCellRef = useRef<HTMLTableCellElement | null>(null);
  const [basicArrowWidth, setBasicArrowWidth] = useState(0);

  const table: Table<IPprData> = useReactTable({
    data: pprData ? pprData.data : [],
    columns: useCreateDefaultColumns(),
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: updatePprData,
      correctPlan: updatePprDataCorrections,
    },
  });
  useEffect(() => {
    const width = planCellRef.current?.getBoundingClientRect().width || 0;
    setBasicArrowWidth(width * 6);
  }, [filterColumns]);

  return (
    <table className="table-fixed w-[100%] [font-size:12px]">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <th
                  ref={header.column.id === "year_plan_work" ? planCellRef : null}
                  className="border border-black max-h-[300px] relative"
                  style={getThStyle(header.column.id as keyof IPprData)}
                  key={header.id}
                  colSpan={header.colSpan}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => {
              return (
                <td
                  className="border border-black relative"
                  key={cell.id}
                  style={getTdStyle(cell.column.id as keyof IPprData)}
                >
                  {planWorkPeriods.includes(cell.column.id as keyof IPlanWorkPeriods) &&
                  (correctionView === "CORRECTED_PLAN_WITH_ARROWS" || correctionView === "INITIAL_PLAN_WITH_ARROWS") &&
                  pprData?.corrections.works &&
                  cell.row.original.id in pprData?.corrections.works &&
                  pprData?.corrections.works[cell.row.original.id] &&
                  cell.column.id in pprData?.corrections.works[cell.row.original.id]! &&
                  pprData?.corrections.works[cell.row.original.id]![cell.column.id as keyof IPlanWorkPeriods]
                    ? pprData.corrections.works[cell.row.original.id]![
                        cell.column.id as keyof IPlanWorkPeriods
                      ]!.fieldsTo?.map((field, index) => (
                        <Arrow key={cell.id + index} width={basicArrowWidth} value={String(field.value)} />
                      ))
                    : null}
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
