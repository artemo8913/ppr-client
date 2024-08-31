"use client";
import { FC, useCallback } from "react";
import { usePpr } from "@/1shared/providers/pprProvider";
import { setBgColor } from "@/1shared/lib/setBgColor";
import { TableCellMemo } from "@/1shared/ui/table";
import { useCreateColumns } from "../lib/useCreateColumns";
import { translateRuTimePeriod } from "@/1shared/lib/date";
import {
  IWorkingManYearPlan,
  SummaryTableFoot,
  checkIsFactTimeField,
  checkIsPlanNormTimeField,
  checkIsPlanTabelTimeField,
} from "@/2entities/ppr";
import { getColumnSettings, getColumnTitle, getThStyle } from "../lib/workingMansTableColumnsHelpers";
import { WorkingManTableCellMemo } from "./WorkingManTableCell";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";

interface IWorkingMansTableProps {}

export const WorkingMansTable: FC<IWorkingMansTableProps> = () => {
  const {
    ppr,
    updateWorkingMan,
    updateWorkingManParticipation,
    updateWorkingManFactTime,
    updateWorkingManPlanNormTime,
    updateWorkingManPlanTabelTime,
  } = usePpr();
  const { currentTimePeriod } = usePprTableSettings();
  const { columnsDefault, timePeriods, timePeriodsColumns } = useCreateColumns();

  const updateWorkingManTableCell = useCallback(
    (rowIndex: number, field: keyof IWorkingManYearPlan, value: unknown) => {
      if (field === "participation") {
        updateWorkingManParticipation(rowIndex, Number(value || 0));
      } else if (checkIsFactTimeField(field)) {
        updateWorkingManFactTime(rowIndex, field, Number(value || 0));
      } else if (checkIsPlanNormTimeField(field)) {
        updateWorkingManPlanNormTime(rowIndex, field, Number(value || 0));
      } else if (checkIsPlanTabelTimeField(field)) {
        updateWorkingManPlanTabelTime(rowIndex, field, Number(value || 0));
      } else {
        updateWorkingMan(rowIndex, field, value);
      }
    },
    // все функции "чистые", у всех useCallback с пустым массивов
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <table
      style={{
        tableLayout: "fixed",
        width: "100%",
      }}
    >
      <thead>
        <tr>
          {columnsDefault.map((field) => (
            <th style={getThStyle(field)} className="border border-black" key={field} rowSpan={2}>
              <TableCellMemo isVertical={field === "participation"} value={getColumnTitle(field)} />
            </th>
          ))}
          {timePeriods.map((period) => (
            <th key={period} colSpan={4} className="border border-black">
              <TableCellMemo value={translateRuTimePeriod(period)} />
            </th>
          ))}
        </tr>
        <tr>
          {timePeriodsColumns.flat().map((column) => (
            <th key={column} className="border border-black">
              <TableCellMemo isVertical value={getColumnTitle(column)} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ppr?.peoples.map((workingMan, rowIndex) => (
          <tr key={workingMan.id}>
            {columnsDefault.concat(timePeriodsColumns.flat()).map((field) => (
              <td
                className="border border-black align-bottom"
                key={workingMan.id + field}
                style={{ backgroundColor: setBgColor(field) }}
              >
                <WorkingManTableCellMemo
                  {...getColumnSettings(field, ppr.status, currentTimePeriod, ppr?.months_statuses)}
                  rowIndex={rowIndex}
                  field={field}
                  isVertical={field.endsWith("_time") || field === "participation"}
                  updateWorkingManTableCell={updateWorkingManTableCell}
                  value={workingMan[field]}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <SummaryTableFoot
        fields={timePeriodsColumns.flat()}
        summaryNameColSpan={columnsDefault.length}
        totalFieldsValues={ppr?.total_fields_value}
      />
    </table>
  );
};
