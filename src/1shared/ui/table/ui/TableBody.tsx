import { PropsWithChildren } from "react";
import { ITableColumn, ITableData } from "../model/tableSchema";

interface ITableBodyProps<T> {
  columnsList: (keyof T)[];
  data: ITableData<T>[];
}
export const TableBody: <T>(props: PropsWithChildren<ITableBodyProps<T>>) => JSX.Element | null = ({
  columnsList,
  data,
}) => {
  const tr = data.map((row, index) => (
    <tr key={index}>
      {columnsList.map((col) => (
        <td key={col.toString()}>{row[col]}</td>
      ))}
    </tr>
  ));
  return <tbody>{tr}</tbody>;
};
