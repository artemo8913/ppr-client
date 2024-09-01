"use client";
import { FC, memo, MutableRefObject, useCallback, useMemo } from "react";

import { ITableCellProps, TableCell } from "@/1shared/ui/table";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { checkIsPlanTimeField, checkIsPlanWorkField, IPprData, TTransfer } from "@/2entities/ppr";
import { TableCellWithWorkControl } from "@/3features/ppr/worksUpdate";

import { getTdStyle } from "../lib/pprTableStylesHelper";
import { CorrectionArrowsConteinerMemo } from "./CorrectionArrowsConteiner";

function getValue(pprData: IPprData, field: keyof IPprData, isCorrectedView: boolean) {
  if (checkIsPlanWorkField(field) || checkIsPlanTimeField(field)) {
    if (isCorrectedView) {
      return pprData[field].final;
    } else {
      return pprData[field].original;
    }
  }

  return pprData[field];
}

interface IPprTableCellProps extends ITableCellProps {
  pprData: IPprData;
  field: keyof IPprData;
  planCellRef: MutableRefObject<HTMLTableCellElement | null>;
  updatePprTableCell: (id: string, field: keyof IPprData, value: string, isWorkAproved?: boolean) => void;
}

export const PprTableCell: FC<IPprTableCellProps> = ({
  pprData,
  field,
  updatePprTableCell,
  planCellRef,
  ...otherProps
}) => {
  const pprSettings = usePprTableSettings();
  const isPlanWorkPeriodField = checkIsPlanWorkField(field);

  const isCorrectedView = useMemo(
    () =>
      pprSettings.correctionView === "CORRECTED_PLAN" || pprSettings.correctionView === "CORRECTED_PLAN_WITH_ARROWS",
    [pprSettings.correctionView]
  );
  const isArrowsShow = useMemo(
    () =>
      pprSettings.correctionView === "CORRECTED_PLAN_WITH_ARROWS" ||
      pprSettings.correctionView === "INITIAL_PLAN_WITH_ARROWS",
    [pprSettings.correctionView]
  );

  let value = getValue(pprData, field, isCorrectedView);

  const transfers: TTransfer[] = [];

  if (isArrowsShow && isPlanWorkPeriodField) {
    if (pprData[field].planTransfers) {
      transfers.push(...pprData[field].planTransfers!);
    }
    if (pprData[field].undoneTransfers) {
      transfers.push(...pprData[field].undoneTransfers!);
    }
  }

  const handleChange = useCallback(
    (newValue: string) => {
      updatePprTableCell(pprData.id, field, newValue, pprData.is_work_aproved);
    },
    [pprData, field, updatePprTableCell]
  );

  return (
    <td
      className="border border-black relative h-1"
      style={{
        ...getTdStyle(field),
      }}
    >
      <div className="flex flex-col justify-between gap-6">
        {isArrowsShow && isPlanWorkPeriodField && (
          <CorrectionArrowsConteinerMemo transfers={transfers} field={field} planCellRef={planCellRef} />
        )}
        {field === "name" ? (
          <TableCellWithWorkControl {...otherProps} onBlur={handleChange} id={pprData.id} value={value} />
        ) : (
          <TableCell {...otherProps} onBlur={handleChange} value={value} />
        )}
      </div>
    </td>
  );
};

export const PprTableCellMemo = memo(PprTableCell);
