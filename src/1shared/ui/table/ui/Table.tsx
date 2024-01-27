import { PropsWithChildren } from "react";
import { TableBody } from "./TableBody";
import { TableTitle } from "./TableTitle";
import { ITableColumn, ITableData } from "../model/tableSchema";
import { createColumnsList } from "../lib/createColumnsList";

interface ITableProps<T> {
  columns: ITableColumn<T>[];
  data: ITableData<T>[];
}

export const Table: <T>(props: PropsWithChildren<ITableProps<T>>) => JSX.Element | null = ({ columns }) => {
  const columnsList = createColumnsList(columns);

  return (
    <table className="w-full">
      <TableTitle columnsList={columnsList} />
      <TableBody />
    </table>
  );
};
