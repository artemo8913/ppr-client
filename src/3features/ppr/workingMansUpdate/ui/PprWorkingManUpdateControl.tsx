"use client";
import { FC, memo, ReactNode } from "react";

import { TableCellControlWrapper } from "@/1shared/ui/table";
import { IWorkingManYearPlan } from "@/2entities/ppr";

import { AddWorkingManButton } from "./AddWorkingManButton";
import { DeleteWorkingManButton } from "./DeleteWorkingManButton";

interface IPprWorkingManUpdateControlProps {
  workingMan: IWorkingManYearPlan;
  children?: ReactNode;
  isShowControl?: boolean;
}

const PprWorkingManUpdateControl: FC<IPprWorkingManUpdateControlProps> = ({ workingMan, isShowControl, children }) => {
  return (
    <TableCellControlWrapper
      isShowControl={isShowControl}
      controlItems={
        <>
          {!workingMan.is_working_man_aproved && <DeleteWorkingManButton id={workingMan.id} />}
          <AddWorkingManButton nearWorkingManId={workingMan.id} />
        </>
      }
    >
      {children}
    </TableCellControlWrapper>
  );
};

const PprWorkingManUpdateControlMemo = memo(PprWorkingManUpdateControl);

export { PprWorkingManUpdateControlMemo as PprWorkingManUpdateControl };
