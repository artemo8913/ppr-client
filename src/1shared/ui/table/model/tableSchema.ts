import { ComponentPropsWithoutRef } from "react";
type TCell = "none" | "input" | "textarea";

export interface ITableColumn<T> {
  name: keyof T | string;
  value?: string | number;
  colSpan?: number;
  rowSpan?: number;
  subColumns?: ITableColumn<T>[];
  isThVertical?: boolean;
  isTdVertical?: boolean;
  width?: string | number;
  height?: string | number;
  cellType?: TCell;
}

export type TColumnsByDepth<T> = ITableColumn<T>[][];

export type ITableData<T> = {
  [key in keyof T]: string | number | undefined;
};

export interface ITableCell extends ComponentPropsWithoutRef<"td"> {
  cellType?: TCell;
  isVertical?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  textAreaRows?: number;
  value?: string | number | readonly string[];
}
