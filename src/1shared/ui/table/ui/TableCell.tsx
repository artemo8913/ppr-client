"use client";
import { FC } from "react";
import clsx from "clsx";
import { ITableCell } from "../model/tableSchema";

interface ITableCellProps extends ITableCell {}

export const TableCell: FC<ITableCellProps & HTMLTableElement> = ({
  type = "none",
  value,
  vText = false,
  maxHeight = 96,
  maxWidth = 96,
  textAreaRows = 3,
  onChange = () => {},
}) => {
  return (
    <td
      className={clsx("border border-black align-middle break-words", vText && "[writing-mode:vertical-rl] rotate-180")}
    >
      <div className={"flex justify-center items-center text-sm bg-transparent"}>
        {type === "textarea" && (
          <textarea
            value={value}
            onChange={onChange}
            style={{ maxHeight, maxWidth }}
            className={clsx(
              "resize-none border-none bg-inherit focus:bg-white transition-transform",
              vText && "focus:rotate-90 "
            )}
            rows={textAreaRows}
          />
        )}
        {type === "input" && (
          <input
            value={value}
            onChange={onChange}
            style={{ maxHeight, maxWidth }}
            className={clsx("border-none bg-inherit focus:bg-white transition-transform", vText && "focus:rotate-90")}
            maxLength={8}
          />
        )}
        {type === "none" && value}
      </div>
    </td>
  );
};
