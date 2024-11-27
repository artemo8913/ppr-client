"use client";
import { FC, memo, useCallback } from "react";

import { ITableCellProps, TableCell } from "@/1shared/ui/table";
import { IWorkingManYearPlan, TWorkingManId } from "@/2entities/ppr";
import { PprWorkingManUpdateControl } from "@/3features/pprWorkingMans/workingMansUpdate";

interface IWorkingManTableCellProps extends ITableCellProps {
  id: TWorkingManId;
  rowIndex: number;
  field: keyof IWorkingManYearPlan;
  isPprInUserControl?: boolean;
  updateWorkingManTableCell: (rowIndex: number, field: keyof IWorkingManYearPlan, value: unknown) => void;
}

const WorkingManTableCell: FC<IWorkingManTableCellProps> = ({
  id,
  rowIndex,
  field,
  updateWorkingManTableCell,
  isPprInUserControl,
  ...otherProps
}) => {
  const handleChange = useCallback(
    (value: unknown) => {
      updateWorkingManTableCell(rowIndex, field, value);
    },
    [rowIndex, field, updateWorkingManTableCell]
  );

  const isShowControl = field === "full_name" && isPprInUserControl;

  return (
    <PprWorkingManUpdateControl workingManId={id} isShowControl={isShowControl}>
      <TableCell {...otherProps} onBlur={handleChange} />
    </PprWorkingManUpdateControl>
  );
};

const WorkingManTableCellMemo = memo(WorkingManTableCell);

export { WorkingManTableCell, WorkingManTableCellMemo };
