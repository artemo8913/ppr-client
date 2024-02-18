import { ITableCell, ITableColumn, ITableData } from "../model/table.schema";
import { createColumnsLists } from "../lib/tableDataHandle";
import { ComponentType } from "react";

interface ITableProps<T> {
  columns: ITableColumn<T>[];
  data: ITableData<T>[];
  className?: string;
  width?: number | string;
  RowComponent: ComponentType<React.AllHTMLAttributes<HTMLTableRowElement>>;
  CellComponent: ComponentType<React.AllHTMLAttributes<HTMLTableCellElement> & ITableCell>;
}

export const Table: <T>(props: ITableProps<T>) => JSX.Element | null = ({
  columns,
  data,
  className,
  RowComponent,
  CellComponent,
}) => {
  const { colListForData, colListForTitle } = createColumnsLists(columns);
  const titleRows = colListForTitle.map((columns, index) => {
    return (
      <RowComponent key={index}>
        {columns.map((col) => {
          return (
            <CellComponent
              {...col.cell}
              key={String(col.name)}
              isVertical={col.isThVertical}
              colSpan={col.thColSpan}
              rowSpan={col.thRowSpan}
              value={col.titleText}
              cellType="none"
            >
              {col.titleText}
            </CellComponent>
          );
        })}
      </RowComponent>
    );
  });
  const bodyRows = data.map((row, index) => (
    <RowComponent key={index}>
      {colListForData.map((col, index) => (
        <CellComponent key={String(col.name) + index} isVertical={col.isTdVertical} value={row[col.name]} {...col.cell}>
          {row[col.name]}
        </CellComponent>
      ))}
    </RowComponent>
  ));
  return (
    <table className={className}>
      <thead>{titleRows}</thead>
      <tbody>{bodyRows}</tbody>
    </table>
  );
};
