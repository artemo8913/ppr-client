"use client";
import { FC, useEffect } from "react";
import { IPpr, IPprData } from "@/1shared/api/pprTable";
import { TableCell, Table } from "@/1shared/ui/table";
import { fullColumnsList } from "../lib/pprTableSettings";
import { PprTableDataProvider, usePprTableData } from "../model/PprTableDataProvider";

interface IPprTableProps {}

export const PprTable: FC<IPprTableProps> = ({}) => {
  const { pprData } = usePprTableData();

  return (
    <Table
      className="table-fixed w-[120%] [font-size:12px]"
      RowComponent={(props) => <tr {...props}></tr>}
      CellComponent={TableCell}
      columns={fullColumnsList}
      data={pprData.data}
    />
  );
};
