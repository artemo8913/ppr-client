import { ComponentPropsWithoutRef } from "react";

type TCell = "none" | "input" | "textarea";

export interface ITableColumn<T> {
  name: keyof T | string;
  thColSpan?: number;
  thRowSpan?: number;
  subColumns?: ITableColumn<T>[];
  isThVertical?: boolean;
  isTdVertical?: boolean;
  titleText?: string;
  cell?: ITableCell;
}

export type TColumnsByDepth<T> = ITableColumn<T>[][];

export type ITableData<T> = {
  [key in keyof T]: string | number | undefined;
};

export interface ITableCell extends ComponentPropsWithoutRef<"td"> {
  cellType?: TCell;
  isVertical?: boolean;
  value?: string | number;
}
