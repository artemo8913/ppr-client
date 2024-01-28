"use client";
import { ComponentPropsWithoutRef, FC, ReactNode } from "react";
import clsx from "clsx";
import { ITableCell } from "../model/tableSchema";

export const TableCell: FC<ITableCell> = (props) => {
  const {
    cellType = "none",
    value,
    isVertical = false,
    textAreaRows = 10,
    colSpan,
    rowSpan,
    children,
    width,
    height,
  } = props;
  return (
    <td colSpan={colSpan} width={width} rowSpan={rowSpan} className="border border-black break-words">
      <div
        style={{ height }}
        className={clsx(
          "w-full flex justify-center items-center text-sm bg-transparent",
          isVertical && "[writing-mode:vertical-rl] rotate-180"
        )}
      >
        {cellType === "textarea" && (
          <textarea
            value={value}
            onChange={() => {}}
            className={clsx(
              "resize-none border-none bg-inherit focus:bg-white transition-transform",
              isVertical && "focus:rotate-90 "
            )}
            rows={textAreaRows}
          >
            {children}
          </textarea>
        )}
        {cellType === "input" && (
          <input
            value={value}
            onChange={() => {}}
            className={clsx(
              "border-none bg-inherit focus:bg-white transition-transform",
              isVertical && "focus:rotate-90"
            )}
            maxLength={8}
          />
        )}
        {cellType === "none" && children}
      </div>
    </td>
  );
};
