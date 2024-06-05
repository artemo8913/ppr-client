import Tabs from "antd/es/tabs";
import { PprProvider } from "@/1shared/providers/pprProvider";
import { PprTableSettingsProvider } from "@/1shared/providers/pprTableSettingsProvider";
import { WorkModalProvider } from "@/1shared/providers/workModalProvider";
import { getPprTable } from "@/2entities/ppr";
import { getAllWorks } from "@/2entities/work";
import { WorkingManAdd } from "@/3features/pprWorkingMans/add";
import { WorkModal } from "@/4widgets/workModal";
import { PprTable } from "@/4widgets/pprTable";
import { PprTableControlPanel } from "@/4widgets/pprTableControlPanel";
import { WorkingMansTable } from "@/4widgets/workingMansTable";
import { CorrectionRaport } from "@/4widgets/correctionRaport";
import { MonthPlanTable } from "@/4widgets/monthPlanTable";

export default async function PprPageId({ params }: { params: { id: string } }) {
  const ppr = await getPprTable(params.id);
  const works = await getAllWorks();
  if (!ppr.id) {
    throw new Error("ППР не найден");
  }
  return (
    <PprTableSettingsProvider>
      <PprProvider pprFromResponce={ppr}>
        <WorkModalProvider>
          <PprTableControlPanel ppr={ppr} />
          <Tabs
            defaultActiveKey="2"
            items={[
              {
                key: "1",
                label: "Настой часов",
                children: (
                  <div className="h-[80vh] overflow-auto">
                    <WorkingManAdd className="mb-2" />
                    <WorkingMansTable />
                  </div>
                ),
              },
              {
                key: "2",
                label: "План ТОиР",
                children: (
                  // TODO #16 Переписать на свой компонент табы. Здесь костыль с высотой
                  <div className="h-[89vh] overflow-auto">
                    <PprTable />
                  </div>
                ),
              },
              {
                key: "3",
                label: "Месячный план",
                children: (
                  <div className="h-[89vh] overflow-auto">
                    <MonthPlanTable />
                  </div>
                ),
              },
              {
                key: "4",
                label: "Рапорт на корректировку плана",
                children: <CorrectionRaport />,
              },
            ]}
          />
          <WorkModal data={works} />
        </WorkModalProvider>
      </PprProvider>
    </PprTableSettingsProvider>
  );
}
