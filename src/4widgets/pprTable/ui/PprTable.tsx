"use client";
import { FC, useCallback, useMemo, useRef } from "react";
import { usePpr } from "@/1shared/providers/pprProvider";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { TAllMonthStatuses, TYearPprStatus } from "@/2entities/ppr";
import { getTdStyle, getThStyle } from "../lib/pprTableStylesHelper";
import { CorrectionArrowsConteiner } from "./CorrectionArrowsConteiner";
import { pprDataColumnsFields } from "@/2entities/ppr/model/ppr.schema";
import { getColumnSettings, getColumnTitle } from "../lib/pprTableColumnsHelper";
import { PprTableCellMemo } from "./PprTableCell";
import { useCreateColumns } from "./PprTableColumns";

const STICKY_COLUMN_INDEX_FROM = 11;

interface IPprTableProps {}

export const PprTable: FC<IPprTableProps> = ({}) => {
  const { ppr, updatePprData, updateNewValueInCorrection, getPprDataWithRowSpan } = usePpr();

  const { correctionView, tableWidthPercent, fontSizePx, headerHeightPx, isCombineSameWorks, currentTimePeriod } =
    usePprTableSettings();

  const planCellRef = useRef<HTMLTableCellElement | null>(null);

  const pprYearStatus: TYearPprStatus = ppr?.status || "done";
  const pprMonthsStatuses: TAllMonthStatuses | undefined = ppr?.months_statuses || undefined;

  const isArrowsShow = useMemo(
    () => correctionView === "CORRECTED_PLAN_WITH_ARROWS" || correctionView === "INITIAL_PLAN_WITH_ARROWS",
    [correctionView]
  );

  const useUpdatePprData = useCallback(
    (index: number, field: string, value: string) => updatePprData(index, field, value),
    [updatePprData]
  );

  const columns = useCreateColumns();
  
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
        {columns.map((field, index) => (
          <th key={field + index} className="border border-black relative" style={{ ...getThStyle(field) }}>
            <PprTableCellMemo
              isWithWorkControl={field === "name" && !isCombineSameWorks}
              isVertical
              value={getColumnTitle(field)}
            />
          </th>
        ))}
      </thead>
      <tbody>
        {ppr?.data.map((row) => (
          <tr key={row.id}>
            {columns.map((field, index) => {
              return (
                <td
                  key={field + index}
                  className="border border-black relative"
                  style={{
                    ...getTdStyle(field),
                  }}
                >
                  {isArrowsShow ? (
                    <CorrectionArrowsConteiner fieldFrom={field} objectId={row.id} planCellRef={planCellRef} />
                  ) : null}
                  <PprTableCellMemo
                    {...getColumnSettings(field, pprYearStatus, currentTimePeriod, pprMonthsStatuses)}
                    value={row[field]}
                    index={index}
                    field={field}
                    handleBlur={useUpdatePprData}
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
