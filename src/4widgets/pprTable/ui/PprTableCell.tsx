"use client";
import { FC, memo, MutableRefObject, useCallback, useMemo } from "react";

import { ITableCellProps, TableCell } from "@/1shared/ui/table";
import { IPprTableSettingsContext } from "@/1shared/providers/pprTableSettingsProvider";
import {
  checkIsPlanTimeField,
  checkIsPlanWorkField,
  getPlanWorkFieldByPlanTimeField,
  IPlanWorkPeriods,
  IPprData,
  TWorkCorrection,
} from "@/2entities/ppr";
import { TableCellWithWorkControl } from "@/3features/ppr/worksUpdate";

import { getTdStyle } from "../lib/pprTableStylesHelper";
import { CorrectionArrowsConteinerMemo } from "./CorrectionArrowsConteiner";

interface IPprTableCellProps extends ITableCellProps {
  id: string;
  field: keyof IPprData;
  pprSettings: IPprTableSettingsContext;
  planCellRef: MutableRefObject<HTMLTableCellElement | null>;
  getWorkCorrection: (
    id: string,
    field: keyof IPlanWorkPeriods
  ) => TWorkCorrection<IPlanWorkPeriods> | undefined;
  updatePprTableCell: (
    id: string,
    field: keyof IPprData,
    value: string,
    isWorkAproved?: boolean
  ) => void;
  isWorkAproved: boolean;
}

export const PprTableCell: FC<IPprTableCellProps> = ({
  id,
  field,
  isWorkAproved,
  pprSettings,
  updatePprTableCell,
  getWorkCorrection,
  ...otherProps
}) => {
  const isPlanWorkPeriodField = checkIsPlanWorkField(field);

  const corrections =
    (isPlanWorkPeriodField && getWorkCorrection(id, field)) || null;

  const isCorrectedView = useMemo(
    () =>
      pprSettings.correctionView === "CORRECTED_PLAN" ||
      pprSettings.correctionView === "CORRECTED_PLAN_WITH_ARROWS",
    [pprSettings.correctionView]
  );

  let value = otherProps.value;

  if (isCorrectedView && isPlanWorkPeriodField) {
    value = corrections ? corrections.finalCorrection : value;
  } else if (isCorrectedView && checkIsPlanTimeField(field)) {
    const finalCorrection = getWorkCorrection(
      id,
      getPlanWorkFieldByPlanTimeField(field)
    )?.finalCorrection;
    value = finalCorrection ? Number((finalCorrection * 1).toFixed(2)) : value;
  }

  const isArrowsShow = useMemo(
    () =>
      pprSettings.correctionView === "CORRECTED_PLAN_WITH_ARROWS" ||
      pprSettings.correctionView === "INITIAL_PLAN_WITH_ARROWS",
    [pprSettings.correctionView]
  );

  const transfers = (corrections?.planTransfers || []).concat(
    corrections?.undoneTransfers || []
  );

  const handleChange = useCallback(
    (newValue: string) => {
      updatePprTableCell(id, field, newValue, isWorkAproved);
    },
    [field, id, isWorkAproved, updatePprTableCell]
  );

  return (
    <td
      className="border border-black relative h-1"
      style={{
        ...getTdStyle(field),
      }}
    >
      <div className="flex flex-col justify-between gap-6">
        {isArrowsShow && isPlanWorkPeriodField && corrections && (
          <CorrectionArrowsConteinerMemo
            transfers={transfers}
            field={field}
            planCellRef={otherProps.planCellRef}
          />
        )}
        {field === "name" ? (
          <TableCellWithWorkControl
            onBlur={handleChange}
            id={id}
            {...otherProps}
          />
        ) : (
          <TableCell onBlur={handleChange} {...otherProps} />
        )}
      </div>
    </td>
  );
};

export const PprTableCellMemo = memo(PprTableCell);
