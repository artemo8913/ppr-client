import { PprProvider } from "@/1shared/providers/pprProvider";
import { PprTableSettingsProvider } from "@/1shared/providers/pprTableSettingsProvider";
import { WorkModalProvider } from "@/1shared/providers/workModalProvider";
import { getPprTable } from "@/2entities/ppr";
import { getCommonWorks } from "@/2entities/commonWork";
import { AddWorkModal } from "@/3features/ppr/addWork";
import { PprTableControlPanel } from "@/4widgets/pprTableControlPanel";
import { PprPage } from "@/5pages/pprPage";

export default async function PprPageId({ params }: { params: { id: string } }) {
  const ppr = await getPprTable(Number(params.id));
  const works = await getCommonWorks();

  if (!ppr?.id) {
    throw new Error("ППР не найден");
  }

  return (
    <PprTableSettingsProvider>
      <WorkModalProvider>
        <PprProvider pprFromResponce={ppr}>
          <PprTableControlPanel />
          <PprPage />
          <AddWorkModal data={works} />
        </PprProvider>
      </WorkModalProvider>
    </PprTableSettingsProvider>
  );
}
