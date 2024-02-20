import { PprInfoTable, getPprsInfo } from "@/2entities/PprInfo";
import { PprInfoCreatePprForm } from "@/3features/CreatePpr";

export default async function PprPage() {
  const data = await getPprsInfo();
  return (
    <div>
      <PprInfoCreatePprForm />
      <PprInfoTable data={data} />
    </div>
  );
}
