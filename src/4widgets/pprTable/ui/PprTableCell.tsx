"use client";
import { FC, memo } from "react";
import { ITableCellProps, TableCell } from "@/1shared/ui/table";
import { IPprData, checkIsFactTimeField, checkIsFactWorkField, checkIsPlanWorkField } from "@/2entities/ppr";
import { TableCellWithWorkControl } from "@/3features/ppr/worksUpdate";

interface IPprTableCellProps extends ITableCellProps {
  pprData?: IPprData;
  indexData?: number;
  field?: keyof IPprData;
  updatePprTableCell?: (newValue: string, isWorkApproved: boolean, indexData: number, field: keyof IPprData) => void;
}

export const PprTableCell: FC<IPprTableCellProps> = ({
  pprData,
  indexData,
  field,
  updatePprTableCell,
  ...otherProps
}) => {
  const handleChange = (newValue: string) => {
    if (!pprData || indexData === undefined || !field || !updatePprTableCell) {
      return;
    }
    updatePprTableCell(newValue, pprData.is_work_aproved, indexData, field);
  };
  if (field === "name") {
    return (
      <TableCellWithWorkControl handleBlur={handleChange} pprData={pprData} indexToPlace={indexData} {...otherProps} />
    );
  }
  return <TableCell handleBlur={handleChange} {...otherProps} />;
};

export const PprTableCellMemo = memo(PprTableCell);
