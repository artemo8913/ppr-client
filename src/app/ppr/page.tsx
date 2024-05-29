import { getPprsInfo } from "@/2entities/pprInfo";
import { PprInfoTable } from "@/4widgets/pprInfoTable";
import { ModalProvider } from "@/1shared/providers/modalProvider";
import { CreatePprModal } from "@/4widgets/createPprModal";

export default async function PprPage() {
  const data = await getPprsInfo();
  return (
    <ModalProvider>
      <CreatePprModal />
      <PprInfoTable data={data} />
    </ModalProvider>
  );
}
