import { PprProvider } from "@/1shared/providers/pprProvider";
import { PprTableSettingsProvider } from "@/1shared/providers/pprTableSettingsProvider";
import { PprWorkModalProvider } from "@/1shared/providers/pprWorkModalProvider";
import { getPprTable } from "@/2entities/ppr";
import { getCommonWorks } from "@/2entities/commonWork";
import { AddWorkModal, EditWorkModal } from "@/3features/ppr/worksUpdate";
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
      <PprWorkModalProvider>
        <PprProvider pprFromResponce={ppr}>
          <PprTableControlPanel />
          <PprPage />
          <AddWorkModal data={works} />
          <EditWorkModal data={works} />
        </PprProvider>
      </PprWorkModalProvider>
    </PprTableSettingsProvider>
  );
}
