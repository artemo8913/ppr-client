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

import { isEnterKey, isEscKey } from "@/1shared/lib/events/keyboard";
import { convertCommaToDot, isSimilarToNumber, NUMBER_WITH_DOT_PATTERN } from "@/1shared/lib/math/stringifiedNumber";

import style from "./TableCell.module.scss";

type TableCellType = "none" | "input" | "textarea";

export interface TableCellProps {
  className?: string;
  isVertical?: boolean;
  cellType?: TableCellType;
  inputType?: HTMLInputTypeAttribute;
  updateValue?: (value: string) => void;
  value?: string | number | boolean | null;
  parentTdRef?: RefObject<HTMLTableCellElement>;
}

const INPUT_MAX_LENGTH = 12;

const TEXTAREA_ROWS_COUNT = 4;

const ANY_SYMBOL_PATTERN = ".*";

const TableCell: FC<TableCellProps> = (props) => {
  const { cellType = "none", value, inputType, isVertical, updateValue, parentTdRef, className } = props;

  const [inputValue, setInputValue] = useState(value);

  const ref = useRef<HTMLTextAreaElement & HTMLInputElement>(null);

  const handleInputUpdate = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setInputValue(e.target.value),
    []
  );

  const selectAllTextOnFocus = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => e.target.select(),
    []
  );

  const blurOnKeydown = useCallback((keyboardEvent: KeyboardEvent) => {
    if (isEscKey(keyboardEvent.key) || isEnterKey(keyboardEvent.key)) {
      ref.current?.blur();
    }
  }, []);

  const handleBlur = useCallback(() => {
    if (!updateValue) {
      return;
    }

    if (inputType === "number" && isSimilarToNumber(String(inputValue))) {
      return updateValue(convertCommaToDot(String(inputValue)));
    }

    updateValue(String(inputValue));
  }, [inputValue, updateValue, inputType]);

  const validatePattern = inputType === "number" ? NUMBER_WITH_DOT_PATTERN : ANY_SYMBOL_PATTERN;

  const hasError = inputType === "number" && isNaN(Number(value));

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    window?.addEventListener("keydown", blurOnKeydown);

    return () => window?.removeEventListener("keydown", blurOnKeydown);
  }, [blurOnKeydown]);

  useEffect(() => {
    const td = parentTdRef?.current;

    const focusInputElement = (e: FocusEvent) => {
      e.preventDefault();
      e.stopPropagation();
      ref?.current?.focus();
    };

    td?.addEventListener("focus", focusInputElement);

    return () => {
      td?.removeEventListener("focus", focusInputElement);
    };
  }, [parentTdRef]);

  return (
    <div className={clsx(style.TableCell, hasError && style.hasError, isVertical && style.isVertical, className)}>
      {cellType === "textarea" && (
        <textarea
          ref={ref}
          onBlur={handleBlur}
          rows={TEXTAREA_ROWS_COUNT}
          value={String(inputValue)}
          onChange={handleInputUpdate}
          onFocus={selectAllTextOnFocus}
          className={clsx(style.TextareaCell, !isVertical && style.isNotVertical)}
        />
      )}
      {cellType === "input" && (
        <input
          ref={ref}
          onBlur={handleBlur}
          pattern={validatePattern}
          value={String(inputValue)}
          maxLength={INPUT_MAX_LENGTH}
          onChange={handleInputUpdate}
          onFocus={selectAllTextOnFocus}
          className={clsx(style.InputCell, isVertical && style.isVertical)}
        />
      )}
      {cellType === "none" && value}
    </div>
  );
};

const TableCellMemo = memo(TableCell);

export { TableCell, TableCellMemo };
