export type TCell = "none" | "input" | "textarea";

export interface ITableCell {
  value?: string | number | boolean | null;
  cellType?: TCell;
  isVertical?: boolean;
  className?: string;
  bgColor?: string;
  handleBlur?: (value: string) => void;
}
