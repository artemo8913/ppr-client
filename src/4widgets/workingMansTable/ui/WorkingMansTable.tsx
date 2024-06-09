"use client";
import { FC } from "react";
import { usePpr } from "@/1shared/providers/pprProvider";
import { setBgColor } from "@/1shared/lib/setBgColor";
import { TableCell } from "@/1shared/ui/table";
import { useCreateColumns } from "../lib/useCreateColumns";
import { getColumnSettings, getColumnTitle, getThStyle } from "../lib/workingMansTableColumnsHelpers";
import { stringToTimePeriodIntlRu } from "@/1shared/lib/date";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";

interface IWorkingMansTableProps {}

export const WorkingMansTable: FC<IWorkingMansTableProps> = () => {
  const { ppr, updateWorkingMan } = usePpr();
  const { columnsDefault, timePeriods, timePeriodsColumns } = useCreateColumns();

  return (
    <table
      style={{
        tableLayout: "fixed",
        width: "100%",
      }}
    >
      <thead>
        <tr>
          {columnsDefault.map((column) => (
            <th style={getThStyle(column)} className="border border-black" key={column} rowSpan={2}>
              <TableCell value={getColumnTitle(column)} />
            </th>
          ))}
          {timePeriods.map((period) => (
            <th key={period} colSpan={4} className="border border-black">
              <TableCell value={stringToTimePeriodIntlRu(period)} />
            </th>
          ))}
        </tr>
        <tr>
          {timePeriodsColumns.flat().map((column) => (
            <th key={column} className="border border-black">
              <TableCell isVertical value={getColumnTitle(column)} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ppr?.peoples.map((workingMan) => (
          <tr key={workingMan.id}>
            {columnsDefault.concat(timePeriodsColumns.flat()).map((column) => (
              <td
                className="border border-black"
                key={workingMan.id + column}
                style={{ backgroundColor: setBgColor(column) }}
              >
                <TableCell
                  {...getColumnSettings(column, ppr.status)}
                  isVertical={column.endsWith("_time")}
                  value={workingMan[column]}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
