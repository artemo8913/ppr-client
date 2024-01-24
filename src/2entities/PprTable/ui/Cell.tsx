"use client";
import { FC } from "react";
import { ICell } from "../model/pprSchema";
import clsx from "clsx";

interface ICellProps extends ICell {
  onChange?: () => void;
}

const Cell: FC<ICellProps> = ({
  type = "none",
  value,
  vText = false,
  colSpan,
  rowSpan,
  maxHeight = 96,
  maxWidth = 96,
  textAreaRows = 3,
  onChange = () => {},
}) => {
  return (
    <td
      className={clsx("border border-black align-middle break-words", vText && "[writing-mode:vertical-rl] rotate-180")}
      colSpan={colSpan}
      rowSpan={rowSpan}
    >
      <div className={"flex justify-center items-center text-sm bg-transparent"}>
        {type === "textarea" && (
          <textarea
            onChange={onChange}
            style={{ maxHeight, maxWidth }}
            value={value}
            className={clsx(
              "resize-none border-none bg-inherit focus:bg-white transition-transform",
              vText && "focus:rotate-90 "
            )}
            rows={textAreaRows}
          />
        )}
        {type === "input" && (
          <input
            onChange={onChange}
            value={value}
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

export default Cell;
