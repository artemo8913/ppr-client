import { FC } from "react";
import { IPpr } from "@/2entities/pprTable";
import { PprTableSaveButton } from "@/3features/pprTableSave";
import { PprTableStatusUpdate } from "@/3features/pprTableStatusUpdate";

interface IPprTableControlPanelProps {
  pprData: IPpr;
}

export const PprTableControlPanel: FC<IPprTableControlPanelProps> = ({ pprData }) => {
  return (
    <div className="flex justify-start items-center sticky top-0 left-0 z-10 bg-slate-300">
      Статус: {pprData?.status} Создан: {new Date(pprData?.created_at!).toLocaleDateString()} Год: {pprData?.year}{" "}
      {pprData?.id_subdivision}-{pprData?.id_distance}-{pprData?.id_direction}
      <PprTableSaveButton />
      <PprTableStatusUpdate />
    </div>
  );
};
