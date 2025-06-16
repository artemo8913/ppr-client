"use client";
import { FC, memo, useCallback } from "react";

import { TableCellProps, TableCell } from "@/1shared/ui/table";
import { pprFieldValidator, IWorkingManYearPlan } from "@/2entities/ppr";
import { PprWorkingManUpdateControl } from "@/3features/ppr/workingMansUpdate";

import style from "./WorkingMansTableCell.module.scss";
import clsx from "clsx";
import { getQuartal, getTimePeriodFromString } from "@/1shared/lib/date";

interface IWorkingManTableCellProps extends TableCellProps {
  workingMan: IWorkingManYearPlan;
  rowIndex: number;
  field: keyof IWorkingManYearPlan;
  isEditable?: boolean;
  updateWorkingManTableCell: (rowIndex: number, field: keyof IWorkingManYearPlan, value: unknown) => void;
}

const WorkingManTableCell: FC<IWorkingManTableCellProps> = ({
  field,
  rowIndex,
  workingMan,
  isEditable,
  updateWorkingManTableCell,
  ...otherProps
}) => {
  const handleChange = useCallback(
    (value: unknown) => {
      updateWorkingManTableCell(rowIndex, field, value);
    },
    [rowIndex, field, updateWorkingManTableCell]
  );

  const isShowControl = field === "full_name" && isEditable;

  const currentTimePeriod = getTimePeriodFromString(field);

  const isBgTransparent =
    pprFieldValidator.isFactWork(field) ||
    pprFieldValidator.isFactTime(field) ||
    pprFieldValidator.isFactNormTime(field);

  const quartalNumber = currentTimePeriod && currentTimePeriod !== "year" && getQuartal(currentTimePeriod);

  return (
    <td className={clsx(style.WorkingMansTableCell, style[`Q${quartalNumber}`], isBgTransparent && style.transparent)}>
      <PprWorkingManUpdateControl workingMan={workingMan} isShowControl={isShowControl}>
        <TableCell {...otherProps} updateValue={handleChange} />
      </PprWorkingManUpdateControl>
    </td>
  );
};

const WorkingManTableCellMemo = memo(WorkingManTableCell);

export { WorkingManTableCell, WorkingManTableCellMemo };
