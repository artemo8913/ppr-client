"use client";
import { FC, SyntheticEvent, useState } from "react";
import clsx from "clsx";
import { ITableCell } from "../model/table.schema";

export const TableCell: FC<ITableCell> = (props) => {
  const { cellType = "none", value, isVertical = false, bgColor, handleBlur, className } = props;
  const [currentValue, setCurrentValue] = useState(value);
  return (
    <>
      {/* Контейнер содержимого ячейки */}
      <div
        style={{ backgroundColor: bgColor }}
        className={clsx(
          "w-full flex justify-center items-center bg-transparent",
          "border-none focus-within:relative focus-within:z-10",
          isVertical && "[writing-mode:vertical-rl] rotate-180",
          className
        )}
      >
        {/* TEXTAREA */}
        {cellType === "textarea" && (
          <textarea
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onBlur={() => handleBlur && handleBlur(String(currentValue))}
            className={clsx(
              "cursor-pointer focus:cursor-text resize-none border-none bg-inherit transition-transform",
              !isVertical && "w-full",
              isVertical && "focus:rotate-90 "
            )}
            rows={4}
          />
        )}
        {/* INPUT */}
        {cellType === "input" && (
          <input
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onBlur={() => handleBlur && handleBlur(String(currentValue))}
            className={clsx(
              "w-full cursor-pointer focus:cursor-text text-center border-none bg-transparent transition-transform",
              isVertical && "h-[80px] focus:rotate-90 focus-within:bg-white"
            )}
            maxLength={8}
          />
        )}
        {/* JUST VALUE */}
        {cellType === "none" && value}
      </div>
    </>
  );
};
