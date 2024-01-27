import { FC, PropsWithChildren } from "react";
import { ITableColumn } from "../model/tableSchema";

interface ITableTitleProps<T> {
  columnsList: ITableColumn<T>[][];
}

export const TableTitle: <T>(props: PropsWithChildren<ITableTitleProps<T>>) => JSX.Element | null = ({
  columnsList,
}) => {
  console.log(columnsList);
  const head = columnsList.map((col, index) => {
    return (
      <tr key={index}>
        {col.map((cell, index) => (
          <td colSpan={cell.colSpan} className="border-2 border-black min-w-[20px]" key={String(cell.name) + index}>
            {String(cell.name)}
          </td>
        ))}
      </tr>
    );
  });
  return <thead>{head}</thead>;
};
