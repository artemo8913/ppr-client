import { createColumnsList } from "@/1shared/ui/table/lib/createColumnsList";
import { ITableColumn, ITableData } from "@/1shared/ui/table/model/tableSchema";
import { Table } from "@/1shared/ui/table/ui/Table";

type TNames = keyof { id: 1; val: 2; a: 1; b: 2; c: 5; d: 6; e: 1; f: 1; g: 0 };
const columns: ITableColumn<TNames>[] = [
  { name: "a", subColumns: [{ name: "val", subColumns: [{ name: "c" }, { name: "d" }] }, { name: "e" }] },
  { name: "f", subColumns: [{ name: "g" }] },
  {
    name: "id",
    subColumns: [
      {
        name: "b",
        subColumns: [{ name: "c" }, { name: "d" }, { name: "g", subColumns: [{ name: "b" }, { name: "e" }] }],
      },
      { name: "e" },
    ],
  },
];
const data: ITableData<TNames>[] = [{ name: "val" }];

export default function Home() {
  const columnsList: ITableColumn<TNames>[][] = [];
  createColumnsList(columns, columnsList);
  console.log(columnsList);
  return (
    <main>
      <div className="bg-slate-600">Главная страница</div>
      <Table<TNames> columns={columns} data={data} />
    </main>
  );
}
