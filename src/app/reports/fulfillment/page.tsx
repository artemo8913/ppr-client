import { getCommonWorks } from "@/2entities/commonWork";
import { getDivisionsMap } from "@/2entities/division";
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
    <div className="overflow-auto print:overflow-visible">
      <ReportFilter divisions={divisionsMap} commonWorks={works} />
      {Boolean(data?.length) && <FulfillmentReport dataForReport={data} divisions={divisionsMap} />}
    </div>
  );
}
