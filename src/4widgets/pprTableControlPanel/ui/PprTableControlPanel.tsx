import { IPpr } from "@/1shared/api/pprTable";
import { PprTableSaveButton } from "@/3features/pprTableSave";
import { PprTableStatusUpdate } from "@/3features/pprTableStatusUpdate";
import { FC } from "react";

interface IPprTableControlPanelProps {
  ppr: IPpr;
}

export const PprTableControlPanel: FC<IPprTableControlPanelProps> = ({ ppr }) => {
  return (
    <div className="flex justify-start items-center sticky top-0 left-0 z-10 bg-slate-300">
      Статус: {ppr.status} Создан: {new Date(ppr.created_at).toLocaleDateString()} Год: {ppr.year} {ppr.id_subdivision}-
      {ppr.id_distance}-{ppr.id_direction}
      <PprTableSaveButton id={ppr.id} />
      <PprTableStatusUpdate />
    </div>
  );
};
