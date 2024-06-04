"use client";
import { FC, useMemo, useRef } from "react";
import { Table, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { usePpr } from "@/1shared/providers/pprProvider";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { IPprDataWithRowSpan, TAllMonthStatuses, TYearPprStatus, planWorkPeriodsSet } from "@/2entities/ppr";
import { getTdStyle, getThStyle } from "../lib/pprTableStylesHelper";
import { useCreateColumns } from "./PprTableColumns";
import { CorrectionArrowsConteiner } from "./CorrectionArrowsConteiner";
import clsx from "clsx";

const STICKY_COLUMN_INDEX_FROM = 11;

interface IPprTableProps {}

export const PprTable: FC<IPprTableProps> = ({}) => {
  const { ppr, updatePprData, updateNewValueInCorrection, getPprDataWithRowSpan } = usePpr();

  const { correctionView, tableWidthPercent, fontSizePx, headerHeightPx, isCombineSameWorks } =
    usePprTableSettings();

  const planCellRef = useRef<HTMLTableCellElement | null>(null);

  const pprYearStatus: TYearPprStatus = ppr?.status || "done";
  const pprMonthsStatuses: TAllMonthStatuses | undefined = ppr?.months_statuses || undefined;

  const pprData = useMemo(() => {
    if (isCombineSameWorks) {
      return getPprDataWithRowSpan(ppr?.data || []);
    } else {
      return ppr?.data;
    }
  }, [ppr?.data, getPprDataWithRowSpan, isCombineSameWorks]);

  const table: Table<IPprDataWithRowSpan> = useReactTable({
    data: pprData ? pprData : [],
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
    <table
      style={{
        tableLayout: "fixed",
        width: `${tableWidthPercent}%`,
        fontSize: `${fontSizePx}px`,
        position: "relative",
      }}
    >
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const isRowWithMonths = Number(headerGroup.id) === 0 && header.index > STICKY_COLUMN_INDEX_FROM;
              return (
                <th
                  ref={header.column.id === "year_plan_work" ? planCellRef : null}
                  key={header.id}
                  className={clsx("border border-black relative", isRowWithMonths && "sticky top-0 z-20 bg-[#f5f5f5]")}
                  style={getThStyle(header.column.id)}
                  colSpan={header.colSpan}
                >
                  <div style={{ maxHeight: `${headerHeightPx}px` }}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </div>
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
                  rowSpan={
                    cell.column.id === "name" && (cell.row.original.rowSpan || 0) > 0
                      ? cell.row.original.rowSpan
                      : undefined
                  }
                  key={cell.id}
                  className="border border-black relative"
                  style={{
                    ...getTdStyle(cell.column.id),
                    display: cell.row.original.rowSpan === 0 && cell.column.id === "name" ? "none" : "table-cell",
                  }}
                >
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
