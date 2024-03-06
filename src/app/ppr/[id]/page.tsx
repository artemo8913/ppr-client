import { getPprTable } from "@/1shared/api/pprTable";
import { getAllWorks } from "@/1shared/api/work";
import { PprTable } from "@/2entities/pprTable";
import { PprTableUpdateButton } from "@/3features/pprTableUpdate";
import { WorkModal } from "@/3features/workSelect";

import Button from "antd/es/button";

export default async function PprPageId({ params }: { params: { id: string } }) {
  const { data, id, created_at, status } = await getPprTable(params.id);
  const works = await getAllWorks();

  return (
    <div className="w-full h-full overflow-scroll">
      <div className="sticky top-0 bg-emerald-500 z-10 w-[120%]">
        ППРы с индексом
        <WorkModal data={works} />
        <PprTableUpdateButton action={async () => {}} />
      </div>
      <PprTable data={data} />
    </div>
  );
}
