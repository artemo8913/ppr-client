"use client";
import { FC } from "react";

import { usePpr } from "@/1shared/providers/pprProvider";
import { translateRuYearStatus } from "@/1shared/locale/pprStatus";
import { PprTableSaveButton } from "@/3features/ppr/update";
import { PprTableYearStatusUpdate, PprTableMonthStatusUpdate } from "@/3features/ppr/statusUpdate";
import { PprTableSelectTimePeriod } from "@/3features/pprTableSettings";
import { PprTableSetOneUnityButton } from "@/3features/ppr/setOneUnity";
import { FillWorkingManPlanTime } from "@/3features/pprWorkingMans/fillWorkingManPlanTime";
import { PprTableCopyFactNormTimeToFactTime } from "@/3features/ppr/copyFactNormTimeToFactTime";
import { PprExportToXslx } from "@/3features/ppr/exportToXslx";

import PprTableSettingsModal from "./PprTableSettingsModal";

interface IPprTableControlPanelProps {}

export const PprTableControlPanel: FC<IPprTableControlPanelProps> = () => {
  const { ppr } = usePpr();

  return (
    <div className="flex justify-start items-center flex-wrap gap-1 bg-slate-300 print:hidden">
      Статус: {ppr ? translateRuYearStatus(ppr.status) : ""} Создан: {new Date(ppr?.created_at!).toLocaleDateString()}{" "}
      Год: {ppr?.year} {ppr?.idSubdivision}-{ppr?.idDistance}-{ppr?.idDirection}
      <PprTableSettingsModal />
      <PprTableSaveButton />
      <PprTableSetOneUnityButton />
      <PprTableCopyFactNormTimeToFactTime />
      <FillWorkingManPlanTime />
      <PprExportToXslx />
      <PprTableSelectTimePeriod />
      <PprTableYearStatusUpdate />
      <PprTableMonthStatusUpdate />
    </div>
  );
};
