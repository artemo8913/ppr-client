import { FC } from "react";
import { Table } from "@/1shared/ui/Table/ui/Table";
import { TableCell } from "@/1shared/ui/Table/ui/TableCell";
import { fullColumnsList } from "../model/pprTableSettings";
import { IPprData } from "..";

interface IPprTableProps {
  data: IPprData[];
}

export const PprTable: FC<IPprTableProps> = ({ data }) => {
  return (
    <Table
      className="table-fixed w-[120%] [font-size:12px]"
      RowComponent={(props) => <tr {...props}></tr>}
      CellComponent={TableCell}
      columns={fullColumnsList}
      data={data}
    />
  );
};
