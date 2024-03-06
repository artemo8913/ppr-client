import { getPprsInfo } from "@/1shared/api/pprInfo";
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
