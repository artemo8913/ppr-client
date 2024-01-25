import { PropsWithChildren, ReactElement } from "react";
import { TableBody } from "./TableBody";
import { TableTitle } from "./TableTitle";
import { ITableColumn, ITableData } from "../model/tableSchema";

interface ITableProps<T> {
  columns: ITableColumn<T>[];
  data: ITableData<T>[];
}

export const Table: <T>(props: PropsWithChildren<ITableProps<T>>) => JSX.Element | null = ({ columns }) => {
  return (
    <table>
      <TableTitle columns={columns} />
      <TableBody />
    </table>
  );
};
