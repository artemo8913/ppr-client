import { getPprTable } from "@/1shared/api/pprTable";
import { getAllWorks } from "@/1shared/api/work";
import { WorkModal, WorkModalProvider } from "@/2entities/work";
import { PprTable, PprTableDataProvider } from "@/4widgets/pprTable";
import { PprTableControlPanel } from "@/4widgets/pprTable/ui/PprTableControlPanel";

export default async function PprPageId({ params }: { params: { id: string } }) {
  const ppr = await getPprTable(params.id);
  const works = await getAllWorks();

  return (
    <PprTableDataProvider ppr={ppr}>
      <WorkModalProvider>
        <div className="w-full h-full overflow-scroll">
          <PprTableControlPanel id={params.id} />
          <PprTable />
        </div>
        <WorkModal data={works} />
      </WorkModalProvider>
    </PprTableDataProvider>
  );
}
