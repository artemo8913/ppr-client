"use client";
import { ChangeEvent, FC, FormEvent } from "react";
import { TableCell, Table } from "@/1shared/ui/table";
import { fullColumnsList } from "../lib/pprTableSettings";
import { usePprTableData } from "..";
import { IPprData } from "@/1shared/api/pprTable";

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
    console.log(rowIndex, colName);
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
          <TableCell
            onChange={(e: ChangeEvent<HTMLInputElement & HTMLTextAreaElement> & FormEvent<HTMLTableCellElement>) =>
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
