import { ITableCell, ITableColumn, ITableData } from "../model/table.schema";
import { createColumnsLists } from "../lib/tableDataHandle";
import { ComponentType } from "react";

interface ITableProps<T> {
  columns: ITableColumn<T>[];
  data: ITableData<T>[];
  className?: string;
  width?: number | string;
  RowComponent: ComponentType<React.AllHTMLAttributes<HTMLTableRowElement> & { rowData?: ITableData<T> }>;
  CellComponent: ComponentType<
    React.AllHTMLAttributes<HTMLTableCellElement> & ITableCell & { colName?: keyof T; rowIndex?: number }
  >;
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
              name={String(col.name)}
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
  const bodyRows = data.map((row, rowIndex) => (
    <RowComponent key={rowIndex} rowData={row}>
      {colListForData.map((col, index) => (
        <CellComponent
          colName={col.name}
          rowIndex={rowIndex}
          key={String(col.name) + index}
          isVertical={col.isTdVertical}
          value={row[col.name]}
          name={String(col.name)}
          {...col.cell}
        >
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
