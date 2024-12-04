"use client";
import { FC, memo, ReactNode } from "react";

import { TableCellControlWrapper } from "@/1shared/ui/table";
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
  return (
    <TableCellControlWrapper
      isShowControl={isShowControl}
      controlItems={
        <>
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
        </>
      }
    >
      {children}
    </TableCellControlWrapper>
  );
};

const PprWorkUpdateControlMemo = memo(PprWorkUpdateControl);

export { PprWorkUpdateControlMemo as PprWorkUpdateControl };
