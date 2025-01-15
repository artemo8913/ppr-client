import { calculateFulfillmentReport } from "@/1shared/providers/pprProvider";
import { getDivisionsMap } from "@/2entities/division";
import { getPprDataForFulfillmentReport } from "@/2entities/ppr";
import { FulfillmentReport } from "@/4widgets/reports";

export default async function ReportsPage() {
  const divisionsMap = await getDivisionsMap();

  const { reportSettings, reportData } = calculateFulfillmentReport(
    (await getPprDataForFulfillmentReport({})) || [],
    divisionsMap
  );

  return (
    <div className="overflow-auto print:overflow-visible">
      <FulfillmentReport reportData={reportData} reportSettings={reportSettings} />
    </div>
  );
}
