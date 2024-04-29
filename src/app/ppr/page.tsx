import { getPprsInfo } from "@/2entities/pprInfo";
import { PprInfoTable } from "@/4widgets/pprInfoTable";
import { PprCreateNewButton } from "@/3features/pprCreateNewTable";

export default async function PprPage() {
  const data = await getPprsInfo();
  return (
    <div>
      <PprCreateNewButton />
      <PprInfoTable data={data} />
    </div>
  );
}
