"use client";
import { FC, memo, useCallback } from "react";

import { ITableCellProps, TableCell } from "@/1shared/ui/table";
import { IWorkingManYearPlan } from "@/2entities/ppr";
import { PprWorkingManUpdateControl } from "@/3features/pprWorkingMans/workingMansUpdate";

interface IWorkingManTableCellProps extends ITableCellProps {
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

  return (
    <PprWorkingManUpdateControl workingMan={workingMan} isShowControl={isShowControl}>
      <TableCell {...otherProps} onBlur={handleChange} />
    </PprWorkingManUpdateControl>
  );
};

const WorkingManTableCellMemo = memo(WorkingManTableCell);

export { WorkingManTableCell, WorkingManTableCellMemo };
