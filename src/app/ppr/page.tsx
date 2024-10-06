import { getManyPprsShortInfo } from "@/2entities/ppr";
import { PprInfoTable } from "@/4widgets/pprShortInfoTable";
import { CreatePprModal } from "@/4widgets/createPprModal";

export default async function PprPage() {
  const data = await getManyPprsShortInfo();

  return (
    <div>
      <CreatePprModal />
      <PprInfoTable data={data} />
    </div>
  );
}
