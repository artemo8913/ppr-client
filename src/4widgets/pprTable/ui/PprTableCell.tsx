import { FC } from "react";
import { ITableCellProps, TableCell } from "@/1shared/ui/table";
import { TableCellWithWorkControl } from "@/3features/ppr/worksUpdate";

interface IPprTableCellProps extends ITableCellProps {
  id?: string;
  indexToPlace?: number;
  isWithWorkControl?: boolean;
}

export const PprTableCell: FC<IPprTableCellProps> = ({ id, indexToPlace, isWithWorkControl, ...otherProps }) => {
  if (isWithWorkControl) {
    return <TableCellWithWorkControl id={id} indexToPlace={indexToPlace} {...otherProps} />;
  }
  return <TableCell {...otherProps} />;
};
