"use client";
import { FC, useMemo, useRef } from "react";
import { Table, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { usePprTableData, usePprTableViewSettings } from "@/1shared/providers/pprTableProvider";
import { IPprData, TAllMonthStatuses, TYearPprStatus, planWorkPeriodsSet } from "@/2entities/pprTable";
import { getTdStyle, getThStyle } from "../lib/pprTableStylesHelper";
import { useCreateColumns } from "./PprTableColumns";
import { CorrectionArrowsConteiner } from "./CorrectionArrowsConteiner";

interface IPprTableProps {}

export const PprTable: FC<IPprTableProps> = ({}) => {
  const { pprData, updatePprData, updateNewValueInCorrection } = usePprTableData();

  const { correctionView } = usePprTableViewSettings();
  const planCellRef = useRef<HTMLTableCellElement | null>(null);

  const pprYearStatus: TYearPprStatus = pprData?.status || "done";
  const pprMonthsStatuses: TAllMonthStatuses | undefined = pprData?.months_statuses || undefined;

  const table: Table<IPprData> = useReactTable({
    data: pprData ? pprData.data : [],
    columns: useCreateColumns(pprYearStatus, pprMonthsStatuses),
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: updatePprData,
      correctPlan: updateNewValueInCorrection,
    },
  });

  const isArrowsShow = useMemo(
    () => correctionView === "CORRECTED_PLAN_WITH_ARROWS" || correctionView === "INITIAL_PLAN_WITH_ARROWS",
    [correctionView]
  );

  return (
    <table className="table-fixed w-[100%] [font-size:12px]">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <th
                  ref={header.column.id === "year_plan_work" ? planCellRef : null}
                  key={header.id}
                  className="border border-black max-h-[300px] relative"
                  style={getThStyle(header.column.id)}
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
                <td key={cell.id} className="border border-black relative" style={getTdStyle(cell.column.id)}>
                  {planWorkPeriodsSet.has(cell.column.id) && isArrowsShow ? (
                    <CorrectionArrowsConteiner
                      fieldFrom={cell.column.id}
                      objectId={cell.row.original.id}
                      planCellRef={planCellRef}
                    />
                  ) : null}
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
