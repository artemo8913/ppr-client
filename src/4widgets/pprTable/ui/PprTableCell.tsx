"use client";
import clsx from "clsx";
import { FC, MutableRefObject } from "react";

import { getQuartal, getTimePeriodFromString } from "@/1shared/const/date";
import { ITableCellProps, TableCell } from "@/1shared/ui/table";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import {
  checkIsPlanOrFactWorkField,
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
  rowSpan?: number;
  pprData: IPprData;
  workOrder?: string;
  field: keyof IPprData;
  isPprInUserControl?: boolean;
  planCellRef: MutableRefObject<HTMLTableCellElement | null>;
  updatePprTableCell: (workId: TPprDataWorkId, field: keyof IPprData, value: string, isWorkAproved?: boolean) => void;
}

export const PprTableCell: FC<IPprTableCellProps> = ({
  field,
  rowSpan,
  pprData,
  workOrder,
  planCellRef,
  isPprInUserControl,
  updatePprTableCell,
  ...otherProps
}) => {
  const pprSettings = usePprTableSettings();

  const isPlanWorkPeriodField = checkIsPlanWorkField(field);
  const isPlanTimePeriodField = checkIsPlanTimeField(field);
  const isPlanOrFactWorkPeriodField = checkIsPlanOrFactWorkField(field);

  const quartalNumber = getQuartal(getTimePeriodFromString(field));

  const isBgNotTransparent = isPlanWorkPeriodField || isPlanTimePeriodField;

  const isWorkNameField = field === "name";

  const isLocationField = field === "location";

  const isUniteWorkName = pprSettings.isUniteSameWorks;

  const hasWorkBacklight = !Boolean(pprData.common_work_id) && isWorkNameField && pprSettings.isBacklightNotCommonWork;

  const isPlanTimeField = checkIsWorkOrTimeField(field);

  const isFieldWithControl =
    isPprInUserControl &&
    ((isWorkNameField && !isUniteWorkName) || (isWorkNameField && isUniteWorkName && rowSpan === 1) || isLocationField);

  const isCorrectedView =
    pprSettings.correctionView === "CORRECTED_PLAN" || pprSettings.correctionView === "CORRECTED_PLAN_WITH_ARROWS";

  const isArrowsShow =
    pprSettings.correctionView === "CORRECTED_PLAN_WITH_ARROWS" ||
    pprSettings.correctionView === "INITIAL_PLAN_WITH_ARROWS";

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

  const handleChange = (newValue: string) => {
    updatePprTableCell(pprData.id, field, newValue, pprData.is_work_aproved);
  };

  if (rowSpan === 0 && isUniteWorkName && isWorkNameField) {
    return null;
  }

  return (
    <td
      rowSpan={isUniteWorkName && isWorkNameField && rowSpan ? rowSpan : undefined}
      className={clsx(
        style.PprTableCell,
        quartalNumber && style[`Q${quartalNumber}`],
        !isBgNotTransparent && style.transparent,
        isPlanTimeField && style.bottom,
        hasWorkBacklight && style.backlight,
        pprSettings.isBacklightRowAndCellOnHover && "hover:shadow-purple-400 hover:shadow-inner",
        isPlanOrFactWorkPeriodField && "font-bold"
      )}
    >
      {isArrowsShow && isPlanWorkPeriodField ? (
        <div className="flex flex-col justify-between gap-6">
          <CorrectionArrowsConteinerMemo transfers={transfers} field={field} planCellRef={planCellRef} />
          <TableCell {...otherProps} onBlur={handleChange} value={value} />
        </div>
      ) : (
        <PprWorkUpdateControl work={pprData} isShowControl={isFieldWithControl}>
          {isWorkNameField && <span className="float-left pr-1">{workOrder}</span>}
          <TableCell
            {...otherProps}
            className={clsx(isWorkNameField && "!inline")}
            onBlur={handleChange}
            value={value}
          />
          {Boolean(pprData.note && isWorkNameField) && (
            <span className="font-semibold block">{` (прим. ${pprData.note})`}</span>
          )}
        </PprWorkUpdateControl>
      )}
    </td>
  );
};
