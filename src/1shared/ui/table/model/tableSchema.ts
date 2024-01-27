export interface ITableColumn<T> {
  name: keyof T | string;
  value?: string | number;
  colSpan?: number;
  rowSpan?: number;
  subColumns?: ITableColumn<T>[];
}

export type TColumnsByDepth<T> = ITableColumn<T>[][];

export type ITableData<T> = {
  [key in keyof T]: string | number | undefined;
};

export interface ITableCell {
  type?: "none" | "input" | "textarea";
  value?: string | number;
  onChange?: () => void;
  vText?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  textAreaRows?: number;
  colSpan?: number;
  rowSpan?: number;
}
