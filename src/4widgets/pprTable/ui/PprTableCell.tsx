import { FC, memo } from "react";
import { ITableCellProps, TableCell } from "@/1shared/ui/table";
import { TableCellWithWorkControl } from "@/3features/ppr/worksUpdate";
import { IPprData } from "@/2entities/ppr";

interface IPprTableCellProps extends ITableCellProps {
  pprData?: IPprData;
  indexToPlace?: number;
  isWithWorkControl?: boolean;
}

export const PprTableCell: FC<IPprTableCellProps> = ({ pprData, indexToPlace, isWithWorkControl, ...otherProps }) => {
  if (isWithWorkControl) {
    return <TableCellWithWorkControl pprData={pprData} indexToPlace={indexToPlace} {...otherProps} />;
  }
  return <TableCell {...otherProps} />;
};

export const PprTableCellMemo = memo(PprTableCell);
