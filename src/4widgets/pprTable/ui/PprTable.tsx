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
    (newValue: string, isWorkAproved: boolean, indexData: number, field: keyof IPprData) => {
      if (field === "norm_of_time") {
        updateNormOfTime(indexData, Number(newValue));
      } else if (checkIsFactWorkField(field)) {
        updateFactWork(indexData, field, Number(newValue));
      } else if (checkIsFactTimeField(field)) {
        updateFactWorkTime(indexData, field, Number(newValue));
      } else if (!isWorkAproved && checkIsPlanWorkField(field)) {
        updatePlanWork(indexData, field, Number(newValue));
      } else if (isWorkAproved && checkIsPlanWorkField(field)) {
        updatePlanWorkValueByUser(indexData, field, Number(newValue));
      } else {
        updatePprData(indexData, field, newValue);
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

              let value = pprData[field];
              if (isPlanWorkPeriodField && isCorrectedView) {
                const correction = getWorkCorrection(rowIndex, field);
                value = correction === undefined ? value : correction.finalCorrection;
              } else if (checkIsPlanTimeField(field) && isCorrectedView) {
                const finalValue = getWorkCorrection(rowIndex, getPlanWorkFieldByPlanTimeField(field))?.finalCorrection;
                value = finalValue === undefined ? value : Number((finalValue * pprData.norm_of_time).toFixed(2));
              }

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
                    {isArrowsShow && isPlanWorkPeriodField ? (
                      <CorrectionArrowsConteinerMemo
                        fieldFrom={field}
                        objectId={pprData.id}
                        planCellRef={planCellRef}
                      />
                    ) : null}
                    <PprTableCellMemo
                      {...columnSettings}
                      updatePprTableCell={updatePprTableCell}
                      isVertical={checkIsWorkOrTimeField(field)}
                      isWorkAproved={pprData.is_work_aproved}
                      rowIndex={rowIndex}
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
