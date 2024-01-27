import { PropsWithChildren } from "react";
import { TableBody } from "./TableBody";
import { TableTitle } from "./TableTitle";
import { ITableColumn, ITableData } from "../model/tableSchema";
import { createColumnsLists } from "../lib/tableDataHandle";

interface ITableProps<T> {
  columns: ITableColumn<T>[];
  data: ITableData<T>[];
}

export const Table: <T>(props: PropsWithChildren<ITableProps<T>>) => JSX.Element | null = ({ columns, data }) => {
  const { colListForData, colListForTitle } = createColumnsLists(columns);
  console.log(colListForData)
  return (
    <table className="w-full">
      <TableTitle columnsList={colListForTitle} />
      <TableBody columnsList={colListForData} data={data} />
    </table>
  );
};
