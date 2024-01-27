import { FC } from "react";
import { Table } from "@/1shared/ui/table/ui/Table";
import { fullColumnsList } from "../model/pprTableSettings";
import data from "../mock/data";
import { IPprData } from "../model/pprSchema";

interface IPprTableProps {}

export const PprTable: FC<IPprTableProps> = () => {
  return (
    <div>
      <Table<IPprData> columns={fullColumnsList} data={data} />
    </div>
  );
};
