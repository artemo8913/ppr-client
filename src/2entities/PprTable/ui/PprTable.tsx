"use client";
import { FC, useEffect, useState } from "react";
import { usePprTableData } from "..";
import {
  ColumnDef,
  Table,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { IPpr, IPprData } from "@/1shared/api/pprTable";
import { TableCell } from "@/1shared/ui/table";
import { columnsTitles } from "../lib/pprTableSettings";

// Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<IPprData>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue();
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      table.options.meta?.updateData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return <input value={value as string} onChange={(e) => setValue(e.target.value)} onBlur={onBlur} />;
  },
};

interface IPprTableProps {}

export const PprTable: FC<IPprTableProps> = ({}) => {
  const { pprData, setPprData } = usePprTableData();

  const columnHelper = createColumnHelper<IPprData>();

  const verticalDiv = "w-full flex justify-center items-center bg-transparent [writing-mode:vertical-rl] rotate-180";

  const defaultColumns: ColumnDef<IPprData, any>[] = [
    columnHelper.accessor("name", {
      header: (info) => columnsTitles[info.header.id as keyof IPprData],
    }),
    columnHelper.group({
      header: "Год",
      columns: [
        columnHelper.accessor("year_plan_work", {
          header: () => <div className={verticalDiv}>кол-во</div>,
        }),
        columnHelper.accessor("year_plan_time", {
          header: () => <div className={verticalDiv}>норм. время на плановый объем, чел.-ч</div>,
        }),
        columnHelper.accessor("year_fact_work", { header: "кол-во" }),
        columnHelper.accessor("year_fact_norm_time", { header: "трудозатраты по норме времени, чел.-ч" }),
        columnHelper.accessor("year_fact_time", { header: "фактические трудозатраты, чел.-ч" }),
      ],
    }),
  ];

  const table: Table<IPprData> = useReactTable({
    data: pprData.data,
    columns: defaultColumns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex: number, columnId: keyof IPprData, value: string) => {
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
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <td className="border border-black" key={header.id} colSpan={header.colSpan}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </td>
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
