import { PprInfoTable, pprInfoTableService } from "@/2entities/PprInfoTable";

export default async function PprPage() {
  const data = await pprInfoTableService.getPprs();
  return <PprInfoTable data={data} />;
}
