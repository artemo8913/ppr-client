"use client";
import { FC, memo, ReactNode } from "react";

import { TableCellControlWrapper } from "@/1shared/ui/table";
import { IPprData } from "@/2entities/ppr";

import { AddWorkButton } from "./AddWorkButton";
import { DeleteWorkButton } from "./DeleteWorkButton";
import { CopyWorkButton } from "./CopyWorkButton";
import { IncreaseWorkPositionButton } from "./IncreaseWorkPositionButton";
import { DecreaseWorkPositionButton } from "./DecreaseWorkPositionButton";
import { EditWorkButton } from "./EditWorkButton";

interface ITableCellWithWorkControlProps {
  work: IPprData;
  children?: ReactNode;
  isShowControl?: boolean;
}

const PprWorkUpdateControl: FC<ITableCellWithWorkControlProps> = ({ work, children, isShowControl }) => {
  return (
    <TableCellControlWrapper
      isShowControl={isShowControl}
      controlItems={
        <>
          {!work.is_work_aproved && (
            <>
              <IncreaseWorkPositionButton workId={work.id} />
              <DecreaseWorkPositionButton workId={work.id} />
              <EditWorkButton work={work} />
              <DeleteWorkButton workId={work.id} />
            </>
          )}
          <AddWorkButton nearWork={work} />
          <CopyWorkButton workId={work.id} />
        </>
      }
    >
      {children}
    </TableCellControlWrapper>
  );
};

const PprWorkUpdateControlMemo = memo(PprWorkUpdateControl);

export { PprWorkUpdateControlMemo as PprWorkUpdateControl };
