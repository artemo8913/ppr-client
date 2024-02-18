import { authOptions } from "@/1shared/auth/authConfig";
import { PprInfoTable, pprInfoTableService } from "@/2entities/PprInfoTable";
import Button from "antd/es/button";
import { getServerSession } from "next-auth";

export default async function PprPage() {
  const data = await pprInfoTableService.getPprs();
  const session = await getServerSession(authOptions);

  return (
    <div>
      <Button type="primary">Добавить</Button>
      <PprInfoTable data={data} />
    </div>
  );
}
