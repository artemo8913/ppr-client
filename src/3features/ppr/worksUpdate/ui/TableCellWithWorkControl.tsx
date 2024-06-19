"use client";
import { FC, useState } from "react";
import { ITableCellProps, TableCell } from "@/1shared/ui/table";
import { AddWorkButton } from "./AddWorkButton";
import { DeleteWorkButton } from "./DeleteWorkButton";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { CopyWorkButton } from "./CopyWorkButton";

interface ITableCellWithWorkControlProps extends ITableCellProps {
  rowIndex?: number;
}

export const TableCellWithWorkControl: FC<ITableCellWithWorkControlProps> = ({ rowIndex, ...otherProps }) => {
  const [isHide, setIsHide] = useState<boolean>(true);

  const { headerHeightPx } = usePprTableSettings();

  return (
    <div
      style={{ maxHeight: `${headerHeightPx}px` }}
      className="relative"
      onMouseEnter={() => setIsHide(false)}
      onMouseLeave={() => setIsHide(true)}
    >
      {!isHide && (
        <div className="!absolute -bottom-6 left-0 z-10 flex">
          <DeleteWorkButton rowIndex={rowIndex} />
          <AddWorkButton rowIndex={rowIndex} />
          <CopyWorkButton rowIndex={rowIndex} />
        </div>
      )}
      <TableCell {...otherProps} />
    </div>
  );
};
