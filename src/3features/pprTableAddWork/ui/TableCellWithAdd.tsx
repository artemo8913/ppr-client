"use client";
import { FC, useState } from "react";
import { ITableCell, TableCell } from "@/1shared/ui/table";
import { AddWorkButton } from "./AddWorkButton";

interface ITableCellWithAddProps extends ITableCell {}

export const TableCellWithAdd: FC<ITableCellWithAddProps> = ({ ...otherProps }) => {
  const [buttonStyle, setButtonStyle] = useState<React.CSSProperties>({ display: "none" });

  return (
    <div
      className="max-h-[250px]"
      onMouseEnter={() => setButtonStyle({ display: "block" })}
      onMouseLeave={() => setButtonStyle({ display: "none" })}
    >
      <AddWorkButton style={buttonStyle} />
      <TableCell {...otherProps} />
    </div>
  );
};
