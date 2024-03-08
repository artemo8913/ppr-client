"use client";
import { ChangeEvent, FC, FormEvent } from "react";
import { usePprTableData } from "..";
import { fullColumnsList } from "../lib/pprTableSettings";
import { TableCell, Table } from "@/1shared/ui/table";
import { IPprData } from "@/1shared/api/pprTable";
import { TableCellWithAdd } from "@/3features/pprAddWork";

interface IPprTableProps {}

export const PprTable: FC<IPprTableProps> = ({}) => {
  const { pprData, setPprData } = usePprTableData();
  const handleChange = ({
    value,
    rowIndex,
    colName,
  }: {
    value: string;
    rowIndex?: number;
    colName?: keyof IPprData;
  }) => {
    if (typeof rowIndex === "undefined" || typeof colName === "undefined") {
      return;
    }
    setPprData((prev) => ({
      ...prev,
      data: [
        ...prev.data.slice(0, rowIndex),
        { ...prev.data[rowIndex], [colName]: value },
        ...prev.data.slice(rowIndex + 1),
      ],
    }));
  };

  return (
    <Table
      className="table-fixed w-[120%] [font-size:12px]"
      RowComponent={({ rowData, ...otherProps }) => {
        return <tr {...otherProps}></tr>;
      }}
      CellComponent={({ rowIndex, colName, ...otherProps }) => {
        return (
          <TableCellWithAdd
            onBlur={(e: ChangeEvent<HTMLInputElement & HTMLTextAreaElement> & FormEvent<HTMLTableCellElement>) =>
              handleChange({ value: e.target.value, rowIndex, colName })
            }
            {...otherProps}
          />
        );
      }}
      columns={fullColumnsList}
      data={pprData.data}
    />
  );
};
