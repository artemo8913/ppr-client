import { PprTable } from "@/2entities/PprTable";
import { pprTableService } from "@/2entities/PprTable/api/pprTable.service";

export default async function PprPageId({ params }: { params: { id: string } }) {
  const { data, id, created_at, status } = await pprTableService.getPpr(params.id);

  return (
    <div className="w-full h-full overflow-scroll">
      ППРы с индексом
      <div className="bg-slate-900">sad</div>
      <PprTable data={data} />
    </div>
  );
}
