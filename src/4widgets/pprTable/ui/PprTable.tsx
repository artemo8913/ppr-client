"use client";
import { FC, useMemo, useRef } from "react";
import { usePpr } from "@/1shared/providers/pprProvider";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { TAllMonthStatuses, TYearPprStatus } from "@/2entities/ppr";
import { getTdStyle, getThStyle } from "../lib/pprTableStylesHelper";
import { CorrectionArrowsConteiner } from "./CorrectionArrowsConteiner";
import { getColumnSettings, getColumnTitle } from "../lib/pprTableColumnsHelper";
import { PprTableCellMemo } from "./PprTableCell";
import { useCreateColumns } from "./PprTableColumns";
import { stringToTimePeriodIntlRu } from "@/1shared/lib/date";

interface IPprTableProps {}

export const PprTable: FC<IPprTableProps> = ({}) => {
  const { ppr, updatePprData, updateNewValueInCorrection } = usePpr();
  const { columnsDefault, timePeriods, timePeriodsColums } = useCreateColumns();
  const { correctionView, tableWidthPercent, fontSizePx, headerHeightPx, currentTimePeriod } = usePprTableSettings();
  const planCellRef = useRef<HTMLTableCellElement | null>(null);
  const pprYearStatus: TYearPprStatus = ppr?.status || "done";
  const pprMonthsStatuses: TAllMonthStatuses | undefined = ppr?.months_statuses || undefined;
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
          {columnsDefault.map((field, index) => (
            <th
              key={field + index}
              className="border border-black relative"
              rowSpan={2}
              style={{ ...getThStyle(field), height: `${headerHeightPx}px` }}
            >
              <PprTableCellMemo isVertical value={getColumnTitle(field)} />
            </th>
          ))}
          {timePeriods.map((month, index) => (
            <th
              key={month + index}
              colSpan={timePeriodsColums[0].length}
              className="border border-black sticky top-0 z-20"
              style={{ ...getThStyle(month) }}
            >
              <PprTableCellMemo value={stringToTimePeriodIntlRu(month)} />
            </th>
          ))}
        </tr>
        <tr>
          {timePeriodsColums.flat(1).map((periodField, index) => (
            <th
              ref={periodField === "year_plan_work" ? planCellRef : null}
              key={periodField + index}
              className="border border-black relative"
              style={{ ...getThStyle(periodField) }}
            >
              <PprTableCellMemo isVertical value={getColumnTitle(periodField)} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ppr?.data.map((pprData) => (
          <tr key={pprData.id}>
            {columnsDefault.concat(timePeriodsColums.flat(1)).map((field, index) => {
              return (
                <td
                  key={field + index}
                  className="border border-black relative"
                  style={{
                    ...getTdStyle(field),
                  }}
                >
                  {isArrowsShow ? (
                    <CorrectionArrowsConteiner fieldFrom={field} objectId={pprData.id} planCellRef={planCellRef} />
                  ) : null}
                  <PprTableCellMemo
                    {...getColumnSettings(field, pprYearStatus, currentTimePeriod, pprMonthsStatuses)}
                    pprData={pprData}
                    indexData={index}
                    field={field}
                    updatePprData={updatePprData}
                    updateNewValueInCorrection={updateNewValueInCorrection}
                    value={pprData[field]}
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
