import Title from "antd/es/typography/Title";
import Card from "antd/es/card/Card";

import { getDivisions } from "@/2entities/division";
import { getManyPprsShortInfo, TPprShortInfo } from "@/2entities/ppr";
import { PprInfoTable } from "@/4widgets/pprShortInfoTable";
import { CreatePprModal } from "@/3features/ppr/create";

interface IPprPageProps {
  searchParams: { [key in keyof TPprShortInfo]?: string };
}

export default async function PprPage({ searchParams }: IPprPageProps) {
  const [pprs, divisions] = await Promise.all([getManyPprsShortInfo({ ...searchParams }), getDivisions()]).catch(
    (e) => {
      throw new Error(`Load data for ppr info page error. ${e}`);
    }
  );

  return (
    <Card className="overflow-auto">
      <Title level={2}>Список годовых планов ЭУ-132</Title>
      <PprInfoTable data={pprs} divisions={divisions} />
      <CreatePprModal className="!block ml-auto" />
    </Card>
  );
}
