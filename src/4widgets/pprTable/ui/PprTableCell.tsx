"use client";
import { FC, memo, useCallback } from "react";
import { ITableCellProps, TableCell } from "@/1shared/ui/table";
import { TableCellWithWorkControl } from "@/3features/ppr/worksUpdate";
import { IPprData, checkIsPlanFactWorkPeriodField } from "@/2entities/ppr";

interface IPprTableCellProps extends ITableCellProps {
  pprData?: IPprData;
  indexData?: number;
  field?: keyof IPprData;
  updatePprData?: (rowIndex: number, columnId: string, value: unknown) => void;
  updateNewValueInCorrection?: (objectId: string, fieldName: string, newValue: number, oldValue: number) => void;
}

export const PprTableCell: FC<IPprTableCellProps> = ({
  pprData,
  indexData,
  field,
  updateNewValueInCorrection,
  updatePprData,
  ...otherProps
}) => {
  const handleChange = useCallback(
    (newValue: string) => {
      if (!pprData || !indexData || !field || !pprData[field] || !checkIsPlanFactWorkPeriodField(field)) {
        return;
      }
      if (pprData?.is_work_aproved) {
        updateNewValueInCorrection && updateNewValueInCorrection(pprData.id, field, Number(newValue), pprData[field]);
      } else {
        updatePprData && updatePprData(indexData, field, newValue);
      }
    },
    [updatePprData, updateNewValueInCorrection, pprData, field, indexData]
  );
  if (field === "name") {
    return (
      <TableCellWithWorkControl handleBlur={handleChange} pprData={pprData} indexToPlace={indexData} {...otherProps} />
    );
  }
  return <TableCell handleBlur={handleChange} {...otherProps} />;
};

export const PprTableCellMemo = memo(PprTableCell);
