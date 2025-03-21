import Card from "antd/es/card/Card";
import Title from "antd/es/typography/Title";

import { BackLink } from "@/1shared/ui/backLink";
import { getDivisionsMap } from "@/2entities/division";
import { getCommonWorks } from "@/2entities/commonWork";
import { getPprDataForReport, IGetPprDataForReportParams } from "@/2entities/ppr";
import { FulfillmentReport, ReportFilter } from "@/4widgets/reports";

interface IFullfilmentReportPageProps {
  searchParams: { [key in keyof IGetPprDataForReportParams]?: string };
}

export default async function FullfilmentReportPage({ searchParams }: IFullfilmentReportPageProps) {
  const divisionsMap = await getDivisionsMap();

  const { data } = await getPprDataForReport({ ...searchParams });

  const works = await getCommonWorks();

  return (
    <Card className="overflow-auto print:overflow-visible">
      <BackLink />
      <Title level={2}>Сводный отчет выполнения запланированных работ</Title>
      <ReportFilter divisions={divisionsMap} commonWorks={works} />
      {Boolean(data?.length) && <FulfillmentReport dataForReport={data} divisions={divisionsMap} />}
    </Card>
  );
}
