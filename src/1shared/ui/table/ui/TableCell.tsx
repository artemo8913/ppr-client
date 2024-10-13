"use client";
import { ChangeEvent, FC, HTMLInputTypeAttribute, memo, Ref, useCallback, useEffect, useRef, useState } from "react";
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

const TableCell: FC<ITableCellProps> = (props) => {
  const { cellType = "none", value, type, isVertical = false, onBlur, className } = props;

  const [currentValue, setCurrentValue] = useState(value);

  const ref = useRef<HTMLTextAreaElement & HTMLInputElement>(null);

  const handleUpdateValue = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setCurrentValue(e.target.value),
    []
  );

  const handleSelect = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => e.target.select(), []);

  const handleKeydown = useCallback((keyboardEvent: KeyboardEvent) => {
    if (keyboardEvent.key === "Escape" || keyboardEvent.key === "Enter") {
      ref.current?.blur();
    }
  }, []);

  const handleBlur = useCallback(() => {
    if (onBlur) {
      onBlur(String(currentValue));
    }
  }, [currentValue, onBlur]);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    window?.addEventListener("keydown", handleKeydown);

    return () => window?.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  return (
    <div className={clsx(style.TableCell, isVertical && style.isVertical, className)}>
      {cellType === "textarea" && (
        <textarea
          ref={ref}
          value={String(currentValue)}
          onFocus={handleSelect}
          onChange={handleUpdateValue}
          onBlur={handleBlur}
          className={clsx(style.TextareaCell, !isVertical && style.isNotVertical)}
          rows={TEXTAREA_BASIC_ROWS_COUNT}
        />
      )}
      {cellType === "input" && (
        <input
          ref={ref}
          value={String(currentValue)}
          onFocus={handleSelect}
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

export { TableCell, TableCellMemo };
