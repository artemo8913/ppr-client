"use client";
import { FC, useState } from "react";
import { ITableCell, TableCell } from "@/1shared/ui/table";
import { AddWorkButton } from "./AddWorkButton";
import { DeleteWorkButton } from "./DeleteWorkButton";
import { usePprTableViewSettings } from "@/1shared/providers/pprTableProvider";

interface ITableCellWithWorkControlProps extends ITableCell {
  id?: string;
}

export const TableCellWithWorkControl: FC<ITableCellWithWorkControlProps> = ({ id, ...otherProps }) => {
  const [isHide, setIsHide] = useState<boolean>(true);

  const { headerHeightPx } = usePprTableViewSettings();

  return (
    <div
      style={{ maxHeight: `${headerHeightPx}px` }}
      onMouseEnter={() => setIsHide(false)}
      onMouseLeave={() => setIsHide(true)}
    >
      <div className="!absolute bottom-0 left-1/2 z-10" style={{ display: isHide ? "none" : "flex" }}>
        <DeleteWorkButton workId={id} />
        <AddWorkButton />
      </div>
      <TableCell {...otherProps} />
    </div>
  );
};
