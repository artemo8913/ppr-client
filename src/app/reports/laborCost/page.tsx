import { getCommonWorks } from "@/2entities/commonWork";
import { getDivisionsMap } from "@/2entities/division";
import { getPprDataForReport, IGetPprDataForReportParams } from "@/2entities/ppr";
import { LaborCostReport, ReportFilter } from "@/4widgets/reports";

interface ILaborCostReportPageProps {
  searchParams: { [key in keyof IGetPprDataForReportParams]?: string };
}

export default async function LaborCostReportPage({ searchParams }: ILaborCostReportPageProps) {
  const divisionsMap = await getDivisionsMap();

  const { data } = await getPprDataForReport({ ...searchParams });

  const works = await getCommonWorks();

  return (
    <div className="overflow-auto print:overflow-visible">
      <ReportFilter divisions={divisionsMap} commonWorks={works} hasShowFields={{ workName: false }} />
      {Boolean(data?.length) && <LaborCostReport dataForReport={data} />}
    </div>
  );
}
