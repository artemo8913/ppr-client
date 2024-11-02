"use client";
import { FC, useState } from "react";

import { ITableCellProps, TableCell } from "@/1shared/ui/table";
import { TPprDataWorkId, TWorkBranch } from "@/2entities/ppr";

import { AddWorkButton } from "./AddWorkButton";
import { DeleteWorkButton } from "./DeleteWorkButton";
import { CopyWorkButton } from "./CopyWorkButton";
import { EditWorkButtonMemo } from "./EditWorkButton";
import { IncreaseWorkPositionButton } from "./IncreaseWorkPositionButton";
import { DecreaseWorkPositionButton } from "./DecreaseWorkPositionButton";

interface ITableCellWithWorkControlProps extends ITableCellProps {
  workId: TPprDataWorkId;
  isWorkApproved?: boolean;
  branch?: TWorkBranch;
  note?: string | null;
}

export const TableCellWithWorkControl: FC<ITableCellWithWorkControlProps> = ({
  workId,
  isWorkApproved,
  branch,
  note,
  ...otherProps
}) => {
  const [isHide, setIsHide] = useState<boolean>(true);

  return (
    <div className="relative" onMouseEnter={() => setIsHide(false)} onMouseLeave={() => setIsHide(true)}>
      {!isHide && (
        <div className="!absolute -bottom-6 left-0 z-10 flex py-2">
          {!isWorkApproved && (
            <>
              <IncreaseWorkPositionButton workId={workId} />
              <DecreaseWorkPositionButton workId={workId} />
              <EditWorkButtonMemo workId={workId} branch={branch} note={note} />
              <DeleteWorkButton workId={workId} />
            </>
          )}
          <AddWorkButton nearWorkId={workId} />
          <CopyWorkButton workId={workId} />
        </div>
      )}
      <TableCell {...otherProps} />
    </div>
  );
};
