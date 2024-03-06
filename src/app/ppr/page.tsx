import { getPprsInfo } from "@/1shared/api/pprInfo";
import { PprCreateNewForm } from "@/3features/pprCreateNew";
import { PprInfoTable } from "@/4widgets/pprInfoTable";

export default async function PprPage() {
  const data = await getPprsInfo();
  return (
    <div>
      <PprCreateNewForm />
      <PprInfoTable data={data} />
    </div>
  );
}
