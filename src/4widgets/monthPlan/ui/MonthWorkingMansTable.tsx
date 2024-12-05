"use client";
import { FC } from "react";

import { usePpr } from "@/1shared/providers/pprProvider";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { TTimePeriod } from "@/1shared/const/date";
import {
  getFactTimeFieldByTimePeriod,
  getFactWorkFieldByTimePeriod,
  getPlanTimeFieldByTimePeriod,
  getPlanWorkFieldByTimePeriod,
  IPprData,
} from "@/2entities/ppr";

function getWorkingMansMonthPlanFields(timePeriod: TTimePeriod): Array<keyof IPprData> {
  return [
    "name",
    "measure",
    getPlanWorkFieldByTimePeriod(timePeriod),
    "norm_of_time",
    getPlanTimeFieldByTimePeriod(timePeriod),
    getFactWorkFieldByTimePeriod(timePeriod),
    getFactTimeFieldByTimePeriod(timePeriod),
  ];
}

interface IMonthWorkingMansTableProps {}

export const MonthWorkingMansTable: FC<IMonthWorkingMansTableProps> = () => {
  const { ppr } = usePpr();

  const { currentTimePeriod } = usePprTableSettings();

  return (
    <table className="shadow-lg">
      <thead>
        <tr className="*:border *:border-black">
          <th colSpan={3}>Данные о работнике</th>
          <th colSpan={3}>Настой часов</th>
          <th rowSpan={2}>Заданно по эксплуатационному плану, чел.-ч</th>
          <th colSpan={2}>Выполнение эксплуатационного плана</th>
          <th colSpan={2}>Выполнение эксплуатационного плана с учетом всех выполненных работ</th>
        </tr>
        <tr className="*:border *:border-black">
          <th>фамилия, имя, отчество</th>
          <th>должность, профессия, разряд рабочих, совмещаемые профессии</th>
          <th>доля участия</th>
          <th>по норме</th>
          <th>по табелю</th>
          <th>нормированное задание</th>
          <th>чел.-ч</th>
          <th>%</th>
          <th>факт, чел.-ч</th>
          <th>%</th>
        </tr>
      </thead>
      {/* <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td className="border border-black text-center" key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        {table.getFooterGroups().map((footerGroup) => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map((header) => (
              <td className="border border-black font-bold text-center" key={header.id} colSpan={header.colSpan}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tfoot> */}
    </table>
  );
};
