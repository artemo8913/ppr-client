"use client";
import { FC, useMemo, useRef } from "react";
import { usePpr } from "@/1shared/providers/pprProvider";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { TAllMonthStatuses, TYearPprStatus, checkIsPlanWorkPeriodField } from "@/2entities/ppr";
import { getColumnSettings, getTdStyle, getThStyle } from "../lib/pprTableStylesHelper";
import { CorrectionArrowsConteiner } from "./CorrectionArrowsConteiner";
import { getColumnTitle } from "../lib/pprTableColumnsHelper";
import { PprTableCellMemo } from "./PprTableCell";
import { useCreateColumns } from "./PprTableColumns";
import { stringToTimePeriodIntlRu } from "@/1shared/lib/date";
import { checkIsWorkAndTimeColumnsFieldsSet } from "@/2entities/ppr/model/ppr.schema";

interface IPprTableProps {}

export const PprTable: FC<IPprTableProps> = ({}) => {
  const { ppr, getCorrectionValue, updatePprData, updateNewValueInCorrection, getTransfers } = usePpr();
  const { columnsDefault, timePeriods, timePeriodsColums } = useCreateColumns();
  const { correctionView, tableWidthPercent, fontSizePx, headerHeightPx, currentTimePeriod } = usePprTableSettings();
  const pprYearStatus: TYearPprStatus = ppr?.status || "template";
  const pprMonthsStatuses: TAllMonthStatuses | undefined = ppr?.months_statuses || undefined;

  const planCellRef = useRef<HTMLTableCellElement | null>(null);
  const isArrowsShow = useMemo(
    () => correctionView === "CORRECTED_PLAN_WITH_ARROWS" || correctionView === "INITIAL_PLAN_WITH_ARROWS",
    [correctionView]
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
            {columnsDefault.concat(timePeriodsColums.flat()).map((columnName) => {
              return (
                <td
                  key={pprData.id + columnName}
                  className="border border-black relative"
                  style={{
                    ...getTdStyle(columnName),
                  }}
                >
                  {isArrowsShow && checkIsPlanWorkPeriodField(columnName) ? (
                    <CorrectionArrowsConteiner
                      transfers={getTransfers(pprData.id, columnName)}
                      fieldFrom={columnName}
                      objectId={pprData.id}
                      planCellRef={planCellRef}
                    />
                  ) : null}
                  <PprTableCellMemo
                    {...getColumnSettings(
                      columnName,
                      pprYearStatus,
                      currentTimePeriod,
                      pprMonthsStatuses,
                      correctionView
                    )}
                    isVertical={checkIsWorkAndTimeColumnsFieldsSet(columnName)}
                    pprData={pprData}
                    indexData={rowIndex}
                    field={columnName}
                    updatePprData={updatePprData}
                    updateNewValueInCorrection={updateNewValueInCorrection}
                    value={
                      checkIsPlanWorkPeriodField(columnName)
                        ? Number(pprData[columnName]) + getCorrectionValue(pprData.id, columnName)
                        : pprData[columnName]
                    }
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
