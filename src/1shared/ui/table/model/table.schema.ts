import { ChangeEventHandler, FormEventHandler } from "react";

export type TCell = "none" | "input" | "textarea";

export interface ITableCell {
  value?: string | number;
  cellType?: TCell;
  width?: string;
  isVertical?: boolean;
  className?: string;
  bgColor?: string;
  onBlur?: ChangeEventHandler<HTMLInputElement> &
    ChangeEventHandler<HTMLTextAreaElement> &
    FormEventHandler<HTMLTableCellElement>;
}
