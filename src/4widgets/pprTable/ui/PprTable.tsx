"use client";
import { FC } from "react";
import { Table, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { getTdStyle, getThStyle } from "../lib/pprTableHelpers";
import { useCreateDefaultColumns } from "./PprTableColumns";
import { usePprTableData } from "@/1shared/providers/pprTableProvider";
import { IPprData, TPprDataCorrection } from "@/2entities/pprTable";
import { IPlanWork } from "@/2entities/pprTable";

interface IPprTableProps {}

export const PprTable: FC<IPprTableProps> = ({}) => {
  const { pprData, setPprData } = usePprTableData();

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
