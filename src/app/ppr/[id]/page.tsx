import Tabs from "antd/es/tabs";
import { PprTableDataProvider, PprTableViewSettingsProvider } from "@/1shared/providers/pprTableProvider";
import { ModalProvider } from "@/1shared/providers/modalProvider";
import { getPprTable } from "@/2entities/pprTable";
import { getAllWorks } from "@/2entities/work";
import { WorkingManAdd } from "@/3features/workingManAdd";
import { WorkModal } from "@/4widgets/workModal";
import { PprTable } from "@/4widgets/pprTable";
import { PprTableControlPanel } from "@/4widgets/pprTableControlPanel";
import { PeoplesTable } from "@/4widgets/peoplesTable";
import { CorrectionRaport } from "@/4widgets/correctionRaport";

export default async function PprPageId({ params }: { params: { id: string } }) {
  const ppr = await getPprTable(params.id);
  const works = await getAllWorks();
  return (
    <PprTableViewSettingsProvider>
      <PprTableDataProvider ppr={ppr}>
        <PprTableControlPanel pprData={ppr} />
        <Tabs
          defaultActiveKey="2"
          items={[
            {
              key: "1",
              label: "Настой часов",
              children: (
                <div className="h-[80vh] overflow-auto">
                  <WorkingManAdd className="mb-2" />
                  <PeoplesTable />
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
              children: <div>Месячный план</div>,
            },
            {
              key: "4",
              label: "Рапорт на корректировку плана",
              children: <CorrectionRaport />,
            },
          ]}
        />
        <ModalProvider>
          <WorkModal data={works} />
        </ModalProvider>
      </PprTableDataProvider>
    </PprTableViewSettingsProvider>
  );
}
