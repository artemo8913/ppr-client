import { FC } from "react";
import { Table } from "@/1shared/ui/table/ui/Table";
import { TableCell } from "@/1shared/ui/table/ui/TableCell";
import { fullColumnsList } from "../model/pprTableSettings";
import data from "../mock/data";

interface IPprTableProps {}

export const PprTable: FC<IPprTableProps> = () => {
  return (
    <div>
      <Table
        className="table-fixed w-[100%] [font-size:12px]"
        RowComponent={(props) => <tr {...props}></tr>}
        CellComponent={TableCell}
        columns={fullColumnsList}
        data={data}
      />
    </div>
  );
};
