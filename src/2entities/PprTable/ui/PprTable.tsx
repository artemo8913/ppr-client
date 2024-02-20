import { IPprData } from "..";
import { FC } from "react";
import { TableCell, Table } from "@/1shared/ui/table";
import { fullColumnsList } from "../model/pprTableSettings";

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
