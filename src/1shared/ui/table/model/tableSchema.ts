export interface ITableColumn<T> {
  name: T;
  value?: string | number;
  colSpan?: number;
  rowSpan?: number;
  subColumns?: ITableColumn<T>[];
}

export interface ITableData<T> {
  name: T;
  cellSettings?: ITableCell;
}

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
