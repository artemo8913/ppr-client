import { FC, PropsWithChildren } from "react";
import { ITableColumn } from "../model/tableSchema";

interface ITableTitleProps<T> {
  columnsList: ITableColumn<T>[][];
}

export const TableTitle: <T>(props: PropsWithChildren<ITableTitleProps<T>>) => JSX.Element | null = ({
  columnsList,
}) => {
  const head = columnsList.map((col, index) => {
    return (
      <tr key={index}>
        {col.map((cell, index) => (
          <th
            colSpan={cell.colSpan}
            rowSpan={cell.rowSpan}
            className="border-2 border-black min-w-[20px]"
            key={String(cell.name) + index}
          >
            {String(cell.name)}
          </th>
        ))}
      </tr>
    );
  });
  return <thead>{head}</thead>;
};
