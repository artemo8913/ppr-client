import { getPprsInfo } from "@/2entities/pprInfo";
import { PprInfoCreateNewForm } from "@/3features/pprInfoOperations/ui/PprInfoCreateNewForm";
import { PprInfoTable } from "@/4widgets/pprInfoTable";

export default async function PprPage() {
  const data = await getPprsInfo();
  return (
    <div>
      <PprInfoCreateNewForm />
      <PprInfoTable data={data} />
    </div>
  );
}
