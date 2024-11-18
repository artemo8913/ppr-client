"use client";
import { FC, ReactNode, useState } from "react";

import { TPprDataWorkId, TWorkBranch } from "@/2entities/ppr";

import { AddWorkButton } from "./AddWorkButton";
import { DeleteWorkButton } from "./DeleteWorkButton";
import { CopyWorkButton } from "./CopyWorkButton";
import { EditWorkButtonMemo } from "./EditWorkButton";
import { IncreaseWorkPositionButton } from "./IncreaseWorkPositionButton";
import { DecreaseWorkPositionButton } from "./DecreaseWorkPositionButton";

interface ITableCellWithWorkControlProps {
  workId: TPprDataWorkId;
  branch?: TWorkBranch;
  subbranch?: string;
  note?: string | null;
  children?: ReactNode;
  isWorkApproved?: boolean;
  isShowControl?: boolean;
}

export const PprWorkUpdateControl: FC<ITableCellWithWorkControlProps> = ({
  workId,
  branch,
  subbranch,
  note,
  children,
  isWorkApproved,
  isShowControl,
}) => {
  const [isHide, setIsHide] = useState<boolean>(true);

  if (!isShowControl) {
    return children;
  }

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
          <AddWorkButton nearWorkMeta={{ branch, subbranch, workId }} />
          <CopyWorkButton workId={workId} />
        </div>
      )}
      {children}
    </div>
  );
};
