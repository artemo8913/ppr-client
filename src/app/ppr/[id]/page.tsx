import { PprTable, getPprTable } from "@/2entities/PprTable";

export default async function PprPageId({ params }: { params: { id: string } }) {
  const { data, id, created_at, status } = await getPprTable(params.id);

  return (
    <div className="w-full h-full overflow-scroll">
      ППРы с индексом
      <PprTable data={data} />
    </div>
  );
}
