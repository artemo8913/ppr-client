"use client";
import { FC, useCallback, useMemo, useRef } from "react";
import { usePpr } from "@/1shared/providers/pprProvider";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import {
  IPprData,
  SummaryTableFoot,
  TAllMonthStatuses,
  TYearPprStatus,
  checkIsFactTimeField,
  checkIsFactWorkField,
  checkIsPlanTimeField,
  checkIsPlanWorkField,
  checkIsWorkOrTimeField,
  getPlanWorkFieldByPlanTimeField,
} from "@/2entities/ppr";
import { getColumnSettings, getTdStyle, getThStyle } from "../lib/pprTableStylesHelper";
import { CorrectionArrowsConteinerMemo } from "./CorrectionArrowsConteiner";
import { getColumnTitle } from "../lib/pprTableColumnsHelper";
import { PprTableCellMemo } from "./PprTableCell";
import { useCreateColumns } from "./PprTableColumns";
import { stringToTimePeriodIntlRu } from "@/1shared/lib/date";

interface IPprTableProps {}

export const PprTable: FC<IPprTableProps> = ({}) => {
  const {
    ppr,
    getWorkCorrection,
    updateFactWorkTime,
    updateFactWork,
    updatePlanWorkValueByUser,
    updateNormOfTime,
    updatePlanWork,
    updatePprData,
  } = usePpr();
  const { columnsDefault, timePeriods, timePeriodsColumns } = useCreateColumns();
  const { correctionView, tableWidthPercent, fontSizePx, headerHeightPx, currentTimePeriod } = usePprTableSettings();
  const pprYearStatus: TYearPprStatus = ppr?.status || "template";
  const pprMonthsStatuses: TAllMonthStatuses | undefined = ppr?.months_statuses || undefined;

  const planCellRef = useRef<HTMLTableCellElement | null>(null);
  const isArrowsShow = useMemo(
    () => correctionView === "CORRECTED_PLAN_WITH_ARROWS" || correctionView === "INITIAL_PLAN_WITH_ARROWS",
    [correctionView]
  );
  const isCorrectedView = useMemo(
    () => correctionView === "CORRECTED_PLAN" || correctionView === "CORRECTED_PLAN_WITH_ARROWS",
    [correctionView]
  );

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
    // все функции "чистые", у всех useCallback с пустым массивов
    []
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
        <tr>
          {columnsDefault.map((field) => (
            <th
              key={field}
              className="border border-black relative"
              rowSpan={2}
              style={{ ...getThStyle(field), height: `${headerHeightPx}px` }}
            >
              <PprTableCellMemo isVertical field={field} value={getColumnTitle(field)} />
            </th>
          ))}
          {timePeriods.map((month) => (
            <th
              key={month}
              colSpan={timePeriodsColumns[0].length}
              className="border border-black sticky top-0 z-20 bg-[#f5f5f5]"
            >
              <PprTableCellMemo value={stringToTimePeriodIntlRu(month)} />
            </th>
          ))}
        </tr>
        <tr>
          {timePeriodsColumns.flat().map((periodField) => (
            <th
              key={periodField}
              ref={periodField === "year_plan_work" ? planCellRef : null}
              className="border border-black relative"
            >
              <PprTableCellMemo isVertical value={getColumnTitle(periodField)} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ppr?.data.map((pprData, rowIndex) => (
          <tr key={pprData.id}>
            {columnsDefault.concat(timePeriodsColumns.flat()).map((field) => {
              const isPlanWorkPeriodField = checkIsPlanWorkField(field);
              const corrections = (isPlanWorkPeriodField && getWorkCorrection(pprData.id, field)) || undefined;

              let value = pprData[field];

              if (isCorrectedView && isPlanWorkPeriodField) {
                value = corrections ? corrections.finalCorrection : value;
              } else if (isCorrectedView && checkIsPlanTimeField(field)) {
                const finalCorrection = getWorkCorrection(
                  pprData.id,
                  getPlanWorkFieldByPlanTimeField(field)
                )?.finalCorrection;
                value =
                  finalCorrection !== undefined ? Number((finalCorrection * pprData.norm_of_time).toFixed(2)) : value;
              }

              const transfers = (corrections?.planTransfers || []).concat(corrections?.undoneTransfers || []);

              const columnSettings = getColumnSettings(
                field,
                pprYearStatus,
                currentTimePeriod,
                pprMonthsStatuses,
                correctionView
              );
              return (
                <td
                  key={pprData.id + field}
                  className="border border-black relative h-1"
                  style={{
                    ...getTdStyle(field),
                  }}
                >
                  <div className="flex flex-col justify-between gap-6">
                    {isArrowsShow && isPlanWorkPeriodField && corrections && (
                      <CorrectionArrowsConteinerMemo transfers={transfers} field={field} planCellRef={planCellRef} />
                    )}
                    <PprTableCellMemo
                      {...columnSettings}
                      updatePprTableCell={updatePprTableCell}
                      isVertical={checkIsWorkOrTimeField(field)}
                      isWorkAproved={pprData.is_work_aproved}
                      id={pprData.id}
                      field={field}
                      value={value}
                    />
                  </div>
                </td>
              );
            })}
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
