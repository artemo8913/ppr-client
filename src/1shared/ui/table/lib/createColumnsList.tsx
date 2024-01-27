import { ITableColumn } from "../model/tableSchema";

const dfs: <T>(columns: ITableColumn<T>[], result: ITableColumn<T>[][], depth?: number) => number = (
  columns,
  result,
  depth = 0
) => {
  let colNumber = 0;
  columns.forEach((col) => {
    result[depth] ? result[depth].push(col) : (result[depth] = [col]);
    if (!col.subColumns) {
      colNumber += 1;
    } else {
      const subCount = dfs(col.subColumns, result, depth + 1);
      col.colSpan = subCount;
      colNumber += subCount;
    }
  });
  return colNumber;
};

export const createColumnsList: <T>(columns: ITableColumn<T>[], depth?: number) => ITableColumn<T>[][] = (columns) => {
  const result = [] as (typeof columns)[];
  dfs(columns, result);
  const maxDepth = result.length;
  result.forEach((depthArr, depth)=>{
    depthArr.forEach(col => {
      if(!col.subColumns){
        col.rowSpan = maxDepth - depth
      }
    })
  })
  return result;
};
