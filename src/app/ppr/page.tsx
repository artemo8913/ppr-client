import Title from "antd/es/typography/Title";
import Card from "antd/es/card/Card";

import { getDivisionsMap } from "@/2entities/division";
import { getManyPprsShortInfo } from "@/2entities/ppr";
import { CreatePprModal } from "@/3features/ppr/create";
import { PprInfoTable } from "@/4widgets/pprShortInfoTable";

interface PprPageProps {
  searchParams: Parameters<typeof getManyPprsShortInfo>[0];
}

export default async function PprPage({ searchParams }: PprPageProps) {
  const [pprs, divisions] = await Promise.all([getManyPprsShortInfo({ ...searchParams }), getDivisionsMap()]).catch(
    (e) => {
      throw new Error(`Load data for ppr info page error. ${e}`);
    }
  );

  return (
    <Card className="overflow-auto">
      <Title level={2}>Список планов технического обслуживания и ремонта</Title>
      <PprInfoTable hasSearch data={pprs?.data || []} divisions={divisions} />
      <CreatePprModal className="!block ml-auto" />
    </Card>
  );
}
