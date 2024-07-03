"use client";
import { FC, memo } from "react";
import { ITableCellProps, TableCell } from "@/1shared/ui/table";
import { IPprData } from "@/2entities/ppr";
import { TableCellWithWorkControl } from "@/3features/ppr/worksUpdate";

interface IPprTableCellProps extends ITableCellProps {
  id?: string;
  isWorkAproved?: boolean;
  field?: keyof IPprData;
  updatePprTableCell?: (id: string, field: keyof IPprData, value: string, isWorkAproved?: boolean) => void;
}

export const PprTableCell: FC<IPprTableCellProps> = ({
  id,
  field,
  isWorkAproved,
  updatePprTableCell,
  ...otherProps
}) => {
  const handleChange = (newValue: string) => {
    if (id === undefined || !field || !updatePprTableCell) {
      return;
    }
    updatePprTableCell(id, field, newValue, isWorkAproved);
  };
  if (field === "name") {
    return <TableCellWithWorkControl handleBlur={handleChange} id={id} {...otherProps} />;
  }
  return <TableCell handleBlur={handleChange} {...otherProps} />;
};

export const PprTableCellMemo = memo(PprTableCell);
