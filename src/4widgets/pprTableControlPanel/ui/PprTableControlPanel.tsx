"use client";
import { FC } from "react";

import { usePpr } from "@/1shared/providers/pprProvider";
import { translateRuYearStatus } from "@/1shared/locale/pprStatus";
import { PprTableSaveButton } from "@/3features/ppr/update";
import { PprTableYearStatusUpdate, PprTableMonthStatusUpdate } from "@/3features/ppr/statusUpdate";
import { PprTableSelectTimePeriod } from "@/3features/pprTableSettings/selectTimePeriod";
import { PprTableSetOneUnityButton } from "@/3features/ppr/setOneUnity";
import { FillWorkingManPlanTime } from "@/3features/pprWorkingMans/fillWorkingManPlanTime";
import { PprTableCopyFactNormTimeToFactTime } from "@/3features/ppr/copyFactNormTimeToFactTime";

import PprTableSettingsModal from "./PprTableSettingsModal";

interface IPprTableControlPanelProps {}

export const PprTableControlPanel: FC<IPprTableControlPanelProps> = () => {
  const { ppr } = usePpr();

  return (
    <div className="flex justify-start items-center flex-wrap gap-1 bg-slate-300 print:hidden">
      Статус: {ppr ? translateRuYearStatus(ppr.status) : ""} Создан: {new Date(ppr?.created_at!).toLocaleDateString()}{" "}
      Год: {ppr?.year} {ppr?.id_subdivision}-{ppr?.id_distance}-{ppr?.id_direction}
      <PprTableSaveButton />
      <PprTableSetOneUnityButton />
      <PprTableCopyFactNormTimeToFactTime />
      <FillWorkingManPlanTime />
      <PprTableSettingsModal />
      <PprTableSelectTimePeriod />
      <PprTableYearStatusUpdate />
      <PprTableMonthStatusUpdate />
    </div>
  );
};
