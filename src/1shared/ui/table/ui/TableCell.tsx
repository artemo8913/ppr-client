"use client";
import {
  ChangeEvent,
  FC,
  HTMLInputTypeAttribute,
  memo,
  useCallback,
  useState,
} from "react";
import clsx from "clsx";

import style from "./TableCell.module.scss";

type TCell = "none" | "input" | "textarea";

export interface ITableCellProps {
  cellType?: TCell;
  value?: string | number | boolean | null;
  type?: HTMLInputTypeAttribute;
  isVertical?: boolean;
  onBlur?: (value: string) => void;
  className?: string;
}

const TEXTAREA_BASIC_ROWS_COUNT = 4;
const INPUT_BASIC_MAX_LENGTH = 8;

export const TableCell: FC<ITableCellProps> = (props) => {
  const {
    cellType = "none",
    value,
    type,
    isVertical = false,
    onBlur,
    className,
  } = props;

  const [currentValue, setCurrentValue] = useState(value);

  const handleUpdateValue = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setCurrentValue(e.target.value),
    []
  );

  const handleBlur = useCallback(() => {
    if (onBlur) {
      onBlur(String(currentValue));
    }
  }, [currentValue, onBlur]);

  return (
    <div
      className={clsx(
        style.TableCell,
        isVertical && style.isVertical,
        className
      )}
    >
      {cellType === "textarea" && (
        <textarea
          value={String(currentValue)}
          onChange={handleUpdateValue}
          onBlur={handleBlur}
          className={clsx(
            style.TextareaCell,
            !isVertical && style.isNotVertical
          )}
          rows={TEXTAREA_BASIC_ROWS_COUNT}
        />
      )}
      {cellType === "input" && (
        <input
          value={String(currentValue)}
          onChange={handleUpdateValue}
          onBlur={handleBlur}
          className={clsx(style.InputCell, isVertical && style.isVertical)}
          maxLength={INPUT_BASIC_MAX_LENGTH}
          type={type}
        />
      )}
      {cellType === "none" && value}
    </div>
  );
};

const TableCellMemo = memo(TableCell);

export { TableCellMemo };
