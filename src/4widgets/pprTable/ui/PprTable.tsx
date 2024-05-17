"use client";
import { FC, useEffect, useRef, useState } from "react";
import { Table, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { getTdStyle, getThStyle } from "../lib/pprTableHelpers";
import { useCreateDefaultColumns } from "./PprTableColumns";
import { usePprTableData, usePprTableSettings } from "@/1shared/providers/pprTableProvider";
import { IPprData, TPprDataCorrection, planWorkPeriods } from "@/2entities/pprTable";
import { IPlanWork } from "@/2entities/pprTable";
import { Arrow } from "@/1shared/ui/arrow";

interface IPprTableProps {}

export const PprTable: FC<IPprTableProps> = ({}) => {
  const { pprData, setPprData } = usePprTableData();
  const { filterColumns, correctionView } = usePprTableSettings();
  const planCellRef = useRef<HTMLTableCellElement | null>(null);
  const [basicArrowWidth, setBasicArrowWidth] = useState(0);

  console.log(planCellRef.current?.getBoundingClientRect().width);
  const table: Table<IPprData> = useReactTable({
    data: pprData ? pprData.data : [],
    columns: useCreateDefaultColumns(),
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updatePprData: (rowIndex: number, columnId: keyof IPprData | string, value: unknown) => {
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
      correctWorkPlan: (fieldName, objectId, newValue, oldValue) => {
        setPprData((prev) => {
          if (!prev) {
            return prev;
          }
          const newDiff = newValue - oldValue;
          // // Если разница в значениях равна нулю
          // if (newDiff === 0) {
          //   // И при этом перенос человек не осуществлял (даже в черновом варианте), то удалить перенос по этому полю вовсе
          //   if (
          //     objectId in prev.corrections.works &&
          //     fieldName in prev.corrections.works[objectId]! &&
          //     prev.corrections.works[objectId]![fieldName]?.fieldsTo === undefined
          //   ) {
          //     return { ...prev, corrections: { ...prev.corrections, works: { ...prev.corrections.works } } };
          //   }
          //   return prev;
          // }
          const prevFieldsTo = prev.corrections.works[objectId]
            ? prev.corrections.works[objectId]![fieldName]?.fieldsTo
            : undefined;
          const newCorrection: TPprDataCorrection<IPlanWork> = {
            ...prev.corrections.works[objectId],
            [fieldName]: {
              newValue,
              diff: newDiff,
              fieldsTo: prevFieldsTo,
            },
          };
          return {
            ...prev,
            corrections: {
              ...prev.corrections,
              works: {
                ...prev.corrections.works,
                [objectId]: {
                  ...newCorrection,
                },
              },
            },
          };
        });
      },
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
                  {planWorkPeriods.includes(cell.column.id as keyof IPlanWork) &&
                  (correctionView === "CORRECTED_PLAN_WITH_ARROWS" || correctionView === "INITIAL_PLAN_WITH_ARROWS") &&
                  pprData?.corrections.works &&
                  cell.row.original.id in pprData?.corrections.works &&
                  pprData?.corrections.works[cell.row.original.id] &&
                  cell.column.id in pprData?.corrections.works[cell.row.original.id]! &&
                  pprData?.corrections.works[cell.row.original.id]![cell.column.id as keyof IPlanWork]
                    ? pprData.corrections.works[cell.row.original.id]![
                        cell.column.id as keyof IPlanWork
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
