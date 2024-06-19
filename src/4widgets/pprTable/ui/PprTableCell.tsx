"use client";
import { FC, memo } from "react";
import { ITableCellProps, TableCell } from "@/1shared/ui/table";
import { IPprData } from "@/2entities/ppr";
import { TableCellWithWorkControl } from "@/3features/ppr/worksUpdate";

interface IPprTableCellProps extends ITableCellProps {
  rowIndex?: number;
  isWorkAproved?: boolean;
  field?: keyof IPprData;
  updatePprTableCell?: (newValue: string, isWorkAproved: boolean, indexData: number, field: keyof IPprData) => void;
}

export const PprTableCell: FC<IPprTableCellProps> = ({
  rowIndex,
  field,
  isWorkAproved,
  updatePprTableCell,
  ...otherProps
}) => {
  const handleChange = (newValue: string) => {
    if (rowIndex === undefined || !field || !updatePprTableCell) {
      return;
    }
    updatePprTableCell(newValue, isWorkAproved || false, rowIndex, field);
  };
  if (field === "name") {
    return <TableCellWithWorkControl handleBlur={handleChange} rowIndex={rowIndex} {...otherProps} />;
  }
  return <TableCell handleBlur={handleChange} {...otherProps} />;
};

export const PprTableCellMemo = memo(PprTableCell);
