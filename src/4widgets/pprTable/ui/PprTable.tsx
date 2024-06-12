"use client";
import { FC, useCallback, useMemo, useRef } from "react";
import { usePpr } from "@/1shared/providers/pprProvider";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import {
  IPprData,
  TAllMonthStatuses,
  TYearPprStatus,
  checkIsFactTimeField,
  checkIsFactWorkField,
  checkIsPlanTimeField,
  checkIsPlanWorkField,
  checkIsWorkOrTimeField,
  getPlanWorkFieldPair,
} from "@/2entities/ppr";
import { getColumnSettings, getTdStyle, getThStyle } from "../lib/pprTableStylesHelper";
import { CorrectionArrowsConteiner } from "./CorrectionArrowsConteiner";
import { getColumnTitle } from "../lib/pprTableColumnsHelper";
import { PprTableCellMemo } from "./PprTableCell";
import { useCreateColumns } from "./PprTableColumns";
import { stringToTimePeriodIntlRu } from "@/1shared/lib/date";

interface IPprTableProps {}

export const PprTable: FC<IPprTableProps> = ({}) => {
  const {
    ppr,
    getCorrectionValue,
    getTransfers,
    updateFactTime,
    updateFactWork,
    updateNewValueInCorrection,
    updateNormOfTime,
    updatePlanWork,
    updatePprData,
  } = usePpr();
  const { columnsDefault, timePeriods, timePeriodsColums } = useCreateColumns();
  const { correctionView, tableWidthPercent, fontSizePx, headerHeightPx, currentTimePeriod } = usePprTableSettings();
  const pprYearStatus: TYearPprStatus = ppr?.status || "template";
  const pprMonthsStatuses: TAllMonthStatuses | undefined = ppr?.months_statuses || undefined;

  const planCellRef = useRef<HTMLTableCellElement | null>(null);
  const isArrowsShow = useMemo(
    () => correctionView === "CORRECTED_PLAN_WITH_ARROWS" || correctionView === "INITIAL_PLAN_WITH_ARROWS",
    [correctionView]
  );

  const updatePprTableCell = useCallback(
    (newValue: string, isWorkApproved: boolean, indexData: number, field: keyof IPprData) => {
      if (field === "norm_of_time") {
        updateNormOfTime(indexData, newValue);
      } else if (checkIsFactWorkField(field)) {
        updateFactWork(indexData, field, Number(newValue));
      } else if (checkIsFactTimeField(field)) {
        updateFactTime(indexData, field, Number(newValue));
      } else if (!isWorkApproved && checkIsPlanWorkField(field)) {
        updatePlanWork(indexData, field, Number(newValue));
      } else if (isWorkApproved && checkIsPlanWorkField(field)) {
        updateNewValueInCorrection(indexData, field, Number(newValue));
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
            <th key={month} colSpan={timePeriodsColums[0].length} className="border border-black sticky top-0 z-20">
              <PprTableCellMemo value={stringToTimePeriodIntlRu(month)} />
            </th>
          ))}
        </tr>
        <tr>
          {timePeriodsColums.flat().map((periodField) => (
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
            {columnsDefault.concat(timePeriodsColums.flat()).map((field) => {
              const isPlanWorkPeriodField = checkIsPlanWorkField(field);
              const value = isPlanWorkPeriodField
                ? Number(pprData[field]) + getCorrectionValue(pprData.id, field)
                : checkIsPlanTimeField(field) && getPlanWorkFieldPair(field)
                ? Number(pprData[field]) +
                  Number(
                    (getCorrectionValue(pprData.id, getPlanWorkFieldPair(field)!) * pprData.norm_of_time).toFixed(2)
                  )
                : pprData[field];
              const columnSettings = getColumnSettings(
                field,
                pprYearStatus,
                currentTimePeriod,
                pprMonthsStatuses,
                correctionView
              );
              const transfers = isPlanWorkPeriodField && getTransfers(pprData.id, field);
              return (
                <td
                  key={pprData.id + field}
                  className="border border-black relative"
                  style={{
                    ...getTdStyle(field),
                  }}
                >
                  {isArrowsShow && transfers ? (
                    <CorrectionArrowsConteiner
                      transfers={transfers}
                      fieldFrom={field}
                      objectId={pprData.id}
                      planCellRef={planCellRef}
                    />
                  ) : null}
                  <PprTableCellMemo
                    {...columnSettings}
                    updatePprTableCell={updatePprTableCell}
                    isVertical={checkIsWorkOrTimeField(field)}
                    pprData={pprData}
                    indexData={rowIndex}
                    field={field}
                    value={value}
                  />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
