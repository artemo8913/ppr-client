import { getPprsInfo } from "@/2entities/pprInfo";
import { PprInfoCreatePprForm } from "@/3features/createPpr";
import { PprInfoTable } from "@/4widgets/pprInfoTable";

export default async function PprPage() {
  const data = await getPprsInfo();
  return (
    <div>
      <PprInfoCreatePprForm />
      <PprInfoTable data={data} />
    </div>
  );
}
