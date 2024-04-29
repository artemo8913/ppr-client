import Tabs from "antd/es/tabs";
import { WorkModalProvider } from "@/1shared/providers/workModalProvider";
import { PprTableDataProvider } from "@/1shared/providers/pprTableProvider";
import { getPprTable } from "@/2entities/pprTable";
import { getAllWorks } from "@/2entities/work";
import { WorkModal } from "@/4widgets/workModal";
import { PprTable } from "@/4widgets/pprTable";
import { PprTableControlPanel } from "@/4widgets/pprTableControlPanel";
import { PeoplesTable } from "@/4widgets/peoplesTable";
import { WorkingManAdd } from "@/3features/workingManAdd";

export default async function PprPageId({ params }: { params: { id: string } }) {
  const ppr = await getPprTable(params.id);
  const works = await getAllWorks();
  return (
    <PprTableDataProvider ppr={ppr}>
      <WorkModalProvider>
        <PprTableControlPanel pprData={ppr} />
        <Tabs
          defaultActiveKey="2"
          items={[
            {
              key: "1",
              label: "Настой часов",
              children: (
                <>
                  <WorkingManAdd className="mb-2"/>
                  <PeoplesTable />
                </>
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
          ]}
        />
        <WorkModal data={works} />
      </WorkModalProvider>
    </PprTableDataProvider>
  );
}
