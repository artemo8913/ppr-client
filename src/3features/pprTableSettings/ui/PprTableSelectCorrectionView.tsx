"use client";
import Select, { DefaultOptionType } from "antd/es/select";
import { FC } from "react";

import { TPprView, usePprTableSettings } from "@/1shared/providers/pprTableSettingsProvider";

interface IPprTableSelectCorrectionViewProps {}

export const PprTableSelectCorrectionView: FC<IPprTableSelectCorrectionViewProps> = () => {
  const { pprView, setPprView } = usePprTableSettings();

  return (
    <Select<TPprView, { value: TPprView } & DefaultOptionType>
      className="min-w-24"
      options={[
        { value: "INITIAL_PLAN", label: "Исходный план" },
        { value: "INITIAL_PLAN_WITH_ARROWS", label: "Исходный план со стрелками" },
        { value: "CORRECTED_PLAN", label: "Откорректированный план" },
        { value: "CORRECTED_PLAN_WITH_ARROWS", label: "Откорректированный план со стрелками" },
      ]}
      value={pprView}
      onChange={setPprView}
    />
  );
};
