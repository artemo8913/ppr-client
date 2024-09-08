"use client";
import { FC, useState } from "react";
import { ITableCellProps, TableCell } from "@/1shared/ui/table";
import { AddWorkButton } from "./AddWorkButton";
import { DeleteWorkButton } from "./DeleteWorkButton";
import { CopyWorkButton } from "./CopyWorkButton";

interface ITableCellWithWorkControlProps extends ITableCellProps {
  id?: string;
}

export const TableCellWithWorkControl: FC<ITableCellWithWorkControlProps> = ({ id, ...otherProps }) => {
  const [isHide, setIsHide] = useState<boolean>(true);

  return (
    <div className="relative" onMouseEnter={() => setIsHide(false)} onMouseLeave={() => setIsHide(true)}>
      {!isHide && (
        <div className="!absolute -bottom-6 left-0 z-10 flex">
          <DeleteWorkButton id={id} />
          <AddWorkButton workId={id} />
          <CopyWorkButton id={id} />
        </div>
      )}
      <TableCell {...otherProps} />
    </div>
  );
};
