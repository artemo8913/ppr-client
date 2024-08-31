"use client";
import { FC, memo, useCallback } from "react";
import { ITableCellProps, TableCell } from "@/1shared/ui/table";
import { IWorkingManYearPlan } from "@/2entities/ppr";

interface IWorkingManTableCellProps extends ITableCellProps {
  rowIndex?: number;
  field?: keyof IWorkingManYearPlan;
  updateWorkingManTableCell?: (rowIndex: number, field: keyof IWorkingManYearPlan, value: unknown) => void;
}

const WorkingManTableCell: FC<IWorkingManTableCellProps> = ({
  rowIndex,
  field,
  updateWorkingManTableCell,
  ...otherProps
}) => {
  const handleChange = useCallback(
    (value: unknown) => {
      if (!rowIndex || !field || !updateWorkingManTableCell) {
        return;
      }
      updateWorkingManTableCell(rowIndex, field, value);
    },
    [rowIndex, field, updateWorkingManTableCell]
  );

  return <TableCell {...otherProps} handleBlur={handleChange} />;
};

const WorkingManTableCellMemo = memo(WorkingManTableCell);

export { WorkingManTableCell, WorkingManTableCellMemo };
