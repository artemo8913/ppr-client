"use client";
import { FC, useState } from "react";
import clsx from "clsx";

type TCell = "none" | "input" | "textarea";

export interface ITableCellProps {
  value?: string | number | boolean | null;
  cellType?: TCell;
  isVertical?: boolean;
  className?: string;
  bgColor?: string;
  index?: number;
  field?: string;
  handleBlur?: (index: number, field: string, value: string) => void;
}

export const TableCell: FC<ITableCellProps> = (props) => {
  const { cellType = "none", value, isVertical = false, bgColor, className, handleBlur, index, field } = props;
  const [currentValue, setCurrentValue] = useState(value);
  return (
    /* Контейнер содержимого ячейки */
    <div
      style={{ backgroundColor: bgColor }}
      className={clsx(
        "w-full flex justify-center items-center bg-transparent [overflow-wrap:anywhere]",
        "border-none focus-within:relative focus-within:z-10",
        isVertical && "[writing-mode:vertical-rl] rotate-180",
        className
      )}
    >
      {/* TEXTAREA */}
      {cellType === "textarea" && (
        <textarea
          value={String(currentValue)}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={() => handleBlur && index && field && handleBlur(index, field, String(currentValue))}
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
          value={String(currentValue || "")}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={() => handleBlur && index && field && handleBlur(index, field, String(currentValue || ""))}
          className={clsx(
            "w-full cursor-pointer focus:cursor-text border-none bg-transparent transition-transform",
            isVertical && "h-[80px] focus:rotate-90 focus-within:bg-white"
          )}
          maxLength={8}
        />
      )}
      {/* JUST VALUE */}
      {(cellType === "none" && value) || ""}
    </div>
  );
};
