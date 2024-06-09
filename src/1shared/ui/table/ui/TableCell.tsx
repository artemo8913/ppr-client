"use client";
import { FC, useState } from "react";
import clsx from "clsx";

type TCell = "none" | "input" | "textarea";

export interface ITableCellProps {
  cellType?: TCell;
  bgColor?: string;
  className?: string;
  isVertical?: boolean;
  value?: string | number | boolean | null;
  handleBlur?: (value: string) => void;
}

export const TableCell: FC<ITableCellProps> = (props) => {
  const { cellType = "none", value, isVertical = false, bgColor, className, handleBlur: handleBlur } = props;
  const [currentValue, setCurrentValue] = useState(value);
  return (
    /* Контейнер содержимого ячейки */
    <div
      style={{ backgroundColor: bgColor }}
      className={clsx(
        "w-full flex justify-center items-center bg-transparent [overflow-wrap:anywhere]",
        "border-none focus-within:relative focus-within:z-10",
        isVertical &&
          "[writing-mode:vertical-rl] focus-within:[writing-mode:horizontal-tb] rotate-180 focus-within:rotate-0",
        className
      )}
    >
      {/* TEXTAREA */}
      {cellType === "textarea" && (
        <textarea
          value={String(currentValue)}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={() => handleBlur && handleBlur(String(currentValue))}
          className={clsx(
            "cursor-pointer focus:cursor-text resize-none border-none bg-inherit",
            !isVertical && "w-full"
          )}
          rows={4}
        />
      )}
      {/* INPUT */}
      {cellType === "input" && (
        <input
          value={String(currentValue || "")}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={() => handleBlur && handleBlur(String(currentValue || ""))}
          className={clsx(
            "w-full h-[80px] cursor-pointer focus:cursor-text border-none bg-transparent",
            isVertical && "focus-within:bg-white focus:w-[80px] focus:h-auto"
          )}
          maxLength={8}
        />
      )}
      {/* JUST VALUE */}
      {(cellType === "none" && value) || ""}
    </div>
  );
};
