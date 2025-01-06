"use client";
import {
  FC,
  memo,
  useRef,
  useState,
  RefObject,
  useEffect,
  useCallback,
  ChangeEvent,
  HTMLInputTypeAttribute,
} from "react";
import clsx from "clsx";

import style from "./TableCell.module.scss";

type TCell = "none" | "input" | "textarea";

export interface ITableCellProps {
  cellType?: TCell;
  className?: string;
  isVertical?: boolean;
  type?: HTMLInputTypeAttribute;
  onBlur?: (value: string) => void;
  tdRef?: RefObject<HTMLTableCellElement>;
  value?: string | number | boolean | null;
}

const TEXTAREA_BASIC_ROWS_COUNT = 4;
const INPUT_BASIC_MAX_LENGTH = 12;

const TableCell: FC<ITableCellProps> = (props) => {
  const { cellType = "none", value, type, isVertical = false, onBlur, tdRef, className } = props;

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
    if (!onBlur) {
      return;
    }

    if (type === "number" && /^[0-9]+[.,]?[0-9]*$/.test(String(currentValue))) {
      onBlur(String(currentValue).replace(",", "."));

      return;
    }

    onBlur(String(currentValue));
  }, [currentValue, onBlur, type]);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    window?.addEventListener("keydown", handleKeydown);

    return () => window?.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  const validatePattern = type === "number" ? "^[0-9]+[.]?[0-9]*$" : ".*";

  const hasError = type === "number" && isNaN(Number(value));

  useEffect(() => {
    const td = tdRef?.current;

    const handleFocusIn = (e: FocusEvent) => {
      e.preventDefault();
      e.stopPropagation();
      ref?.current?.focus();
    };

    td?.addEventListener("focus", handleFocusIn);

    return () => {
      td?.removeEventListener("focus", handleFocusIn);
    };
  }, [tdRef]);

  return (
    <div className={clsx(style.TableCell, hasError && style.hasError, isVertical && style.isVertical, className)}>
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
          pattern={validatePattern}
        />
      )}
      {cellType === "none" && value}
    </div>
  );
};

const TableCellMemo = memo(TableCell);

export { TableCell, TableCellMemo };
