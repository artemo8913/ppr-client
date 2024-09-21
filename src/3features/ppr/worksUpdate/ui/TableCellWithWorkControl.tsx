"use client";
import { FC, useState } from "react";

import { ITableCellProps, TableCell } from "@/1shared/ui/table";
import { TWorkBranch } from "@/2entities/ppr";
import { AddWorkButton } from "./AddWorkButton";
import { DeleteWorkButton } from "./DeleteWorkButton";
import { CopyWorkButton } from "./CopyWorkButton";
import { ChangeBranchButton } from "./ChangeBranchButton";

interface ITableCellWithWorkControlProps extends ITableCellProps {
  id?: string;
  branch?: TWorkBranch;
}

export const TableCellWithWorkControl: FC<ITableCellWithWorkControlProps> = ({ id, branch, ...otherProps }) => {
  const [isHide, setIsHide] = useState<boolean>(true);

  return (
    <div className="relative" onMouseEnter={() => setIsHide(false)} onMouseLeave={() => setIsHide(true)}>
      {!isHide && (
        <div className="!absolute -bottom-6 left-0 z-10 flex py-2">
          <DeleteWorkButton id={id} />
          <AddWorkButton workId={id} />
          <CopyWorkButton id={id} />
          <ChangeBranchButton workId={id} branch={branch} />
        </div>
      )}
      <TableCell {...otherProps} />
    </div>
  );
};
