"use client";
import { FC, memo, MutableRefObject, useCallback, useMemo } from "react";
import clsx from "clsx";

import { getQuartal, getTimePeriodFromString } from "@/1shared/const/date";
import { ITableCellProps, TableCell } from "@/1shared/ui/table";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import {
  checkIsPlanTimeField,
  checkIsPlanWorkField,
  checkIsWorkOrTimeField,
  IPprData,
  TPprDataWorkId,
  TTransfer,
} from "@/2entities/ppr";
import { PprWorkUpdateControl } from "@/3features/ppr/worksUpdate";

import { CorrectionArrowsConteinerMemo } from "./CorrectionArrowsConteiner";

import style from "./PprTableCell.module.scss";

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
  updatePprTableCell: (workId: TPprDataWorkId, field: keyof IPprData, value: string, isWorkAproved?: boolean) => void;
  isPprInUserControl?: boolean;
}

export const PprTableCell: FC<IPprTableCellProps> = ({
  pprData,
  field,
  updatePprTableCell,
  planCellRef,
  isPprInUserControl,
  ...otherProps
}) => {
  const pprSettings = usePprTableSettings();

  const isPlanWorkPeriodField = checkIsPlanWorkField(field);
  const isPlanTimePeriodField = checkIsPlanTimeField(field);

  const quartalNumber = getQuartal(getTimePeriodFromString(field));

  const isBgNotTransparent = isPlanWorkPeriodField || isPlanTimePeriodField;

  const hasCommonWorkBacklight =
    Boolean(pprData.common_work_id) && field === "name" && pprSettings.isBacklightCommonWork;

  const isPlanTimeField = checkIsWorkOrTimeField(field);

  const isFieldWithControl = field === "name" && isPprInUserControl;

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

  let value = getValue(pprData, field, isCorrectedView) || "";

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
      className={clsx(
        style.PprTableCell,
        quartalNumber && style[`Q${quartalNumber}`],
        !isBgNotTransparent && style.transparent,
        isPlanTimeField && style.bottom,
        hasCommonWorkBacklight && style.backlight
      )}
    >
      {isArrowsShow && isPlanWorkPeriodField ? (
        <div className="flex flex-col justify-between gap-6">
          <CorrectionArrowsConteinerMemo transfers={transfers} field={field} planCellRef={planCellRef} />
          <TableCell {...otherProps} onBlur={handleChange} value={value} />
        </div>
      ) : (
        <PprWorkUpdateControl
          workId={pprData.id}
          branch={pprData.branch}
          subbranch={pprData.subbranch}
          note={pprData.note}
          isWorkApproved={pprData.is_work_aproved}
          isShowControl={isFieldWithControl}
        >
          <TableCell {...otherProps} onBlur={handleChange} value={value} />
          {Boolean(pprData.note && field === "name") && (
            <span className="font-semibold">{` (прим. ${pprData.note})`}</span>
          )}
        </PprWorkUpdateControl>
      )}
    </td>
  );
};

export const PprTableCellMemo = memo(PprTableCell);
