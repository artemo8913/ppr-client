import { ITableColumn, TColumnsByDepth } from "../model/tableSchema";

const dfs: <T>(
  columns: ITableColumn<T>[],
  colListFortitle: TColumnsByDepth<T>,
  colListForData: (keyof T)[],
  depth?: number
) => number = (columns, colListForTitle, colListForData, depth = 0) => {
  let colNumber = 0;
  columns.forEach((col) => {
    colListForTitle[depth] ? colListForTitle[depth].push(col) : (colListForTitle[depth] = [col]);
    if (!col.subColumns) {
      colListForData.push(col.name);
      colNumber += 1;
    } else {
      const subCount = dfs(col.subColumns, colListForTitle, colListForData, depth + 1);
      col.colSpan = subCount;
      colNumber += subCount;
    }
  });
  return colNumber;
};

export const createColumnsLists: <T>(
  columns: ITableColumn<T>[],
  depth?: number
) => { colListForTitle: TColumnsByDepth<T>; colListForData: (keyof T)[] } = (columns) => {
  const colListForTitle: (typeof columns)[] = [];
  const colListForData = [];
  dfs(columns, colListForTitle, colListForData);
  const maxDepth = colListForTitle.length;
  colListForTitle.forEach((depthArr, depth) => {
    depthArr.forEach((col) => {
      if (!col.subColumns && maxDepth - depth > 1) {
        col.rowSpan = maxDepth - depth;
      }
    });
  });
  return { colListForTitle, colListForData };
};
