import { FC } from "react";
import { IPpr } from "@/2entities/pprTable";
import { PprTableSaveButton } from "@/3features/pprTableSave";
import { PprTableStatusUpdate } from "@/3features/pprTableStatusUpdate";
import Select from "antd/es/select";
import { TPprTimePeriod, monthsIntlRu, pprTimePeriods } from "@/1shared/types/date";
import { findPossibleCurrentPprPeriod } from "../lib/findCurrentPprPeriod";

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
      <Select<TPprTimePeriod>
        className="min-w-24"
        options={pprTimePeriods.map((period) => ({ value: period, label: monthsIntlRu[period] }))}
        defaultValue={findPossibleCurrentPprPeriod({ ...pprData })}
      />
    </div>
  );
};
