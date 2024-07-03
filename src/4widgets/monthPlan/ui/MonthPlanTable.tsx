"use client";
import { FC } from "react";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { TTimePeriod } from "@/1shared/lib/date";
import { usePpr } from "@/1shared/providers/pprProvider";
import { IPlanWorkPeriods, IPprData, TWorkCorrection } from "@/2entities/ppr";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";

type TMonthPlanColumns = IPprData;

const columnHelper = createColumnHelper<TMonthPlanColumns>();

const useColumns = (
  timePeriod: TTimePeriod,
  getWorkCorrection: (id: string, field: keyof IPlanWorkPeriods) => TWorkCorrection<IPlanWorkPeriods> | undefined
) => {
  return [
    columnHelper.group({
      header: "Работа",
      columns: [
        columnHelper.accessor("name", {
          header: "Наименование работ",
          size: 800,
        }),
        columnHelper.accessor("measure", {
          header: "Измеритель",
        }),
      ],
    }),
    columnHelper.group({
      header: "План",
      size: 100,
      columns: [
        columnHelper.accessor(`${timePeriod}_plan_work`, {
          header: "Количество",
          cell(props) {
            const pprData = props.row.original;
            const correction = getWorkCorrection(pprData.id, `${timePeriod}_plan_work`);

            if (!correction) {
              return props.cell.getValue();
            }

            return correction.planValueAfterCorrection;
          },
        }),
        columnHelper.accessor(`norm_of_time`, {
          header: "Норма времени на измеритель, чел.-ч",
        }),
        {
          accessorKey: `${timePeriod}_plan_time`,
          header: "Всего трудозатрат по норме, чел.-ч",
          cell(props) {
            const pprData = props.row.original;
            const correction = getWorkCorrection(pprData.id, `${timePeriod}_plan_work`);

            if (!correction) {
              return props.cell.getValue();
            }

            return (correction.planValueAfterCorrection * pprData.norm_of_time).toFixed(2);
          },
        },
      ],
    }),
    columnHelper.group({
      header: "Выполнение",
      size: 100,
      columns: [
        columnHelper.accessor(`${timePeriod}_fact_work`, {
          header: "Количество",
          size: 50,
        }),
        columnHelper.accessor(`${timePeriod}_fact_time`, {
          header: "Фактически затрачено чел.-ч",
          size: 50,
        }),
      ],
    }),
  ];
};

interface IMonthPlanTableProps {}

export const MonthPlanTable: FC<IMonthPlanTableProps> = () => {
  const { ppr, getWorkCorrection } = usePpr();
  const { currentTimePeriod } = usePprTableSettings();
  const table = useReactTable({
    data: ppr?.data || [],
    columns: useColumns(currentTimePeriod, getWorkCorrection),
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="overflow-auto">
      <table className="shadow-lg">
        <thead>
          {table.getHeaderGroups().map((headerGroup, rowIndex) => (
            <tr key={headerGroup.id + rowIndex}>
              {rowIndex === 0 && (
                <th className="border border-black" rowSpan={2}>
                  № п.п.
                </th>
              )}
              {headerGroup.headers.map((header) => (
                <>
                  <th
                    className="border border-black"
                    key={header.id}
                    style={{ width: header.getSize() }}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                </>
              ))}
              {rowIndex === 0 && (
                <th className="border border-black" rowSpan={2}>
                  Примечание
                </th>
              )}
            </tr>
          ))}
        </thead>
        <tbody>
          {table
            .getRowModel()
            .rows.filter((row) => {
              const pprData = row.original;
              const correction = getWorkCorrection(pprData.id, `${currentTimePeriod}_plan_work`);

              const planValue = correction
                ? correction.planValueAfterCorrection
                : row.original[`${currentTimePeriod}_plan_work`];

              return Boolean(Number(row.original[`${currentTimePeriod}_fact_work`])) || Boolean(planValue);
            })
            .map((row, rowIndex) => (
              <tr key={row.id}>
                <td className="border border-black text-center">{rowIndex + 1}</td>
                {row.getVisibleCells().map((cell) => (
                  <td className="border border-black text-center" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td className="border border-black text-center"></td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
