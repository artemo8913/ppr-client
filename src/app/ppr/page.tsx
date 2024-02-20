import { PprInfoTable, getPprsInfo } from "@/2entities/pprInfo";
import { PprInfoCreatePprForm } from "@/3features/createPpr";

export default async function PprPage() {
  const data = await getPprsInfo();
  return (
    <div>
      <PprInfoCreatePprForm />
      <PprInfoTable data={data} />
    </div>
  );
}
