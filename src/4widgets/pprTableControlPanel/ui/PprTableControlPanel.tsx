import { FC, useEffect } from "react";
import { findPossibleCurrentPprPeriod } from "@/1shared/providers/pprTableProvider/lib/findPossibleCurrentPprPeriod";
import { usePprTableViewSettings } from "@/1shared/providers/pprTableProvider";
import { IPpr } from "@/2entities/pprTable";
import { PprTableSaveButton } from "@/3features/pprTableSave";
import { PprTableYearStatusUpdate } from "@/3features/pprTableStatusUpdate";
import { PprTableSelectTimePeriod } from "@/3features/pprTableSelectTimePeriod";
import { PprTableSelectFilterPlanFact, PprTableSelectFilterTimePeriod } from "@/3features/pprTableSelectColumnsFilter";
import { PprTableMonthStatusUpdate } from "@/3features/pprTableStatusUpdate/ui/PprTableMonthStatusUpdate";
import { PprTableSelectCorrectionView } from "@/3features/pprTableSelectCorrectionView";

interface IPprTableControlPanelProps {
  pprData: IPpr;
}

export const PprTableControlPanel: FC<IPprTableControlPanelProps> = ({ pprData }) => {
  const { setTimePeriod } = usePprTableViewSettings();

  useEffect(() => {
    setTimePeriod(findPossibleCurrentPprPeriod(pprData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
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
      <PprTableSelectCorrectionView />
    </div>
  );
};
