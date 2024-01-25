import { ITableColumn } from "../model/tableSchema";

export const createColumnsList: <T>(
  columns: ITableColumn<T>[],
  result: ITableColumn<T>[][],
  depth?: number
) => number = (columns, result, depth = 0) => {
  let colNumber = 0;
  columns.forEach((col) => {
    result[depth] ? result[depth].push(col) : (result[depth] = [col]);
    if (!col.subColumns) {
      colNumber += 1;
    } else {
      const subCount = createColumnsList(col.subColumns, result, depth + 1);
      col.colSpan = subCount;
      colNumber += subCount;
    }
  });
  return colNumber;
};
