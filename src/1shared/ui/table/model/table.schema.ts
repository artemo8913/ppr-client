export type TCell = "none" | "input" | "textarea";

export interface ITableCell {
  value?: string | number | boolean | null;
  cellType?: TCell;
  width?: string;
  isVertical?: boolean;
  className?: string;
  bgColor?: string;
  handleClick?: () => void;
  handleBlur?: (value: string) => void;
}
