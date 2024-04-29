import Tabs from "antd/es/tabs";
import { getPprTable } from "@/1shared/api/pprTable";
import { getAllWorks } from "@/1shared/api/work";
import { PprTableDataProvider } from "@/2entities/pprTableProvider";
import { WorkModal, WorkModalProvider } from "@/2entities/work";
import { PprTable } from "@/4widgets/pprTable";
import { PprTableControlPanel } from "@/4widgets/pprTableControlPanel";
import { PeoplesTable } from "@/2entities/peoples";

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
            { key: "1", label: "Настой часов", children: <PeoplesTable /> },
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
