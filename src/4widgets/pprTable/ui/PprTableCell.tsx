import { ITableCell, TableCell } from "@/1shared/ui/table";
import { TableCellWithAdd } from "@/3features/pprTableAddWork";
import { FC, ReactNode } from "react";

interface IPprTableCellProps extends ITableCell {
  isWithAddButton?: boolean;
}

export const PprTableCell: FC<IPprTableCellProps> = ({ isWithAddButton, ...otherProps }) => {
  if (isWithAddButton) {
    return <TableCellWithAdd {...otherProps} />;
  }
  return <TableCell {...otherProps} />;
};
