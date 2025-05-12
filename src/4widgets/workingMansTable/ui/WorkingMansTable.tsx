"use client";
import { useSession } from "next-auth/react";
import { FC, useCallback, useMemo } from "react";

import { TableCellMemo } from "@/1shared/ui/table";
import { translateRuTimePeriod } from "@/1shared/lib/date";
import {
  IWorkingManYearPlan,
  SummaryTableFoot,
  checkIsFactTimeField,
  checkIsPlanNormTimeField,
  checkIsPlanTabelTimeField,
  checkIsPprInUserControl,
  usePpr,
  usePprTableSettings,
} from "@/2entities/ppr";
import { AddWorkingManButton } from "@/3features/ppr/workingMansUpdate";

import { getColumnSettings, getColumnTitle, getThStyle } from "../lib/workingMansTableColumnsHelpers";
import { WorkingManTableCellMemo } from "./WorkingManTableCell";
import { useCreateColumns } from "../lib/useCreateColumns";

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

  const { data: credential } = useSession();

  const pprSettings = usePprTableSettings();

  const { columnsDefault, timePeriods, timePeriodsColumns } = useCreateColumns();
  //TODO: вынести в ppr provider
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

  const isCreatingPpr = useMemo(
    () => pprSettings.currentTimePeriod === "year" && (ppr?.status === "plan_creating" || ppr?.status === "template"),
    [ppr?.status, pprSettings.currentTimePeriod]
  );

  const isMonthPlanCreating = useMemo(
    () =>
      pprSettings.currentTimePeriod !== "year" &&
      ppr?.months_statuses[pprSettings.currentTimePeriod] === "plan_creating",
    [ppr?.months_statuses, pprSettings.currentTimePeriod]
  );

  const isMonthFactFilling = useMemo(
    () =>
      pprSettings.currentTimePeriod !== "year" &&
      ppr?.months_statuses[pprSettings.currentTimePeriod] === "fact_filling",
    [ppr?.months_statuses, pprSettings.currentTimePeriod]
  );

  const isPprInUserControl = useMemo(() => {
    const { isForSubdivision, isPprCreatedByThisUser } = checkIsPprInUserControl(ppr?.created_by, credential?.user);

    return isForSubdivision || (isPprCreatedByThisUser && ppr?.status === "template");
  }, [credential?.user, ppr?.created_by, ppr?.status]);

  const isEditable = useMemo(
    () => isPprInUserControl && (isCreatingPpr || isMonthPlanCreating || isMonthFactFilling),
    [isCreatingPpr, isMonthFactFilling, isMonthPlanCreating, isPprInUserControl]
  );

  if (!Boolean(ppr?.workingMans.length)) {
    return <AddWorkingManButton shape="default" size="middle" type="primary" label="Добавить работника" />;
  }

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
        {ppr?.workingMans.map((workingMan, rowIndex) => (
          <tr key={workingMan.id}>
            {columnsDefault.concat(timePeriodsColumns.flat()).map((field) => (
              <WorkingManTableCellMemo
                {...getColumnSettings({
                  field,
                  isPprInUserControl,
                  pprYearStatus: ppr.status,
                  timePeriod: pprSettings.currentTimePeriod,
                  pprMonthStatuses: ppr?.months_statuses,
                })}
                field={field}
                rowIndex={rowIndex}
                workingMan={workingMan}
                isEditable={isEditable}
                key={workingMan.id + field}
                updateWorkingManTableCell={updateWorkingManTableCell}
                value={workingMan[field] === 0 ? "" : workingMan[field]}
                isVertical={field.endsWith("_time") || field === "participation"}
              />
            ))}
          </tr>
        ))}
      </tbody>
      <SummaryTableFoot fields={timePeriodsColumns.flat()} summaryNameColSpan={columnsDefault.length} />
    </table>
  );
};
