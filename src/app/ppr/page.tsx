import { getPprsInfo } from "@/2entities/pprShortInfo";
import { PprInfoTable } from "@/4widgets/pprShortInfoTable";
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
