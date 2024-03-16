import { getPprTable } from "@/1shared/api/pprTable";
import { PprTable, PprTableDataProvider } from "@/4widgets/pprTable";
import { PprTableUpdateButton } from "@/3features/pprTableUpdate";
import { PprTableControlPanel } from "@/4widgets/pprTable/ui/PprTableControlPanel";

export default async function PprPageId({ params }: { params: { id: string } }) {
  const ppr = await getPprTable(params.id);
  return (
    <PprTableDataProvider ppr={ppr}>
      <div className="w-full h-full overflow-scroll">
        <PprTableControlPanel id={params.id} />
        <PprTable />
      </div>
    </PprTableDataProvider>
  );
}
