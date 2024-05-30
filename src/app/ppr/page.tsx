import { getPprsInfo } from "@/2entities/pprInfo";
import { PprInfoTable } from "@/4widgets/pprInfoTable";
import { CreatePprModal } from "@/4widgets/createPprModal";

export default async function PprPage() {
  const data = await getPprsInfo();
  return (
    <div>
      <CreatePprModal />
      <PprInfoTable data={data} />
    </div>
  );
}
