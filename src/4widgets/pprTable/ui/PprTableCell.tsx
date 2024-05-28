import { FC } from "react";
import { ITableCell, TableCell } from "@/1shared/ui/table";
import { TableCellWithWorkControl } from "@/3features/pprTableWorkControl";

interface IPprTableCellProps extends ITableCell {
  id?: string;
  isWithWorkControl?: boolean;
}

export const PprTableCell: FC<IPprTableCellProps> = ({ id: workId, isWithWorkControl, ...otherProps }) => {
  if (isWithWorkControl) {
    return <TableCellWithWorkControl id={workId} {...otherProps} />;
  }
  return <TableCell {...otherProps} />;
};
