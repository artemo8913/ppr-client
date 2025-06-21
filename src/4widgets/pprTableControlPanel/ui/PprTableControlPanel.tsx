"use client";
import { FC } from "react";
import Card from "antd/es/card/Card";

import { PrintButton } from "@/1shared/ui/print";
import { usePpr } from "@/2entities/ppr";
import { PprTableSaveButton } from "@/3features/ppr/update";
import { PprExportToXslx } from "@/3features/ppr/exportToXslx";
import { PprTableSelectTimePeriod } from "@/3features/pprTableSettings";
import { PprTableSetOneUnityButton } from "@/3features/ppr/setOneUnity";
import { PprTableCopyFactNormTimeToFactTime } from "@/3features/ppr/copyFactNormTimeToFactTime";
import { PprTableYearStatusUpdate, PprTableMonthStatusUpdate } from "@/3features/ppr/statusUpdate";

import PprTableSettingsModal from "./PprTableSettingsModal";

interface IPprTableControlPanelProps {}

export const PprTableControlPanel: FC<IPprTableControlPanelProps> = () => {
  const { ppr } = usePpr();

  return (
    <div className="flex justify-start items-center flex-wrap gap-3 bg-slate-300 print:hidden p-1">
      <span>
        План ТОиР: <b>{ppr?.name}</b>
      </span>
      <span>
        Год: <b>{ppr?.year}</b>
      </span>
      <Card size="small" styles={{ body: { padding: 0 } }}>
        <PprTableSettingsModal />
        <PprTableSaveButton />
        <PprTableSetOneUnityButton />
        <PprTableCopyFactNormTimeToFactTime />
        <PprExportToXslx />
        <PrintButton />
      </Card>
      <span className="font-bold">
        Период планирования: <PprTableSelectTimePeriod />
      </span>
      <PprTableYearStatusUpdate />
      <PprTableMonthStatusUpdate />
    </div>
  );
};
