"use client";
import { FC, memo, ReactNode, useState } from "react";
import clsx from "clsx";

import { TPprDataWorkId, TWorkBranch } from "@/2entities/ppr";

import { AddWorkButton } from "./AddWorkButton";
import { DeleteWorkButton } from "./DeleteWorkButton";
import { CopyWorkButton } from "./CopyWorkButton";
import { EditWorkButton } from "./EditWorkButton";
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

const PprWorkUpdateControl: FC<ITableCellWithWorkControlProps> = ({
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
      <div className={clsx("!absolute -bottom-6 left-0 z-10 flex py-2", isHide && "hidden")}>
        {!isWorkApproved && (
          <>
            <IncreaseWorkPositionButton workId={workId} />
            <DecreaseWorkPositionButton workId={workId} />
            <EditWorkButton workId={workId} branch={branch} note={note} />
            <DeleteWorkButton workId={workId} />
          </>
        )}
        <AddWorkButton nearWorkMeta={{ branch, subbranch, id: workId }} />
        <CopyWorkButton workId={workId} />
      </div>
      {children}
    </div>
  );
};

const PprWorkUpdateControlMemo = memo(PprWorkUpdateControl);

export { PprWorkUpdateControlMemo as PprWorkUpdateControl };
