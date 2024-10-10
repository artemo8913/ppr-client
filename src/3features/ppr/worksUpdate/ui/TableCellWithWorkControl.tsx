"use client";
import { FC, useState } from "react";

import { ITableCellProps, TableCell } from "@/1shared/ui/table";
import { TWorkBranch } from "@/2entities/ppr";

import { AddWorkButton } from "./AddWorkButton";
import { DeleteWorkButton } from "./DeleteWorkButton";
import { CopyWorkButton } from "./CopyWorkButton";
import { EditWorkButtonMemo } from "./EditWorkButton";
import { IncreaseWorkPositionButton } from "./IncreaseWorkPositionButton";
import { DecreaseWorkPositionButton } from "./DecreaseWorkPositionButton";

interface ITableCellWithWorkControlProps extends ITableCellProps {
  workId: string | number;
  branch?: TWorkBranch;
}

export const TableCellWithWorkControl: FC<ITableCellWithWorkControlProps> = ({ workId, branch, ...otherProps }) => {
  const [isHide, setIsHide] = useState<boolean>(true);

  return (
    <div className="relative" onMouseEnter={() => setIsHide(false)} onMouseLeave={() => setIsHide(true)}>
      {!isHide && (
        <div className="!absolute -bottom-6 left-0 z-10 flex py-2">
          <IncreaseWorkPositionButton workId={workId} />
          <DecreaseWorkPositionButton workId={workId} />
          <DeleteWorkButton workId={workId} />
          <AddWorkButton workId={workId} />
          <CopyWorkButton workId={workId} />
          <EditWorkButtonMemo workId={workId} branch={branch} />
        </div>
      )}
      <TableCell {...otherProps} />
    </div>
  );
};
