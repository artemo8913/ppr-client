"use client";
import { FC, memo, ReactNode } from "react";

import { TableCellHoverWrapper } from "@/1shared/ui/table";
import { IPprData } from "@/2entities/ppr";

import { AddWorkButton } from "./AddWorkButton";
import { CopyWorkButton } from "./CopyWorkButton";
import { EditWorkButton } from "./EditWorkButton";
import { DeleteWorkButton } from "./DeleteWorkButton";
import { IncreaseWorkPositionButton } from "./IncreaseWorkPositionButton";
import { DecreaseWorkPositionButton } from "./DecreaseWorkPositionButton";

interface ITableCellWithWorkControlProps {
  work: IPprData;
  children?: ReactNode;
  isShowControl?: boolean;
}

const PprWorkUpdateControl: FC<ITableCellWithWorkControlProps> = ({ work, children, isShowControl }) => {
  if (!isShowControl) {
    return children;
  }

  return (
    <TableCellHoverWrapper
      items={
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
    </TableCellHoverWrapper>
  );
};

const PprWorkUpdateControlMemo = memo(PprWorkUpdateControl);

export { PprWorkUpdateControlMemo as PprWorkUpdateControl };
