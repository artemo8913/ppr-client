"use client";
import { FC, memo, ReactNode } from "react";

import { TableCellControlWrapper } from "@/1shared/ui/table";
import { TWorkingManId } from "@/2entities/ppr";

import { AddWorkingManButton } from "./AddWorkingManButton";
import { DeleteWorkingManButton } from "./DeleteWorkingManButton";

interface IPprWorkingManUpdateControlProps {
  workingManId: TWorkingManId;
  children?: ReactNode;
  isShowControl?: boolean;
}

const PprWorkingManUpdateControl: FC<IPprWorkingManUpdateControlProps> = ({
  workingManId,
  isShowControl,
  children,
}) => {
  return (
    <TableCellControlWrapper
      isShowControl={isShowControl}
      controlItems={
        <>
          <DeleteWorkingManButton id={workingManId} />
          <AddWorkingManButton nearWorkingManId={workingManId} />
        </>
      }
    >
      {children}
    </TableCellControlWrapper>
  );
};

const PprWorkingManUpdateControlMemo = memo(PprWorkingManUpdateControl);

export { PprWorkingManUpdateControlMemo as PprWorkingManUpdateControl };
