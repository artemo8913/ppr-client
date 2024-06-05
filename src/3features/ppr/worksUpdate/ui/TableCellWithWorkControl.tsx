"use client";
import { FC, useState } from "react";
import { ITableCellProps, TableCell } from "@/1shared/ui/table";
import { AddWorkButton } from "./AddWorkButton";
import { DeleteWorkButton } from "./DeleteWorkButton";
import { usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";
import { IPprData } from "@/2entities/ppr";
import { CopyWorkButton } from "./CopyWorkButton";

interface ITableCellWithWorkControlProps extends ITableCellProps {
  pprData?: IPprData;
  indexToPlace?: number;
}

export const TableCellWithWorkControl: FC<ITableCellWithWorkControlProps> = ({
  pprData,
  indexToPlace,
  ...otherProps
}) => {
  const [isHide, setIsHide] = useState<boolean>(true);

  const { headerHeightPx } = usePprTableSettings();

  return (
    <div
      style={{ maxHeight: `${headerHeightPx}px` }}
      className="relative"
      onMouseEnter={() => setIsHide(false)}
      onMouseLeave={() => setIsHide(true)}
    >
      <div className="!absolute -bottom-6 left-0 z-10" style={{ display: isHide ? "none" : "flex" }}>
        <DeleteWorkButton workId={pprData?.id} />
        <AddWorkButton indexToPlace={indexToPlace} />
        <CopyWorkButton indexToPlace={indexToPlace} pprData={pprData} />
      </div>
      <TableCell {...otherProps} />
    </div>
  );
};
