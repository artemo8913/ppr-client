"use client";
import { FC, useCallback, useRef } from "react";

import { usePpr } from "@/1shared/providers/pprProvider";
import { translateRuTimePeriod } from "@/1shared/lib/date";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import {
  IPprData,
  SummaryTableFoot,
  TAllMonthStatuses,
  TYearPprStatus,
  checkIsFactTimeField,
  checkIsFactWorkField,
  checkIsPlanWorkField,
  checkIsWorkOrTimeField,
} from "@/2entities/ppr";
import { AddWorkButton } from "@/3features/ppr/worksUpdate";

import { PprTableCellMemo } from "./PprTableCell";
import { useCreateColumns } from "./PprTableColumns";
import HeaderCell from "./HeaderCell";
import { getColumnSettings, getThStyle } from "../lib/pprTableStylesHelper";
import { translateRuFieldName } from "../lib/pprTableColumnsHelper";

interface IPprTableProps {}

export const PprTable: FC<IPprTableProps> = ({}) => {
  const {
    ppr,
    updateFactWorkTime,
    updateFactWork,
    updatePlanWorkValueByUser,
    updateNormOfTime,
    updatePlanWork,
    updatePprData,
  } = usePpr();

  const { basicColumns, timePeriods, planFactColumns, monthColSpan } = useCreateColumns();

  const pprSettings = usePprTableSettings();

  const pprYearStatus: TYearPprStatus = ppr?.status || "template";
  const pprMonthsStatuses: TAllMonthStatuses | null = ppr?.months_statuses || null;

  const planCellRef = useRef<HTMLTableCellElement | null>(null);

  const updatePprTableCell = useCallback(
    (id: string, field: keyof IPprData, value: string, isWorkAproved?: boolean) => {
      if (field === "norm_of_time") {
        updateNormOfTime(id, Number(value));
      } else if (checkIsFactWorkField(field)) {
        updateFactWork(id, field, Number(value));
      } else if (checkIsFactTimeField(field)) {
        updateFactWorkTime(id, field, Number(value));
      } else if (!isWorkAproved && checkIsPlanWorkField(field)) {
        updatePlanWork(id, field, Number(value));
      } else if (isWorkAproved && checkIsPlanWorkField(field)) {
        updatePlanWorkValueByUser(id, field, Number(value));
      } else {
        updatePprData(id, field, value);
      }
    },
    [updateFactWork, updateFactWorkTime, updateNormOfTime, updatePlanWork, updatePlanWorkValueByUser, updatePprData]
  );

  const getColumnSettingsForField = useCallback(
    (field: keyof IPprData, isHaveWorkId: boolean) =>
      getColumnSettings(
        field,
        pprYearStatus,
        pprSettings.currentTimePeriod,
        isHaveWorkId,
        pprMonthsStatuses,
        pprSettings.correctionView
      ),
    [pprMonthsStatuses, pprSettings.correctionView, pprSettings.currentTimePeriod, pprYearStatus]
  );

  return (
    <>
      {!Boolean(ppr?.data.length) && (
        <AddWorkButton shape="default" size="middle" type="primary" label="Добавить работу" />
      )}
      <table
        style={{
          tableLayout: "fixed",
          width: `${pprSettings.tableWidthPercent}%`,
          fontSize: `${pprSettings.fontSizePx}px`,
          position: "relative",
        }}
      >
        <thead>
          <tr>
            {basicColumns.map((field) => (
              <HeaderCell
                isVertical
                key={field}
                rowSpan={2}
                value={translateRuFieldName(field)}
                style={{
                  ...getThStyle(field),
                  height: `${pprSettings.headerHeightPx}px`,
                }}
              />
            ))}
            {timePeriods.map((month) => (
              <HeaderCell key={month} colSpan={monthColSpan} value={translateRuTimePeriod(month)} />
            ))}
          </tr>
          <tr>
            {planFactColumns.map((planFactField) => (
              <HeaderCell
                isVertical
                key={planFactField}
                value={translateRuFieldName(planFactField)}
                cellRef={planFactField === "year_plan_work" ? planCellRef : null}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {ppr?.data.map((pprData) => (
            <tr key={pprData.id}>
              {basicColumns.concat(planFactColumns).map((field) => (
                <PprTableCellMemo
                  key={pprData.id + field}
                  pprData={pprData}
                  updatePprTableCell={updatePprTableCell}
                  isVertical={checkIsWorkOrTimeField(field)}
                  field={field}
                  planCellRef={planCellRef}
                  {...getColumnSettingsForField(field, pprData.workId !== null)}
                />
              ))}
            </tr>
          ))}
        </tbody>
        <SummaryTableFoot
          fields={planFactColumns}
          summaryNameColSpan={basicColumns.length}
          totalFieldsValues={ppr?.total_fields_value}
        />
      </table>
    </>
  );
};
