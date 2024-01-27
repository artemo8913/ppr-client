import { FC } from "react";
import { Table } from "@/1shared/ui/table/ui/Table";
import { fullColumnsList } from "../model/pprSettings";

interface IPprTableProps {}

export const PprTable: FC<IPprTableProps> = () => {
  return (
    <div>
      <Table columns={fullColumnsList} data={[]} />
    </div>
  );
};
