"use client";
import { FC } from "react";
import clsx from "clsx";
import { ITableCell } from "../model/tableSchema";

export const TableCell: FC<ITableCell> = (props) => {
  const { cellType = "none", value, isVertical = false, children, height, width, colSpan, rowSpan, style } = props;
  return (
    <td width={width} colSpan={colSpan} rowSpan={rowSpan} style={style} className="border border-black break-words">
      {/* Контейнер содержимого td */}
      <div
        style={{ height }}
        className={clsx(
          "w-full flex justify-center items-center bg-transparent",
          "focus-within:relative focus-within:z-10",
          isVertical && "[writing-mode:vertical-rl] rotate-180"
        )}
      >
        {/* TEXTAREA */}
        {cellType === "textarea" && (
          <textarea
            defaultValue={value}
            onChange={() => {}}
            className={clsx(
              "resize-none border-none bg-inherit transition-transform",
              !isVertical && "w-full",
              isVertical && "focus:rotate-90 "
            )}
            rows={4}
          />
        )}
        {/* INPUT */}
        {cellType === "input" && (
          <input
            defaultValue={value}
            onChange={() => {}}
            className={clsx(
              "w-full cursor-pointer focus:cursor-text text-center border-none bg-transparent transition-transform",
              isVertical && "h-[90px] focus:rotate-90 focus-within:bg-white"
            )}
            maxLength={8}
          />
        )}
        {/* JUST VALUE */}
        {cellType === "none" && (value || children)}
      </div>
    </td>
  );
};
