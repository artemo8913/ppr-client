import { FC } from "react";
import { IPpr } from "@/2entities/pprTable";
import { PprTableSaveButton } from "@/3features/pprTableSave";
import { PprTableYearStatusUpdate } from "@/3features/pprTableStatusUpdate";
import { PprTableSelectTimePeriod } from "@/3features/pprTableSelectTimePeriod";
import { PprTableSelectFilterPlanFact, PprTableSelectFilterTimePeriod } from "@/3features/pprTableSelectColumnsFilter";
import { PprTableMonthStatusUpdate } from "@/3features/pprTableStatusUpdate/ui/PprTableMonthStatusUpdate";

interface IPprTableControlPanelProps {
  pprData: IPpr;
}

export const PprTableControlPanel: FC<IPprTableControlPanelProps> = ({ pprData }) => {
  return (
    <div className="flex justify-start items-center sticky top-0 left-0 z-10 bg-slate-300">
      Статус: {pprData?.status} Создан: {new Date(pprData?.created_at!).toLocaleDateString()} Год: {pprData?.year}{" "}
      {pprData?.id_subdivision}-{pprData?.id_distance}-{pprData?.id_direction}
      <PprTableSaveButton />
      <PprTableYearStatusUpdate />
      <PprTableMonthStatusUpdate />
      <PprTableSelectTimePeriod />
      <PprTableSelectFilterTimePeriod />
      <PprTableSelectFilterPlanFact />
    </div>
  );
};
