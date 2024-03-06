import { FC } from "react";
import { IPprData } from "@/1shared/api/pprTable";
import { TableCell, Table } from "@/1shared/ui/table";
import { fullColumnsList } from "../lib/pprTableSettings";

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
