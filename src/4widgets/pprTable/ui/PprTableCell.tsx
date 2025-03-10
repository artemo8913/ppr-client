"use client";
import clsx from "clsx";
import { FC, MutableRefObject, useRef } from "react";

import { roundToFixed } from "@/1shared/lib/math/roundToFixed";
import { ITableCellProps, TableCell } from "@/1shared/ui/table";
import { getQuartal, getTimePeriodFromString } from "@/1shared/lib/date";
import {
  checkIsPlanOrFactWorkField,
  checkIsPlanTimeField,
  checkIsPlanWorkField,
  checkIsWorkOrTimeField,
  IPprData,
  IPprTableSettingsContext,
  TPprDataWorkId,
  TTransfer,
} from "@/2entities/ppr";
import { PprWorkUpdateControl } from "@/3features/ppr/worksUpdate";

import { CorrectionArrowsConteinerMemo } from "./CorrectionArrowsConteiner";
import { checkIsFieldVertical } from "../lib/pprTableFieldsHelper";

import style from "./PprTableCell.module.scss";

function getValue(pprData: IPprData, field: keyof IPprData, isCorrectedView: boolean) {
  if (checkIsPlanWorkField(field) || checkIsPlanTimeField(field)) {
    if (isCorrectedView) {
      return roundToFixed(pprData[field].final);
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
  pprSettings: IPprTableSettingsContext;
  planCellRef: MutableRefObject<HTMLTableCellElement | null>;
  updatePprTableCell: (workId: TPprDataWorkId, field: keyof IPprData, value: string, isWorkAproved?: boolean) => void;
}

export const PprTableCell: FC<IPprTableCellProps> = ({
  field,
  rowSpan,
  pprData,
  workOrder,
  planCellRef,
  pprSettings,
  isPprInUserControl,
  updatePprTableCell,
  ...otherProps
}) => {
  const tdRef = useRef<HTMLTableCellElement>(null);

  const isPlanWorkPeriodField = checkIsPlanWorkField(field);
  const isPlanTimePeriodField = checkIsPlanTimeField(field);
  const isPlanOrFactWorkPeriodField = checkIsPlanOrFactWorkField(field);

  const quartalNumber = getQuartal(getTimePeriodFromString(field));

  const isBgNotTransparent = isPlanWorkPeriodField || isPlanTimePeriodField;

  const isWorkNameField = field === "name";

  const isLocationField = field === "location";

  const isUniteWorkName = pprSettings.isUniteSameWorks;

  const hasNotCommonWorkBacklight =
    !Boolean(pprData.common_work_id) && (isWorkNameField || isLocationField) && pprSettings.isBacklightNotCommonWork;

  const hasNotApprovedWorkBacklight =
    !Boolean(pprData.is_work_aproved) && (isWorkNameField || isLocationField) && pprSettings.isBacklightNotApprovedWork;

  const isPlanTimeField = checkIsWorkOrTimeField(field);

  const isFieldWithControl =
    isPprInUserControl &&
    ((isWorkNameField && !isUniteWorkName) || (isWorkNameField && isUniteWorkName && rowSpan === 1) || isLocationField);

  const isCorrectedView =
    pprSettings.pprView === "CORRECTED_PLAN" || pprSettings.pprView === "CORRECTED_PLAN_WITH_ARROWS";

  const isArrowsShow =
    pprSettings.pprView === "CORRECTED_PLAN_WITH_ARROWS" || pprSettings.pprView === "INITIAL_PLAN_WITH_ARROWS";

  const isVertical = checkIsFieldVertical(field);

  const isEditable = otherProps?.cellType === "input" || otherProps?.cellType === "textarea";

  let value = getValue(pprData, field, isCorrectedView);

  if (value === 0) {
    value = "";
  }

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
      ref={tdRef}
      tabIndex={-1}
      rowSpan={isUniteWorkName && isWorkNameField && rowSpan ? rowSpan : undefined}
      className={clsx(
        style.PprTableCell,
        isEditable && style.isEditable,
        isPlanTimeField && style.bottom,
        !isBgNotTransparent && style.transparent,
        isPlanOrFactWorkPeriodField && "font-bold",
        quartalNumber && style[`Q${quartalNumber}`],
        hasNotCommonWorkBacklight && style.backlightNotCommonWork,
        hasNotApprovedWorkBacklight && style.backlightNotApprovedWork,
        pprSettings.isBacklightRowAndCellOnHover && "hover:shadow-purple-400 hover:shadow-inner"
      )}
    >
      {isArrowsShow && isPlanWorkPeriodField ? (
        <div className="flex flex-col justify-between gap-6">
          <CorrectionArrowsConteinerMemo transfers={transfers} field={field} planCellRef={planCellRef} />
          <TableCell {...otherProps} tdRef={tdRef} isVertical={isVertical} onBlur={handleChange} value={value} />
        </div>
      ) : (
        <PprWorkUpdateControl work={pprData} isShowControl={isFieldWithControl}>
          <div>
            {isWorkNameField && <span className="float-left pr-1">{workOrder}</span>}
            <TableCell
              {...otherProps}
              tdRef={tdRef}
              value={value}
              onBlur={handleChange}
              isVertical={isVertical}
              className={clsx(isWorkNameField && "!inline")}
            />
            {Boolean(pprData.note && isWorkNameField) && (
              <span className="font-semibold block">{` (прим. ${pprData.note})`}</span>
            )}
          </div>
        </PprWorkUpdateControl>
      )}
    </td>
  );
};
