import { getPprsInfo } from "@/1shared/api/pprInfo";
import { PprInfoTable } from "@/2entities/pprInfoTable";
import { PprCreateNewForm } from "@/3features/pprCreateNew";

export default async function PprPage() {
  const data = await getPprsInfo();
  return (
    <div>
      <PprCreateNewForm />
      <PprInfoTable data={data} />
    </div>
  );
}
