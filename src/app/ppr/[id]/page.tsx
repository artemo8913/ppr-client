import { getPprTable } from "@/1shared/api/pprTable";
import { PprTable, PprTableDataProvider } from "@/2entities/PprTable";
import { PprTableUpdateButton } from "@/3features/pprTableUpdate";

export default async function PprPageId({ params }: { params: { id: string } }) {
  const ppr = await getPprTable(params.id);

  return (
    <PprTableDataProvider ppr={ppr}>
      <div className="w-full h-full overflow-scroll">
        <div className="flex justify-start items-center sticky top-0 left-0 z-10 bg-slate-300">
          Ппр такого-то года, такого-то ЭЧК
          <PprTableUpdateButton id={params.id} />
        </div>
        <PprTable />
      </div>
    </PprTableDataProvider>
  );
}
