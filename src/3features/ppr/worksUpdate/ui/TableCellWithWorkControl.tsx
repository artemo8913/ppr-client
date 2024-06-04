"use client";
import { FC, useState } from "react";
import { ITableCell, TableCell } from "@/1shared/ui/table";
import { AddWorkButton } from "./AddWorkButton";
import { DeleteWorkButton } from "./DeleteWorkButton";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";

interface ITableCellWithWorkControlProps extends ITableCell {
  id?: string;
  indexToPlace?: number;
}

export const TableCellWithWorkControl: FC<ITableCellWithWorkControlProps> = ({ id, indexToPlace, ...otherProps }) => {
  const [isHide, setIsHide] = useState<boolean>(true);

  const { headerHeightPx } = usePprTableSettings();

  return (
    <div
      style={{ maxHeight: `${headerHeightPx}px` }}
      onMouseEnter={() => setIsHide(false)}
      onMouseLeave={() => setIsHide(true)}
    >
      <div className="!absolute bottom-0 left-1/2 z-10" style={{ display: isHide ? "none" : "flex" }}>
        <DeleteWorkButton workId={id} />
        <AddWorkButton indexToPlace={indexToPlace} />
      </div>
      <TableCell {...otherProps} />
    </div>
  );
};
